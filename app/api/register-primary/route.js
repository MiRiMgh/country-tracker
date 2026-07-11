import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "ru-central1",
  endpoint: "https://storage.yandexcloud.net",
  credentials: {
    accessKeyId: process.env.YC_ACCESS_KEY_ID,
    secretAccessKey: process.env.YC_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return Response.json({ error: "Не указана почта" }, { status: 400 });
    }

    // Это и есть "первичная запись" по требованию 152-ФЗ — фиксируем факт регистрации
    // и согласия на территории России, до того как данные попадут в Supabase (Ирландия)
    const record = {
      email,
      consent_given: true,
      consent_documents: ["/consent", "/privacy"],
      created_at: new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for") || "unknown",
    };

    const key = `registrations/${Date.now()}-${encodeURIComponent(email)}.json`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.YC_BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(record, null, 2),
        ContentType: "application/json",
      })
    );

    return Response.json({ ok: true });
  } catch (e) {
    console.error("register-primary error:", e.message);
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
