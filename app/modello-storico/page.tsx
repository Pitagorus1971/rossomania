'use client';

import { useEffect, useRef } from 'react';

export default function SchedaTestarossa() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Header: trasparente su hero scuro, diventa solida dopo lo scroll (stesso pattern di page.tsx / home)
    const nav = navRef.current;
    const logo = document.getElementById('logoImg') as HTMLImageElement | null;
    const LOGO_DARK = 'https://www.welead.it/rossomania/logo/logo_rw.png'; // logo bianco, per sfondo scuro/trasparente
    const LOGO_LIGHT = 'https://www.welead.it/rossomania/logo/logo_rn.png'; // logo scuro, per sfondo chiaro/solido
    let lastY = 0;
    function onScroll() {
      const y = window.scrollY;
      const isMobile = window.matchMedia('(max-width:1080px)').matches;
      const solid = isMobile || y > 56;
      nav?.classList.toggle('solid', solid);
      if (logo) logo.src = solid ? LOGO_LIGHT : LOGO_DARK;
      if (y > lastY && y > 420 && !document.body.classList.contains('lock')) nav?.classList.add('hidden');
      else nav?.classList.remove('hidden');
      lastY = y;
      const h = document.documentElement;
      const prog = document.getElementById('progress');
      if (prog) prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile menu
    const btn = document.getElementById('navToggle');
    const mm = document.getElementById('mobileMenu');
    if (btn && mm) {
      btn.addEventListener('click', () => {
        const open = mm.classList.toggle('open');
        btn.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('lock', open);
      });
      mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        mm.classList.remove('open'); btn.classList.remove('open'); document.body.classList.remove('lock');
      }));
    }

    // Timeline / evoluzione accordion (stesso pattern .spec-head di annuncio)
    document.querySelectorAll('.spec-head').forEach(h => {
      h.addEventListener('click', () => (h as HTMLElement).parentElement?.classList.toggle('open'));
    });

    // Reveals
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.rv').forEach(el => io.observe(el));
    document.querySelectorAll('.car-grid .car').forEach((c, i) => (c as HTMLElement).style.transitionDelay = (i % 3) * 110 + 'ms');

    // Subnav scroll-spy
    const sections = ['storia', 'tecnica', 'evoluzione', 'mercato', 'annunci'];
    const subnavLinks = Array.from(document.querySelectorAll('.subnav a'));
    function spy() {
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 140 && r.bottom > 140) {
            subnavLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
          }
        }
      }
    }
    window.addEventListener('scroll', spy, { passive: true });
    spy();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', spy);
    };
  }, []);

  const specGroups = [
    { title: 'Motore', open: true, rows: [['Tipo', '12 cilindri boxer (180°), aspirato'], ['Posizione', 'Centrale longitudinale posteriore'], ['Cilindrata', '4.943 cc'], ['Alesaggio x corsa', '82 mm x 78 mm'], ['Alimentazione', 'Iniezione meccanica Bosch KE-Jetronic'], ['Distribuzione', 'DOHC, 4 valvole/cilindro (48 totali)'], ['Raffreddamento', 'Doppio radiatore laterale'], ['Lubrificazione', 'Carter secco']] },
    { title: 'Prestazioni', open: true, rows: [['Potenza massima', '390 CV a 6.300 giri/min'], ['Coppia massima', '490 Nm a 4.500 giri/min'], ['Velocità massima', '~290 km/h'], ['0–100 km/h', '~5,3 secondi']] },
    { title: 'Trasmissione e telaio', open: false, rows: [['Trasmissione', 'Manuale a 5 marce'], ['Trazione', 'Posteriore'], ['Frizione', 'Monodisco a secco'], ['Telaio', 'Tubolare in acciaio'], ['Carrozzeria', 'Pannelli in alluminio e acciaio'], ['Sospensioni ant.', 'Doppi triangoli indipendenti'], ['Sospensioni post.', 'Doppi triangoli indipendenti'], ['Freni', 'Dischi ventilati sulle 4 ruote'], ['Sterzo', 'Cremagliera senza servo (prime versioni)']] },
    { title: 'Dimensioni e peso', open: false, rows: [['Lunghezza', '4.485 mm'], ['Larghezza', '1.976 mm'], ['Altezza', '1.130 mm'], ['Passo', '2.550 mm'], ['Peso a secco', '~1.500 kg'], ['Produzione totale', '~7.177 esemplari']] },
  ];

  return (
    <>
      <style>{`
        :root{--rosso:#E11827;--rosso-deep:#A30D1A;--ink:#0C0E12;--ink-2:#181B22;--paper:#FAF8F4;--paper-2:#F2EFE8;--slate:#5C6271;--mute:#979CA8;--line:#E5E1D8;--display:'Fraunces',serif;--body:'Figtree',sans-serif;--ease:cubic-bezier(.22,.75,.25,1);--ease-out:cubic-bezier(.16,1,.3,1);}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:var(--body);background:var(--paper);color:var(--ink);font-size:16px;line-height:1.7;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
        a{color:inherit;text-decoration:none;}img{display:block;max-width:100%;}button{font-family:var(--body);cursor:pointer;}
        .wrap{max-width:1280px;margin:0 auto;padding:0 32px;}
        ::selection{background:var(--rosso);color:#fff;}
        .progress{position:fixed;top:0;left:0;height:2.5px;width:0;background:var(--rosso);z-index:300;}

        /* NAV — trasparente su hero scuro, solida dopo lo scroll (identico a page.tsx / home) */
        header.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(250,248,244,0);transition:background .35s var(--ease),box-shadow .35s var(--ease),transform .4s var(--ease);}
        header.nav.solid{background:rgba(250,248,244,.94);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 1px 0 var(--line);}
        header.nav.hidden{transform:translateY(-100%);}
        .nav-inner{display:flex;align-items:center;justify-content:space-between;height:80px;padding:0 40px;}
        .brand-logo{display:block;height:46px;width:auto;}
        .menu{display:flex;gap:2px;}
        .menu a{position:relative;padding:10px 16px;font-weight:500;font-size:14.5px;color:var(--ink);}
        .menu a::after{content:'';position:absolute;left:16px;right:16px;bottom:5px;height:1.5px;background:var(--rosso);transform:scaleX(0);transform-origin:right;transition:transform .35s var(--ease);}
        .menu a:hover::after,.menu a.active::after{transform:scaleX(1);transform-origin:left;}
        header.nav:not(.solid) .menu a{color:#fff;}
        header.nav:not(.solid) .lang-switch{color:rgba(255,255,255,.75);}
        header.nav:not(.solid) .lang-switch span{color:rgba(255,255,255,.3);}
        header.nav:not(.solid) .nav-login{color:#fff;}
        header.nav:not(.solid) .hamburger{color:#fff;}
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
        .btn-ink{background:var(--ink);color:#fff;}.btn-ink::before{background:var(--rosso);}
        .btn-outline{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--ink);}.btn-outline::before{background:var(--ink);}.btn-outline:hover{color:#fff;}
        .btn-light{background:#fff;color:var(--ink);}.btn-light::before{background:var(--rosso);}.btn-light:hover{color:#fff;}
        .hamburger{display:none;align-items:center;justify-content:center;background:none;border:none;padding:8px;color:var(--ink);}
        .hamburger .ico-close{display:none;}
        .hamburger.open .ico-open{display:none;}
        .hamburger.open .ico-close{display:block;}
        .mobile-menu{display:none;}

        /* SUBNAV — identico a annuncio/page.tsx */
        .subnav{background:var(--ink);color:rgba(250,248,244,.7);overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
        .subnav::-webkit-scrollbar{display:none;}
        .subnav-inner{display:flex;gap:4px;padding:0 32px;max-width:1280px;margin:0 auto;}
        .subnav a{flex-shrink:0;padding:15px 17px;font-size:14px;font-weight:600;letter-spacing:.04em;border-bottom:2px solid transparent;transition:color .2s,border-color .2s;}
        .subnav a:hover,.subnav a.active{color:#fff;border-bottom-color:var(--rosso);}

        /* PAGE HEAD — variante hero scura, come testata di scheda editoriale */
        .scheda-hero{position:relative;min-height:64vh;display:flex;align-items:flex-end;color:#fff;overflow:hidden;background:var(--ink);}
        .scheda-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
        .scheda-veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,14,18,.35) 0%,rgba(12,14,18,.55) 55%,rgba(12,14,18,.95) 100%);}
        .scheda-hero-content{position:relative;z-index:2;padding:140px 0 52px;width:100%;}
        .crumbs{display:flex;align-items:center;gap:8px;font-size:13.5px;color:rgba(250,248,244,.7);margin-bottom:20px;flex-wrap:wrap;}
        .crumbs a:hover{color:var(--rosso);}
        .crumbs svg{opacity:.5;}
        .scheda-kicker{display:flex;align-items:center;gap:14px;margin-bottom:18px;font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#fff;}
        .scheda-kicker::before{content:'';width:38px;height:1.5px;background:var(--rosso);}
        h1.scheda-title{font-family:var(--display);font-size:clamp(46px,7vw,92px);font-weight:500;letter-spacing:-.02em;line-height:.98;margin-bottom:18px;}
        h1.scheda-title em{font-style:italic;color:var(--rosso);}
        .scheda-sub{max-width:600px;font-size:17px;color:rgba(250,248,244,.85);font-weight:300;line-height:1.6;margin-bottom:34px;}
        .hero-meta{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;border-top:1px solid rgba(255,255,255,.18);padding-top:24px;max-width:880px;}
        .hero-meta div{display:flex;flex-direction:column;gap:6px;}
        .hero-meta small{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(250,248,244,.5);}
        .hero-meta b{font-family:var(--display);font-size:16.5px;font-weight:600;}

        /* BODY LAYOUT */
        .listing-body{padding:54px 0 30px;}
        .cols{display:grid;grid-template-columns:1fr 280px;gap:56px;align-items:start;}

        /* TOC sidebar (sticky, leggera — coerente con .sidebar di annuncio ma più semplice) */
        .toc-card{position:sticky;top:104px;background:#fff;border:1px solid var(--line);border-radius:20px;padding:26px;display:flex;flex-direction:column;gap:14px;}
        .toc-label{font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);}
        .toc-card nav{display:flex;flex-direction:column;border-left:2px solid var(--line);}
        .toc-card nav a{padding:9px 0 9px 16px;font-size:14px;color:var(--slate);border-left:2px solid transparent;margin-left:-2px;transition:all .15s;}
        .toc-card nav a:hover{color:var(--ink);}
        .toc-card nav a.active{color:var(--ink);font-weight:600;border-left-color:var(--rosso);}
        .toc-divider{height:1px;background:var(--line);}
        .toc-cta{font-size:13.5px;font-weight:600;color:var(--rosso);}
        .toc-cta:hover{text-decoration:underline;}

        /* SECTION — identico pattern .sec/.sec-h di annuncio */
        .sec{margin-bottom:56px;scroll-margin-top:104px;}
        .sec-h{display:flex;align-items:baseline;gap:14px;margin-bottom:28px;}
        .sec-h .idx{font-family:var(--display);font-style:italic;font-size:14px;color:var(--rosso);}
        .sec-h h2{font-family:var(--display);font-size:clamp(26px,3vw,34px);font-weight:500;letter-spacing:-.015em;}
        .sec-h h2 em{font-style:italic;color:var(--rosso);}

        .desc p{color:#474D59;font-weight:400;font-size:17px;line-height:1.8;margin-bottom:18px;max-width:700px;}
        .desc p strong{color:var(--ink);font-weight:600;}

        /* COLLAGE — riusa esattamente il pattern di annuncio/page.tsx, con varianti per 1/2/3/4 foto */
        .collage{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:172px;gap:12px;margin-top:28px;}
        .cl{position:relative;border-radius:16px;overflow:hidden;background:var(--ink);}
        .cl img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease);}
        .cl:hover img{transform:scale(1.06);}
        .cl.b{grid-column:span 2;grid-row:span 2;}
        .cl.t{grid-row:span 2;}
        .cl.w{grid-column:span 2;}
        /* Variante singola foto — una scheda con un solo scatto disponibile */
        .collage-1{grid-template-columns:1fr;grid-auto-rows:380px;}
        .collage-1 .cl{grid-column:span 1;grid-row:span 1;}
        /* Variante due foto, affiancate */
        .collage-2{grid-template-columns:1fr 1fr;grid-auto-rows:300px;}
        .collage-2 .cl{grid-column:span 1;grid-row:span 1;}
        /* Variante tre foto */
        .collage-3{grid-template-columns:2fr 1fr;grid-auto-rows:172px;}
        .collage-3 .cl.b{grid-row:span 2;}

        /* SPEC GROUPS — riusa esattamente .spec-group di annuncio */
        .spec-group{background:#fff;border:1px solid var(--line);border-radius:18px;overflow:hidden;margin-bottom:16px;}
        .spec-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:20px 28px;cursor:pointer;user-select:none;background:var(--ink);color:var(--paper);}
        .spec-head h3{font-family:var(--display);font-size:19px;font-weight:500;letter-spacing:-.01em;color:var(--paper);}
        .spec-head svg{transition:transform .35s var(--ease);color:rgba(250,248,244,.5);flex-shrink:0;}
        .spec-group.open .spec-head svg{transform:rotate(180deg);}
        .spec-rows{display:none;}
        .spec-group.open .spec-rows{display:block;}
        .spec-row{display:grid;grid-template-columns:220px 1fr;gap:24px;padding:18px 28px;font-size:16px;border-bottom:1px solid var(--line);align-items:center;}
        .spec-row:last-child{border-bottom:none;}
        .spec-row:nth-child(even){background:var(--paper);}
        .spec-row dt{color:#565C68;font-weight:400;font-size:14.5px;letter-spacing:.01em;}
        .spec-row dd{font-weight:700;font-size:16px;color:var(--ink);}

        /* TIMELINE evoluzione */
        .timeline{display:flex;flex-direction:column;}
        .timeline-item{display:grid;grid-template-columns:130px 1fr;gap:32px;padding:28px 0;border-top:1px solid var(--line);}
        .timeline-item:first-child{border-top:none;}
        .timeline-year{font-family:var(--display);font-size:17px;font-weight:600;color:var(--rosso);padding-top:2px;}
        .timeline-item h3{font-family:var(--display);font-size:21px;font-weight:600;margin-bottom:8px;letter-spacing:-.01em;}
        .timeline-item p{font-size:15.5px;line-height:1.7;color:#474D59;margin-bottom:10px;max-width:620px;}
        .timeline-tag{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;letter-spacing:.04em;padding:6px 13px;border-radius:100px;background:rgba(225,24,39,.08);color:var(--rosso-deep);}

        .callout{margin-top:8px;padding:26px 30px;background:var(--ink);color:var(--paper);border-radius:18px;font-size:15px;line-height:1.7;max-width:760px;}
        .callout strong{color:#fff;}

        /* MERCATO / AI widget — riusa esattamente .model-widget di annuncio */
        .model-widget{position:relative;background:var(--ink);color:var(--paper);border-radius:20px;padding:36px;display:flex;align-items:center;justify-content:space-between;gap:24px;overflow:hidden;transition:transform .4s var(--ease);}
        .model-widget:hover{transform:translateY(-3px);}
        .model-widget::before{content:'';position:absolute;inset:0;background:radial-gradient(420px 200px at 90% 0%,rgba(225,24,39,.4),transparent 70%);}
        .model-widget > *{position:relative;}
        .mw-kicker{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(250,248,244,.55);margin-bottom:8px;}
        .mw-title{font-family:var(--display);font-size:26px;font-weight:500;}
        .mw-title em{font-style:italic;color:var(--rosso);}
        .mw-sub{font-size:15px;color:rgba(250,248,244,.6);font-weight:300;margin-top:8px;max-width:440px;}
        .mw-arrow{flex-shrink:0;width:58px;height:58px;border-radius:50%;border:1.5px solid rgba(250,248,244,.3);display:flex;align-items:center;justify-content:center;transition:all .35s var(--ease);}
        .model-widget:hover .mw-arrow{background:var(--rosso);border-color:var(--rosso);transform:rotate(-38deg);}

        /* ANNUNCI — riusa esattamente .car-grid/.car/.tag di catalogo */
        .sec-head-row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:28px;gap:14px;flex-wrap:wrap;}
        .link-arrow{font-size:14px;font-weight:600;color:var(--rosso);white-space:nowrap;}
        .link-arrow:hover{text-decoration:underline;}
        .car-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
        .car{position:relative;background:#fff;border-radius:18px;overflow:hidden;border:1px solid var(--line);transition:transform .45s var(--ease),box-shadow .45s var(--ease),border-color .3s;}
        .car:hover{transform:translateY(-6px);box-shadow:0 24px 50px -22px rgba(12,14,18,.2);border-color:transparent;}
        .car-img{position:relative;height:200px;overflow:hidden;background:var(--ink);}
        .car-img img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease);}
        .car:hover .car-img img{transform:scale(1.06);}
        .car-tags{position:absolute;top:12px;left:12px;display:flex;gap:6px;z-index:2;flex-wrap:wrap;}
        .tag{font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;padding:5px 10px;border-radius:100px;color:#fff;backdrop-filter:blur(6px);}
        .tag-r{background:rgba(225,24,39,.92);}
        .tag-g{background:rgba(31,164,99,.88);}
        .tag-k{background:rgba(12,14,18,.65);border:1px solid rgba(255,255,255,.25);}
        .car-body{padding:18px 18px 20px;}
        .car-meta{display:flex;align-items:center;gap:7px;font-size:11.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--rosso);margin-bottom:7px;}
        .car-meta i{font-style:normal;color:var(--line);}
        .car-name{font-family:var(--display);font-size:22px;font-weight:500;letter-spacing:-.01em;color:var(--ink);line-height:1.1;margin-bottom:4px;}
        .car-loc{font-size:13px;color:var(--mute);font-weight:400;margin-bottom:16px;}
        .car-divider{height:1px;background:var(--line);margin-bottom:16px;}
        .car-foot{display:flex;align-items:flex-end;justify-content:space-between;}
        .car-price small{display:block;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);font-weight:600;margin-bottom:2px;}
        .car-price b{font-family:var(--display);font-size:23px;font-weight:600;letter-spacing:-.01em;color:var(--ink);}
        .car-go{width:42px;height:42px;border-radius:50%;border:1.5px solid var(--line);display:flex;align-items:center;justify-content:center;color:var(--ink);transition:all .35s var(--ease);}
        .car:hover .car-go{background:var(--rosso);border-color:var(--rosso);color:#fff;transform:rotate(-38deg);}

        .back-link{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:var(--slate);}
        .back-link:hover{color:var(--rosso);}

        /* REVEAL */
        .rv{opacity:0;transform:translateY(30px);filter:blur(5px);transition:opacity .85s var(--ease),transform .85s var(--ease),filter .85s var(--ease);}
        .rv.in{opacity:1;transform:none;filter:none;}

        /* FOOTER — identico alle altre pagine */
        footer.site{background:var(--ink);color:rgba(250,248,244,.7);padding:80px 0 0;border-top:1px solid rgba(255,255,255,.07);}
        .foot-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:48px;padding-bottom:60px;border-bottom:1px solid rgba(255,255,255,.09);}
        .foot-brand img{height:46px;width:auto;margin-bottom:20px;}
        .foot-brand p{font-size:14px;font-weight:300;color:rgba(250,248,244,.55);max-width:300px;}
        .foot-social{display:flex;gap:10px;margin-top:22px;}
        .foot-social a{width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;transition:all .3s var(--ease);}
        .foot-social a:hover{background:var(--rosso);border-color:var(--rosso);transform:translateY(-3px);}
        .foot-col h5{font-family:var(--display);font-style:italic;font-size:17px;font-weight:500;color:var(--paper);margin-bottom:20px;}
        .foot-col a{display:block;font-size:14px;padding:5.5px 0;color:rgba(250,248,244,.55);transition:color .2s,padding-left .25s var(--ease);}
        .foot-col a:hover{color:#fff;padding-left:6px;}
        .foot-bottom{display:flex;justify-content:space-between;align-items:center;padding:26px 0;font-size:13px;color:rgba(250,248,244,.4);flex-wrap:wrap;gap:14px;}
        footer.site .lang-switch{color:rgba(250,248,244,.55);}
        footer.site .lang-switch span{color:rgba(255,255,255,.15);}

        /* RESPONSIVE — stessi breakpoint delle altre pagine */
        @media(max-width:1080px){
          .menu,.nav-actions{display:none;}
          .hamburger{display:flex;}
          .nav-inner{height:72px;padding:0 22px;}
          .brand-logo{height:42px;}
          .mobile-menu{display:flex;flex-direction:column;position:fixed;top:72px;left:0;right:0;height:calc(100dvh - 72px);background:var(--paper);z-index:95;padding:10px 0 30px;overflow-y:auto;opacity:0;transform:translateY(-10px);pointer-events:none;transition:opacity .25s var(--ease),transform .25s var(--ease);}
          .mobile-menu.open{opacity:1;transform:none;pointer-events:auto;}
          .mobile-menu > a{font-family:var(--display);font-size:26px;font-weight:500;padding:19px 26px;border-bottom:1px solid var(--line);color:var(--ink);display:flex;justify-content:space-between;align-items:center;}
          .mobile-menu > a::after{content:'→';font-size:18px;color:var(--rosso);}
          .mobile-foot{padding:24px 26px 0;display:flex;flex-direction:column;gap:18px;}
          body.lock{overflow:hidden;}
          .cols{grid-template-columns:1fr;gap:40px;}
          .toc-card{position:static;}
          .hero-meta{grid-template-columns:1fr 1fr;}
          .collage{grid-template-columns:1fr 1fr;grid-auto-rows:160px;}
          .collage-1{grid-template-columns:1fr;grid-auto-rows:300px;}
          .car-grid{grid-template-columns:1fr 1fr;}
          .foot-grid{grid-template-columns:1fr 1fr;}
          .scheda-hero-content{padding-top:110px;}
        }
        @media(max-width:640px){
          .wrap{padding:0 20px;}
          .subnav-inner{padding:0 20px;}
          .scheda-hero{min-height:54vh;}
          .scheda-hero-content{padding:100px 0 36px;}
          .listing-body{padding:36px 0 10px;}
          .spec-row{grid-template-columns:1fr;gap:3px;padding:16px 20px;}
          .spec-row dt{font-size:12px;letter-spacing:.06em;text-transform:uppercase;}
          .collage{grid-template-columns:1fr 1fr;grid-auto-rows:128px;gap:9px;}
          .collage-1{grid-auto-rows:220px;}
          .timeline-item{grid-template-columns:1fr;gap:8px;}
          .model-widget{flex-direction:column;align-items:flex-start;gap:20px;}
          .car-grid{grid-template-columns:1fr 1fr;gap:13px;}
          .car-img{height:124px;}
          .car-body{padding:13px 13px 15px;}
          .car-name{font-size:16.5px;}
          .car-price b{font-size:18px;}
          .foot-grid{grid-template-columns:1fr;}
        }
        @media(max-width:360px){
          .car-grid{grid-template-columns:1fr;}
        }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Figtree:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      <div className="progress" id="progress"></div>

      {/* ===== HEADER — trasparente su hero scuro, identico al pattern della home ===== */}
      <header className="nav" id="nav" ref={navRef}>
        <div className="nav-inner">
          <a href="/" aria-label="Rosso Mania"><img className="brand-logo" alt="Rosso Mania" src="https://www.welead.it/rossomania/logo/logo_rw.png" id="logoImg" /></a>
          <nav className="menu">
            <a href="/catalogo">Vetture in vendita</a>
            <a href="/modelli" className="active">Schede ufficiali</a>
            <a href="/#ai">Valutazione AI</a>
            <a href="/#come-funziona">Come funziona</a>
            <a href="#">Magazine</a>
          </nav>
          <div className="nav-actions">
            <div className="lang-switch"><a href="#" className="active">IT</a><span>/</span><a href="#">EN</a></div>
            <a href="#" className="nav-login">Accedi</a>
            <button className="btn btn-rosso">Vendi</button>
          </div>
          <button className="hamburger" id="navToggle" aria-label="Apri menu" aria-expanded="false">
            <svg className="ico-open" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
            <svg className="ico-close" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
          </button>
        </div>
      </header>

      <div className="mobile-menu" id="mobileMenu">
        <a href="/catalogo">Vetture in vendita</a>
        <a href="/modelli">Schede ufficiali</a>
        <a href="/#ai">Valutazione AI</a>
        <a href="/#come-funziona">Come funziona</a>
        <a href="#">Magazine</a>
        <div className="mobile-foot">
          <div className="lang-switch"><a href="#" className="active">IT</a><span>/</span><a href="#">EN</a></div>
          <a href="#" className="nav-login">Accedi</a>
          <button className="btn btn-rosso" style={{justifyContent:'center',padding:'15px'}}>Vendi la tua Ferrari</button>
        </div>
      </div>

      {/* ===== HERO SCHEDA ===== */}
      <header className="scheda-hero">
        <img src="https://www.welead.it/rossomania/img/foto1-laterale.jpeg" alt="Ferrari Testarossa" />
        <div className="scheda-veil"></div>
        <div className="wrap scheda-hero-content">
          <div className="crumbs">
            <a href="/">Home</a>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <a href="/modelli">Schede ufficiali</a>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>Testarossa</span>
          </div>
          <div className="scheda-kicker">Scheda ufficiale del modello</div>
          <h1 className="scheda-title">Testa<em>rossa</em></h1>
          <p className="scheda-sub">Coupé sportiva a motore centrale. L&apos;icona assoluta degli anni &apos;80: dodici cilindri boxer e le indimenticabili branchie laterali.</p>
          <div className="hero-meta">
            <div><small>Produzione</small><b>1984 — 1991</b></div>
            <div><small>Categoria</small><b>Coupé, motore centrale</b></div>
            <div><small>Sostituisce</small><b>Berlinetta Boxer 512 BBi</b></div>
            <div><small>Evoluzione</small><b>512 TR, F512 M</b></div>
          </div>
        </div>
      </header>

      <nav className="subnav" id="subnav">
        <div className="subnav-inner">
          <a href="#storia" className="active">Storia e design</a>
          <a href="#tecnica">Scheda tecnica</a>
          <a href="#evoluzione">Evoluzione</a>
          <a href="#mercato">Mercato</a>
          <a href="#annunci">In vendita</a>
        </div>
      </nav>

      <div className="listing-body">
        <div className="wrap">
          <div className="cols">

            {/* ===== COLONNA PRINCIPALE ===== */}
            <div>

              <div className="sec rv" id="storia">
                <div className="sec-h"><span className="idx">(01)</span><h2>Storia e <em>design</em></h2></div>
                <div className="desc">
                  <p><strong>Il nuovo modello che sostituisce la 512 BBi</strong> viene presentato al salone di Parigi nell&apos;ottobre del 1984 e suscita clamore ed entusiasmo. Disegnata dall&apos;Ing. Leonardo Fioravanti per Pininfarina, nasce per raccogliere l&apos;eredità delle Berlinetta Boxer e introduce una visione più moderna della granturismo Ferrari, unendo prestazioni elevate a una maggiore fruibilità su strada rispetto alle generazioni precedenti.</p>
                  <p>Il suo elemento più distintivo sono le <strong>ampie prese d&apos;aria laterali</strong>, soluzione tanto estetica quanto tecnica, studiata per ottimizzare il raffreddamento dei radiatori posizionati lateralmente — una scelta che contribuisce a definire una presenza su strada imponente, accentuata dalla larghezza fuori scala per l&apos;epoca. Lo stesso Fioravanti ha raccontato come il posteriore della Testarossa risulti volutamente &quot;esagerato&quot; dal punto di vista estetico, conseguenza diretta dei vincoli tecnici legati all&apos;architettura del motore.</p>
                  <p>Sotto il cofano si trova un <strong>dodici cilindri contrapposto da quasi cinque litri</strong>, montato in posizione centrale longitudinale, capace di erogare circa 390 cavalli e di spingere l&apos;auto fino a sfiorare i 290 km/h. La guida resta analogica e coinvolgente, con cambio manuale e trazione posteriore, ma l&apos;auto introduce anche un livello di comfort superiore, segnando un passaggio importante nella filosofia del marchio.</p>
                  <p>Oltre agli aspetti tecnici, la Testarossa ha avuto <strong>un impatto culturale enorme</strong>, diventando uno dei simboli assoluti degli anni &apos;80, anche grazie alla sua presenza in produzioni come Miami Vice. Ancora oggi è considerata una delle Ferrari più rappresentative dell&apos;epoca.</p>
                </div>
                <div className="collage collage-4">
                  <div className="cl b"><img src="https://www.welead.it/rossomania/img/foto1-laterale.jpeg" alt="Ferrari Testarossa, vista laterale" /></div>
                  <div className="cl"><img src="https://www.welead.it/rossomania/img/foto2-tre-quarti.jpeg" alt="Ferrari Testarossa, tre quarti anteriore" /></div>
                  <div className="cl t"><img src="https://www.welead.it/rossomania/img/foto3-dettaglio-scudetto.jpeg" alt="Dettaglio scudetto Ferrari" /></div>
                  <div className="cl"><img src="https://www.welead.it/rossomania/img/foto4-motore.jpeg" alt="Motore boxer Ferrari Testarossa" /></div>
                </div>
              </div>

              <div className="sec rv" id="tecnica">
                <div className="sec-h"><span className="idx">(02)</span><h2>Scheda <em>tecnica</em></h2></div>
                {specGroups.map((g, gi) => (
                  <div className={`spec-group${g.open ? ' open' : ''}`} key={gi}>
                    <div className="spec-head">
                      <h3>{g.title}</h3>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    <dl className="spec-rows">
                      {g.rows.map(([k, v], ri) => (
                        <div className="spec-row" key={ri}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>

              <div className="sec rv" id="evoluzione">
                <div className="sec-h"><span className="idx">(03)</span><h2>Evoluzione del <em>modello</em></h2></div>
                <p style={{ fontSize: '16px', color: '#474D59', maxWidth: '700px', marginBottom: '32px' }}>Tre dettagli tecnici dividono nettamente la produzione e ne determinano oggi il valore di mercato: lo specchietto, il fissaggio ruote e la presenza del catalizzatore.</p>
                <div className="timeline">
                  <div className="timeline-item">
                    <span className="timeline-year">1984–86</span>
                    <div>
                      <h3>Monospecchio</h3>
                      <p>Specchietto retrovisore singolo montato in posizione alta sul montante sinistro, cerchi con fissaggio a dado centrale. La configurazione più iconica e ricercata, anche per la produzione relativamente limitata.</p>
                      <span className="timeline-tag">Le più ricercate dal mercato</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-year">1987</span>
                    <div>
                      <h3>Doppio specchio, monodado</h3>
                      <p>Ferrari introduce il secondo specchietto retrovisore e abbassa l&apos;altezza dei finestrini all&apos;angolo. I cerchi restano a fissaggio monodado centrale. Pochi lo sanno: è la serie più limitata di tutta la produzione Testarossa.</p>
                      <span className="timeline-tag">La serie più rara</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-year">1988</span>
                    <div>
                      <h3>Cinque bulloni</h3>
                      <p>Ultimo aggiornamento sul fissaggio ruote: si passa al sistema classico a cinque bulloni. Le versioni non catalitiche di questo periodo rappresentano l&apos;impostazione più &quot;pura&quot; del progetto, con risposta motore più diretta — spesso preferite dagli appassionati europei.</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-year">1989–91</span>
                    <div>
                      <h3>Versione catalitica</h3>
                      <p>Introdotta per adeguarsi alle normative ambientali, in particolare per il mercato americano. Modifiche all&apos;impianto di scarico con leggera perdita di potenza nominale, ma fondamentale per la diffusione globale del modello.</p>
                    </div>
                  </div>
                </div>
                <div className="callout">
                  <strong>Da sapere prima di acquistare.</strong> Le prime serie monospecchio restano le più iconiche e spesso le più ambite; le versioni a cinque bulloni non catalitiche sono un ottimo compromesso tra purezza meccanica e usabilità; le catalitiche, più diffuse, sono spesso più accessibili ma fondamentali per comprendere l&apos;evoluzione del modello fino al 1991.
                </div>
              </div>

              <div className="sec rv" id="mercato">
                <div className="sec-h"><span className="idx">(04)</span><h2>Mercato e <em>quotazioni</em></h2></div>
                <div className="desc">
                  <p>Nel mercato collezionistico la Testarossa mantiene <strong>una posizione solida</strong>, con quotazioni che variano in base a stato, originalità e storico manutentivo — premiando in modo particolare gli esemplari conservati perfettamente e con basso chilometraggio.</p>
                </div>
                <a href="/#ai" className="model-widget" style={{ display: 'flex' }}>
                  <div>
                    <div className="mw-kicker">Esclusiva Rosso Mania</div>
                    <div className="mw-title">Quanto vale la tua <em>Testarossa?</em></div>
                    <p className="mw-sub">Lo strumento di valutazione AI analizza originalità, carrozzeria, interni e certificazioni per restituire una fascia di prezzo realistica.</p>
                  </div>
                  <span className="mw-arrow"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
                </a>
              </div>

              <div className="sec rv" id="annunci">
                <div className="sec-head-row">
                  <div className="sec-h" style={{ marginBottom: 0 }}><span className="idx">(05)</span><h2>Testarossa <em>in vendita</em></h2></div>
                  <a href="/catalogo" className="link-arrow">Vedi tutti gli annunci →</a>
                </div>
                <div className="car-grid">
                  {[
                    { img: 'https://images.unsplash.com/photo-1696433919026-7da23fbf8707?auto=format&fit=crop&w=720&q=72', tags: [{ c: 'tag-r', t: 'In evidenza' }, { c: 'tag-g', t: 'Classiche' }], year: '1989', km: '42.000 km', engine: 'V12', name: 'Testarossa', loc: 'Modena, Italia — Storico verificato', price: '€ 145.000' },
                    { img: 'https://images.unsplash.com/photo-1583356322642-da4d7fa7d39c?auto=format&fit=crop&w=720&q=72', tags: [{ c: 'tag-k', t: 'Dealer' }], year: '1986', km: '38.500 km', engine: 'V12', name: 'Testarossa Monospecchio', loc: 'Maranello, Italia — Conservata', price: '€ 189.000' },
                    { img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=720&q=72', tags: [{ c: 'tag-g', t: 'ASI' }], year: '1991', km: '51.200 km', engine: 'V12', name: 'Testarossa Catalitica', loc: 'Zurigo, Svizzera — Restaurata', price: '€ 132.000' },
                  ].map((car, i) => (
                    <a className="car" href="/annuncio" key={i}>
                      <div className="car-img">
                        <img src={car.img} alt={car.name} />
                        <div className="car-tags">{car.tags.map((t, j) => <span key={j} className={`tag ${t.c}`}>{t.t}</span>)}</div>
                      </div>
                      <div className="car-body">
                        <div className="car-meta">{car.year} <i>·</i> {car.km} <i>·</i> {car.engine}</div>
                        <h3 className="car-name">{car.name}</h3>
                        <p className="car-loc">{car.loc}</p>
                        <div className="car-divider"></div>
                        <div className="car-foot">
                          <div className="car-price"><small>Prezzo</small><b>{car.price}</b></div>
                          <span className="car-go" aria-label="Dettagli"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="sec rv" style={{ marginBottom: '90px' }}>
                <a href="/modelli" className="back-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  Torna a tutte le schede ufficiali
                </a>
              </div>
            </div>

            {/* ===== TOC SIDEBAR — non sticky su mobile ===== */}
            <aside className="toc-card rv">
              <span className="toc-label">In questa scheda</span>
              <nav>
                <a href="#storia" className="active">Storia e design</a>
                <a href="#tecnica">Scheda tecnica</a>
                <a href="#evoluzione">Evoluzione</a>
                <a href="#mercato">Mercato</a>
                <a href="#annunci">In vendita</a>
              </nav>
              <div className="toc-divider"></div>
              <a href="/#ai" className="toc-cta">Valuta la tua Testarossa →</a>
            </aside>

          </div>
        </div>
      </div>

      {/* ===== FOOTER — identico alle altre pagine ===== */}
      <footer className="site">
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <img src="https://www.welead.it/rossomania/logo/logo_rw.png" alt="Rosso Mania" />
              <p>Il marketplace verticale dedicato alle Ferrari d&apos;epoca. Da appassionati, per appassionati.</p>
              <div className="foot-social">
                <a href="#" aria-label="Facebook"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>
                <a href="#" aria-label="Instagram"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
                <a href="#" aria-label="YouTube"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 6.4a2.8 2.8 0 00-2-2C18.8 4 12 4 12 4s-6.8 0-8.5.4a2.8 2.8 0 00-2 2A29 29 0 001 12a29 29 0 00.5 5.6 2.8 2.8 0 002 2C5.2 20 12 20 12 20s6.8 0 8.5-.4a2.8 2.8 0 002-2A29 29 0 0023 12a29 29 0 00-.5-5.6zM10 15V9l5 3z"/></svg></a>
              </div>
            </div>
            <div className="foot-col"><h5>Esplora</h5><a href="/catalogo">Vetture in vendita</a><a href="/modelli">Schede ufficiali</a><a href="/#ai">Valutazione AI</a><a href="#">Magazine</a></div>
            <div className="foot-col"><h5>Vendi</h5><a href="#">Pubblica un annuncio</a><a href="/#come-funziona">Come funziona</a><a href="#">Registrati</a><a href="#">Accedi</a></div>
            <div className="foot-col"><h5>Rosso Mania</h5><a href="#">Chi siamo</a><a href="#">Contatti</a><a href="#">Privacy policy</a><a href="#">Termini di utilizzo</a></div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 Rosso Mania. Tutti i diritti riservati.</span>
            <div className="lang-switch"><a href="#" className="active">IT</a><span>/</span><a href="#">EN</a></div>
            <span>Realizzato da Welead srl</span>
          </div>
        </div>
      </footer>
    </>
  );
}
