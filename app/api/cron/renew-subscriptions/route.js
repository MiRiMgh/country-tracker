import { randomUUID } from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://churcvjjkdcmpaltgdwe.supabase.co";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const baseHeaders = {
    "Content-Type": "application/json",
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  };

  // Берём подписки, которые заканчиваются в ближайшие сутки, ещё активны
  // и у которых есть сохранённый способ оплаты для автосписания
  const soon = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const listRes = await fetch(
    `${SUPABASE_URL}/rest/v1/subscriptions?status=eq.active&current_period_end=lte.${soon}&payment_method_id=not.is.null`,
    { headers: baseHeaders }
  );
  const subs = await listRes.json();
  if (!Array.isArray(subs)) {
    return Response.json({ processed: 0, error: "Не удалось получить список подписок" });
  }

  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;
  const yooAuth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");

  const results = [];

  for (const sub of subs) {
    try {
      const paymentRes = await fetch("https://api.yookassa.ru/v3/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${yooAuth}`,
          "Idempotence-Key": randomUUID(),
        },
        body: JSON.stringify({
          amount: { value: "599.00", currency: "RUB" },
          capture: true,
          payment_method_id: sub.payment_method_id,
          description: "Автопродление подписки «Паспорт+»",
          metadata: { user_id: sub.user_id, type: "subscription" },
        }),
      });
      const payment = await paymentRes.json();

      if (payment.status === "succeeded") {
        const periodEnd = new Date();
        periodEnd.setDate(periodEnd.getDate() + 30);
        await fetch(`${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${sub.user_id}`, {
          method: "PATCH",
          headers: baseHeaders,
          body: JSON.stringify({ current_period_end: periodEnd.toISOString(), updated_at: new Date().toISOString() }),
        });
      } else if (payment.status === "canceled") {
        // Карта отклонила списание — отмечаем подписку неактивной, доступ пропадёт после окончания текущего периода
        await fetch(`${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${sub.user_id}`, {
          method: "PATCH",
          headers: baseHeaders,
          body: JSON.stringify({ status: "payment_failed", updated_at: new Date().toISOString() }),
        });
      }
      // Если статус "pending" — ждём отдельного вебхука, который дозаполнит период при успехе

      results.push({ user_id: sub.user_id, status: payment.status });
    } catch (e) {
      results.push({ user_id: sub.user_id, error: e.message });
    }
  }

  return Response.json({ processed: results.length, results });
}
