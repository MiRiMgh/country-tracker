"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Check, Lock, Plane, Star, X, ScrollText, LogOut, Mail, KeyRound } from "lucide-react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://churcvjjkdcmpaltgdwe.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_ITDurTgrCAqUNEL_U-4_gg_1fbh6vO_";

const flag = (code) =>
  code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));

const COUNTRIES = [
  { name: "Россия", code: "RU", continent: "Европа/Азия", status: "признана" },
  { name: "Нидерланды", code: "NL", continent: "Европа", status: "признана" },
  { name: "Германия", code: "DE", continent: "Европа", status: "признана" },
  { name: "Франция", code: "FR", continent: "Европа", status: "признана" },
  { name: "Испания", code: "ES", continent: "Европа", status: "признана" },
  { name: "Италия", code: "IT", continent: "Европа", status: "признана" },
  { name: "Португалия", code: "PT", continent: "Европа", status: "признана" },
  { name: "Великобритания", code: "GB", continent: "Европа", status: "признана" },
  { name: "Польша", code: "PL", continent: "Европа", status: "признана" },
  { name: "Чехия", code: "CZ", continent: "Европа", status: "признана" },
  { name: "Австрия", code: "AT", continent: "Европа", status: "признана" },
  { name: "Швейцария", code: "CH", continent: "Европа", status: "признана" },
  { name: "Греция", code: "GR", continent: "Европа", status: "признана" },
  { name: "Швеция", code: "SE", continent: "Европа", status: "признана" },
  { name: "Норвегия", code: "NO", continent: "Европа", status: "признана" },
  { name: "Финляндия", code: "FI", continent: "Европа", status: "признана" },
  { name: "Дания", code: "DK", continent: "Европа", status: "признана" },
  { name: "Исландия", code: "IS", continent: "Европа", status: "признана" },
  { name: "Ирландия", code: "IE", continent: "Европа", status: "признана" },
  { name: "Бельгия", code: "BE", continent: "Европа", status: "признана" },
  { name: "Венгрия", code: "HU", continent: "Европа", status: "признана" },
  { name: "Хорватия", code: "HR", continent: "Европа", status: "признана" },
  { name: "Черногория", code: "ME", continent: "Европа", status: "признана" },
  { name: "Сербия", code: "RS", continent: "Европа", status: "признана" },
  { name: "Турция", code: "TR", continent: "Европа/Азия", status: "признана" },
  { name: "Грузия", code: "GE", continent: "Азия", status: "признана" },
  { name: "Армения", code: "AM", continent: "Азия", status: "признана" },
  { name: "ОАЭ", code: "AE", continent: "Азия", status: "признана" },
  { name: "Таиланд", code: "TH", continent: "Азия", status: "признана" },
  { name: "Вьетнам", code: "VN", continent: "Азия", status: "признана" },
  { name: "Индонезия", code: "ID", continent: "Азия", status: "признана" },
  { name: "Малайзия", code: "MY", continent: "Азия", status: "признана" },
  { name: "Сингапур", code: "SG", continent: "Азия", status: "признана" },
  { name: "Япония", code: "JP", continent: "Азия", status: "признана" },
  { name: "Южная Корея", code: "KR", continent: "Азия", status: "признана" },
  { name: "Китай", code: "CN", continent: "Азия", status: "признана" },
  { name: "Индия", code: "IN", continent: "Азия", status: "признана" },
  { name: "Шри-Ланка", code: "LK", continent: "Азия", status: "признана" },
  { name: "Непал", code: "NP", continent: "Азия", status: "признана" },
  { name: "Израиль", code: "IL", continent: "Азия", status: "признана" },
  { name: "Иордания", code: "JO", continent: "Азия", status: "признана" },
  { name: "Египет", code: "EG", continent: "Африка", status: "признана" },
  { name: "Марокко", code: "MA", continent: "Африка", status: "признана" },
  { name: "Тунис", code: "TN", continent: "Африка", status: "признана" },
  { name: "ЮАР", code: "ZA", continent: "Африка", status: "признана" },
  { name: "Кения", code: "KE", continent: "Африка", status: "признана" },
  { name: "Танзания", code: "TZ", continent: "Африка", status: "признана" },
  { name: "США", code: "US", continent: "Северная Америка", status: "признана" },
  { name: "Канада", code: "CA", continent: "Северная Америка", status: "признана" },
  { name: "Мексика", code: "MX", continent: "Северная Америка", status: "признана" },
  { name: "Куба", code: "CU", continent: "Северная Америка", status: "признана" },
  { name: "Бразилия", code: "BR", continent: "Южная Америка", status: "признана" },
  { name: "Аргентина", code: "AR", continent: "Южная Америка", status: "признана" },
  { name: "Чили", code: "CL", continent: "Южная Америка", status: "признана" },
  { name: "Перу", code: "PE", continent: "Южная Америка", status: "признана" },
  { name: "Колумбия", code: "CO", continent: "Южная Америка", status: "признана" },
  { name: "Австралия", code: "AU", continent: "Океания", status: "признана" },
  { name: "Новая Зеландия", code: "NZ", continent: "Океания", status: "признана" },
  { name: "Косово", code: "XK", continent: "Европа", status: "частично признана" },
  { name: "Тайвань", code: "TW", continent: "Азия", status: "частично признана" },
  { name: "Палестина", code: "PS", continent: "Азия", status: "частично признана" },
  { name: "Западная Сахара", code: "EH", continent: "Африка", status: "частично признана" },
  { name: "Абхазия", code: "GE-AB", continent: "Азия", status: "не признана" },
  { name: "Южная Осетия", code: "GE-SO", continent: "Азия", status: "не признана" },
  { name: "Приднестровье", code: "MD-PR", continent: "Европа", status: "не признана" },
  { name: "Сомалиленд", code: "SO-SL", continent: "Африка", status: "не признана" },
];

const CONTINENTS = ["Все", ...Array.from(new Set(COUNTRIES.map((c) => c.continent)))];

// Простой клиент к Supabase через fetch, без SDK
const authFetch = (path, body) =>
  fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify(body),
  }).then((r) => r.json());

function AuthScreen({ onAuthed }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const data = await authFetch("signup", { email, password });
        if (data.error_description || data.msg) throw new Error(data.error_description || data.msg);
        if (data.access_token) {
          onAuthed({ token: data.access_token, id: data.user.id, email: data.user.email });
        } else {
          setError("Аккаунт создан. Теперь войди по почте и паролю.");
          setMode("login");
        }
      } else {
        const data = await authFetch("token?grant_type=password", { email, password });
        if (data.error_description || data.msg) throw new Error(data.error_description || data.msg);
        onAuthed({ token: data.access_token, id: data.user.id, email: data.user.email });
      }
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Не удалось связаться с сервером. Проверь Project URL и ключ в коде, и что в Supabase включён доступ по email (шаг с Confirm email)."
          : err.message || "Что-то пошло не так"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#16233F",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "-apple-system, Inter, sans-serif",
        padding: 16,
      }}
    >
      <div style={{ background: "#FFFDF8", borderRadius: 16, padding: 32, width: "100%", maxWidth: 360 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <ScrollText size={20} color="#C9A24B" />
          <span style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8B8778" }}>
            Мой паспорт мира
          </span>
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 24, margin: "6px 0 20px", color: "#1B2A44" }}>
          {mode === "login" ? "Вход" : "Регистрация"}
        </h1>

        <div>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <Mail size={15} color="#8B8778" style={{ position: "absolute", left: 12, top: 13 }} />
            <input
              type="email"
              placeholder="Почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              style={{
                width: "100%",
                padding: "11px 12px 11px 34px",
                borderRadius: 8,
                border: "1px solid #D9D2BC",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <KeyRound size={15} color="#8B8778" style={{ position: "absolute", left: 12, top: 13 }} />
            <input
              type="password"
              placeholder="Пароль (минимум 6 символов)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              style={{
                width: "100%",
                padding: "11px 12px 11px 34px",
                borderRadius: 8,
                border: "1px solid #D9D2BC",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div style={{ background: "#FBEAE6", color: "#A6382C", fontSize: 12.5, padding: "8px 10px", borderRadius: 6, marginBottom: 12 }}>
              {error}
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading || !email || password.length < 6}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 8,
              border: "none",
              background: "#16233F",
              color: "#F6F1E4",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              opacity: loading || !email || password.length < 6 ? 0.6 : 1,
            }}
          >
            {loading ? "Секунду..." : mode === "login" ? "Войти" : "Создать аккаунт"}
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#8B8778", marginTop: 16 }}>
          {mode === "login" ? "Ещё нет аккаунта?" : "Уже есть аккаунт?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
            style={{ background: "none", border: "none", color: "#A6382C", cursor: "pointer", fontWeight: 600, fontSize: 13 }}
          >
            {mode === "login" ? "Зарегистрироваться" : "Войти"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function CountryTracker() {
  const [user, setUser] = useState(null); // { token, id, email }
  const [visited, setVisited] = useState(new Set());
  const [query, setQuery] = useState("");
  const [continent, setContinent] = useState("Все");
  const [activeCountry, setActiveCountry] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Загружаем отмеченные страны из базы после входа
  useEffect(() => {
    if (!user) return;
    fetch(`${SUPABASE_URL}/rest/v1/visited_countries?select=country_code`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((rows) => {
        if (Array.isArray(rows)) setVisited(new Set(rows.map((r) => r.country_code)));
      });
  }, [user]);

  const toggleVisited = async (code) => {
    if (!user) return;
    const isVisited = visited.has(code);
    setSyncing(true);
    setVisited((prev) => {
      const next = new Set(prev);
      isVisited ? next.delete(code) : next.add(code);
      return next;
    });
    try {
      if (isVisited) {
        await fetch(
          `${SUPABASE_URL}/rest/v1/visited_countries?country_code=eq.${code}&user_id=eq.${user.id}`,
          { method: "DELETE", headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${user.token}` } }
        );
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/visited_countries`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${user.token}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ user_id: user.id, country_code: code }),
        });
      }
    } finally {
      setSyncing(false);
    }
  };

  const filtered = useMemo(() => {
    return COUNTRIES.filter((c) => {
      const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase());
      const matchesContinent = continent === "Все" || c.continent === continent;
      return matchesQuery && matchesContinent;
    });
  }, [query, continent]);

  const percent = Math.round((visited.size / COUNTRIES.length) * 100);

  if (!user) {
    return <AuthScreen onAuthed={setUser} />;
  }

  return (
    <div style={{ fontFamily: "-apple-system, Inter, sans-serif", background: "#F6F1E4", minHeight: "100vh", color: "#1B2A44" }}>
      <style>{`
        @keyframes stampIn {
          0% { transform: scale(2.4) rotate(-14deg); opacity: 0; }
          60% { transform: scale(0.9) rotate(-8deg); opacity: 1; }
          100% { transform: scale(1) rotate(-8deg); opacity: 1; }
        }
        .stamp { animation: stampIn 0.35s ease-out; }
        .country-card { transition: border-color 0.15s ease, transform 0.15s ease; }
        .country-card:hover { transform: translateY(-2px); }
      `}</style>

      <header style={{ background: "#16233F", color: "#F6F1E4", padding: "2rem 1.5rem 2.5rem" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <ScrollText size={22} color="#C9A24B" />
              <span style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9A24B" }}>
                Мой паспорт мира
              </span>
            </div>
            <button
              onClick={() => setUser(null)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #33456B", color: "#C9C2AE", borderRadius: 8, padding: "6px 12px", fontSize: 12.5, cursor: "pointer" }}
            >
              <LogOut size={13} /> {user.email}
            </button>
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 34, fontWeight: 700, margin: "6px 0 8px", lineHeight: 1.15 }}>
            Отмечай страны, которые повидал
          </h1>
          <p style={{ fontSize: 14, color: "#C9C2AE", maxWidth: 520, lineHeight: 1.6, margin: "0 0 22px" }}>
            Отметки сохраняются в твоём аккаунте и никуда не пропадут.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div style={{ background: "#1F304F", border: "1px solid #33456B", borderRadius: 10, padding: "10px 16px", minWidth: 120 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#C9A24B" }}>{visited.size}</div>
              <div style={{ fontSize: 12, color: "#9AA3B8" }}>стран посещено</div>
            </div>
            <div style={{ background: "#1F304F", border: "1px solid #33456B", borderRadius: 10, padding: "10px 16px", minWidth: 120 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#C9A24B" }}>{percent}%</div>
              <div style={{ fontSize: 12, color: "#9AA3B8" }}>мира открыто</div>
            </div>
            <div style={{ background: "#1F304F", border: "1px solid #33456B", borderRadius: 10, padding: "10px 16px", minWidth: 120 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#C9A24B" }}>{COUNTRIES.length}</div>
              <div style={{ fontSize: 12, color: "#9AA3B8" }}>всего в базе</div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 1.5rem 0" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
          <div style={{ position: "relative", flex: "1 1 220px" }}>
            <Search size={16} color="#8B8778" style={{ position: "absolute", left: 12, top: 12 }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти страну..."
              style={{
                width: "100%",
                padding: "10px 12px 10px 34px",
                borderRadius: 8,
                border: "1px solid #D9D2BC",
                background: "#FFFDF8",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            onClick={() => setShowPaywall(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#A6382C",
              color: "#FBEAE6",
              border: "none",
              borderRadius: 8,
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Star size={14} /> Подписка
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
          {CONTINENTS.map((c) => (
            <button
              key={c}
              onClick={() => setContinent(c)}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                border: "1px solid " + (continent === c ? "#16233F" : "#D9D2BC"),
                background: continent === c ? "#16233F" : "#FFFDF8",
                color: continent === c ? "#F6F1E4" : "#5C574A",
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1.5rem 3rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {filtered.map((c) => {
            const isVisited = visited.has(c.code);
            return (
              <div
                key={c.name}
                className="country-card"
                style={{
                  position: "relative",
                  background: "#FFFDF8",
                  border: "1px solid " + (isVisited ? "#C9A24B" : "#E4DDC8"),
                  borderRadius: 12,
                  padding: "14px 14px 12px",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
                onClick={() => setActiveCountry(c)}
              >
                {isVisited && (
                  <div
                    className="stamp"
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      border: "2px solid #A6382C",
                      color: "#A6382C",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: "rotate(-8deg)",
                    }}
                  >
                    <Check size={15} strokeWidth={3} />
                  </div>
                )}
                <div style={{ fontSize: 30, marginBottom: 8 }}>{flag(c.code.slice(0, 2))}</div>
                <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 2 }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: "#8B8778" }}>{c.continent}</div>
                {c.status !== "признана" && (
                  <div style={{ fontSize: 10.5, color: "#5C7A5E", marginTop: 4 }}>{c.status}</div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisited(c.code);
                  }}
                  style={{
                    marginTop: 10,
                    width: "100%",
                    padding: "6px 0",
                    fontSize: 12,
                    borderRadius: 6,
                    border: "1px solid " + (isVisited ? "#C9A24B" : "#D9D2BC"),
                    background: isVisited ? "#FBF2DE" : "#F6F1E4",
                    color: "#1B2A44",
                    cursor: "pointer",
                  }}
                >
                  {isVisited ? "Отметить как не посещённую" : "Я тут был"}
                </button>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "#8B8778", marginTop: 40 }}>Ничего не найдено</p>
        )}
      </div>

      {activeCountry && (
        <div
          onClick={() => setActiveCountry(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(22,35,63,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50 }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#FFFDF8", borderRadius: 16, maxWidth: 420, width: "100%", padding: 24, position: "relative" }}>
            <button onClick={() => setActiveCountry(null)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer" }}>
              <X size={18} color="#8B8778" />
            </button>
            <div style={{ fontSize: 46 }}>{flag(activeCountry.code.slice(0, 2))}</div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, margin: "8px 0 4px" }}>{activeCountry.name}</h2>
            <p style={{ fontSize: 13, color: "#8B8778", margin: "0 0 18px" }}>
              {activeCountry.continent} · {activeCountry.status}
            </p>
            <div style={{ background: "#F6F1E4", border: "1px dashed #D9D2BC", borderRadius: 10, padding: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Lock size={18} color="#A6382C" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 4 }}>Доступно по подписке</div>
                <div style={{ fontSize: 12.5, color: "#5C574A", lineHeight: 1.5 }}>
                  Визовые требования, Шенген, ВНЖ и ПМЖ, путь к гражданству, проверенные юристы по этой стране.
                </div>
              </div>
            </div>
            <button
              onClick={() => { setActiveCountry(null); setShowPaywall(true); }}
              style={{ width: "100%", marginTop: 14, padding: "12px 0", borderRadius: 8, border: "none", background: "#16233F", color: "#F6F1E4", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              Открыть подпиской
            </button>
          </div>
        </div>
      )}

      {showPaywall && (
        <div onClick={() => setShowPaywall(false)} style={{ position: "fixed", inset: 0, background: "rgba(22,35,63,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#16233F", color: "#F6F1E4", borderRadius: 16, maxWidth: 420, width: "100%", padding: 28, position: "relative" }}>
            <button onClick={() => setShowPaywall(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer" }}>
              <X size={18} color="#9AA3B8" />
            </button>
            <Plane size={22} color="#C9A24B" />
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, margin: "10px 0 6px" }}>Подписка «Паспорт+»</h2>
            <p style={{ fontSize: 13, color: "#C9C2AE", lineHeight: 1.6, marginBottom: 18 }}>
              Полные визовые гиды по каждой стране: Шенген, ВНЖ, ПМЖ, гражданство и подборка проверенных юристов для оформления.
            </p>
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
              599 ₽<span style={{ fontSize: 13, fontWeight: 400, color: "#9AA3B8" }}> / месяц</span>
            </div>
            <button style={{ width: "100%", marginTop: 14, padding: "12px 0", borderRadius: 8, border: "none", background: "#C9A24B", color: "#16233F", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Оформить подписку
            </button>
            <p style={{ fontSize: 11, color: "#7C87A0", marginTop: 10, textAlign: "center" }}>
              Демо-кнопка. Реальная оплата подключится через Stripe на следующем шаге.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
