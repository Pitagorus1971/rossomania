'use client';

import { useEffect, useState } from 'react';

const CARS = [
  { id:1, name:'Testarossa', year:1989, km:'42.000', engine:'V12', price:145000, loc:'Modena, IT', tags:['In evidenza','Classiche'], img:'https://images.unsplash.com/photo-1696433919026-7da23fbf8707?auto=format&fit=crop&w=720&q=72', cert:'Ferrari Classiche', type:'dealer' },
  { id:2, name:'Dino 246 GT', year:1972, km:'68.500', engine:'V6', price:385000, loc:'Stuttgart, DE', tags:['In evidenza','Dealer'], img:'https://images.unsplash.com/photo-1658905097696-ec44846c3c3c?auto=format&fit=crop&w=720&q=72', cert:'ASI', type:'dealer' },
  { id:3, name:'365 GTB/4 Daytona', year:1971, km:'54.200', engine:'V12', price:720000, loc:'Londra, UK', tags:['ASI · FIVA'], img:'https://images.unsplash.com/photo-1752253509655-112f2abab03c?auto=format&fit=crop&w=720&q=72', cert:'FIVA', type:'privato' },
  { id:4, name:'F40', year:1990, km:'18.900', engine:'V8 Turbo', price:2400000, loc:'Zurigo, CH', tags:['Classiche'], img:'https://images.unsplash.com/photo-1690998199897-c32c0798a456?auto=format&fit=crop&w=720&q=72', cert:'Ferrari Classiche', type:'dealer' },
  { id:5, name:'308 GTS', year:1982, km:'89.000', engine:'V8', price:78000, loc:'Torino, IT', tags:['Dealer'], img:'https://images.unsplash.com/photo-1758620328615-2815f2689169?auto=format&fit=crop&w=720&q=72', cert:'', type:'dealer' },
  { id:6, name:'250 GT Lusso', year:1963, km:'61.000', engine:'V12', price:1850000, loc:'Maranello, IT', tags:['In evidenza'], img:'https://images.unsplash.com/photo-1716265816511-3693aeac2b60?auto=format&fit=crop&w=720&q=72', cert:'Ferrari Classiche', type:'privato' },
  { id:7, name:'512 TR', year:1992, km:'38.500', engine:'V12', price:198000, loc:'Bologna, IT', tags:['In evidenza'], img:'https://images.unsplash.com/photo-1658905097696-ec44846c3c3c?auto=format&fit=crop&w=720&q=72', cert:'ASI', type:'dealer' },
  { id:8, name:'512 BB', year:1979, km:'51.200', engine:'V12', price:320000, loc:'Ginevra, CH', tags:['ASI'], img:'https://images.unsplash.com/photo-1752253509655-112f2abab03c?auto=format&fit=crop&w=720&q=72', cert:'ASI', type:'privato' },
  { id:9, name:'Testarossa Monospecchio', year:1985, km:'29.800', engine:'V12', price:235000, loc:'Monaco, MC', tags:['In evidenza','Dealer'], img:'https://images.unsplash.com/photo-1696433919026-7da23fbf8707?auto=format&fit=crop&w=720&q=72', cert:'Storico', type:'dealer' },
];

const MODELS = ['Tutti i modelli','Testarossa','308 GTS','Dino 246 GT','365 GTB/4 Daytona','250 GT Lusso','F40','512 TR','512 BB'];
const CERTS = ['Tutte','Ferrari Classiche','ASI','FIVA','Storico'];
const TYPES = ['Tutti','dealer','privato'];
const SORT_OPTIONS = ['In evidenza','Prezzo ↑','Prezzo ↓','Più recenti'];

export default function Catalogo() {
  const [model, setModel] = useState('Tutti i modelli');
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [cert, setCert] = useState('Tutte');
  const [type, setType] = useState('Tutti');
  const [sort, setSort] = useState('In evidenza');
  const [saved, setSaved] = useState<number[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = CARS.filter(c => {
    if (model !== 'Tutti i modelli' && !c.name.includes(model)) return false;
    if (c.price > maxPrice) return false;
    if (cert !== 'Tutte' && c.cert !== cert) return false;
    if (type !== 'Tutti' && c.type !== type) return false;
    return true;
  }).sort((a,b) => {
    if (sort === 'Prezzo ↑') return a.price - b.price;
    if (sort === 'Prezzo ↓') return b.price - a.price;
    if (sort === 'Più recenti') return b.year - a.year;
    return 0;
  });

  const toggleSave = (id: number) => setSaved(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id]);

  useEffect(() => {
    const nav = document.getElementById('nav');
    let lastY = 0;
    function onScroll() {
      const y = window.scrollY;
      if (y > lastY && y > 120) nav?.classList.add('hidden');
      else nav?.classList.remove('hidden');
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    const btn = document.getElementById('navToggle');
    const mm = document.getElementById('mobileMenu');
    if (btn && mm) {
      btn.addEventListener('click', () => {
        const open = mm.classList.toggle('open');
        btn.classList.toggle('open', open);
        document.body.classList.toggle('lock', open);
      });
      mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        mm.classList.remove('open'); btn.classList.remove('open'); document.body.classList.remove('lock');
      }));
    }
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        :root{--rosso:#E11827;--ink:#0C0E12;--ink-2:#181B22;--paper:#FAF8F4;--slate:#5C6271;--mute:#979CA8;--line:#E5E1D8;--display:'Fraunces',serif;--body:'Figtree',sans-serif;--ease:cubic-bezier(.22,.75,.25,1);--ease-out:cubic-bezier(.16,1,.3,1);}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:var(--body);background:var(--paper);color:var(--ink);font-size:15.5px;line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
        a{color:inherit;text-decoration:none;}img{display:block;max-width:100%;}button{font-family:var(--body);cursor:pointer;}
        .wrap{max-width:1280px;margin:0 auto;padding:0 32px;}
        ::selection{background:var(--rosso);color:#fff;}

        /* NAV */
        header.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(250,248,244,.94);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 1px 0 var(--line);transition:transform .4s var(--ease);}
        header.nav.hidden{transform:translateY(-100%);}
        .nav-inner{display:flex;align-items:center;justify-content:space-between;height:80px;padding:0 40px;}
        .brand-logo{display:block;height:46px;width:auto;}
        .menu{display:flex;gap:2px;}
        .menu a{position:relative;padding:10px 16px;font-weight:500;font-size:14.5px;color:var(--ink);}
        .menu a::after{content:'';position:absolute;left:16px;right:16px;bottom:5px;height:1.5px;background:var(--rosso);transform:scaleX(0);transform-origin:right;transition:transform .35s var(--ease);}
        .menu a:hover::after,.menu a.active::after{transform:scaleX(1);transform-origin:left;}
        .nav-actions{display:flex;align-items:center;gap:18px;}
        .lang-switch{display:flex;align-items:center;gap:4px;font-size:13px;font-weight:600;color:var(--mute);}
        .lang-switch span{color:var(--line);}
        .lang-switch a{padding:2px 8px;border-radius:6px;}
        .lang-switch a.active{background:var(--rosso);color:#fff;}
        .nav-login{font-weight:500;font-size:14.5px;transition:color .2s;}
        .nav-login:hover{color:var(--rosso);}
        .btn{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:9px;font-weight:600;font-size:14.5px;border:none;border-radius:100px;padding:13px 26px;overflow:hidden;transition:color .3s var(--ease);isolation:isolate;}
        .btn::before{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;transform:translateY(101%);transition:transform .45s var(--ease-out);}
        .btn:hover::before{transform:translateY(0);}
        .btn-rosso{background:var(--rosso);color:#fff;}.btn-rosso::before{background:var(--ink);}
        .btn-outline{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--ink);}.btn-outline::before{background:var(--ink);}.btn-outline:hover{color:#fff;}
        .hamburger{display:none;align-items:center;justify-content:center;background:none;border:none;padding:8px;color:var(--ink);}
        .hamburger .ico-close{display:none;}
        .hamburger.open .ico-open{display:none;}
        .hamburger.open .ico-close{display:block;}
        .mobile-menu{display:none;}

        /* PAGE HEAD */
        .page-head{padding:108px 0 36px;border-bottom:1px solid var(--line);}
        .page-head h1{font-family:var(--display);font-size:clamp(32px,4.5vw,52px);font-weight:500;letter-spacing:-.02em;line-height:1.05;}
        .page-head h1 em{font-style:italic;color:var(--rosso);}
        .head-row{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;}
        .result-count{font-size:15px;color:var(--slate);font-weight:400;}
        .result-count b{color:var(--ink);font-weight:700;}

        /* SORT BAR */
        .sort-bar{display:flex;align-items:center;gap:10px;margin-top:22px;flex-wrap:wrap;}
        .sort-label{font-size:13px;font-weight:600;color:var(--mute);letter-spacing:.06em;text-transform:uppercase;}
        .sort-pill{padding:8px 18px;border-radius:100px;font-size:13px;font-weight:600;background:transparent;color:var(--slate);border:1px solid var(--line);transition:all .25s var(--ease);cursor:pointer;}
        .sort-pill:hover{border-color:var(--ink);color:var(--ink);}
        .sort-pill.active{background:var(--ink);border-color:var(--ink);color:#fff;}

        /* LAYOUT */
        .catalog-layout{display:grid;grid-template-columns:280px 1fr;gap:48px;padding:48px 0 96px;align-items:start;}

        /* SIDEBAR FILTERS */
        .filters{position:sticky;top:100px;background:#fff;border:1px solid var(--line);border-radius:20px;padding:28px;display:flex;flex-direction:column;gap:26px;}
        .filter-group{}
        .filter-label{display:block;font-size:11.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--ink);margin-bottom:12px;}
        .filter-select{width:100%;border:1.5px solid var(--line);border-radius:12px;padding:11px 14px;font-family:var(--body);font-size:15px;color:var(--ink);background:#fff;outline:none;cursor:pointer;transition:border-color .2s;}
        .filter-select:focus{border-color:var(--ink);}
        .filter-divider{height:1px;background:var(--line);}
        .price-display{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
        .price-display span{font-size:13px;color:var(--mute);}
        .price-display b{font-family:var(--display);font-size:18px;font-weight:600;}
        input[type=range]{width:100%;accent-color:var(--rosso);height:4px;}
        .type-pills{display:flex;gap:8px;}
        .type-pill{flex:1;padding:9px;border-radius:10px;font-size:13px;font-weight:600;background:transparent;color:var(--slate);border:1px solid var(--line);transition:all .25s;text-align:center;}
        .type-pill.active{background:var(--ink);border-color:var(--ink);color:#fff;}
        .reset-btn{width:100%;padding:11px;border-radius:12px;font-size:13.5px;font-weight:600;background:transparent;color:var(--mute);border:1px solid var(--line);transition:all .25s;}
        .reset-btn:hover{color:var(--rosso);border-color:var(--rosso);}

        /* GRID */
        .car-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
        .car{position:relative;background:#fff;border-radius:18px;overflow:hidden;border:1px solid var(--line);transition:transform .45s var(--ease),box-shadow .45s var(--ease),border-color .3s;}
        .car:hover{transform:translateY(-6px);box-shadow:0 24px 50px -22px rgba(12,14,18,.2);border-color:transparent;}
        .car-img{position:relative;height:210px;overflow:hidden;background:var(--ink);}
        .car-img img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease);}
        .car:hover .car-img img{transform:scale(1.06);}
        .car-img::after{content:'';position:absolute;top:0;bottom:0;left:-80%;width:50%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.2),transparent);transform:skewX(-18deg);transition:left .7s var(--ease);}
        .car:hover .car-img::after{left:130%;}
        .car-tags{position:absolute;top:12px;left:12px;display:flex;gap:6px;z-index:2;flex-wrap:wrap;}
        .tag{font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;padding:5px 10px;border-radius:100px;color:#fff;backdrop-filter:blur(6px);}
        .tag-r{background:rgba(225,24,39,.92);}
        .tag-g{background:rgba(31,164,99,.88);}
        .tag-k{background:rgba(12,14,18,.65);border:1px solid rgba(255,255,255,.25);}
        .car-save{position:absolute;top:10px;right:10px;z-index:2;width:36px;height:36px;border-radius:50%;background:rgba(250,248,244,.9);backdrop-filter:blur(6px);border:1px solid rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center;color:var(--ink);transition:all .25s;}
        .car-save:hover{transform:scale(1.1);}
        .car-save.on{background:var(--rosso);border-color:var(--rosso);color:#fff;}
        .car-save.on svg{fill:#fff;}
        .car-body{padding:20px 20px 22px;}
        .car-meta{display:flex;align-items:center;gap:7px;font-size:11.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--rosso);margin-bottom:7px;}
        .car-meta i{font-style:normal;color:var(--line);}
        .car-name{font-family:var(--display);font-size:23px;font-weight:500;letter-spacing:-.01em;color:var(--ink);line-height:1.1;margin-bottom:4px;}
        .car-loc{font-size:13px;color:var(--mute);font-weight:400;margin-bottom:16px;}
        .car-divider{height:1px;background:var(--line);margin-bottom:16px;}
        .car-foot{display:flex;align-items:flex-end;justify-content:space-between;}
        .car-price small{display:block;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);font-weight:600;margin-bottom:2px;}
        .car-price b{font-family:var(--display);font-size:24px;font-weight:600;letter-spacing:-.01em;color:var(--ink);}
        .car-go{width:44px;height:44px;border-radius:50%;border:1.5px solid var(--line);display:flex;align-items:center;justify-content:center;color:var(--ink);transition:all .35s var(--ease);}
        .car:hover .car-go{background:var(--rosso);border-color:var(--rosso);color:#fff;transform:rotate(-38deg);}

        /* CERT BADGE */
        .cert-badge{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:#168752;background:#EAF7F0;border:1px solid #BFE6D2;border-radius:100px;padding:4px 10px;margin-bottom:12px;}

        /* EMPTY */
        .empty{grid-column:1/-1;text-align:center;padding:80px 20px;}
        .empty h3{font-family:var(--display);font-size:28px;font-weight:500;margin-bottom:12px;}
        .empty p{color:var(--slate);font-size:16px;}

        /* MOBILE FILTERS TOGGLE */
        .mobile-filter-btn{display:none;}

        /* FOOTER */
        footer.site{background:var(--ink);color:rgba(250,248,244,.7);padding:70px 0 0;}
        .foot-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:48px;padding-bottom:50px;border-bottom:1px solid rgba(255,255,255,.09);}
        .foot-brand img{height:42px;width:auto;margin-bottom:18px;}
        .foot-brand p{font-size:14px;font-weight:300;color:rgba(250,248,244,.5);max-width:280px;}
        .foot-col h5{font-family:var(--display);font-style:italic;font-size:16px;font-weight:500;color:rgba(250,248,244,.9);margin-bottom:16px;}
        .foot-col a{display:block;font-size:13.5px;padding:5px 0;color:rgba(250,248,244,.5);transition:color .2s,padding-left .2s;}
        .foot-col a:hover{color:#fff;padding-left:5px;}
        .foot-bottom{display:flex;justify-content:space-between;align-items:center;padding:22px 0;font-size:13px;color:rgba(250,248,244,.35);flex-wrap:wrap;gap:12px;}

        @media(max-width:1080px){
          .menu,.nav-actions{display:none;}
          .hamburger{display:flex;}
          .nav-inner{height:72px;padding:0 22px;}
          .brand-logo{height:42px;}
          .mobile-menu{display:flex;flex-direction:column;position:fixed;top:72px;left:0;right:0;height:calc(100dvh - 72px);background:var(--paper);z-index:95;padding:10px 0 30px;overflow-y:auto;opacity:0;transform:translateY(-10px);pointer-events:none;transition:opacity .25s,transform .25s;}
          .mobile-menu.open{opacity:1;transform:none;pointer-events:auto;}
          .mobile-menu > a{font-family:var(--display);font-size:26px;font-weight:500;padding:19px 26px;border-bottom:1px solid var(--line);color:var(--ink);display:flex;justify-content:space-between;align-items:center;}
          .mobile-menu > a::after{content:'→';font-size:18px;color:var(--rosso);}
          .mobile-foot{padding:24px 26px 0;display:flex;flex-direction:column;gap:16px;}
          body.lock{overflow:hidden;}
          .catalog-layout{grid-template-columns:1fr;gap:28px;}
          .filters{position:static;display:none;}
          .filters.open{display:flex;}
          .mobile-filter-btn{display:flex;align-items:center;gap:8px;padding:11px 20px;border-radius:12px;font-size:14px;font-weight:600;background:#fff;border:1.5px solid var(--line);color:var(--ink);margin-bottom:4px;}
          .car-grid{grid-template-columns:1fr 1fr;}
          .foot-grid{grid-template-columns:1fr 1fr;}
          .page-head{padding-top:94px;}
        }
        @media(max-width:640px){
          .wrap{padding:0 18px;}
          .car-grid{grid-template-columns:1fr;gap:12px;}
          .car-img{height:170px;}
          .car-body{padding:12px 14px 14px;}
          .car-meta{font-size:10.5px;margin-bottom:4px;}
          .car-name{font-size:18px;margin-bottom:2px;}
          .car-loc{font-size:12px;margin-bottom:10px;}
          .cert-badge{font-size:10.5px;padding:3px 9px;margin-bottom:9px;}
          .car-divider{margin-bottom:10px;}
          .car-price small{font-size:9.5px;margin-bottom:1px;}
          .car-price b{font-size:20px;}
          .car-go{width:38px;height:38px;}
          .car-save{width:32px;height:32px;}
          .foot-grid{grid-template-columns:1fr;}
          .sort-bar{gap:7px;overflow-x:auto;padding-bottom:4px;flex-wrap:nowrap;-webkit-overflow-scrolling:touch;}
          .sort-pill{padding:8px 16px;font-size:13px;flex-shrink:0;}
          .page-head{padding:90px 0 24px;}
          .page-head h1{font-size:clamp(28px,8vw,38px);}
          .result-count{font-size:14px;}
          .sort-label{display:none;}
          .mobile-filter-btn{width:100%;}
        }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Figtree:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <header className="nav" id="nav">
        <div className="nav-inner">
          <a href="/" aria-label="Rosso Mania"><img className="brand-logo" alt="Rosso Mania" src="https://www.welead.it/rossomania/logo/logo_rn.png" /></a>
          <nav className="menu">
            <a href="/" className="active">Vetture in vendita</a>
            <a href="#">Schede ufficiali</a>
            <a href="#">Valutazione AI</a>
            <a href="#">Come funziona</a>
            <a href="#">Magazine</a>
          </nav>
          <div className="nav-actions">
            <div className="lang-switch"><a href="#" className="active">IT</a><span>/</span><a href="#">EN</a></div>
            <a href="#" className="nav-login">Accedi</a>
            <button className="btn btn-rosso">Vendi</button>
          </div>
          <button className="hamburger" id="navToggle" aria-label="Menu" aria-expanded="false">
            <svg className="ico-open" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
            <svg className="ico-close" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
          </button>
        </div>
      </header>

      <div className="mobile-menu" id="mobileMenu">
        <a href="/">Home</a>
        <a href="/catalogo">Vetture in vendita</a>
        <a href="#">Schede ufficiali</a>
        <a href="#">Valutazione AI</a>
        <a href="#">Come funziona</a>
        <div className="mobile-foot">
          <div className="lang-switch"><a href="#" className="active">IT</a><span>/</span><a href="#">EN</a></div>
          <a href="#" className="nav-login">Accedi</a>
          <button className="btn btn-rosso" style={{justifyContent:'center',padding:'15px'}}>Vendi la tua Ferrari</button>
        </div>
      </div>

      {/* PAGE HEAD */}
      <div className="page-head">
        <div className="wrap">
          <div className="head-row">
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}><span style={{width:'32px',height:'1.5px',background:'var(--rosso)',display:'block'}}></span><span style={{fontSize:'11.5px',fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--rosso)'}}>Marketplace Ferrari d&apos;epoca</span></div>
              <h1>Vetture <em>in vendita</em></h1>
              <p className="result-count" style={{marginTop:'10px'}}>
                <b>{filtered.length}</b> {filtered.length === 1 ? 'vettura trovata' : 'vetture trovate'}
              </p>
            </div>
          </div>
          <div className="sort-bar">
            <span className="sort-label">Ordina</span>
            {SORT_OPTIONS.map(o => (
              <button key={o} className={`sort-pill${sort===o?' active':''}`} onClick={()=>setSort(o)}>{o}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="catalog-layout">

          {/* SIDEBAR */}
          <div>
            <button className="mobile-filter-btn" onClick={()=>setFiltersOpen(f=>!f)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
              {filtersOpen ? 'Chiudi filtri' : 'Filtra vetture'}
            </button>

            <div className={`filters${filtersOpen?' open':''}`}>
              <div className="filter-group">
                <label className="filter-label">Modello</label>
                <select className="filter-select" value={model} onChange={e=>setModel(e.target.value)}>
                  {MODELS.map(m=><option key={m}>{m}</option>)}
                </select>
              </div>

              <div className="filter-divider"/>

              <div className="filter-group">
                <label className="filter-label">Prezzo massimo</label>
                <div className="price-display">
                  <span>fino a</span>
                  <b>€ {maxPrice.toLocaleString('it-IT')}</b>
                </div>
                <input type="range" min={50000} max={3000000} step={50000} value={maxPrice} onChange={e=>setMaxPrice(+e.target.value)} />
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:'var(--mute)',marginTop:'6px'}}>
                  <span>€ 50.000</span><span>€ 3.000.000+</span>
                </div>
              </div>

              <div className="filter-divider"/>

              <div className="filter-group">
                <label className="filter-label">Certificazione</label>
                <select className="filter-select" value={cert} onChange={e=>setCert(e.target.value)}>
                  {CERTS.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="filter-divider"/>

              <div className="filter-group">
                <label className="filter-label">Tipo venditore</label>
                <div className="type-pills">
                  {TYPES.map(t=>(
                    <button key={t} className={`type-pill${type===t?' active':''}`} onClick={()=>setType(t)}>
                      {t === 'Tutti' ? 'Tutti' : t === 'dealer' ? 'Dealer' : 'Privato'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-divider"/>

              <button className="reset-btn" onClick={()=>{setModel('Tutti i modelli');setMaxPrice(3000000);setCert('Tutte');setType('Tutti');}}>
                Reimposta filtri
              </button>
            </div>
          </div>

          {/* GRID */}
          <div>
            <div className="car-grid">
              {filtered.length === 0 ? (
                <div className="empty">
                  <h3>Nessuna vettura trovata</h3>
                  <p>Prova a modificare i filtri per vedere più risultati.</p>
                </div>
              ) : filtered.map(car => (
                <article className="car" key={car.id}>
                  <div className="car-img">
                    <img src={car.img} alt={car.name} />
                    <div className="car-tags">
                      {car.tags.slice(0,2).map((t,i) => (
                        <span key={i} className={`tag ${t==='In evidenza'?'tag-r':t==='Dealer'||t==='Classiche'?'tag-g':'tag-k'}`}>{t}</span>
                      ))}
                    </div>
                    <button className={`car-save${saved.includes(car.id)?' on':''}`} onClick={()=>toggleSave(car.id)} aria-label="Salva">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>
                    </button>
                  </div>
                  <div className="car-body">
                    <div className="car-meta">{car.year} <i>·</i> {car.km} km <i>·</i> {car.engine}</div>
                    <h3 className="car-name">{car.name}</h3>
                    <p className="car-loc">{car.loc}</p>
                    {car.cert && (
                      <div className="cert-badge">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><polyline points="20 6 9 17 4 12"/></svg>
                        {car.cert}
                      </div>
                    )}
                    <div className="car-divider"/>
                    <div className="car-foot">
                      <div className="car-price">
                        <small>Prezzo</small>
                        <b>€ {car.price.toLocaleString('it-IT')}</b>
                      </div>
                      <a href="/annuncio" className="car-go" aria-label="Dettagli">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

        </div>
      </div>

      <footer className="site">
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <img src="https://www.welead.it/rossomania/logo/logo_rw.png" alt="Rosso Mania" />
              <p>Il marketplace verticale dedicato alle Ferrari d&apos;epoca. Da appassionati, per appassionati.</p>
            </div>
            <div className="foot-col"><h5>Esplora</h5><a href="/catalogo">Vetture in vendita</a><a href="#">Schede ufficiali</a><a href="#">Valutazione AI</a><a href="#">Magazine</a></div>
            <div className="foot-col"><h5>Vendi</h5><a href="#">Pubblica annuncio</a><a href="#">Come funziona</a><a href="#">Registrati</a><a href="#">Accedi</a></div>
            <div className="foot-col"><h5>Rosso Mania</h5><a href="#">Chi siamo</a><a href="#">Contatti</a><a href="#">Privacy policy</a><a href="#">Termini</a></div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 Rosso Mania. Tutti i diritti riservati.</span>
            <div className="lang-switch" style={{color:'rgba(250,248,244,.5)'}}><a href="#" className="active" style={{background:'var(--rosso)',color:'#fff',padding:'2px 8px',borderRadius:'6px'}}>IT</a><span style={{color:'rgba(255,255,255,.15)'}}>/</span><a href="#" style={{padding:'2px 8px'}}>EN</a></div>
            <span>Realizzato da Welead srl</span>
          </div>
        </div>
      </footer>
    </>
  );
}
