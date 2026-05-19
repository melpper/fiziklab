'use client';
import { useState } from 'react';

const T = {
  tr: {
    title: "İletişim",
    subtitle: "Fizik simülasyonları hakkında sorularınız veya önerileriniz için bize ulaşın.",
    email: "E-posta",
    name: "Çetin Doğan",
    role: "Fizikçi",
    project: "FizikLab — İnteraktif Fizik Simülasyonları",
    back: "Ana Sayfa",
    byLine: "Fizikçi",
    home: "Ana Sayfa",
    topics: "Konular",
    contact: "İletişim",
  },
  en: {
    title: "Contact",
    subtitle: "Reach out to us for questions or suggestions about physics simulations.",
    email: "Email",
    name: "Çetin Doğan",
    role: "Physicist",
    project: "FizikLab — Interactive Physics Simulations",
    back: "Home",
    byLine: "Physicist",
    home: "Home",
    topics: "Topics",
    contact: "Contact",
  },
};

const Icons = {
  atom: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>,
  globe: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  mail: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg>,
  home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  chevDown: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
};

export default function ContactPage() {
  const [lang, setLang] = useState('tr');
  const t = T[lang];

  return (
    <div style={{ fontFamily: "'Outfit', 'Segoe UI', sans-serif", background: "#0a0c12", color: "#e2e8f0", minHeight: "100vh", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(100,200,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)", width: 800, height: 400, background: "radial-gradient(ellipse, rgba(0,255,200,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", height: 64, background: "rgba(10,12,18,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid #1e293b", flexWrap: "wrap", gap: 10 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textDecoration: "none", color: "inherit" }}>
          <span style={{ color: "#00ffc8" }}>{Icons.atom}</span>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 700, letterSpacing: 1, color: "#00ffc8" }}>FizikLab</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#475569", letterSpacing: 2, textTransform: "uppercase" }}>Çetin Doğan — {t.byLine}</div>
          </div>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6, color: "#64748b", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", textDecoration: "none" }}>
            {Icons.home} {t.home}
          </a>
          <a href="/iletisim" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6, border: "1px solid #00ffc833", background: "#00ffc80a", color: "#00ffc8", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", textDecoration: "none" }}>
            {t.contact}
          </a>
          <div style={{ width: 1, height: 20, background: "#1e293b", margin: "0 6px" }} />
          <button onClick={() => setLang(lang === "tr" ? "en" : "tr")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: "1px solid #334155", background: "#0f121844", color: "#94a3b8", cursor: "pointer", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
            {Icons.globe}
            <span style={{ color: lang === "tr" ? "#f1f5f9" : "#64748b", fontWeight: lang === "tr" ? 600 : 400 }}>TR</span>
            <span style={{ color: "#334155" }}>/</span>
            <span style={{ color: lang === "en" ? "#f1f5f9" : "#64748b", fontWeight: lang === "en" ? 600 : 400 }}>EN</span>
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: "60px 24px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12, background: "linear-gradient(135deg, #e2e8f0 0%, #00ffc8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {t.title}
        </h1>
        <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.6, marginBottom: 48 }}>{t.subtitle}</p>

        {/* Card */}
        <div style={{ background: "#0f1218", border: "1px solid #1e293b", borderRadius: 16, padding: 40, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: "linear-gradient(225deg, rgba(0,255,200,0.04) 0%, transparent 60%)", borderRadius: "0 16px 0 0" }} />

          {/* Name & Role */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: "#f1f5f9", marginBottom: 6 }}>{t.name}</h2>
            <p style={{ fontSize: 14, color: "#00ffc8", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1 }}>{t.role}</p>
            <p style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>{t.project}</p>
          </div>

          {/* Email */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", background: "#0a0c12", borderRadius: 12, border: "1px solid #1e293b" }}>
            <div style={{ color: "#00ffc8", flexShrink: 0 }}>{Icons.mail}</div>
            <div>
              <div style={{ fontSize: 11, color: "#475569", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>{t.email}</div>
              <a href="mailto:d_cetin@hotmail.com" style={{ fontSize: 16, color: "#f1f5f9", textDecoration: "none", fontWeight: 500 }}>
                d_cetin@hotmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "40px 20px 20px" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#334155", letterSpacing: 1 }}>© 2026 Çetin Doğan — FizikLab</p>
      </footer>
    </div>
  );
}
