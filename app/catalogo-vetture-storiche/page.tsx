'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

/* ============================================================
   ROSSO MANIA — Archivio Schede Ufficiali (/modelli)
   Header e footer identici a app/page.tsx (homepage approvata).
   Pensata per scalare: il cliente caricherà 130+ schede da backend,
   qui sotto un dataset di esempio nello stesso shape che arriverà da Sanity.
   ============================================================ */

type Modello = {
  slug: string;
  nome: string;
  decennio: string; // "1950s" | "1960s" ...
  anniProduzione: string;
  categoria: string;
  cilindrata: string;
  img: string;
  estratto: string;
  annunciAttivi: number;
};

const MODELLI: Modello[] = [
  { slug: 'testarossa', nome: 'Testarossa', decennio: '1980s', anniProduzione: '1984 – 1991', categoria: 'Coupé', cilindrata: '12 cilindri boxer', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=70', estratto: "L'icona degli anni '80. Dodici cilindri boxer e le indimenticabili branchie laterali.", annunciAttivi: 6 },
  { slug: 'dino-246-gt', nome: 'Dino 246 GT', decennio: '1970s', anniProduzione: '1969 – 1974', categoria: 'Coupé', cilindrata: 'V6', img: 'https://images.unsplash.com/photo-1658905097696-ec44846c3c3c?auto=format&fit=crop&w=900&q=70', estratto: 'La piccola di Maranello dedicata ad Alfredo Ferrari. Equilibrio e linea senza tempo.', annunciAttivi: 4 },
  { slug: 'f40', nome: 'F40', decennio: '1980s', anniProduzione: '1987 – 1992', categoria: 'Coupé', cilindrata: 'V8 Turbo', img: 'https://images.unsplash.com/photo-1690998199897-c32c0798a456?auto=format&fit=crop&w=900&q=70', estratto: "L'ultima Ferrari voluta da Enzo. Pura, brutale, definitiva. Il mito dei miti.", annunciAttivi: 3 },
  { slug: '308-gtb-gts', nome: '308 GTB / GTS', decennio: '1970s', anniProduzione: '1975 – 1985', categoria: 'Coupé / Targa', cilindrata: 'V8', img: 'https://images.unsplash.com/photo-1758620328615-2815f2689169?auto=format&fit=crop&w=900&q=70', estratto: 'La V8 che ha definito un\u2019epoca, tra cinema e collezionismo internazionale.', annunciAttivi: 9 },
  { slug: '365-daytona', nome: '365 GTB/4 Daytona', decennio: '1960s', anniProduzione: '1968 – 1973', categoria: 'Gran Turismo', cilindrata: 'V12', img: 'https://images.unsplash.com/photo-1752253509655-112f2abab03c?auto=format&fit=crop&w=900&q=70', estratto: 'Il gran turismo definitivo. V12 anteriore e 280 km/h nel 1968.', annunciAttivi: 5 },
  { slug: '250-gt-lusso', nome: '250 GT Lusso', decennio: '1960s', anniProduzione: '1962 – 1964', categoria: 'Gran Turismo', cilindrata: 'V12', img: 'https://images.unsplash.com/photo-1716265816511-3693aeac2b60?auto=format&fit=crop&w=900&q=70', estratto: "L'eleganza Pininfarina al servizio del gran turismo. Rarità e fascino assoluti.", annunciAttivi: 2 },
  { slug: '288-gto', nome: '288 GTO', decennio: '1980s', anniProduzione: '1984 – 1987', categoria: 'Omologazione Gruppo B', cilindrata: 'V8 Turbo', img: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=70', estratto: 'Nata per le corse, rimasta un mito su strada. Antesignana della F40.', annunciAttivi: 1 },
  { slug: '512-bb', nome: '512 BB', decennio: '1970s', anniProduzione: '1976 – 1981', categoria: 'Coupé', cilindrata: '12 cilindri boxer', img: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=70', estratto: 'La prima Berlinetta Boxer a motore centrale. La progenitrice della Testarossa.', annunciAttivi: 3 },
  { slug: '328-gts', nome: '328 GTS', decennio: '1980s', anniProduzione: '1985 – 1989', categoria: 'Targa', cilindrata: 'V8', img: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=70', estratto: "L'evoluzione finale della famiglia 308, più potente e raffinata.", annunciAttivi: 4 },
  { slug: '275-gtb', nome: '275 GTB', decennio: '1960s', anniProduzione: '1964 – 1968', categoria: 'Coupé', cilindrata: 'V12', img: 'https://images.unsplash.com/photo-1716265816511-3693aeac2b60?auto=format&fit=crop&w=900&q=70', estratto: 'Sospensioni indipendenti e cambio in blocco con il differenziale: una svolta tecnica.', annunciAttivi: 2 },
];

const DECENNI = ['Tutti', '1950s', '1960s', '1970s', '1980s', '1990s'];

export default function ArchivioSchede() {
  const navRef = useRef<HTMLElement>(null);
  const [decennio, setDecennio] = useState('Tutti');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const nav = navRef.current;
    const logo = document.getElementById('logoImg') as HTMLImageElement | null;
    const LOGO_DARK = 'https://www.welead.it/rossomania/logo/logo_rw.png';
    const LOGO_LIGHT = 'https://www.welead.it/rossomania/logo/logo_rn.png';
    let lastY = 0;
    function onScroll() {
      const y = window.scrollY;
      const isMobile = window.matchMedia('(max-width:1080px)').matches;
      const solid = isMobile || y > 56;
      nav?.classList.toggle('solid', solid);
      if (logo) logo.src = solid ? LOGO_DARK : LOGO_LIGHT;
      if (y > lastY && y > 420) nav?.classList.add('hidden');
      else nav?.classList.remove('hidden');
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filtrati = useMemo(() => {
    return MODELLI.filter((m) => {
      const matchDecennio = decennio === 'Tutti' || m.decennio === decennio;
      const matchQuery = query.trim() === '' || m.nome.toLowerCase().includes(query.toLowerCase());
      return matchDecennio && matchQuery;
    });
  }, [decennio, query]);

  // Conteggio per decennio (per mostrare quanti modelli ci sono in ciascun filtro)
  const countByDecennio = useMemo(() => {
    const map: Record<string, number> = { Tutti: MODELLI.length };
    DECENNI.slice(1).forEach((d) => { map[d] = MODELLI.filter((m) => m.decennio === d).length; });
    return map;
  }, []);

  return (
    <>
      {/* ============ HEADER (identico alla homepage) ============ */}
      <nav id="nav" ref={navRef} className="nav">
        <div className="nav-inner">
          <a href="/" className="nav-logo">
            <img id="logoImg" src="https://www.welead.it/rossomania/logo/logo_rn.png" alt="Rosso Mania" />
          </a>
          <div className="nav-links">
            <a href="/catalogo">Vetture in vendita</a>
            <a href="/modelli" className="active">Schede ufficiali</a>
            <a href="/#ai">Valutazione AI</a>
            <a href="/#come-funziona">Come funziona</a>
            <a href="/magazine">Magazine</a>
          </div>
          <div className="nav-right">
            <div className="nav-lang"><a href="#">IT</a>/<a href="#">EN</a></div>
            <a href="#" className="nav-login">Accedi</a>
            <a href="#" className="nav-cta">Vendi la tua Ferrari</a>
          </div>
        </div>
      </nav>

      <main className="archivio">
        {/* ============ HERO ARCHIVIO ============ */}
        <header className="archivio-hero">
          <div className="archivio-hero-inner">
            <p className="eyebrow">Knowledge base Rosso Mania</p>
            <h1>Schede <em>ufficiali</em> dei modelli</h1>
            <p className="hero-sub">
              Storia, varianti, dati tecnici e guida all'acquisto per ogni Ferrari d'epoca.
              Ogni annuncio sulla piattaforma è collegato automaticamente alla scheda editoriale del suo modello.
            </p>
            <div className="hero-stats">
              <div><strong>{MODELLI.length}+</strong><span>schede pubblicate</span></div>
              <div><strong>1947–1996</strong><span>periodo coperto</span></div>
              <div><strong>IT / EN</strong><span>bilingue nativo</span></div>
            </div>
          </div>
        </header>

        {/* ============ FILTRI ============ */}
        <div className="archivio-filters">
          <div className="filters-inner">
            <div className="decade-tabs">
              {DECENNI.map((d) => (
                <button
                  key={d}
                  className={decennio === d ? 'active' : ''}
                  onClick={() => setDecennio(d)}
                >
                  {d}
                  <span className="tab-count">{countByDecennio[d] ?? 0}</span>
                </button>
              ))}
            </div>
            <div className="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              <input
                type="text"
                placeholder="Cerca un modello…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ============ GRIGLIA SCHEDE ============ */}
        <section className="archivio-grid-section">
          <div className="grid-result-count">
            {filtrati.length} {filtrati.length === 1 ? 'modello trovato' : 'modelli trovati'}
          </div>

          {filtrati.length > 0 ? (
            <div className="model-grid">
              {filtrati.map((m) => (
                <a key={m.slug} href={`/modello/${m.slug}`} className="model-card">
                  <div className="model-card-img">
                    <img src={m.img} alt={m.nome} loading="lazy" />
                    <span className="model-card-decade">{m.decennio}</span>
                  </div>
                  <div className="model-card-body">
                    <span className="model-card-years">{m.anniProduzione}</span>
                    <h3>{m.nome}</h3>
                    <p>{m.estratto}</p>
                    <div className="model-card-foot">
                      <span className="model-card-tag">{m.categoria} · {m.cilindrata}</span>
                      {m.annunciAttivi > 0 && (
                        <span className="model-card-count">{m.annunciAttivi} in vendita</span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Nessun modello trovato per "{query}".</p>
              <button onClick={() => { setQuery(''); setDecennio('Tutti'); }}>Azzera i filtri</button>
            </div>
          )}
        </section>

        {/* ============ CTA FINALE ============ */}
        <section className="archivio-cta">
          <div className="archivio-cta-inner">
            <h2>Non trovi il modello che cerchi?</h2>
            <p>L'archivio si arricchisce costantemente. Scrivici e aggiungeremo la scheda del modello che ti interessa.</p>
            <a href="#" className="btn-primary">Contattaci</a>
          </div>
        </section>
      </main>

      {/* ============ FOOTER (identico alla homepage) ============ */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="https://www.welead.it/rossomania/logo/logo_rw.png" alt="Rosso Mania" />
            <p>Il marketplace verticale dedicato alle Ferrari d'epoca. Da appassionati, per appassionati.</p>
            <div className="footer-social">
              <a href="#">𝕏</a><a href="#">in</a><a href="#">◎</a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Esplora</h5>
            <a href="/catalogo">Vetture in vendita</a>
            <a href="/modelli">Schede ufficiali</a>
            <a href="/#ai">Valutazione AI</a>
            <a href="/magazine">Magazine</a>
          </div>
          <div className="footer-col">
            <h5>Vendi</h5>
            <a href="#">Pubblica un annuncio</a>
            <a href="/#come-funziona">Come funziona</a>
            <a href="#">Registrati</a>
            <a href="#">Accedi</a>
          </div>
          <div className="footer-col">
            <h5>Rosso Mania</h5>
            <a href="#">Chi siamo</a>
            <a href="#">Contatti</a>
            <a href="#">Privacy policy</a>
            <a href="#">Termini di utilizzo</a>
            <a href="#" className="footer-highlight">Valuta la tua Ferrari</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Rosso Mania. Tutti i diritti riservati.</span>
          <div className="footer-lang"><a href="#">IT</a>/<a href="#">EN</a></div>
          <span>Realizzato da Welead srl</span>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Figtree:wght@400;500;600;700&display=swap');

        :root {
          --paper: #FAF8F4;
          --ink: #0C0E12;
          --red: #E11827;
          --line: rgba(12,14,18,0.10);
        }

        .archivio, .archivio * { box-sizing: border-box; }
        .archivio { background: var(--paper); color: var(--ink); font-family: 'Figtree', sans-serif; }
        .archivio h1, .archivio h2, .archivio h3 { font-family: 'Fraunces', serif; }

        /* ===== HERO ===== */
        .archivio-hero { background: var(--ink); color: #fff; padding: 168px 32px 64px; }
        .archivio-hero-inner { max-width: 1240px; margin: 0 auto; }
        .eyebrow { font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.65; margin: 0 0 14px; font-weight: 600; }
        .archivio-hero h1 { font-size: clamp(40px, 6vw, 68px); font-weight: 400; margin: 0 0 20px; line-height: 1.02; }
        .archivio-hero h1 em { font-style: italic; color: var(--red); }
        .hero-sub { max-width: 640px; font-size: 17px; line-height: 1.6; opacity: 0.85; margin: 0 0 40px; }
        .hero-stats { display: flex; gap: 48px; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 28px; }
        .hero-stats div { display: flex; flex-direction: column; gap: 6px; }
        .hero-stats strong { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 500; }
        .hero-stats span { font-size: 12.5px; opacity: 0.6; }

        /* ===== FILTERS ===== */
        .archivio-filters { background: var(--paper); border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 5; backdrop-filter: blur(6px); background: rgba(250,248,244,0.92); }
        .filters-inner { max-width: 1240px; margin: 0 auto; padding: 20px 32px; display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
        .decade-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
        .decade-tabs button { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 100px; font-size: 14px; font-weight: 600; color: rgba(12,14,18,0.6); border: 1px solid var(--line); transition: all .15s; }
        .decade-tabs button:hover { border-color: rgba(12,14,18,0.3); }
        .decade-tabs button.active { background: var(--ink); color: #fff; border-color: var(--ink); }
        .tab-count { font-size: 11px; opacity: 0.6; font-weight: 700; }
        .decade-tabs button.active .tab-count { opacity: 0.7; }

        .search-box { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--line); border-radius: 100px; padding: 10px 18px; min-width: 240px; color: rgba(12,14,18,0.4); }
        .search-box input { all: unset; flex: 1; font-size: 14px; color: var(--ink); }
        .search-box input::placeholder { color: rgba(12,14,18,0.4); }

        /* ===== GRID ===== */
        .archivio-grid-section { max-width: 1240px; margin: 0 auto; padding: 40px 32px 96px; }
        .grid-result-count { font-size: 13px; color: rgba(12,14,18,0.5); margin-bottom: 24px; }
        .model-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

        .model-card { display: block; text-decoration: none; color: inherit; background: #fff; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; transition: transform .2s, box-shadow .2s; }
        .model-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(12,14,18,0.10); }
        .model-card-img { position: relative; aspect-ratio: 16/10; overflow: hidden; }
        .model-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
        .model-card:hover .model-card-img img { transform: scale(1.05); }
        .model-card-decade { position: absolute; top: 12px; right: 12px; background: rgba(12,14,18,0.78); color: #fff; font-size: 11px; font-weight: 700; padding: 5px 11px; border-radius: 100px; backdrop-filter: blur(4px); }
        .model-card-body { padding: 20px 22px 22px; }
        .model-card-years { font-size: 12.5px; color: rgba(12,14,18,0.5); font-weight: 600; }
        .model-card h3 { font-size: 24px; font-weight: 500; margin: 4px 0 10px; }
        .model-card-body p { font-size: 14px; line-height: 1.55; color: rgba(12,14,18,0.75); margin: 0 0 18px; min-height: 44px; }
        .model-card-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 14px; gap: 10px; }
        .model-card-tag { font-size: 12px; color: rgba(12,14,18,0.55); }
        .model-card-count { font-size: 12px; font-weight: 700; color: var(--red); white-space: nowrap; }

        .empty-state { text-align: center; padding: 80px 20px; color: rgba(12,14,18,0.6); }
        .empty-state button { all: unset; cursor: pointer; margin-top: 14px; color: var(--red); font-weight: 600; font-size: 14px; text-decoration: underline; }

        /* ===== CTA ===== */
        .archivio-cta { background: #fff; border-top: 1px solid var(--line); padding: 80px 32px; }
        .archivio-cta-inner { max-width: 600px; margin: 0 auto; text-align: center; }
        .archivio-cta h2 { font-size: 30px; font-weight: 400; margin: 0 0 12px; }
        .archivio-cta p { font-size: 15px; color: rgba(12,14,18,0.7); margin: 0 0 28px; }
        .btn-primary { display: inline-block; background: var(--red); color: #fff; text-decoration: none; padding: 14px 30px; border-radius: 100px; font-size: 14px; font-weight: 700; transition: opacity .15s; }
        .btn-primary:hover { opacity: 0.88; }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 980px) {
          .archivio-hero { padding: 140px 20px 48px; }
          .hero-stats { gap: 28px; flex-wrap: wrap; }
          .filters-inner { padding: 16px 20px; flex-direction: column; align-items: stretch; }
          .search-box { min-width: 0; }
          .archivio-grid-section { padding: 32px 20px 64px; }
          .model-grid { grid-template-columns: 1fr; gap: 18px; }
        }
        @media (min-width: 981px) and (max-width: 1240px) {
          .model-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  );
}
