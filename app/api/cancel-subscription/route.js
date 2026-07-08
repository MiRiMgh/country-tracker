const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://churcvjjkdcmpaltgdwe.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_ITDurTgrCAqUNEL_U-4_gg_1fbh6vO_";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return Response.json({ error: "Не авторизован" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");

    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
    });
    const userData = await userRes.json();
    if (!userData.id) {
      return Response.json({ error: "Не удалось определить пользователя" }, { status: 401 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    await fetch(`${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${userData.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      // Статус "canceled" — доступ сохраняется до конца уже оплаченного периода,
      // но автосписание в следующий раз (в cron-функции) больше не запустится
      body: JSON.stringify({ status: "canceled", updated_at: new Date().toISOString() }),
    });

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
