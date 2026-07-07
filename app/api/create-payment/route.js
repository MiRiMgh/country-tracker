import { randomUUID } from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://churcvjjkdcmpaltgdwe.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_ITDurTgrCAqUNEL_U-4_gg_1fbh6vO_";

export async function POST(req) {
  try {
    const { type, countryCode } = await req.json();

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return Response.json({ error: "Не авторизован" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");

    // Проверяем токен пользователя через Supabase — платёж создаём только для реально вошедшего пользователя
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
    });
    const userData = await userRes.json();
    if (!userData.id) {
      return Response.json({ error: "Не удалось определить пользователя" }, { status: 401 });
    }

    let amount, description;
    if (type === "subscription") {
      amount = "599.00";
      description = "Подписка «Паспорт+» — 1 месяц";
    } else if (type === "country") {
      if (!countryCode) return Response.json({ error: "Не указана страна" }, { status: 400 });
      amount = "299.00";
      description = `Доступ к стране: ${countryCode}`;
    } else {
      return Response.json({ error: "Неизвестный тип платежа" }, { status: 400 });
    }

    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;
    const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");
    const origin = req.headers.get("origin") || "https://moipasport.ru";

    const paymentRes = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
        "Idempotence-Key": randomUUID(),
      },
      body: JSON.stringify({
        amount: { value: amount, currency: "RUB" },
        confirmation: { type: "redirect", return_url: `${origin}?payment=done` },
        capture: true,
        save_payment_method: type === "subscription",
        description,
        metadata: {
          user_id: userData.id,
          type,
          country_code: countryCode || "",
        },
      }),
    });

    const payment = await paymentRes.json();

    if (!payment.confirmation) {
      return Response.json({ error: payment.description || "Ошибка создания платежа в ЮKassa" }, { status: 500 });
    }

    return Response.json({ confirmationUrl: payment.confirmation.confirmation_url });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
