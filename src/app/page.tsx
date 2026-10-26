 "use client";

import { useMemo, useState } from "react";
import {
  Activity, ArrowDownToLine, ArrowUpRight, BarChart3, CalendarDays, Check,
  ChevronDown, CircleHelp, Copy, FileText, Filter, Lightbulb, Search,
  Sparkles, TrendingUp, WandSparkles
} from "lucide-react";

type Niche = { name: string; category: string; demand: number; competition: number; timing: string; tags: string[]; rationale: string };
type Prompt = { id: number; title: string; niche: string; style: string; text: string; keywords: string[] };

const niches: Niche[] = [
  { name: "Holiday product backgrounds", category: "Photo", demand: 88, competition: 72, timing: "Seasonal", tags: ["holiday", "commerce", "copy space"], rationale: "Commercial layouts with room for campaign copy; differentiate by audience, palette, and product category." },
  { name: "Sustainable packaging", category: "Photo", demand: 81, competition: 54, timing: "Evergreen", tags: ["eco", "packaging", "brand"], rationale: "Useful for sustainability campaigns, product launches, and editorial-style commercial layouts." },
  { name: "AI and human collaboration", category: "Illustration", demand: 85, competition: 68, timing: "Trend-led", tags: ["AI", "business", "technology"], rationale: "Broad business use case; avoid generic robot imagery by focusing on concrete workflows." },
  { name: "Botanical skincare still life", category: "Photo", demand: 78, competition: 61, timing: "Evergreen", tags: ["beauty", "botanical", "wellness"], rationale: "A flexible product-adjacent concept with room for lighting, material, and composition variations." },
  { name: "Minimal business icon system", category: "Vector", demand: 73, competition: 79, timing: "Evergreen", tags: ["icon", "business", "UI"], rationale: "Potentially useful as a coherent set, but highly competitive; prioritize a specific industry or workflow." },
  { name: "Local food culture", category: "Photo", demand: 76, competition: 43, timing: "Trend-led", tags: ["food", "local", "culture"], rationale: "Specific regional context can help distinguish assets from generic global stock imagery." },
];

const styles = [
  ["Auto (ikut riset)", "Gaya disarankan dari niche dan tipe aset"],
  ["Commercial photography", "Foto komersial dengan komposisi terarah"],
  ["Minimalist", "Sederhana, bersih, ruang negatif"],
  ["3D render", "Material dan pencahayaan 3D"],
  ["Flat vector", "Bentuk tegas dan warna flat"],
  ["Line icon", "Sistem ikon dengan ketebalan konsisten"],
  ["Editorial", "Nuansa editorial dengan storytelling"],
  ["Paper cut", "Lapisan kertas dan bayangan halus"],
  ["Isometric", "Sudut isometrik dan bentuk terstruktur"],
  ["Surreal conceptual", "Konsep visual metaforis"],
];

const seasonal = [
  { label: "Halloween", date: "31 Okt", days: 5 },
  { label: "Black Friday", date: "27 Nov", days: 32 },
  { label: "Christmas", date: "25 Des", days: 60 },
  { label: "New Year 2027", date: "1 Jan", days: 67 },
  { label: "Lunar New Year", date: "6 Feb", days: 103 },
  { label: "Ramadan 2027", date: "Feb 2027*", days: 105 },
  { label: "Valentine", date: "14 Feb", days: 111 },
  { label: "Eid al-Fitr 2027", date: "Mar 2027*", days: 135 },
];

function makePrompts(niche: Niche, style: string, count: number): Prompt[] {
  const directions = [
    "wide composition with generous clean copy space on the right",
    "close-up detail with tactile materials and soft directional light",
    "overhead flat lay with carefully balanced negative space",
    "three-quarter view with layered depth and a restrained color palette",
    "modular composition designed for a commercial campaign layout",
    "asymmetric editorial framing with a clear visual focal point",
    "isolated subject on a seamless neutral background",
    "cohesive collection with consistent lighting and art direction",
    "natural candid moment with believable details and authentic context",
    "bold geometric composition with a distinctive silhouette",
  ];
  const chosenStyle = style === "Auto (ikut riset)"
    ? (niche.category === "Vector" ? "clean flat vector illustration" : niche.category === "Illustration" ? "polished commercial editorial illustration" : "premium commercial stock photography")
    : style.toLowerCase();
  return Array.from({ length: count }, (_, i) => {
    const direction = directions[i % directions.length];
    const text = `Create a commercially useful ${chosenStyle} concept about ${niche.name.toLowerCase()}, intended for Adobe Stock buyers. ${direction}. Use ${niche.tags.join(", ")} as contextual cues without adding logos, trademarks, or recognizable copyrighted characters. Clear subject hierarchy, refined art direction, realistic or stylistically consistent details, technically clean output, no accidental text, no watermark, no brand marks. Make the concept visually specific rather than generic, with a distinctive and usable stock composition.`;
    return {
      id: Date.now() + i,
      title: `${niche.name} — concept ${i + 1}`,
      niche: niche.name,
      style: chosenStyle,
      text,
      keywords: [...niche.tags, "commercial stock", "copy space", "creative concept"],
    };
  });
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [assetType, setAssetType] = useState("All asset types");
  const [resultCount, setResultCount] = useState(100);
  const [selectedNiche, setSelectedNiche] = useState(niches[0].name);
  const [style, setStyle] = useState("Auto (ikut riset)");
  const [promptCount, setPromptCount] = useState(5);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompts, setSelectedPrompts] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<"research" | "prompts">("research");

  const filteredNiches = useMemo(() => niches.filter(n => {
    const matchQuery = `${n.name} ${n.category} ${n.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase());
    const matchType = assetType === "All asset types" || n.category === assetType;
    return matchQuery && matchType;
  }), [query, assetType]);

  const activeNiche = niches.find(n => n.name === selectedNiche) ?? niches[0];

  function research() {
    setNotice("Tampilan ini memakai data contoh. Hubungkan sumber data resmi/berizin untuk riset live.");
    setTab("research");
  }

  function generate() {
    const created = makePrompts(activeNiche, style, promptCount);
    setPrompts(created);
    setSelectedPrompts(created.map(p => p.id));
    setTab("prompts");
    setNotice(`${created.length} prompt berhasil disusun dari template berbasis niche. Statistik live belum terhubung.`);
  }

  async function copyText(text: string) {
    try { await navigator.clipboard.writeText(text); setNotice("Berhasil disalin."); }
    catch { setNotice("Clipboard tidak tersedia. Pilih teks prompt lalu salin manual."); }
  }

  function exportTxt() {
    const chosen = prompts.filter(p => selectedPrompts.includes(p.id));
    if (!chosen.length) { setNotice("Pilih setidaknya satu prompt untuk diekspor."); return; }
    const content = chosen.map((p, i) => `PROMPT ${i + 1}: ${p.title}\nSTYLE: ${p.style}\nKEYWORDS: ${p.keywords.join(", ")}\n\n${p.text}`).join("\n\n---\n\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "stock-trend-prompts.txt"; a.click(); URL.revokeObjectURL(url);
    setNotice(`${chosen.length} prompt diekspor.`);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><TrendingUp size={19}/></div><div><strong>Stock Trend</strong><span>STUDIO</span></div></div>
        <div className="workspace-label">WORKSPACE</div>
        <button className={`nav-item ${tab === "research" ? "active" : ""}`} onClick={() => setTab("research")}><BarChart3 size={17}/> Riset niche</button>
        <button className={`nav-item ${tab === "prompts" ? "active" : ""}`} onClick={() => setTab("prompts")}><WandSparkles size={17}/> Prompt studio <span className="nav-count">{prompts.length || 0}</span></button>
        <div className="sidebar-bottom"><div className="status-dot"/> <span>Prototype mode</span><span className="status-pill">LOCAL</span></div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div><div className="eyebrow">CREATOR INTELLIGENCE / WORKSPACE</div><h1>{tab === "research" ? "Riset peluang stock" : "Prompt studio"}</h1></div>
          <div className="top-actions"><span className="demo-badge"><span/> DATA DEMO</span><button className="avatar">ST</button></div>
        </header>

        <div className="page-content">
          <div className="notice"><CircleHelp size={16}/><span><strong>Mode prototype:</strong> skor dan niche di bawah adalah data contoh, bukan statistik live atau data penjualan Adobe Stock.</span></div>

          <section className="hero-panel">
            <div className="hero-copy"><div className="hero-kicker"><Sparkles size={14}/> TREND → INSIGHT → PROMPT</div><h2>Temukan peluang.<br/><em>Buat prompt yang terarah.</em></h2><p>Riset niche terlebih dahulu, lalu ubah insight menjadi prompt stock yang spesifik dan siap kamu gunakan di image generator pilihanmu.</p><div className="hero-actions"><button className="primary-btn" onClick={() => { setTab("research"); document.getElementById("research-panel")?.scrollIntoView({ behavior: "smooth" }); }}><Search size={16}/> Mulai riset <ArrowUpRight size={16}/></button><button className="secondary-btn" onClick={() => { setTab("prompts"); document.getElementById("prompt-panel")?.scrollIntoView({ behavior: "smooth" }); }}>Buka prompt studio</button></div></div>
            <div className="hero-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="mini-window"><div className="window-top"><span/><span/><span/><b>NICHE SIGNALS</b></div><div className="signal-row"><div className="signal-icon purple"><Activity size={16}/></div><div><strong>Trend relevance</strong><span>Trend-led signal</span></div><b>High</b></div><div className="signal-row"><div className="signal-icon green"><TrendingUp size={16}/></div><div><strong>Commercial use</strong><span>Buyer use cases</span></div><b>Strong</b></div><div className="signal-row"><div className="signal-icon orange"><CalendarDays size={16}/></div><div><strong>Seasonality</strong><span>Planning window</span></div><b>Active</b></div><div className="signal-footer"><span/> Illustrative signals only</div></div><div className="float-tag"><Sparkles size={13}/> Insight to prompt</div></div>
          </section>

          <div className="section-heading" id="research-panel"><div><span className="section-index">01</span><div><h3>Riset niche</h3><p>Mulai dari keyword atau pilih ide niche yang ingin ditelusuri.</p></div></div><span className="section-note"><Activity size={14}/> Data source: demo</span></div>
          <section className="panel">
            <div className="search-row"><label className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari niche, keyword, atau use case…"/><kbd>ENTER</kbd></label><button className="primary-btn" onClick={research}>Riset niche <ArrowUpRight size={15}/></button></div>
            <div className="field-grid"><label className="field"><span>Jenis aset</span><div className="select-wrap"><Filter size={15}/><select value={assetType} onChange={e => setAssetType(e.target.value)}><option>All asset types</option><option>Photo</option><option>Vector</option><option>Illustration</option></select><ChevronDown size={15}/></div></label><label className="field"><span>Jumlah hasil yang ditinjau <b>{resultCount}</b></span><input type="range" min="20" max="200" step="20" value={resultCount} onChange={e => setResultCount(Number(e.target.value))}/><small>Kontrol ini akan dipakai saat sumber data riset dihubungkan.</small></label></div>
            <div className="subheading"><div><h4>Ide niche</h4><p>Pilih satu untuk melihat sinyal dan membuat prompt.</p></div><span>{filteredNiches.length} niche</span></div>
            <div className="niche-grid">{filteredNiches.map((n, i) => <button key={n.name} onClick={() => setSelectedNiche(n.name)} className={`niche-card ${selectedNiche === n.name ? "selected" : ""}`}><div className={`niche-symbol symbol-${i % 4}`}>{i % 2 ? <Lightbulb size={19}/> : <TrendingUp size={19}/>}</div><div className="niche-card-main"><div className="niche-title">{n.name}</div><div className="niche-meta"><span>{n.category}</span><span>•</span><span>{n.timing}</span></div><div className="tag-row">{n.tags.slice(0, 2).map(t => <span key={t}>{t}</span>)}</div></div><div className="niche-score"><strong>{Math.round((n.demand * 0.55) + ((100 - n.competition) * 0.45)}</strong><span>heuristic</span></div></button>)}</div>
            <div className="selected-insight"><div className="insight-mark"><Lightbulb size={18}/></div><div className="insight-copy"><strong>{activeNiche.name}</strong><p>{activeNiche.rationale}</p><div className="tag-row">{activeNiche.tags.map(t => <span key={t}>{t}</span>)}</div></div><button className="text-btn" onClick={() => { setTab("prompts"); document.getElementById("prompt-panel")?.scrollIntoView({ behavior: "smooth" }); }}>Buat prompt <ArrowUpRight size={15}/></button></div>
          </section>

          <div className="section-heading"><div><span className="section-index">02</span><div><h3>Momentum musiman</h3><p>Rencanakan aset lebih awal dari tanggal kebutuhan buyer.</p></div></div><span className="section-note"><CalendarDays size={14}/> Kalender indikatif</span></div>
          <section className="season-grid">{seasonal.map((s, i) => <button key={s.label} className={`season-card ${s.days < 30 ? "urgent" : ""}`} onClick={() => { setQuery(s.label); setSelectedNiche(s.label === "Ramadan 2027" || s.label === "Eid al-Fitr 2027" ? "Local food culture" : "Holiday product backgrounds"); }}><div className="season-top"><CalendarDays size={16}/><span>{s.date}</span></div><strong>{s.label}</strong><div className="season-bottom"><span>{s.days < 30 ? "Waktunya mepet" : "Planning window"}</span><b>{s.days} hari</b></div><div className="season-track"><span style={{ width: `${Math.max(8, 100 - s.days / 2)}%` }}/></div></button>)}</section>
            <p className="footnote">*Tanggal hari raya dapat berubah mengikuti penetapan resmi. Kalender dan jarak hari perlu disegarkan sebelum dipakai untuk keputusan produksi.</p>

          <div className="section-heading" id="prompt-panel"><div><span className="section-index">03</span><div><h3>Ubah insight jadi prompt</h3><p>Atur gaya visual dan jumlah variasi. Tidak ada gambar yang dibuat di sini.</p></div></div><span className="section-note"><WandSparkles size={14}/> Prompt only</span></div>
          <section className="panel prompt-builder">
            <div className="prompt-controls"><label className="field"><span>Niche aktif</span><div className="select-wrap"><Lightbulb size={15}/><select value={selectedNiche} onChange={e => setSelectedNiche(e.target.value)}>{niches.map(n => <option key={n.name}>{n.name}</option>)}</select><ChevronDown size={15}/></div></label><label className="field"><span>Gaya visual</span><div className="select-wrap"><Sparkles size={15}/><select value={style} onChange={e => setStyle(e.target.value)}>{styles.map(s => <option key={s[0]}>{s[0]}</option>)}</select><ChevronDown size={15}/></div></label></div>
            <div className="style-hint">{styles.find(s => s[0] === style)?.[1]}</div>
            <div className="prompt-count"><label htmlFor="prompt-count">Jumlah prompt <b>{promptCount}</b></label><input id="prompt-count" type="range" min="1" max="20" value={promptCount} onChange={e => setPromptCount(Number(e.target.value))}/><div className="range-labels"><span>1 prompt</span><span>20 prompt</span></div></div>
            <button className="primary-btn wide" onClick={generate}><WandSparkles size={16}/> Buat {promptCount} prompt dari niche <ArrowUpRight size={16}/></button>
          </section>

          <div className="section-heading"><div><span className="section-index">04</span><div><h3>Prompt output</h3><p>Pilih prompt untuk disalin atau diekspor.</p></div></div><div className="output-actions"><span className="section-note">{prompts.length} prompt</span><button className="secondary-btn small" onClick={exportTxt}><ArrowDownToLine size={15}/> Export TXT</button></div></div>
          <section className="panel output-panel">
            {notice && <div className="inline-notice"><Check size={15}/>{notice}</div>}
            {prompts.length === 0 ? <div className="empty-state"><div className="empty-icon"><FileText size={24}/></div><h4>Prompt kamu akan muncul di sini</h4><p>Pilih niche, tentukan gaya visual, lalu buat prompt. Kamu bisa menyalin atau mengekspor hasilnya.</p><button className="secondary-btn" onClick={generate}><WandSparkles size={15}/> Coba dengan niche terpilih</button></div> : <><div className="output-toolbar"><label><input type="checkbox" checked={selectedPrompts.length === prompts.length} onChange={e => setSelectedPrompts(e.target.checked ? prompts.map(p => p.id) : [])}/> Pilih semua</label><span>{selectedPrompts.length} dipilih</span></div><div className="prompt-list">{prompts.map((p, i) => <article className="prompt-card" key={p.id}><div className="prompt-card-head"><label className="prompt-select"><input type="checkbox" checked={selectedPrompts.includes(p.id)} onChange={e => setSelectedPrompts(old => e.target.checked ? [...old, p.id] : old.filter(id => id !== p.id))}/><span className="prompt-number">{String(i + 1).padStart(2, "0")}</span></label><div className="prompt-card-title"><strong>{p.title}</strong><span>{p.style}</span></div><button className="icon-btn" title="Salin prompt" onClick={() => copyText(p.text)}><Copy size={16}/></button></div><p className="prompt-text">{p.text}</p><div className="tag-row">{p.keywords.map(k => <span key={k}>{k}</span>)}</div></article>)}</div></>}
          </section>
          <footer className="footer"><div className="brand mini"><div className="brand-mark"><TrendingUp size={15}/></div><strong>Stock Trend Studio</strong></div><span>Riset dengan jujur. Prompt dengan tujuan.</span><span>Prototype v0.1</span></footer>
        </div>
      </section>
    </main>
  );
}
