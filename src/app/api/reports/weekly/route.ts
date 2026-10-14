// POST /api/reports/weekly — Weekly mental condition & wellness digest email

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth/api';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const secret = process.env.CRON_SECRET || process.env.N8N_WEBHOOK_SECRET;

    let targetUserId: string | null = null;

    // Check if called by a logged-in user testing their weekly report
    if (!secret || authHeader !== `Bearer ${secret}`) {
      try {
        const user = await getAuthUser(request);
        targetUserId = user.id;
      } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const whereClause: any = targetUserId
      ? { id: targetUserId }
      : { reminderEnabled: true };

    const usersToProcess = await prisma.user.findMany({
      where: whereClause,
      include: {
        entries: {
          where: { createdAt: { gte: sevenDaysAgo } },
          select: {
            id: true,
            title: true,
            content: true,
            mood: true,
            sentiment: true,
            moodLabels: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        tasks: {
          where: { date: { gte: sevenDaysAgo } },
          select: {
            id: true,
            text: true,
            completed: true,
            priority: true,
          },
        },
        goals: {
          select: {
            id: true,
            text: true,
            completed: true,
          },
        },
      },
    });

    const resendKey = process.env.RESEND_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'https://mindful-space-theta.vercel.app';

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const sentList: Array<{ email: string; wellnessScore: number }> = [];

    for (const u of usersToProcess) {
      const recipientEmail = u.email;
      const userName = u.name || recipientEmail.split('@')[0] || 'friend';

      const entries = u.entries || [];
      const tasks = u.tasks || [];
      const completedTasks = tasks.filter((t) => t.completed);
      const taskCompletionRate =
        tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

      // Calculate sentiment stats
      const sentimentList = entries
        .map((e) => e.sentiment)
        .filter((s): s is number => s !== null && s !== undefined);

      const avgSentiment =
        sentimentList.length > 0
          ? Math.round(
              (sentimentList.reduce((acc, val) => acc + val, 0) / sentimentList.length) * 100
            )
          : 65;

      // Tally moods
      const moodCounts: Record<string, number> = {};
      for (const entry of entries) {
        for (const label of entry.moodLabels) {
          moodCounts[label] = (moodCounts[label] || 0) + 1;
        }
      }

      const topMood =
        Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Reflective';

      // ── Generate AI Weekly Condition Analysis via Groq ──
      let aiAnalysis = {
        headline: 'A Week of Intentional Growth and Self-Awareness',
        overview:
          'This week, you took meaningful pauses to acknowledge your emotional rhythm. Balancing personal commitments with daily responsibilities showed resilience and healthy self-reflection.',
        wellnessScore: Math.min(100, Math.max(40, avgSentiment + (tasks.length > 0 ? 10 : 0))),
        topThemes: ['Mindful Pacing', 'Inner Resilience', 'Daily Focus'],
        actionableAdvice: [
          'Schedule 10 minutes for gentle breathing or stretching to kickstart each morning.',
          'Identify your single highest-priority task and tackle it before midday distractions.',
          'Celebrate the small victories you achieved over the last seven days.',
        ],
      };

      if (groqKey) {
        try {
          const entrySummaries = entries
            .slice(0, 15)
            .map((e) => `Entry "${e.title}": moods [${e.moodLabels.join(', ')}], sentiment: ${e.sentiment ?? 'N/A'}`)
            .join('\n');

          const prompt = `You are an empathetic, clinical wellness intelligence advisor for MindFul-Space.
Analyze the user's past 7 days of emotional and task activity:
- Total journal entries: ${entries.length}
- Average emotional sentiment: ${avgSentiment}%
- Top observed mood: ${topMood}
- Tasks completed: ${completedTasks.length}/${tasks.length} (${taskCompletionRate}%)
- Recent entries:
${entrySummaries || 'No specific entries written.'}

Generate a weekly condition report adhering strictly to this JSON format:
{
  "headline": "Short uplifting 1-sentence headline summarizing their week",
  "overview": "Warm, insightful 2-paragraph overview analyzing their emotional journey and productivity",
  "wellnessScore": 82,
  "topThemes": ["Theme 1", "Theme 2", "Theme 3"],
  "actionableAdvice": [
    "Practical wellness tip 1 for the coming week",
    "Practical wellness tip 2 for the coming week",
    "Practical wellness tip 3 for the coming week"
  ]
}`;

          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${groqKey}`,
            },
            body: JSON.stringify({
              model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
              messages: [
                { role: 'system', content: 'You are a wellness advisor. Always respond with valid JSON only.' },
                { role: 'user', content: prompt },
              ],
              temperature: 0.4,
              max_tokens: 600,
              response_format: { type: 'json_object' },
            }),
            signal: AbortSignal.timeout(8000),
          });

          if (groqRes.ok) {
            const groqData = await groqRes.json();
            const content = groqData.choices?.[0]?.message?.content;
            if (content) {
              const parsed = JSON.parse(content);
              if (parsed.headline && parsed.overview) {
                aiAnalysis = {
                  headline: parsed.headline,
                  overview: parsed.overview,
                  wellnessScore: Number(parsed.wellnessScore) || aiAnalysis.wellnessScore,
                  topThemes: Array.isArray(parsed.topThemes) ? parsed.topThemes : aiAnalysis.topThemes,
                  actionableAdvice: Array.isArray(parsed.actionableAdvice)
                    ? parsed.actionableAdvice
                    : aiAnalysis.actionableAdvice,
                };
              }
            }
          }
        } catch (groqErr: any) {
          console.warn('Groq weekly report generation fallback used:', groqErr.message);
        }
      }

      // ── Build HTML Email ──
      const adviceListHtml = aiAnalysis.actionableAdvice
        .map(
          (tip) =>
            `<li style="margin: 8px 0; color: #cbd5e1; font-size: 14px; line-height: 1.5;">✨ <span style="color: #f1f5f9;">${tip}</span></li>`
        )
        .join('');

      const themesBadgeHtml = aiAnalysis.topThemes
        .map(
          (theme) =>
            `<span style="display: inline-block; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); color: #c084fc; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; margin: 3px 4px 3px 0;">${theme}</span>`
        )
        .join('');

      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 28px; background: #0f0714; color: #ffffff; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.1);">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: rgba(192, 132, 252, 0.15); border: 1px solid rgba(192, 132, 252, 0.3); padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; color: #c084fc; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 12px;">
              Weekly Condition Report
            </div>
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 8px 0;">MindFul Space</h1>
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">7-Day Mental Health & Productivity Digest</p>
          </div>

          <div style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(236, 72, 153, 0.12)); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 18px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #c084fc;">Estimated Wellness Index</span>
            <div style="font-size: 42px; font-weight: 900; color: #f472b6; margin: 6px 0;">${aiAnalysis.wellnessScore}<span style="font-size: 20px; font-weight: 500; color: #cbd5e1;">/100</span></div>
            <p style="font-size: 15px; font-weight: 600; color: #f1f5f9; margin: 0;">${aiAnalysis.headline}</p>
          </div>

          <!-- Quick Metrics Grid -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="width: 50%; padding: 6px;">
                <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 14px; text-align: center;">
                  <span style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 600;">Journal Entries</span>
                  <div style="font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 4px;">${entries.length}</div>
                </div>
              </td>
              <td style="width: 50%; padding: 6px;">
                <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 14px; text-align: center;">
                  <span style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 600;">Average Positivity</span>
                  <div style="font-size: 20px; font-weight: 700; color: #34d399; margin-top: 4px;">${avgSentiment}%</div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="width: 50%; padding: 6px;">
                <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 14px; text-align: center;">
                  <span style="width: 11px; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 600;">Dominant Mood</span>
                  <div style="font-size: 20px; font-weight: 700; color: #f59e0b; margin-top: 4px;">${topMood}</div>
                </div>
              </td>
              <td style="width: 50%; padding: 6px;">
                <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 14px; text-align: center;">
                  <span style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 600;">Task Completion</span>
                  <div style="font-size: 20px; font-weight: 700; color: #60a5fa; margin-top: 4px;">${taskCompletionRate}%</div>
                </div>
              </td>
            </tr>
          </table>

          <!-- AI Reflection -->
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 18px; margin-bottom: 22px;">
            <h3 style="font-size: 14px; font-weight: 700; color: #c084fc; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 10px 0;">AI Holistic Reflection</h3>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0;">${aiAnalysis.overview}</p>
            <div style="margin-top: 14px;">
              ${themesBadgeHtml}
            </div>
          </div>

          <!-- Actionable Advice -->
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 18px; margin-bottom: 24px;">
            <h3 style="font-size: 14px; font-weight: 700; color: #34d399; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 10px 0;">Intentions for the Week Ahead</h3>
            <ul style="list-style: none; padding-left: 0; margin: 0;">
              ${adviceListHtml}
            </ul>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${appUrl}/dashboard/analysis" style="background: linear-gradient(135deg, #a855f7, #ec4899); color: white; padding: 12px 28px; text-decoration: none; font-weight: 700; border-radius: 12px; display: inline-block; font-size: 14px; box-shadow: 0 10px 25px -5px rgba(168, 85, 247, 0.4);">
              Explore Full Dashboard Analysis →
            </a>
          </div>

          <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px; text-align: center;">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 4px 0;">
              You received this weekly report from MindFul Space.
            </p>
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              <a href="${appUrl}/dashboard/settings" style="color: #a855f7; text-decoration: underline;">Manage preferences</a>
            </p>
          </div>
        </div>
      `;

      if (resendKey) {
        try {
          const resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${resendKey}`,
            },
            body: JSON.stringify({
              from: `MindFul-Space <${fromEmail}>`,
              to: recipientEmail,
              subject: `🌿 Your Weekly Wellness & Condition Report (${aiAnalysis.wellnessScore}/100)`,
              html: emailHtml,
            }),
          });

          if (!resendRes.ok) {
            const errText = await resendRes.text();
            console.error(`Resend API error sending weekly report to ${recipientEmail}:`, resendRes.status, errText);
          } else {
            sentList.push({
              email: recipientEmail,
              wellnessScore: aiAnalysis.wellnessScore,
            });
          }
        } catch (emailErr: any) {
          console.error(`Failed to send weekly report to ${recipientEmail}:`, emailErr.message);
        }
      } else {
        console.log(`[Dev Weekly Report] Dispatched to ${recipientEmail} with score ${aiAnalysis.wellnessScore}`);
        sentList.push({
          email: recipientEmail,
          wellnessScore: aiAnalysis.wellnessScore,
        });
      }
    }

    return NextResponse.json({
      message: `Dispatched weekly wellness report to ${sentList.length} recipient(s)`,
      recipients: sentList,
    });
  } catch (error) {
    console.error('POST /api/reports/weekly error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
