import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../styles/Home.css";

/* ── animated counter ── */
function useCountUp(target: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let cur = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [trigger, target, duration]);
  return count;
}

const StatItem = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);
  const n = useCountUp(value, 1500, go);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div className="hm-stat-item" ref={ref}>
      <span className="hm-stat-num">{n}{suffix}</span>
      <span className="hm-stat-label">{label}</span>
    </div>
  );
};

/* ── faq accordion ── */
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`hm-faq-item${open ? " open" : ""}`} onClick={() => setOpen(!open)}>
      <div className="hm-faq-q">
        <span>{q}</span>
        <svg className="hm-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {open && <div className="hm-faq-a">{a}</div>}
    </div>
  );
};

/* ── data ── */
const BRANDS = ["BOSCH", "NGK", "VALEO", "MANN", "BREMBO", "FEBI", "SKF", "GATES", "HELLA", "LIQUI MOLY"];

const FEATURES = [
  {
    title: "Stoc în Timp Real", badge: "Live",
    desc: "Disponibilitatea fiecărei piese instant. Alerte automate la stoc scăzut, astfel că niciodată nu rămâi fără piesele cheie.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" /><path strokeLinecap="round" d="M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z" /><path strokeLinecap="round" d="M16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
  },
  {
    title: "Specificații Complete", badge: "Detaliat",
    desc: "Fiecare produs cu cod OEM, producător, categorie și imagini. Filtre avansate după orice parametru.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  },
  {
    title: "Roluri și Permisiuni", badge: "Securizat",
    desc: "Admin controlează tot, angajații actualizează stocul. Acces bazat pe roluri cu audit complet al modificărilor.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
  },
  {
    title: "Rapoarte și Statistici", badge: "Analytics",
    desc: "Dashboard cu KPI: valoare stoc, produse critice, mișcări recente. Exportă rapoarte în câteva secunde.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>,
  },
  {
    title: "Accesibil Oricând", badge: "Cloud",
    desc: "Platformă web completă — lucrezi de pe desktop, tabletă sau telefon. Fără instalare, fără VPN.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3.284 14.253A8.959 8.959 0 013 12c0-1.067.174-2.094.497-3.053" /></svg>,
  },
  {
    title: "Import din Excel", badge: "Import",
    desc: "Migrezi datele din Excel, CSV sau 1C rapid. Asistență tehnică inclusă în toate planurile pentru configurarea inițială.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>,
  },
];

const CATEGORIES = [
  {
    id: "01", name: "Frâne", desc: "Plăcuțe, discuri, etriere și componente complete",
    count: "120+", accent: "#3B82F6",
    bg: "linear-gradient(135deg, #101828 0%, #0d1f3c 100%)",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /><path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M16.9 16.9l1.5 1.5M5.6 18.4l1.4-1.4M16.9 7.1l1.5-1.5" /></svg>,
  },
  {
    id: "02", name: "Filtre", desc: "Ulei, aer, combustibil și habitaclu",
    count: "85+", accent: "#10B981",
    bg: "linear-gradient(135deg, #101c14 0%, #0b2a1a 100%)",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path strokeLinecap="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path strokeLinecap="round" d="M8 9h8M8 12h5M8 15h6" /><circle cx="12" cy="12" r="3" /></svg>,
  },
  {
    id: "03", name: "Suspensie", desc: "Amortizoare, arcuri, silent blocuri",
    count: "95+", accent: "#F59E0B",
    bg: "linear-gradient(135deg, #1c1410 0%, #2a1a0a 100%)",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path strokeLinecap="round" d="M12 2v5M12 17v5" /><path strokeLinecap="round" d="M8 5l4 4 4-4M8 19l4-4 4 4" /><line x1="7" y1="10" x2="17" y2="10" /><line x1="7" y1="14" x2="17" y2="14" /></svg>,
  },
  {
    id: "04", name: "Motor", desc: "Distribuție, răcire, piese interne",
    count: "200+", accent: "#8B5CF6",
    bg: "linear-gradient(135deg, #120e1c 0%, #1a0e2e 100%)",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="7" width="20" height="10" rx="2" /><path strokeLinecap="round" d="M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2" /><circle cx="7" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="17" cy="12" r="1.5" /></svg>,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01", title: "Creezi contul",
    text: "Înregistrare în 2 minute. Configurezi depozitul, categoriile și echipa cu care vei lucra.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
  },
  {
    step: "02", title: "Importezi stocul",
    text: "Importi din Excel sau introduci manual. Categorii, coduri OEM, prețuri și imagini.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>,
  },
  {
    step: "03", title: "Lucrezi în timp real",
    text: "Echipa operează simultan — actualizări instant pentru toți utilizatorii. Modificările se văd în secunde.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  },
  {
    step: "04", title: "Analizezi și optimizezi",
    text: "Dashboard cu KPI, rapoarte lunare, alerte de reaprovizionare. Decizii bazate pe date reale.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
  },
];

const TESTIMONIALS = [
  {
    name: "Ion Ciorici", role: "Manager depozit", company: "AutoParts SRL", initials: "IC",
    quote: "MaxVanDam a schimbat complet modul în care gestionăm stocul. Am trecut de la tabele Excel haotice la un sistem clar și rapid. Angajații mei s-au adaptat în câteva ore.",
  },
  {
    name: "Elena Rotaru", role: "Proprietar", company: "Distribuitor Auto MD", initials: "ER",
    quote: "Cel mai bun lucru a fost că am putut importa tot stocul din Excel fără probleme. Acum avem vizibilitate totală și nu mai pierdem piese din evidență.",
  },
  {
    name: "Vasile Grosu", role: "Director logistică", company: "AutoTech Distribution", initials: "VG",
    quote: "Am testat multe sisteme, dar MaxVanDam este singurul care se potrivește perfect cu specificul depozitelor auto din Moldova. Simplu, rapid și fără bătăi de cap.",
  },
];

const PLANS = [
  {
    name: "Basic", price: "299", period: "MDL / lună", popular: false,
    features: ["Până la 3 utilizatori", "500 produse", "Rapoarte de bază", "Suport email"],
  },
  {
    name: "Professional", price: "599", period: "MDL / lună", popular: true,
    features: ["Până la 15 utilizatori", "Produse nelimitate", "Analytics avansat", "Import Excel/CSV", "Suport prioritar"],
  },
  {
    name: "Enterprise", price: "999", period: "MDL / lună", popular: false,
    features: ["Utilizatori nelimitați", "Multi-depozit", "API access", "Manager dedicat", "SLA garantat"],
  },
];

const FAQ = [
  {
    q: "Cum pot testa platforma înainte de a mă abona?",
    a: "Oferim un demo gratuit de 14 zile fără card de credit. Poți testa toate funcționalitățile platformei în condiții reale de lucru.",
  },
  {
    q: "Pot importa datele din Excel sau din sistemele existente?",
    a: "Da. MaxVanDam suportă import din fișiere Excel (.xlsx, .csv) și oferă asistență tehnică pentru migrarea datelor din sisteme existente precum 1C.",
  },
  {
    q: "Câți utilizatori pot lucra simultan în platformă?",
    a: "Depinde de planul ales. Basic permite până la 3 utilizatori, Professional până la 15, iar Enterprise nu are limită.",
  },
  {
    q: "Ce se întâmplă cu datele mele dacă renunț la abonament?",
    a: "Datele îți aparțin. Poți exporta întregul inventar în CSV sau Excel oricând. Accesul rămâne activ 30 de zile după expirare pentru export.",
  },
];

const Check = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

/* ══════════════════════════════════════════════════ */

const Home = () => (
  <div className="home-page">

    {/* ━ 1. HERO ━ */}
    <section className="hm-hero">
      <div className="hm-hero-overlay" />
      <div className="hm-hero-grid-overlay" />
      <div className="hm-hero-content">
        <span className="hm-badge">Platformă digitală auto · Moldova · 2024</span>
        <h1 className="hm-hero-h1">
          Stoc precis.<br />
          <span className="hm-hero-accent">Control total.</span>
        </h1>
        <p className="hm-hero-sub">
          Platformă modernă pentru managementul stocurilor auto. Înlocuiește Excelul și 1C cu un sistem cloud rapid, securizat și ușor de folosit de întreaga echipă.
        </p>
        <div className="hm-hero-ctas">
          <Link to="/products" className="hm-btn hm-btn-primary">Explorează Produsele</Link>
          <Link to="/about"    className="hm-btn hm-btn-ghost">Descoperă Platforma →</Link>
        </div>
        <div className="hm-hero-trust">
          <span>500+ Produse</span><span className="hm-dot">·</span>
          <span>200+ Clienți</span><span className="hm-dot">·</span>
          <span>99.9% Uptime</span><span className="hm-dot">·</span>
          <span>Moldova, 2024</span>
        </div>
      </div>
    </section>

    {/* ━ 2. STATS ━ */}
    <section className="hm-stats-strip">
      <div className="hm-container">
        <div className="hm-stats-grid">
          <StatItem value={500} suffix="+" label="Produse în catalog" />
          <StatItem value={200} suffix="+" label="Clienți activi" />
          <StatItem value={4}   suffix=""  label="Categorii principale" />
          <StatItem value={99}  suffix="%" label="Satisfacție clienți" />
        </div>
      </div>
    </section>

    {/* ━ 3. FEATURES ━ */}
    <section className="hm-section hm-section-alt">
      <div className="hm-container">
        <div className="hm-section-head">
          <span className="hm-badge">De ce MaxVanDam?</span>
          <h2>Tot ce ai nevoie într-o singură platformă</h2>
          <p>Construită specific pentru depozite auto și distribuitori de piese, cu fiecare funcție gândită să reducă munca manuală și să elimine erorile.</p>
        </div>
        <div className="hm-features-grid">
          {FEATURES.map((f) => (
            <div className="hm-feature-card" key={f.title}>
              <div className="hm-feature-icon-wrap">{f.icon}</div>
              <div className="hm-feature-badge-chip">{f.badge}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ━ 4. PLATFORM PREVIEW ━ */}
    <section className="hm-section">
      <div className="hm-container">
        <div className="hm-split">
          <div className="hm-split-text">
            <span className="hm-badge">Platformă cloud</span>
            <h2>Un dashboard care îți arată tot ce contează</h2>
            <p>Interfață curată, indicatori în timp real, filtre rapide. Gestionezi sute de produse cu aceeași ușurință ca și cum ai avea zece.</p>
            <ul className="hm-check-list">
              <li><Check />Vizualizare stoc cu filtre după categorie, preț și disponibilitate</li>
              <li><Check />Alerte automate la stoc scăzut sub pragul configurat</li>
              <li><Check />Export rapoarte în Excel sau PDF cu un click</li>
              <li><Check />Modificări trasabile — cine, ce și când a schimbat</li>
              <li><Check />Căutare rapidă după cod OEM, denumire sau categorie</li>
            </ul>
            <Link to="/inventory-visibility" className="hm-btn hm-btn-primary hm-mt">
              Vezi Demo Platformă →
            </Link>
          </div>
          <div className="hm-split-img">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80"
              alt="Dashboard analytics MaxVanDam"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    {/* ━ 5. CATEGORIES ━ */}
    <section className="hm-section hm-section-alt">
      <div className="hm-container">
        <div className="hm-section-head">
          <span className="hm-badge">Catalog</span>
          <h2>Categorii de Piese Auto</h2>
          <p>Organizat clar pe categorii principale. Fiecare produs cu specificații complete și stoc actualizat zilnic.</p>
        </div>
        <div className="hm-cat-grid">
          {CATEGORIES.map((c) => (
            <Link
              to="/products"
              key={c.id}
              className="hm-cat-card"
              style={{ "--cat-accent": c.accent } as React.CSSProperties}
            >
              <div className="hm-cat-bg" style={{ background: c.bg }} />
              <div className="hm-cat-icon-wrap">{c.icon}</div>
              <div className="hm-cat-body">
                <span className="hm-cat-count">{c.count} produse</span>
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
                <span className="hm-cat-link">Explorează →</span>
              </div>
              <div className="hm-cat-num">{c.id}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* ━ 6. HOW IT WORKS ━ */}
    <section className="hm-section">
      <div className="hm-container">
        <div className="hm-section-head">
          <span className="hm-badge">Proces</span>
          <h2>De la zero la depozit digitalizat în o oră</h2>
          <p>Implementare simplă, adoptare rapidă, impact imediat asupra operațiunilor.</p>
        </div>
        <div className="hm-steps-grid">
          {HOW_IT_WORKS.map((s) => (
            <div className="hm-step-card" key={s.step}>
              <div className="hm-step-num">{s.step}</div>
              <div className="hm-step-icon-wrap">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ━ 7. BRANDS ━ */}
    <div className="hm-brands-strip">
      <p className="hm-brands-label">Mărci disponibile în catalog</p>
      <div className="hm-brands-mask">
        <div className="hm-brands-track">
          {[...BRANDS, ...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} className="hm-brand">{b}</span>
          ))}
        </div>
      </div>
    </div>

    {/* ━ 8. TESTIMONIALS ━ */}
    <section className="hm-section hm-section-alt">
      <div className="hm-container">
        <div className="hm-section-head">
          <span className="hm-badge">Clienți</span>
          <h2>Ce spun clienții noștri</h2>
          <p>Depozite auto și distribuitori din toată Moldova folosesc MaxVanDam zilnic.</p>
        </div>
        <div className="hm-testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <div className="hm-testimonial-card" key={t.name}>
              <div className="hm-quote-icon">
                <svg viewBox="0 0 32 24" fill="currentColor">
                  <path d="M0 24V14.4C0 6.432 4.48 1.472 13.44 0l1.12 2.08C10.08 3.36 7.68 5.92 7.04 9.6H12V24H0zm18 0V14.4C18 6.432 22.48 1.472 31.44 0l1.12 2.08C28.08 3.36 25.68 5.92 25.04 9.6H30V24H18z" />
                </svg>
              </div>
              <p className="hm-testimonial-text">{t.quote}</p>
              <div className="hm-testimonial-author">
                <div className="hm-avatar">{t.initials}</div>
                <div className="hm-author-info">
                  <strong>{t.name}</strong>
                  <span>{t.role} · {t.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ━ 9. TECH & SECURITY ━ */}
    <section className="hm-section">
      <div className="hm-container">
        <div className="hm-split hm-split-rev">
          <div className="hm-split-img">
            <img
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80"
              alt="Infrastructură cloud securizată"
              loading="lazy"
            />
          </div>
          <div className="hm-split-text">
            <span className="hm-badge">Securitate</span>
            <h2>Date protejate, infrastructură solidă</h2>
            <p>Datele tale sunt stocate pe servere securizate cu backup automat zilnic. Accesul este controlat prin autentificare JWT și permisiuni pe roluri.</p>
            <div className="hm-tech-pills">
              {[".NET 8", "PostgreSQL", "React + Vite", "JWT Auth", "HTTPS", "Docker"].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <ul className="hm-check-list hm-mt">
              <li><Check />Backup automat zilnic cu posibilitate de restaurare</li>
              <li><Check />99.9% uptime garantat prin monitorizare continuă</li>
              <li><Check />Audit complet — cine, ce și când a modificat</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* ━ 10. PRICING TEASER ━ */}
    <section className="hm-section hm-section-alt">
      <div className="hm-container">
        <div className="hm-section-head">
          <span className="hm-badge">Prețuri</span>
          <h2>Planuri transparente, fără surprize</h2>
          <p>Alege planul potrivit dimensiunii depozitului tău. Anulezi oricând, fără penalizări.</p>
        </div>
        <div className="hm-pricing-grid">
          {PLANS.map((plan) => (
            <div className={`hm-price-card${plan.popular ? " hm-popular" : ""}`} key={plan.name}>
              {plan.popular && <div className="hm-popular-badge">Cel mai popular</div>}
              <div className="hm-price-name">{plan.name}</div>
              <div className="hm-price-amount">
                <span className="hm-price-val">{plan.price}</span>
                <span className="hm-price-period">{plan.period}</span>
              </div>
              <ul className="hm-price-features">
                {plan.features.map((f) => (
                  <li key={f}><Check />{f}</li>
                ))}
              </ul>
              <Link to="/pricing" className={`hm-btn ${plan.popular ? "hm-btn-primary" : "hm-btn-outline"}`}>
                Alege {plan.name}
              </Link>
            </div>
          ))}
        </div>
        <div className="hm-pricing-footer">
          <Link to="/pricing" className="hm-text-link">Compară toate planurile în detaliu →</Link>
        </div>
      </div>
    </section>

    {/* ━ 11. FAQ ━ */}
    <section className="hm-section">
      <div className="hm-container">
        <div className="hm-section-head">
          <span className="hm-badge">Întrebări frecvente</span>
          <h2>Ai întrebări? Avem răspunsuri.</h2>
          <p>Cele mai comune întrebări de la potențialii clienți. Nu găsești răspunsul? Contactează-ne direct.</p>
        </div>
        <div className="hm-faq-list">
          {FAQ.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>

    {/* ━ 12. CTA FINAL ━ */}
    <section className="hm-cta-final">
      <div className="hm-cta-glow" />
      <div className="hm-cta-grid" />
      <div className="hm-container hm-cta-content">
        <span className="hm-badge">Start astăzi</span>
        <h2>Pregătit să treci la un depozit inteligent?</h2>
        <p>Renunță la Excel și la sistemele greoaie. MaxVanDam funcționează din prima zi — import rapid, echipă conectată, stoc sub control.</p>
        <div className="hm-cta-actions">
          <Link to="/pricing" className="hm-btn hm-btn-primary hm-btn-lg">Alege un plan →</Link>
          <Link to="/about"   className="hm-btn hm-btn-ghost">Află mai multe</Link>
        </div>
      </div>
    </section>

  </div>
);

export default Home;
