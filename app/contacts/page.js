export const metadata = {
  title: "Контакты и реквизиты — Мой паспорт мира",
};

export default function Contacts() {
  return (
    <div style={{ background: "#F6F1E4", minHeight: "100vh", fontFamily: "-apple-system, Inter, sans-serif", color: "#1B2A44" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px 80px" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, marginBottom: 20 }}>Контакты и реквизиты</h1>

        <div style={{ background: "#FFFDF8", border: "1px solid #E4DDC8", borderRadius: 12, padding: 20, fontSize: 14.5, lineHeight: 1.8 }}>
          <div><strong>Сервис:</strong> Мой паспорт мира</div>
          <div><strong>Самозанятый (плательщик НПД):</strong> Панаскин Михаил Дмитриевич</div>
          <div><strong>ИНН:</strong> 183313564572</div>
          <div><strong>E-mail:</strong> gdmirim@gmail.com</div>
          <div><strong>Телефон:</strong> +7 912 752 48 47</div>
        </div>

        <p style={{ fontSize: 12.5, color: "#8B8778", marginTop: 20 }}>
          Публичная оферта — <a href="/oferta" style={{ color: "#A6382C" }}>/oferta</a>
        </p>
      </div>
    </div>
  );
}
