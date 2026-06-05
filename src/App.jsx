import { useState, useMemo } from "react";

const INITIAL_QUEUE = [
  { id: 1, title: "Lenny's Podcast – Como PMs constroem roadmaps sem data", format: "Podcast", category: "Carreira & Produto", context: "Deslocamento", status: "Na fila", link: "" },
  { id: 2, title: "How Duolingo's PM team runs discovery", format: "Artigo", category: "Carreira & Produto", context: "Pausa curta", status: "Na fila", link: "" },
  { id: 3, title: "Rotina de skincare para o inverno – pele oleosa", format: "TikTok", category: "Estilo de vida", context: "Pausa curta", status: "Na fila", link: "" },
  { id: 4, title: "Como a guerra tarifária está mudando o varejo brasileiro", format: "YouTube", category: "Mundo", context: "Foco longo", status: "Na fila", link: "" },
  { id: 5, title: "Inspired – Marty Cagan (cap. 12 a 18)", format: "PDF / Livro", category: "Carreira & Produto", context: "Foco longo", status: "Na fila", link: "" },
  { id: 6, title: "Newsletter Substack – PM Letter #34", format: "Artigo", category: "Carreira & Produto", context: "Pausa curta", status: "Na fila", link: "" },
  { id: 7, title: "Mini-cápsula de inverno com peças que já tenho", format: "YouTube", category: "Estilo de vida", context: "Foco longo", status: "Na fila", link: "" },
  { id: 8, title: "O que é IA generativa – explicado sem tecniquês", format: "YouTube", category: "Mundo", context: "Pausa curta", status: "Em espera", link: "" },
  { id: 9, title: "Jobs to Be Done na prática – Intercom Blog", format: "Artigo", category: "Carreira & Produto", context: "Pausa curta", status: "Em espera", link: "" },
  { id: 10, title: "The Product Strategy Stack – Reforge", format: "Artigo", category: "Carreira & Produto", context: "Foco longo", status: "Concluído", link: "" },
];

const INITIAL_PROFILES = [
  { id: 1, name: "@lenny_rachitsky", category: "Carreira & Produto", status: "Ativo" },
  { id: 2, name: "@producthunt", category: "Carreira & Produto", status: "Ativo" },
  { id: 3, name: "@theskimm", category: "Mundo", status: "Ativo" },
  { id: 4, name: "@skincarebyhyram", category: "Estilo de vida", status: "Ativo" },
  { id: 5, name: "@modefica", category: "Estilo de vida", status: "Ativo" },
  { id: 6, name: "@nexojornal", category: "Mundo", status: "Ativo" },
  { id: 7, name: "@uxdesignbr", category: "Carreira & Produto", status: "Passivo" },
  { id: 8, name: "@minhasfinancas", category: "Mundo", status: "Passivo" },
];

const INITIAL_MOVIES = [
  { id: 1, title: "Pobres Criaturas", genre: "Drama / Fantasia", platform: "Disney+", watched: false },
  { id: 2, title: "A Zona de Interesse", genre: "Drama histórico", platform: "MUBI", watched: false },
  { id: 3, title: "Saltburn", genre: "Suspense", platform: "Prime Video", watched: false },
  { id: 4, title: "Past Lives", genre: "Romance / Drama", platform: "MUBI", watched: false },
  { id: 5, title: "Oppenheimer", genre: "Drama histórico", platform: "Netflix", watched: true },
];

const CATEGORIES = ["Carreira & Produto", "Estilo de vida", "Mundo"];
const FORMATS = ["TikTok", "YouTube", "Podcast", "Artigo", "PDF / Livro"];
const CONTEXTS = ["Deslocamento", "Pausa curta", "Foco longo"];
const PLATFORMS = ["Netflix", "Prime Video", "Disney+", "MUBI", "Apple TV+", "Outro"];

const CAT_COLOR = {
  "Carreira & Produto": { bg: "#EEF2FF", text: "#4F46E5", dot: "#6366F1" },
  "Estilo de vida":     { bg: "#FDF2F8", text: "#BE185D", dot: "#EC4899" },
  "Mundo":              { bg: "#F0FDF4", text: "#166534", dot: "#22C55E" },
};

const FORMAT_ICON = {
  "TikTok": "📱", "YouTube": "▶️", "Podcast": "🎙️",
  "Artigo": "📰", "PDF / Livro": "📚",
};

const CTX_ICON = { "Deslocamento": "🚶", "Pausa curta": "☕", "Foco longo": "🧠" };

const STATUS_STYLE = {
  "Na fila":   { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  "Em espera": { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  "Concluído": { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
};

function CatPill({ cat }) {
  const c = CAT_COLOR[cat] || { bg: "#F3F4F6", text: "#374151", dot: "#9CA3AF" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:c.bg, color:c.text,
      borderRadius:99, padding:"2px 8px", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:c.dot, flexShrink:0 }} />
      {cat}
    </span>
  );
}

function Chip({ label }) {
  return (
    <span style={{ background:"#F3F4F6", color:"#6B7280", borderRadius:6,
      padding:"2px 7px", fontSize:11, fontWeight:500, whiteSpace:"nowrap" }}>{label}</span>
  );
}

function Divider() {
  return <div style={{ height:1, background:"#F3F4F6", margin:"4px 0" }} />;
}

function SectionHeader({ emoji, title, count, accent }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
      <span style={{ fontSize:18 }}>{emoji}</span>
      <div style={{ flex:1 }}>
        <span style={{ fontSize:15, fontWeight:700, color:"#111827" }}>{title}</span>
        {count !== undefined && (
          <span style={{ marginLeft:8, fontSize:12, color:"#9CA3AF", fontWeight:500 }}>{count}</span>
        )}
      </div>
      {accent && <div style={{ width:3, height:20, borderRadius:99, background:accent }} />}
    </div>
  );
}

function EmptyState({ msg }) {
  return (
    <div style={{ textAlign:"center", padding:"28px 0", color:"#D1D5DB", fontSize:13 }}>
      <div style={{ fontSize:28, marginBottom:8 }}>○</div>
      {msg}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:100,
      display:"flex", alignItems:"flex-end", justifyContent:"center" }}
      onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", width:"100%", maxWidth:520,
        padding:"24px 20px 36px", boxShadow:"0 -8px 40px rgba(0,0,0,0.12)" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <span style={{ fontWeight:700, fontSize:15, color:"#111827" }}>{title}</span>
          <button onClick={onClose} style={{ background:"#F3F4F6", border:"none", borderRadius:99,
            width:28, height:28, cursor:"pointer", fontSize:16, color:"#6B7280" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#6B7280",
        letterSpacing:.5, marginBottom:5, textTransform:"uppercase" }}>{label}</label>
      {children}
    </div>
  );
}

const inputCss = {
  width:"100%", border:"1.5px solid #E5E7EB", borderRadius:10, padding:"10px 12px",
  fontSize:14, color:"#111827", outline:"none", background:"#FAFAFA", boxSizing:"border-box",
};

const selectCss = {
  ...inputCss, cursor:"pointer", appearance:"none",
  backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%236B7280' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
  backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center",
};

function SaveBtn({ onClick, label="Salvar" }) {
  return (
    <button onClick={onClick} style={{ width:"100%", background:"#111827", color:"#fff",
      border:"none", borderRadius:12, padding:"13px", fontSize:14, fontWeight:700,
      cursor:"pointer", marginTop:4 }}>{label}</button>
  );
}

function ActionBtn({ onClick, color, icon, title }) {
  return (
    <button onClick={onClick} title={title} style={{
      width:28, height:28, borderRadius:8, border:`1.5px solid ${color}30`,
      background:`${color}12`, color, fontSize:13, fontWeight:700,
      cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
      flexShrink:0, padding:0,
    }}>{icon}</button>
  );
}

function QueueSection({ items, setItems }) {
  const [filter, setFilter] = useState("Na fila");
  const [catFilter, setCatFilter] = useState("Todas");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title:"", format:"Podcast", category:"Carreira & Produto", context:"Deslocamento", status:"Na fila", link:"" });

  const counts = {
    "Na fila": items.filter(i => i.status === "Na fila").length,
    "Em espera": items.filter(i => i.status === "Em espera").length,
    "Concluído": items.filter(i => i.status === "Concluído").length,
  };

  const visible = useMemo(() => items.filter(i => {
    if (i.status !== filter) return false;
    if (catFilter !== "Todas" && i.category !== catFilter) return false;
    return true;
  }), [items, filter, catFilter]);

  function save() {
    if (!form.title.trim()) return;
    setItems(p => [...p, { ...form, id: Date.now() }]);
    setForm({ title:"", format:"Podcast", category:"Carreira & Produto", context:"Deslocamento", status:"Na fila", link:"" });
    setModal(false);
  }

  function advance(id) {
    setItems(p => p.map(i => {
      if (i.id !== id) return i;
      const next = i.status === "Na fila" ? "Concluído" : i.status === "Em espera" ? "Na fila" : i.status;
      return { ...i, status: next };
    }));
  }

  function pause(id) { setItems(p => p.map(i => i.id === id ? { ...i, status: "Em espera" } : i)); }
  function remove(id) { setItems(p => p.filter(i => i.id !== id)); }

  return (
    <section style={{ marginBottom:32 }}>
      <SectionHeader emoji="📋" title="Fila de conteúdo" count={`${counts["Na fila"]} na fila`} accent="#6366F1" />
      <div style={{ display:"flex", gap:6, marginBottom:14, overflowX:"auto", paddingBottom:2 }}>
        {["Na fila","Em espera","Concluído"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            background: filter===s ? "#111827" : "#F3F4F6",
            color: filter===s ? "#fff" : "#6B7280",
            border:"none", borderRadius:99, padding:"6px 14px",
            fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
          }}>{s} ({counts[s]})</button>
        ))}
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:16, overflowX:"auto", paddingBottom:2 }}>
        {["Todas", ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setCatFilter(c)} style={{
            background: catFilter===c ? "#EEF2FF" : "transparent",
            color: catFilter===c ? "#4F46E5" : "#9CA3AF",
            border: catFilter===c ? "1.5px solid #C7D2FE" : "1.5px solid #F3F4F6",
            borderRadius:99, padding:"4px 12px", fontSize:11, fontWeight:600,
            cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
          }}>{c}</button>
        ))}
      </div>
      <div style={{ background:"#fff", border:"1.5px solid #F3F4F6", borderRadius:16, overflow:"hidden" }}>
        {visible.length === 0 ? <EmptyState msg="Nenhum item aqui." /> : visible.map((item, idx) => (
          <div key={item.id}>
            {idx > 0 && <Divider />}
            <div style={{ padding:"14px 16px", display:"flex", gap:12, alignItems:"flex-start" }}>
              <div style={{ fontSize:22, flexShrink:0, marginTop:1 }}>{FORMAT_ICON[item.format]}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#111827", lineHeight:1.4,
                  marginBottom:7, overflow:"hidden", display:"-webkit-box",
                  WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                      style={{ color:"#4F46E5", textDecoration:"none" }}>
                      {item.title} <span style={{ fontSize:10 }}>↗</span>
                    </a>
                  ) : item.title}
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  <CatPill cat={item.category} />
                  <Chip label={`${CTX_ICON[item.context]} ${item.context}`} />
                  <Chip label={item.format} />
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:5, flexShrink:0 }}>
                {item.status === "Na fila" && <>
                  <ActionBtn onClick={() => advance(item.id)} color="#22C55E" icon="✓" title="Concluir" />
                  <ActionBtn onClick={() => pause(item.id)} color="#F59E0B" icon="⏸" title="Pausar" />
                </>}
                {item.status === "Em espera" && <ActionBtn onClick={() => advance(item.id)} color="#6366F1" icon="↑" title="Reativar" />}
                <ActionBtn onClick={() => remove(item.id)} color="#EF4444" icon="×" title="Remover" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setModal(true)} style={{
        width:"100%", marginTop:12, background:"#F9FAFB", border:"1.5px dashed #D1D5DB",
        borderRadius:12, padding:"11px", fontSize:13, color:"#6B7280", fontWeight:600,
        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6,
      }}><span style={{ fontSize:16 }}>+</span> Adicionar conteúdo</button>
      {modal && (
        <Modal title="Novo conteúdo" onClose={() => setModal(false)}>
          <Field label="Título">
            <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))}
              placeholder="Nome do conteúdo..." style={inputCss} />
          </Field>
          <Field label="Link (opcional)">
            <input value={form.link} onChange={e => setForm(f=>({...f,link:e.target.value}))}
              placeholder="https://..." style={inputCss} />
          </Field>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Field label="Formato">
              <select value={form.format} onChange={e => setForm(f=>({...f,format:e.target.value}))} style={selectCss}>
                {FORMATS.map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value}))} style={selectCss}>
                {["Na fila","Em espera"].map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Categoria">
              <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} style={selectCss}>
                {CATEGORIES.map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Contexto">
              <select value={form.context} onChange={e => setForm(f=>({...f,context:e.target.value}))} style={selectCss}>
                {CONTEXTS.map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
          </div>
          <SaveBtn onClick={save} />
        </Modal>
      )}
    </section>
  );
}

function ProfilesSection({ profiles, setProfiles }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name:"", category:"Carreira & Produto", status:"Ativo" });

  const active = profiles.filter(p => p.status === "Ativo");
  const passive = profiles.filter(p => p.status === "Passivo");

  function save() {
    if (!form.name.trim()) return;
    setProfiles(p => [...p, { ...form, id: Date.now() }]);
    setForm({ name:"", category:"Carreira & Produto", status:"Ativo" });
    setModal(false);
  }

  function toggle(id) {
    setProfiles(p => p.map(pr => pr.id === id ? { ...pr, status: pr.status === "Ativo" ? "Passivo" : "Ativo" } : pr));
  }

  function remove(id) { setProfiles(p => p.filter(pr => pr.id !== id)); }

  const ProfileRow = ({ p }) => (
    <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:12, opacity: p.status === "Passivo" ? .5 : 1 }}>
      <div style={{ width:34, height:34, borderRadius:99, background:"#F3F4F6",
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>📱</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{p.name}</div>
        <div style={{ marginTop:4 }}><CatPill cat={p.category} /></div>
      </div>
      <div style={{ display:"flex", gap:5 }}>
        <ActionBtn onClick={() => toggle(p.id)} color={p.status==="Ativo" ? "#F59E0B" : "#6366F1"}
          icon={p.status==="Ativo" ? "⏸" : "↑"} title={p.status==="Ativo" ? "Marcar passivo" : "Reativar"} />
        <ActionBtn onClick={() => remove(p.id)} color="#EF4444" icon="×" title="Remover" />
      </div>
    </div>
  );

  return (
    <section style={{ marginBottom:32 }}>
      <SectionHeader emoji="📱" title="Perfis TikTok" accent="#EC4899" count={`${active.length} ativos · meta ≤ 10`} />
      <div style={{ background:"#fff", border:"1.5px solid #F3F4F6", borderRadius:16, overflow:"hidden" }}>
        {active.length === 0 && passive.length === 0 && <EmptyState msg="Nenhum perfil cadastrado." />}
        {active.map((p, i) => <div key={p.id}>{i>0 && <Divider />}<ProfileRow p={p} /></div>)}
        {passive.length > 0 && <>
          <div style={{ padding:"8px 16px", background:"#FAFAFA", borderTop:"1px solid #F3F4F6", borderBottom:"1px solid #F3F4F6" }}>
            <span style={{ fontSize:11, fontWeight:700, color:"#9CA3AF", letterSpacing:.5 }}>PASSIVOS — rever mensalmente ({passive.length})</span>
          </div>
          {passive.map((p, i) => <div key={p.id}>{i>0 && <Divider />}<ProfileRow p={p} /></div>)}
        </>}
      </div>
      <button onClick={() => setModal(true)} style={{
        width:"100%", marginTop:12, background:"#F9FAFB", border:"1.5px dashed #D1D5DB",
        borderRadius:12, padding:"11px", fontSize:13, color:"#6B7280", fontWeight:600,
        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6,
      }}><span style={{ fontSize:16 }}>+</span> Adicionar perfil</button>
      {modal && (
        <Modal title="Novo perfil" onClose={() => setModal(false)}>
          <Field label="Perfil (@usuario)">
            <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}
              placeholder="@nome do perfil" style={inputCss} />
          </Field>
          <Field label="Categoria">
            <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} style={selectCss}>
              {CATEGORIES.map(v => <option key={v}>{v}</option>)}
            </select>
          </Field>
          <SaveBtn onClick={save} />
        </Modal>
      )}
    </section>
  );
}

function MoviesSection({ movies, setMovies }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title:"", genre:"", platform:"Netflix", watched:false });

  const toWatch = movies.filter(m => !m.watched);
  const watched = movies.filter(m => m.watched);

  function save() {
    if (!form.title.trim()) return;
    setMovies(p => [...p, { ...form, id: Date.now() }]);
    setForm({ title:"", genre:"", platform:"Netflix", watched:false });
    setModal(false);
  }

  function toggle(id) { setMovies(p => p.map(m => m.id===id ? {...m, watched:!m.watched} : m)); }
  function remove(id) { setMovies(p => p.filter(m => m.id!==id)); }

  const MovieRow = ({ m }) => (
    <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:12, opacity: m.watched ? .45 : 1 }}>
      <div style={{ width:34, height:34, borderRadius:10, background:"#F3F4F6",
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🎬</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#111827", textDecoration: m.watched ? "line-through" : "none" }}>{m.title}</div>
        <div style={{ display:"flex", gap:5, marginTop:4, flexWrap:"wrap" }}>
          {m.genre && <Chip label={m.genre} />}
          {m.platform && <span style={{ background:"#EFF6FF", color:"#1D4ED8", borderRadius:6, padding:"2px 7px", fontSize:11, fontWeight:500 }}>{m.platform}</span>}
        </div>
      </div>
      <div style={{ display:"flex", gap:5 }}>
        <ActionBtn onClick={() => toggle(m.id)} color={m.watched ? "#F59E0B" : "#22C55E"} icon={m.watched ? "↩" : "✓"} title={m.watched ? "Desmarcar" : "Marcar como visto"} />
        <ActionBtn onClick={() => remove(m.id)} color="#EF4444" icon="×" title="Remover" />
      </div>
    </div>
  );

  return (
    <section style={{ marginBottom:32 }}>
      <SectionHeader emoji="🎬" title="Lista de filmes" accent="#22C55E" count={`${toWatch.length} para ver · ${watched.length} visto${watched.length!==1?"s":""}`} />
      <div style={{ background:"#fff", border:"1.5px solid #F3F4F6", borderRadius:16, overflow:"hidden" }}>
        {toWatch.length === 0 && watched.length === 0 && <EmptyState msg="Nenhum filme salvo ainda." />}
        {toWatch.map((m, i) => <div key={m.id}>{i>0 && <Divider />}<MovieRow m={m} /></div>)}
        {watched.length > 0 && <>
          <div style={{ padding:"8px 16px", background:"#FAFAFA", borderTop:"1px solid #F3F4F6", borderBottom:"1px solid #F3F4F6" }}>
            <span style={{ fontSize:11, fontWeight:700, color:"#9CA3AF", letterSpacing:.5 }}>VISTOS ({watched.length})</span>
          </div>
          {watched.map((m, i) => <div key={m.id}>{i>0 && <Divider />}<MovieRow m={m} /></div>)}
        </>}
      </div>
      <button onClick={() => setModal(true)} style={{
        width:"100%", marginTop:12, background:"#F9FAFB", border:"1.5px dashed #D1D5DB",
        borderRadius:12, padding:"11px", fontSize:13, color:"#6B7280", fontWeight:600,
        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6,
      }}><span style={{ fontSize:16 }}>+</span> Adicionar filme</button>
      {modal && (
        <Modal title="Novo filme" onClose={() => setModal(false)}>
          <Field label="Título">
            <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))}
              placeholder="Nome do filme..." style={inputCss} />
          </Field>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Field label="Gênero">
              <input value={form.genre} onChange={e => setForm(f=>({...f,genre:e.target.value}))}
                placeholder="Ex: Drama..." style={inputCss} />
            </Field>
            <Field label="Plataforma">
              <select value={form.platform} onChange={e => setForm(f=>({...f,platform:e.target.value}))} style={selectCss}>
                {PLATFORMS.map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
          </div>
          <SaveBtn onClick={save} />
        </Modal>
      )}
    </section>
  );
}

function RitualBanner() {
  const steps = [
    "Passe pelos perfis TikTok ativos e salve o que vale",
    "Adicione novos conteúdos à fila",
    "Priorize no máximo 7 itens para a semana",
    "O resto vai para Em espera — revise a cada 3 semanas",
  ];
  return (
    <div style={{ background:"#111827", borderRadius:16, padding:"18px 20px", marginBottom:32 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <span style={{ fontSize:16 }}>☀️</span>
        <span style={{ fontSize:13, fontWeight:700, color:"#F9FAFB" }}>Ritual de domingo</span>
        <span style={{ fontSize:11, color:"#6B7280", marginLeft:4 }}>~15 min</span>
      </div>
      {steps.map((s, i) => (
        <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom: i<steps.length-1 ? 8 : 0 }}>
          <span style={{ width:20, height:20, borderRadius:99, background:"#374151",
            color:"#9CA3AF", fontSize:11, fontWeight:700, display:"flex", alignItems:"center",
            justifyContent:"center", flexShrink:0, marginTop:1 }}>{i+1}</span>
          <span style={{ fontSize:12, color:"#D1D5DB", lineHeight:1.5 }}>{s}</span>
        </div>
      ))}
    </div>
  );
}

function StatsBar({ queue, profiles, movies }) {
  const stats = [
    { label:"Na fila", value: queue.filter(i=>i.status==="Na fila").length, color:"#6366F1" },
    { label:"Em espera", value: queue.filter(i=>i.status==="Em espera").length, color:"#F59E0B" },
    { label:"Perfis ativos", value: profiles.filter(p=>p.status==="Ativo").length, color:"#EC4899" },
    { label:"Ver depois", value: movies.filter(m=>!m.watched).length, color:"#22C55E" },
  ];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:28 }}>
      {stats.map(s => (
        <div key={s.label} style={{ background:"#fff", border:"1.5px solid #F3F4F6",
          borderRadius:12, padding:"12px 10px", textAlign:"center" }}>
          <div style={{ fontSize:22, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
          <div style={{ fontSize:10, color:"#9CA3AF", marginTop:4, fontWeight:500, lineHeight:1.3 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [profiles, setProfiles] = useState(INITIAL_PROFILES);
  const [movies, setMovies] = useState(INITIAL_MOVIES);
  const [tab, setTab] = useState("fila");

  const tabs = [
    { id:"fila",   label:"Conteúdo", emoji:"📋" },
    { id:"tiktok", label:"TikTok",   emoji:"📱" },
    { id:"filmes", label:"Filmes",   emoji:"🎬" },
    { id:"ritual", label:"Ritual",   emoji:"☀️" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#F9FAFB",
      fontFamily:"'Geist', 'SF Pro Text', system-ui, -apple-system, sans-serif" }}>
      <div style={{ background:"#fff", borderBottom:"1.5px solid #F3F4F6",
        padding:"20px 20px 0", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#9CA3AF", letterSpacing:1.5,
            textTransform:"uppercase", marginBottom:4 }}>Curadoria Semanal</div>
          <div style={{ fontSize:22, fontWeight:800, color:"#111827", letterSpacing:-.5 }}>Consumo intencional</div>
        </div>
        <div style={{ display:"flex", gap:2 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1, background:"none", border:"none",
              borderBottom: tab===t.id ? "2.5px solid #111827" : "2.5px solid transparent",
              padding:"10px 4px 11px", fontSize:12, fontWeight:600,
              color: tab===t.id ? "#111827" : "#9CA3AF",
              cursor:"pointer", display:"flex", flexDirection:"column",
              alignItems:"center", gap:2, transition:"color .15s",
            }}>
              <span style={{ fontSize:16 }}>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding:"24px 20px", maxWidth:520, margin:"0 auto" }}>
        {tab === "fila" && <><StatsBar queue={queue} profiles={profiles} movies={movies} /><QueueSection items={queue} setItems={setQueue} /></>}
        {tab === "tiktok" && <ProfilesSection profiles={profiles} setProfiles={setProfiles} />}
        {tab === "filmes" && <MoviesSection movies={movies} setMovies={setMovies} />}
        {tab === "ritual" && <RitualBanner />}
      </div>
    </div>
  );
}
