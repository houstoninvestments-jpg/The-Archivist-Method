export default async function handler(req: any, res: any) {
  const debugKeys = Object.keys(process.env)
    .filter((k) => k.includes('SUPABASE') || k.includes('RESEND') || k.includes('VERCEL'))
    .sort()
    .map((key) => ({
      key,
      hasValue: Boolean(process.env[key]),
      length: process.env[key]?.length ?? 0,
    }));

  return res.status(200).json({
    ok: true,
    env: {
      hasSupabaseUrl: Boolean(process.env['SUPABASE_URL']),
      hasServiceRoleKey: Boolean(process.env['SUPABASE_SERVICE_ROLE_KEY']),
      hasResendKey: Boolean(process.env['RESEND_API_KEY']),
    },
    debugKeys,
  });
}
