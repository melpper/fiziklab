'use client';
import { useState, useEffect, useRef } from 'react';

const T = {
  tr: {
    heroTitle: "Fiziği Keşfet",
    heroDesc: "İnteraktif JavaScript simülasyonları ile fizik kavramlarını deneyimleyin.",
    noSims: "Henüz simülasyon eklenmemiş.",
    noSimsInCat: "Bu kategoride henüz simülasyon yok.",
    backToGallery: "Galeriye Dön",
    fullscreen: "Tam Ekran",
    exitFullscreen: "Küçült",
    loading: "Yükleniyor...",
    byLine: "Fizikçi",
    home: "Ana Sayfa",
    topics: "Konular",
    contact: "İletişim",
    allSims: "Tümü",
    simCount: (n) => `${n} simülasyon`,
    footerContact: "İletişim için:",
    categories: {
      "Mechanics": "Mekanik", "Chaos Theory": "Kaos Teorisi", "Waves": "Dalgalar",
      "Optics": "Optik", "Thermodynamics": "Termodinamik", "Electromagnetism": "Elektromanyetizma",
      "Quantum": "Kuantum", "Nuclear": "Nükleer / Radyasyon", "Other": "Diğer",
    },
  },
  en: {
    heroTitle: "Explore Physics",
    heroDesc: "Experience physics concepts through interactive JavaScript simulations.",
    noSims: "No simulations added yet.",
    noSimsInCat: "No simulations in this category yet.",
    backToGallery: "Back to Gallery",
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit",
    loading: "Loading...",
    byLine: "Physicist",
    home: "Home",
    topics: "Topics",
    contact: "Contact",
    allSims: "All",
    simCount: (n) => `${n} simulation${n !== 1 ? "s" : ""}`,
    footerContact: "Contact:",
    categories: {
      "Mechanics": "Mechanics", "Chaos Theory": "Chaos Theory", "Waves": "Waves",
      "Optics": "Optics", "Thermodynamics": "Thermodynamics", "Electromagnetism": "Electromagnetism",
      "Quantum": "Quantum", "Nuclear": "Nuclear / Radiation", "Other": "Other",
    },
  },
};

function getCatLabel(cat, lang) { return T[lang]?.categories?.[cat] || cat; }
function getTitle(sim, lang) { return sim[`title_${lang}`] || sim.title_tr || ''; }
function getDesc(sim, lang) { return sim[`description_${lang}`] || sim.description_tr || ''; }

const catColors = {
  Mechanics: { bg: "#00ffc822", fg: "#00ffc8", border: "#00ffc844", icon: "⚙️" },
  "Chaos Theory": { bg: "#c084fc22", fg: "#c084fc", border: "#c084fc44", icon: "🌀" },
  Waves: { bg: "#6bcfff22", fg: "#6bcfff", border: "#6bcfff44", icon: "🌊" },
  Optics: { bg: "#ffd93d22", fg: "#ffd93d", border: "#ffd93d44", icon: "🔦" },
  Thermodynamics: { bg: "#ff6b6b22", fg: "#ff6b6b", border: "#ff6b6b44", icon: "🔥" },
  Electromagnetism: { bg: "#a78bfa22", fg: "#a78bfa", border: "#a78bfa44", icon: "⚡" },
  Quantum: { bg: "#34d39922", fg: "#34d399", border: "#34d39944", icon: "🔬" },
  Nuclear: { bg: "#f472b622", fg: "#f472b6", border: "#f472b644", icon: "☢️" },
  Other: { bg: "#ffffff11", fg: "#94a3b8", border: "#ffffff22", icon: "🧪" },
};

function Badge({ catKey, lang }) {
  const c = catColors[catKey] || catColors.Other;
  return (
    <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5, padding: "3px 10px", borderRadius: 4, background: c.bg, color: c.fg, border: `1px solid ${c.border}` }}>
      {getCatLabel(catKey, lang)}
    </span>
  );
}

const Icons = {
  play: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  back: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  atom: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>,
  globe: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  expand: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
  chevDown: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  mail: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg>,
};

function SimViewer({ sim }) {
  if (!sim) return null;
  if (sim.htmlFile) {
    return <iframe src={`/${sim.htmlFile}`} title="Simulation" style={{ width: "100%", height: "100%", minHeight: 550, border: "none", borderRadius: 8, background: "#0a0c12", display: "block" }} allow="fullscreen" />;
  }
  return <CanvasRunner code={sim.code} />;
}

function CanvasRunner({ code }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!code || !ref.current) return;
    const el = ref.current;
    el.innerHTML = '<canvas id="sim-canvas" style="width:100%;height:100%;display:block;background:#0a0c12;"></canvas>';
    const s = document.createElement('script');
    s.textContent = `(function(){try{${code}}catch(e){console.error(e)}})()`;
    el.appendChild(s);
    return () => { el.innerHTML = ''; };
  }, [code]);
  return <div ref={ref} style={{ width: "100%", height: "100%", minHeight: 400, background: "#0a0c12", borderRadius: 8, overflow: "hidden" }} />;
}

function TopicsDropdown({ sims, lang, t, activeCategory, setActiveCategory, onClose }) {
  const usedCategories = [...new Set(sims.map(s => s.category))];
  return (
    <div
      style={{ position: "absolute", top: "100%", left: 0, marginTop: 8, background: "rgba(15,18,24,0.98)", border: "1px solid #1e293b", borderRadius: 12, padding: "8px", minWidth: 260, backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,255,200,0.03)", zIndex: 200 }}
      onMouseLeave={onClose}
    >
      <button onClick={() => { setActiveCategory(null); onClose(); }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 14px", borderRadius: 8, border: "none", background: activeCategory === null ? "#00ffc80e" : "transparent", color: activeCategory === null ? "#00ffc8" : "#94a3b8", cursor: "pointer", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", textAlign: "left" }}>
        <span>🧬 {t.allSims}</span>
        <span style={{ fontSize: 11, color: "#475569" }}>{t.simCount(sims.length)}</span>
      </button>
      <div style={{ height: 1, background: "#1e293b", margin: "6px 0" }} />
      {usedCategories.map(catKey => {
        const c = catColors[catKey] || catColors.Other;
        const count = sims.filter(s => s.category === catKey).length;
        const isActive = activeCategory === catKey;
        return (
          <button key={catKey} onClick={() => { setActiveCategory(catKey); onClose(); }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 14px", borderRadius: 8, border: "none", background: isActive ? `${c.fg}10` : "transparent", color: isActive ? c.fg : "#94a3b8", cursor: "pointer", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", textAlign: "left" }}>
            <span>{c.icon} {getCatLabel(catKey, lang)}</span>
            <span style={{ fontSize: 11, color: "#475569", background: "#ffffff08", padding: "2px 8px", borderRadius: 10 }}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [sims, setSims] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [lang, setLang] = useState('tr');
  const [activeSim, setActiveSim] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showTopics, setShowTopics] = useState(false);
  const viewerRef = useRef(null);
  const [isFs, setIsFs] = useState(false);

  const t = T[lang];
  const filteredSims = activeCategory ? sims.filter(s => s.category === activeCategory) : sims;

  useEffect(() => {
    fetch('/api/simulations').then(r => r.json()).then(data => {
      setSims(Array.isArray(data) ? data : []);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    const fn = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', fn);
    return () => document.removeEventListener('fullscreenchange', fn);
  }, []);

  function toggleFs() {
    if (!viewerRef.current) return;
    if (!document.fullscreenElement) viewerRef.current.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  }

  if (!loaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: '#00ffc8', fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}>{t.loading}</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(100,200,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: -200, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(0,255,200,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', height: 64, background: 'rgba(10,12,18,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1e293b', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => { setActiveSim(null); setActiveCategory(null); }}>
          <span style={{ color: '#00ffc8' }}>{Icons.atom}</span>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 700, letterSpacing: 1, color: '#00ffc8' }}>FizikLab</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#475569', letterSpacing: 2, textTransform: 'uppercase' }}>Çetin Doğan — {t.byLine}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Ana Sayfa */}
          <button onClick={() => { setActiveSim(null); setActiveCategory(null); setShowTopics(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 6, border: '1px solid transparent', background: (!activeSim && !activeCategory) ? '#00ffc80a' : 'transparent', color: (!activeSim && !activeCategory) ? '#00ffc8' : '#64748b', cursor: 'pointer', fontSize: 13, fontFamily: "'JetBrains Mono', monospace", transition: 'all 0.2s' }}>
            {Icons.home} {t.home}
          </button>

          {/* Konular */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowTopics(!showTopics)} onMouseEnter={() => setShowTopics(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 6, border: activeCategory ? '1px solid #00ffc833' : '1px solid transparent', background: activeCategory ? '#00ffc80a' : 'transparent', color: activeCategory ? '#00ffc8' : '#64748b', cursor: 'pointer', fontSize: 13, fontFamily: "'JetBrains Mono', monospace", transition: 'all 0.2s' }}>
              {t.topics}
              <span style={{ transition: 'transform 0.2s', transform: showTopics ? 'rotate(180deg)' : 'rotate(0deg)', display: 'flex' }}>{Icons.chevDown}</span>
            </button>
            {showTopics && (
              <TopicsDropdown sims={sims} lang={lang} t={t} activeCategory={activeCategory}
                setActiveCategory={(cat) => { setActiveCategory(cat); setActiveSim(null); }}
                onClose={() => setShowTopics(false)} />
            )}
          </div>

          {/* İletişim */}
          <a href="/iletisim" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 6, border: '1px solid transparent', color: '#64748b', fontSize: 13, fontFamily: "'JetBrains Mono', monospace", textDecoration: 'none', transition: 'all 0.2s' }}>
            {Icons.mail} {t.contact}
          </a>

          <div style={{ width: 1, height: 20, background: '#1e293b', margin: '0 6px' }} />

          {/* Language */}
          <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, border: '1px solid #334155', background: '#0f121844', color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
            {Icons.globe}
            <span style={{ color: lang === 'tr' ? '#f1f5f9' : '#64748b', fontWeight: lang === 'tr' ? 600 : 400 }}>TR</span>
            <span style={{ color: '#334155' }}>/</span>
            <span style={{ color: lang === 'en' ? '#f1f5f9' : '#64748b', fontWeight: lang === 'en' ? 600 : 400 }}>EN</span>
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {!activeSim && (
          <>
            <div style={{ marginBottom: 32 }}>
              {activeCategory ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 28 }}>{(catColors[activeCategory] || catColors.Other).icon}</span>
                    <h1 style={{ fontSize: 32, fontWeight: 700, color: (catColors[activeCategory] || catColors.Other).fg }}>{getCatLabel(activeCategory, lang)}</h1>
                  </div>
                  <p style={{ color: '#64748b', fontSize: 14 }}>{t.simCount(filteredSims.length)}</p>
                </>
              ) : (
                <>
                  <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8, background: 'linear-gradient(135deg, #e2e8f0 0%, #00ffc8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t.heroTitle}</h1>
                  <p style={{ color: '#64748b', fontSize: 15, maxWidth: 560, lineHeight: 1.6 }}>{t.heroDesc}</p>
                </>
              )}
            </div>

            {activeCategory && (
              <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => setActiveCategory(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, border: `1px solid ${(catColors[activeCategory] || catColors.Other).border}`, background: (catColors[activeCategory] || catColors.Other).bg, color: (catColors[activeCategory] || catColors.Other).fg, cursor: 'pointer', fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                  {getCatLabel(activeCategory, lang)} ✕
                </button>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {filteredSims.map(sim => (
                <div key={sim.id} onMouseEnter={() => setHoveredId(sim.id)} onMouseLeave={() => setHoveredId(null)} onClick={() => setActiveSim(sim)}
                  style={{
                    background: hoveredId === sim.id ? 'linear-gradient(145deg, #131720 0%, #0f1923 100%)' : '#0f1218',
                    border: `1px solid ${hoveredId === sim.id ? '#00ffc833' : '#1e293b'}`,
                    borderRadius: 12, padding: 24, cursor: 'pointer', transition: 'all 0.3s ease',
                    transform: hoveredId === sim.id ? 'translateY(-2px)' : 'none',
                    boxShadow: hoveredId === sim.id ? '0 8px 32px rgba(0,255,200,0.08)' : 'none',
                    position: 'relative', overflow: 'hidden',
                  }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: 'linear-gradient(225deg, rgba(0,255,200,0.06) 0%, transparent 60%)', borderRadius: '0 12px 0 0' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <Badge catKey={sim.category} lang={lang} />
                    <span style={{ color: hoveredId === sim.id ? '#00ffc8' : '#334155', transition: 'color 0.3s' }}>{Icons.play}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#f1f5f9' }}>{getTitle(sim, lang)}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.55 }}>{getDesc(sim, lang)}</p>
                </div>
              ))}
            </div>

            {filteredSims.length === 0 && sims.length > 0 && (
              <div style={{ textAlign: 'center', padding: 60, color: '#475569' }}>
                <p style={{ fontSize: 15, fontFamily: "'JetBrains Mono', monospace" }}>{t.noSimsInCat}</p>
              </div>
            )}
            {sims.length === 0 && (
              <div style={{ textAlign: 'center', padding: 80, color: '#475569' }}>
                <p style={{ fontSize: 15, fontFamily: "'JetBrains Mono', monospace" }}>{t.noSims}</p>
              </div>
            )}
          </>
        )}

        {activeSim && (
          <>
            <button onClick={() => setActiveSim(null)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 6, border: '1px solid #1e293b', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 13, fontFamily: "'JetBrains Mono', monospace", marginBottom: 20 }}>
              {Icons.back} {t.backToGallery}
            </button>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Badge catKey={activeSim.category} lang={lang} />
                <h2 style={{ fontSize: 24, fontWeight: 600, color: '#f1f5f9' }}>{getTitle(activeSim, lang)}</h2>
              </div>
              <button onClick={toggleFs} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, border: '1px solid #1e293b', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                {Icons.expand} {isFs ? t.exitFullscreen : t.fullscreen}
              </button>
            </div>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20, maxWidth: 600 }}>{getDesc(activeSim, lang)}</p>
            <div ref={viewerRef} style={{ borderRadius: 12, border: '1px solid #1e293b', overflow: 'hidden', background: '#0a0c12', boxShadow: '0 0 40px rgba(0,255,200,0.04)' }}>
              <SimViewer sim={activeSim} />
            </div>
          </>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '40px 20px 20px', borderTop: '1px solid #1e293b22' }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#475569', marginBottom: 8 }}>
          {t.footerContact} <a href="mailto:d_cetin@hotmail.com" style={{ color: '#00ffc8', textDecoration: 'none' }}>d_cetin@hotmail.com</a>
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#334155', letterSpacing: 1 }}>© 2026 Çetin Doğan — FizikLab</p>
      </footer>
    </div>
  );
}
