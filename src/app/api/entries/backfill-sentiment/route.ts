// POST /api/entries/backfill-sentiment — Re-analyze entries missing sentiment scores

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, AuthError } from '@/lib/auth/api';

export async function POST(request: NextRequest) {
    try {
        const user = await getAuthUser(request);

        const groqKey = process.env.GROQ_API_KEY;
        if (!groqKey) {
            return NextResponse.json({ error: 'GROQ_API_KEY not set' }, { status: 500 });
        }

        const entries = await prisma.entry.findMany({
            where: { userId: user.id, sentiment: null },
            select: { id: true, title: true, content: true },
        });

        if (entries.length === 0) {
            return NextResponse.json({ message: 'All entries already have sentiment scores', updated: 0 });
        }

        let updated = 0;
        const errors: string[] = [];

        // Process in chunks to avoid rate limits while eliminating sequential waterfalls
        const chunkSize = 5;
        for (let i = 0; i < entries.length; i += chunkSize) {
            const chunk = entries.slice(i, i + chunkSize);

            await Promise.all(chunk.map(async (entry) => {
                try {
                    const text = `${entry.title}. ${entry.content}`;

                    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${groqKey}`,
                        },
                        body: JSON.stringify({
                            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                            messages: [
                                { role: 'system', content: 'Analyze sentiment and respond with only a decimal number between -1.0 (very negative) and 1.0 (very positive).' },
                                { role: 'user', content: text },
                            ],
                            temperature: 0.2,
                            max_tokens: 10,
                        }),
                    });

                    if (!groqResponse.ok) {
                        errors.push(`Entry ${entry.id}: Groq error ${groqResponse.status}`);
                        return;
                    }

                    const groqData = await groqResponse.json();
                    const content = groqData.choices?.[0]?.message?.content?.trim() || '';

                    const match = content.match(/-?\d+\.?\d*/);
                    if (match) {
                        let sentiment = parseFloat(match[0]);
                        if (sentiment > 1 && sentiment <= 100) sentiment = (sentiment / 100) * 2 - 1;
                        if (sentiment < -1) sentiment = -1;
                        if (sentiment > 1) sentiment = 1;
                        sentiment = Math.round(sentiment * 100) / 100;

                        await prisma.entry.update({
                            where: { id: entry.id },
                            data: { sentiment },
                        });
                        updated++;
                    } else {
                        errors.push(`Entry ${entry.id}: Could not parse "${content}"`);
                    }
                } catch (err: any) {
                    errors.push(`Entry ${entry.id}: ${err.message}`);
                }
            }));

            if (i + chunkSize < entries.length) {
                await new Promise(r => setTimeout(r, 500));
            }
        }

        return NextResponse.json({ message: 'Backfill complete', total: entries.length, updated, errors: errors.length > 0 ? errors : undefined });
    } catch (error) {
        if (error instanceof AuthError) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        console.error('Backfill error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
