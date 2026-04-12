'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const ADMIN_PASS = 'fiziklab2026';
const CATEGORIES = [
  { key: 'Mechanics', tr: 'Mekanik' },
  { key: 'Chaos Theory', tr: 'Kaos Teorisi' },
  { key: 'Waves', tr: 'Dalgalar' },
  { key: 'Optics', tr: 'Optik' },
  { key: 'Thermodynamics', tr: 'Termodinamik' },
  { key: 'Electromagnetism', tr: 'Elektromanyetizma' },
  { key: 'Quantum', tr: 'Kuantum' },
  { key: 'Nuclear', tr: 'Nükleer / Radyasyon' },
  { key: 'Other', tr: 'Diğer' },
];

// ═══════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════
const Icons = {
  lock: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  upload: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  check: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ffc8" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  edit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  file: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ffc8" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  atom: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  spinner: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></path></svg>,
};

// ═══════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #1e293b', background: '#0a0c12', color: '#e2e8f0', fontSize: 15, outline: 'none', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 8 };
const btnPrimary = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px', borderRadius: 8, border: '1px solid #00ffc844', background: 'linear-gradient(135deg, #00ffc820, #00ffc810)', color: '#00ffc8', cursor: 'pointer', fontSize: 16, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 };

// ═══════════════════════════════════════════
// MAIN PANEL
// ═══════════════════════════════════════════
export default function PanelPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pass, setPass] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [sims, setSims] = useState([]);
  const [view, setView] = useState('list'); // list | add | edit
  const [editSim, setEditSim] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (isAdmin) loadSims();
  }, [isAdmin]);

  async function loadSims() {
    const r = await fetch('/api/simulations');
    const data = await r.json();
    setSims(Array.isArray(data) ? data : []);
  }

  function handleLogin() {
    if (pass === ADMIN_PASS) { setIsAdmin(true); setLoginError(false); }
    else setLoginError(true);
  }

  async function handleDelete(sim) {
    if (!confirm(`"${sim.title_tr}" silinecek. Emin misiniz?`)) return;
    // delete file from blob if exists
    if (sim.fileUrl) {
      await fetch('/api/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: sim.fileUrl, password: ADMIN_PASS }) });
    }
    await fetch('/api/simulations', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: sim.id, password: ADMIN_PASS }) });
    await loadSims();
    showMsg('Simülasyon silindi');
  }

  function showMsg(text) {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  }

  // ── LOGIN ──
  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(100,200,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 380, width: '100%', textAlign: 'center' }}>
          <div style={{ color: '#00ffc8', marginBottom: 20, display: 'flex', justifyContent: 'center' }}>{Icons.lock}</div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#f1f5f9', marginBottom: 8 }}>Yönetim Paneli</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>Simülasyon eklemek ve düzenlemek için giriş yapın.</p>
          <input type="password" value={pass}
            onChange={e => { setPass(e.target.value); setLoginError(false); }}
            onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
            placeholder="Şifre girin..."
            style={{ ...inputStyle, marginBottom: 14, textAlign: 'center', fontSize: 16, border: loginError ? '1px solid #ff6b6b' : '1px solid #1e293b' }}
            autoFocus
          />
          <button onClick={handleLogin} style={btnPrimary}>Giriş Yap</button>
          {loginError && <p style={{ color: '#ff6b6b', fontSize: 13, marginTop: 14 }}>Yanlış şifre</p>}
        </div>
      </div>
    );
  }

  // ── PANEL ──
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(100,200,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', background: 'rgba(10,12,18,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#00ffc8' }}>{Icons.atom}</span>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: '#00ffc8' }}>FizikLab Panel</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#475569', letterSpacing: 2 }}>SİMÜLASYON YÖNETİMİ</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/" style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #1e293b', color: '#94a3b8', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', gap: 5 }}>Siteyi Gör</a>
          <button onClick={() => { setIsAdmin(false); setPass(''); }} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 6, border: '1px solid #ff6b6b33', background: 'transparent', color: '#ff6b6b', cursor: 'pointer', fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
            {Icons.logout} Çıkış
          </button>
        </div>
      </nav>

      {/* Toast */}
      {msg && (
        <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', padding: '10px 24px', borderRadius: 8, background: '#00ffc815', border: '1px solid #00ffc844', color: '#00ffc8', fontSize: 13, fontFamily: "'JetBrains Mono', monospace", zIndex: 200, display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icons.check} {msg}
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>

        {/* LIST VIEW */}
        {view === 'list' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>Simülasyonlar</h2>
                <p style={{ color: '#64748b', fontSize: 13 }}>{sims.length} simülasyon mevcut</p>
              </div>
              <button onClick={() => { setEditSim(null); setView('add'); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 8, border: '1px solid #00ffc844', background: 'linear-gradient(135deg, #00ffc815, #00ffc808)', color: '#00ffc8', cursor: 'pointer', fontSize: 14, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                {Icons.plus} Yeni Ekle
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sims.map(sim => (
                <div key={sim.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: 10, border: '1px solid #1e293b', background: '#0f1218', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: '#f1f5f9', marginBottom: 4 }}>{sim.title_tr}</div>
                    <div style={{ fontSize: 11, color: '#475569', fontFamily: "'JetBrains Mono', monospace" }}>
                      {sim.fileUrl ? '📄 Yüklenmiş HTML' : sim.htmlFile ? `📄 ${sim.htmlFile}` : '⚡ Canvas JS'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => { setEditSim(sim); setView('edit'); }} style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #1e293b', background: 'transparent', color: '#ffd93d', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                      {Icons.edit} Düzenle
                    </button>
                    <button onClick={() => handleDelete(sim)} style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #1e293b', background: 'transparent', color: '#ff6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                      {Icons.trash} Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {sims.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, borderRadius: 12, border: '1px dashed #1e293b', color: '#475569', marginTop: 20 }}>
                <p style={{ fontSize: 15, marginBottom: 8 }}>Henüz simülasyon yok</p>
                <p style={{ fontSize: 13 }}>"Yeni Ekle" butonuna tıklayarak başlayın.</p>
              </div>
            )}
          </>
        )}

        {/* ADD / EDIT VIEW */}
        {(view === 'add' || view === 'edit') && (
          <SimForm
            sim={editSim}
            onSave={async (sim) => {
              await fetch('/api/simulations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sim, password: ADMIN_PASS }) });
              await loadSims();
              setView('list');
              showMsg(editSim ? 'Simülasyon güncellendi' : 'Simülasyon eklendi');
            }}
            onCancel={() => setView('list')}
          />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SIM FORM (Add / Edit) with Drag & Drop
// ═══════════════════════════════════════════
function SimForm({ sim, onSave, onCancel }) {
  const [titleTr, setTitleTr] = useState(sim?.title_tr || '');
  const [titleEn, setTitleEn] = useState(sim?.title_en || '');
  const [descTr, setDescTr] = useState(sim?.description_tr || '');
  const [descEn, setDescEn] = useState(sim?.description_en || '');
  const [category, setCategory] = useState(sim?.category || 'Mechanics');
  const [fileUrl, setFileUrl] = useState(sim?.fileUrl || '');
  const [fileName, setFileName] = useState(sim?.fileName || '');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const canSave = titleTr.trim() && (fileUrl || sim?.htmlFile || sim?.code);

  async function uploadFile(file) {
    if (!file || !file.name.endsWith('.html')) {
      alert('Sadece .html dosyaları yüklenebilir.');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('password', 'fiziklab2026');
      const r = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await r.json();
      if (data.url) {
        setFileUrl(data.url);
        setFileName(data.filename);
      } else {
        alert('Yükleme hatası: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (e) {
      alert('Yükleme hatası: ' + e.message);
    }
    setUploading(false);
  }

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, []);

  const onDragOver = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
  const onDragLeave = useCallback(() => setDragOver(false), []);

  return (
    <div>
      <button onClick={onCancel} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 6, border: '1px solid #1e293b', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 13, fontFamily: "'JetBrains Mono', monospace", marginBottom: 24 }}>
        ← Geri Dön
      </button>

      <h2 style={{ fontSize: 22, fontWeight: 600, color: '#f1f5f9', marginBottom: 28 }}>
        {sim ? 'Simülasyonu Düzenle' : 'Yeni Simülasyon Ekle'}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* DRAG & DROP UPLOAD */}
        <div>
          <label style={labelStyle}>HTML Dosyası</label>
          <div
            onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#00ffc8' : fileUrl ? '#00ffc844' : '#1e293b'}`,
              borderRadius: 12, padding: '40px 20px', textAlign: 'center', cursor: 'pointer',
              background: dragOver ? '#00ffc808' : fileUrl ? '#00ffc805' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            <input ref={fileInputRef} type="file" accept=".html" style={{ display: 'none' }}
              onChange={e => { if (e.target.files[0]) uploadFile(e.target.files[0]); }}
            />
            {uploading ? (
              <div style={{ color: '#00ffc8' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{Icons.spinner}</div>
                <p style={{ fontSize: 15, fontWeight: 500 }}>Dosya yükleniyor...</p>
              </div>
            ) : fileUrl ? (
              <div style={{ color: '#00ffc8' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{Icons.file}</div>
                <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{fileName || 'Dosya yüklendi'}</p>
                <p style={{ fontSize: 12, color: '#64748b' }}>Değiştirmek için tıklayın veya yeni dosya sürükleyin</p>
              </div>
            ) : (
              <div style={{ color: '#64748b' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: '#334155' }}>{Icons.upload}</div>
                <p style={{ fontSize: 16, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>HTML dosyasını buraya sürükleyin</p>
                <p style={{ fontSize: 13 }}>veya tıklayarak dosya seçin</p>
              </div>
            )}
          </div>
        </div>

        {/* TITLE TR */}
        <div>
          <label style={labelStyle}>Başlık (Türkçe) <span style={{ color: '#ff6b6b' }}>*</span></label>
          <input style={{ ...inputStyle, fontSize: 16 }} value={titleTr} onChange={e => setTitleTr(e.target.value)} placeholder="örn. X Işını Oluşumu" />
        </div>

        {/* TITLE EN */}
        <div>
          <label style={labelStyle}>Başlık (İngilizce) <span style={{ color: '#475569', fontWeight: 400 }}>— isteğe bağlı</span></label>
          <input style={inputStyle} value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder="e.g. X-Ray Generation" />
        </div>

        {/* DESC TR */}
        <div>
          <label style={labelStyle}>Açıklama (Türkçe)</label>
          <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={descTr} onChange={e => setDescTr(e.target.value)} placeholder="Simülasyonun kısa açıklaması..." />
        </div>

        {/* DESC EN */}
        <div>
          <label style={labelStyle}>Açıklama (İngilizce) <span style={{ color: '#475569', fontWeight: 400 }}>— isteğe bağlı</span></label>
          <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={descEn} onChange={e => setDescEn(e.target.value)} placeholder="Brief description..." />
        </div>

        {/* CATEGORY */}
        <div>
          <label style={labelStyle}>Kategori</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.tr}</option>)}
          </select>
        </div>

        {/* SAVE */}
        <div style={{ display: 'flex', gap: 12, paddingTop: 8, paddingBottom: 40 }}>
          <button
            onClick={() => {
              if (!canSave) return;
              onSave({
                ...(sim || {}),
                title_tr: titleTr,
                title_en: titleEn,
                description_tr: descTr,
                description_en: descEn,
                category,
                fileUrl: fileUrl || sim?.fileUrl || '',
                fileName: fileName || sim?.fileName || '',
                htmlFile: sim?.htmlFile || '',
                code: sim?.code || '',
              });
            }}
            disabled={!canSave}
            style={{
              ...btnPrimary, width: 'auto', padding: '14px 36px',
              opacity: canSave ? 1 : 0.4,
              cursor: canSave ? 'pointer' : 'not-allowed',
            }}
          >
            {sim ? 'Kaydet' : 'Simülasyonu Ekle'}
          </button>
          <button onClick={onCancel} style={{ padding: '14px 28px', borderRadius: 8, border: '1px solid #1e293b', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}
