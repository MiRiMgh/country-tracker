const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://churcvjjkdcmpaltgdwe.supabase.co";

async function getPaymentFromYooKassa(paymentId) {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;
  const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");
  const res = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  return res.json();
}

export async function POST(req) {
  try {
    const body = await req.json();
    const paymentId = body?.object?.id;
    if (!paymentId) return Response.json({ ok: true });

    // Важно: не доверяем данным из самого уведомления (их можно подделать).
    // Перезапрашиваем статус платежа напрямую у ЮKassa своим секретным ключом.
    const payment = await getPaymentFromYooKassa(paymentId);
    if (payment.status !== "succeeded") {
      return Response.json({ ok: true });
    }

    const { user_id, type, country_code } = payment.metadata || {};
    if (!user_id) return Response.json({ ok: true });

    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    const baseHeaders = {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    };

    if (type === "subscription") {
      const periodEnd = new Date();
      periodEnd.setDate(periodEnd.getDate() + 30);
      await fetch(`${SUPABASE_URL}/rest/v1/subscriptions`, {
        method: "POST",
        headers: { ...baseHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          user_id,
          status: "active",
          current_period_end: periodEnd.toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });
    } else if (type === "country" && country_code) {
      await fetch(`${SUPABASE_URL}/rest/v1/country_purchases`, {
        method: "POST",
        headers: { ...baseHeaders, Prefer: "return=minimal" },
        body: JSON.stringify({ user_id, country_code }),
      });
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
