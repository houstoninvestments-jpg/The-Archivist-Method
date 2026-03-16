import type { IncomingMessage, ServerResponse } from 'http';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

type NodeRequest = IncomingMessage & { method?: string; body?: any };
type NodeResponse = ServerResponse & { status: (code: number) => NodeResponse; json: (data: any) => void };

const patternDisplayNames: Record<string, string> = {
  disappearing: 'The Disappearing Pattern',
  apologyLoop: 'The Apology Loop',
  testing: 'The Testing Pattern',
  attractionToHarm: 'Attraction to Harm',
  complimentDeflection: 'Compliment Deflection',
  drainingBond: 'The Draining Bond',
  successSabotage: 'Success Sabotage',
  perfectionism: 'The Perfectionism Pattern',
  rage: 'The Rage Pattern',
};

export default async function handler(req: NodeRequest, res: NodeResponse) {
  console.log('quiz submit hit', {
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasResendKey: !!process.env.RESEND_API_KEY
  });

  // TODO: remove after routing is confirmed working
  return res.status(200).json({
    ok: true,
    env: {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasResendKey: !!process.env.RESEND_API_KEY
    }
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, primaryPattern, secondaryPatterns, patternScores } = req.body as {
    email?: string;
    primaryPattern?: string;
    secondaryPatterns?: string[];
    patternScores?: Record<string, number>;
  };

  if (!email || !primaryPattern) {
    return res.status(400).json({ error: 'Email and pattern are required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const supabase = createClient(supabaseUrl!, supabaseKey!);

  // Upsert the quiz user
  const { data: user, error: upsertError } = await supabase
    .from('quiz_users')
    .upsert(
      {
        email,
        primary_pattern: primaryPattern,
        secondary_patterns: secondaryPatterns ?? [],
        pattern_scores: patternScores ?? {},
      },
      { onConflict: 'email' }
    )
    .select('id, email')
    .single();

  if (!user) {
    return res.status(500).json({ error: 'Failed to create user' });
  }

  if (upsertError || !user) {
    console.error('[quiz/submit] upsert error:', upsertError);
    return res.status(500).json({ error: 'Failed to save quiz submission' });
  }

  // Send welcome email
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const resend = new Resend(resendKey);
    const patternName = patternDisplayNames[primaryPattern!] ?? primaryPattern;
    try {
      await resend.emails.send({
        from: 'The Archivist <hello@archiebase.com>',
        to: [email!],
        subject: `Your pattern has been identified — ${patternName}`,
        html: `
          <div style="background:#0a0a0a;color:#fff;padding:40px;font-family:sans-serif;">
            <p style="color:#00FFD1;font-size:12px;letter-spacing:3px;">PATTERN IDENTIFIED</p>
            <h2 style="font-size:28px;">${patternName}</h2>
            <p style="color:#94A3B8;">Your free Crash Course is built specifically for this pattern. Everything inside is designed for how your nervous system works.</p>
            <a href="https://thearchivistmethod.com/portal"
               style="display:inline-block;background:#00FFD1;color:#0a0a0a;padding:14px 32px;text-decoration:none;font-weight:bold;margin-top:20px;">
              START YOUR CRASH COURSE →
            </a>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('[quiz/submit] email send failed:', emailErr);
    }
  }

  if (!user) {
    return res.status(500).json({ error: 'User not found after upsert' });
  }
  return res.status(200).json({ success: true, userId: user.id });
}
