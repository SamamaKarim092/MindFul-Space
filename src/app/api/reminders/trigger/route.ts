// POST /api/reminders/trigger — End-of-day task summary & journal reminder email

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth/api';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const secret = process.env.CRON_SECRET || process.env.N8N_WEBHOOK_SECRET;

    let targetUserId: string | null = null;

    // Check if called by a logged-in user testing their reminders
    if (!secret || authHeader !== `Bearer ${secret}`) {
      try {
        const user = await getAuthUser(request);
        targetUserId = user.id;
      } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayDateStr = todayStart.toISOString().split('T')[0];
    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateStr = tomorrow.toISOString().split('T')[0];

    const whereClause: any = targetUserId
      ? { id: targetUserId }
      : { reminderEnabled: true };

    const usersToProcess = await prisma.user.findMany({
      where: whereClause,
      include: {
        entries: {
          where: { createdAt: { gte: todayStart } },
          select: { id: true, title: true },
        },
        tasks: {
          where: {
            date: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
          select: {
            id: true,
            text: true,
            completed: true,
            priority: true,
          },
        },
      },
    });

    const resendKey = process.env.RESEND_API_KEY;
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'https://mindful-space-theta.vercel.app';

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const sentList: Array<{ email: string; tasksCount: number; pendingCount: number }> = [];

    for (const u of usersToProcess) {
      const recipientEmail = u.email;
      const userName = u.name || recipientEmail.split('@')[0] || 'friend';

      const tasks = u.tasks || [];
      const completedTasks = tasks.filter((t) => t.completed);
      const pendingTasks = tasks.filter((t) => !t.completed);
      const hasJournalEntry = (u.entries || []).length > 0;

      let subject = '🌿 Your Daily Pause & Reflection — MindFul Space';
      if (tasks.length > 0) {
        if (pendingTasks.length === 0) {
          subject = `🎉 All ${tasks.length} tasks completed today! — MindFul Space`;
        } else {
          subject = `📋 Today's Summary: ${completedTasks.length}/${tasks.length} tasks done — MindFul Space`;
        }
      }

      // Build task HTML blocks
      const completedListHtml =
        completedTasks.length > 0
          ? completedTasks
              .map(
                (t) =>
                  `<li style="margin: 6px 0; color: #4ade80;">✓ <span style="color: #e2e8f0; text-decoration: line-through;">${t.text}</span></li>`
              )
              .join('')
          : '<li style="color: #94a3b8; font-style: italic;">No tasks completed yet today</li>';

      const pendingListHtml =
        pendingTasks.length > 0
          ? pendingTasks
              .map(
                (t) =>
                  `<li style="margin: 6px 0; color: #fbbf24;">⏳ <span style="color: #f1f5f9; font-weight: 500;">${t.text}</span> <span style="font-size: 11px; background: rgba(251, 191, 36, 0.15); color: #fbbf24; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">${t.priority}</span></li>`
              )
              .join('')
          : '';

      const carryOverButtonHtml =
        pendingTasks.length > 0
          ? `<div style="background: rgba(251, 191, 36, 0.08); border: 1px solid rgba(251, 191, 36, 0.25); border-radius: 12px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0 0 12px 0; color: #fde68a; font-size: 14px;">
                You have <strong>${pendingTasks.length} unfinished task${pendingTasks.length > 1 ? 's' : ''}</strong>. Would you like to carry them over to tomorrow?
              </p>
              <a href="${appUrl}/dashboard/tasks?action=carry-over&from=${todayDateStr}&to=${tomorrowDateStr}" 
                 style="background: linear-gradient(135deg, #f59e0b, #ea580c); color: #ffffff; padding: 10px 20px; text-decoration: none; font-weight: 600; border-radius: 10px; display: inline-block; font-size: 14px;">
                Push Remaining Tasks to Tomorrow 🚀
              </a>
            </div>`
          : '';

      const journalPromptHtml = !hasJournalEntry
        ? `<div style="margin: 20px 0; padding: 16px; background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 12px;">
            <p style="margin: 0 0 10px 0; color: #e9d5ff; font-size: 14px;">
              You haven't recorded a journal entry today. Take 2 quiet minutes to check in with how you're feeling.
            </p>
            <a href="${appUrl}/dashboard/journal" style="background: linear-gradient(135deg, #a855f7, #ec4899); color: white; padding: 10px 20px; text-decoration: none; font-weight: 600; border-radius: 10px; display: inline-block; font-size: 14px;">
              Write Reflection 📝
            </a>
          </div>`
        : `<p style="color: #a7f3d0; font-size: 13px; margin: 15px 0;">
            ✓ You've already recorded your journal entry today. Well done honoring your pause!
          </p>`;

      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background: #0f0714; color: #ffffff; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #c084fc; font-size: 22px; margin: 0 0 6px 0;">MindFul Space</h1>
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">End-of-Day Check-in & Review</p>
          </div>

          <h2 style="color: #f1f5f9; font-size: 18px; margin: 0 0 12px 0;">Good evening, ${userName} 👋</h2>
          <p style="color: #cbd5e1; line-height: 1.6; font-size: 14px; margin: 0 0 16px 0;">
            Here is a snapshot of your day so you can wrap up with clarity and peace of mind.
          </p>

          ${
            tasks.length > 0
              ? `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 18px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #a855f7;">Tasks Overview</span>
                <span style="font-size: 13px; font-weight: 600; color: #e2e8f0;">${completedTasks.length}/${tasks.length} Completed</span>
              </div>
              
              ${
                completedTasks.length > 0
                  ? `<div style="margin-bottom: 14px;">
                      <span style="font-size: 12px; color: #4ade80; font-weight: 600;">Accomplished:</span>
                      <ul style="list-style: none; padding-left: 0; margin: 6px 0 0 0; font-size: 14px;">
                        ${completedListHtml}
                      </ul>
                    </div>`
                  : ''
              }

              ${
                pendingTasks.length > 0
                  ? `<div>
                      <span style="font-size: 12px; color: #fbbf24; font-weight: 600;">Still Remaining:</span>
                      <ul style="list-style: none; padding-left: 0; margin: 6px 0 0 0; font-size: 14px;">
                        ${pendingListHtml}
                      </ul>
                    </div>`
                  : ''
              }
            </div>
            ${carryOverButtonHtml}
          `
              : `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 18px; margin-bottom: 20px;">
              <p style="color: #cbd5e1; font-size: 14px; margin: 0;">No daily tasks were logged for today.</p>
            </div>
          `
          }

          ${journalPromptHtml}

          <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 4px 0;">
              You received this check-in because you have reminders enabled in MindFul Space.
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
              subject,
              html: emailHtml,
            }),
          });

          if (!resendRes.ok) {
            const errText = await resendRes.text();
            console.error(`Resend API error sending summary to ${recipientEmail}:`, resendRes.status, errText);
          } else {
            sentList.push({
              email: recipientEmail,
              tasksCount: tasks.length,
              pendingCount: pendingTasks.length,
            });
          }
        } catch (emailErr: any) {
          console.error(`Failed to send summary to ${recipientEmail}:`, emailErr.message);
        }
      } else {
        console.log(`[Dev Summary] Dispatched nightly email to ${recipientEmail} (${completedTasks.length}/${tasks.length} tasks)`);
        sentList.push({
          email: recipientEmail,
          tasksCount: tasks.length,
          pendingCount: pendingTasks.length,
        });
      }
    }

    return NextResponse.json({
      message: `Dispatched nightly summary emails to ${sentList.length} recipient(s)`,
      recipients: sentList,
    });
  } catch (error) {
    console.error('POST /api/reminders/trigger error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
