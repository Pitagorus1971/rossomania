'use client';

import { useEffect } from 'react';

export default function Annuncio1() {
  useEffect(() => {
    // Header hide on scroll
    const nav = document.getElementById('nav');
    let lastY = 0;
    function onScroll() {
      const y = window.scrollY;
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

    // Spec accordions
    document.querySelectorAll('.spec-head').forEach(h => {
      h.addEventListener('click', () => (h as HTMLElement).parentElement?.classList.toggle('open'));
    });

    // Phone reveal
    const pb = document.getElementById('phoneBtn');
    if (pb) pb.addEventListener('click', () => { const s = pb.querySelector('span'); if (s) s.textContent = '+39 059 123 4567'; });

    // Form submit — handle multiple forms
    document.querySelectorAll('.contactForm').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const ok = form.querySelector('.formOk') as HTMLElement;
        const submitBtn = form.querySelector('button[type=submit]') as HTMLElement;
        if (ok) ok.style.display = 'flex';
        if (submitBtn) submitBtn.style.display = 'none';
      });
    });

    // Lightbox
    const shots = [
      'https://www.welead.it/rossomania/img/foto1.jpeg',
      'https://www.welead.it/rossomania/img/foto2.jpeg',
      'https://www.welead.it/rossomania/img/foto3.jpeg',
      'https://images.unsplash.com/photo-1696433919026-7da23fbf8707?auto=format&fit=crop&w=1400&q=75',
      'https://images.unsplash.com/photo-1658905097696-ec44846c3c3c?auto=format&fit=crop&w=1400&q=75',
      'https://images.unsplash.com/photo-1752253509655-112f2abab03c?auto=format&fit=crop&w=1400&q=75',
      'https://images.unsplash.com/photo-1690998199897-c32c0798a456?auto=format&fit=crop&w=1400&q=75',
    ];
    const lb = document.getElementById('lb');
    const lbImg = document.getElementById('lbImg') as HTMLImageElement;
    const lbCount = document.getElementById('lbCount');
    let li = 0;
    function lbShow(n: number) { li = ((n % shots.length) + shots.length) % shots.length; if (lbImg) lbImg.src = shots[li]; if (lbCount) lbCount.textContent = (li + 1) + ' / ' + shots.length; }
    function lbOpen(n: number) { lbShow(n); lb?.classList.add('open'); document.body.classList.add('lock'); }
    function lbClose() { lb?.classList.remove('open'); document.body.classList.remove('lock'); }
    document.querySelectorAll('.gal-item, .gal-shot, .gal-more, .cl').forEach(el => {
      el.addEventListener('click', e => { e.stopPropagation(); lbOpen(+(el as HTMLElement).dataset.i! || 0); });
    });
    document.getElementById('lbClose')?.addEventListener('click', lbClose);
    document.getElementById('lbPrev')?.addEventListener('click', e => { e.stopPropagation(); lbShow(li - 1); });
    document.getElementById('lbNext')?.addEventListener('click', e => { e.stopPropagation(); lbShow(li + 1); });
    lb?.addEventListener('click', e => { if (e.target === lb) lbClose(); });
    document.addEventListener('keydown', e => {
      if (!lb?.classList.contains('open')) return;
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowLeft') lbShow(li - 1);
      if (e.key === 'ArrowRight') lbShow(li + 1);
    });

    // Reveals
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.rv').forEach(el => io.observe(el));
    document.querySelectorAll('.car-grid .car').forEach((c, i) => (c as HTMLElement).style.transitionDelay = (i % 3) * 110 + 'ms');

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const specGroups = [
    {title:'Identificazione', open:true, rows:[['Modello','Testarossa — terza serie'],['Anno di costruzione','1989'],['Telaio','ZFFSG17A8K00*****'],['Versione','Europea'],['Proprietari','3 (documentati)'],['Immatricolazione','Italia — targhe originali']]},
    {title:'Motore e meccanica', open:true, rows:[['Motore','4.943 cc, 12 cilindri boxer (Tipo F113)'],['Potenza','390 CV a 6.300 giri'],['Cambio','Manuale 5 marce'],['Matching numbers','✓ Sì — certificato'],['Cinghie distribuzione','Sostituite 2024'],['Frizione','~90%'],['Pneumatici','Michelin TRX, 2023'],['Lavori da eseguire','Nessuno']]},
    {title:'Carrozzeria e vernice', open:true, rows:[['Colore','Rosso Corsa (originale)'],['Stato conservazione','9 / 10'],['Vernice','Originale, riverniciatura parziale cofano (documentata)'],['Sottoscocca','✓ Eccellente, mai incidentata'],['Vetri','Originali'],['Cerchi','Originali monodado']]},
    {title:'Interni e documentazione', open:true, rows:[['Interni','Pelle nera — 9 / 10'],['Cruscotto','Perfetto, senza crepe'],['Trousse attrezzi','✓ Presente, completa'],['Libretto tagliandi','✓ Completo e timbrato'],['Manuali','Uso e manutenzione, portadocumenti']]},
  ];

  const ContactForm = ({ id }: { id: string }) => (
    <form className="contactForm cform" id={id}>
      <h3>Richiedi <em>informazioni</em></h3>
      <div className="frow">
        <div className="fld"><label>Nome e cognome</label><input type="text" placeholder="Il tuo nome" required /></div>
        <div className="fld"><label>Email</label><input type="email" placeholder="nome@email.com" required /></div>
      </div>
      <div className="frow">
        <div className="fld"><label>Telefono <span style={{color:'var(--mute)',fontWeight:500,textTransform:'none'}}>(facoltativo)</span></label><input type="tel" placeholder="+39 ..." /></div>
      </div>
      <div className="fld"><label>Messaggio</label><textarea rows={4} defaultValue="Buongiorno, sono interessato alla Ferrari Testarossa del 1989 (annuncio #RM-0274). Vorrei ricevere maggiori informazioni."></textarea></div>
      <label className="consent"><input type="checkbox" required /> Acconsento al trattamento dei dati personali secondo la <a href="#" style={{textDecoration:'underline'}}>privacy policy</a>.</label>
      <button type="submit" className="btn btn-rosso" style={{padding:'16px',fontSize:'16px'}}>Invia richiesta</button>
      <div className="formOk" style={{display:'none',alignItems:'center',gap:'10px',background:'#EAF7F0',border:'1px solid #BFE6D2',color:'#168752',fontSize:'15px',fontWeight:600,borderRadius:'13px',padding:'14px 18px'}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="12" cy="12" r="10"/><polyline points="8 12.5 11 15.5 16 9.5"/></svg>
        Richiesta inviata. Il venditore ti risponderà via email.
      </div>
    </form>
  );

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
        .btn-ink{background:var(--ink);color:#fff;}.btn-ink::before{background:var(--rosso);}
        .btn-outline{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--ink);}.btn-outline::before{background:var(--ink);}.btn-outline:hover{color:#fff;}
        .btn-light{background:#fff;color:var(--ink);}.btn-light::before{background:var(--rosso);}.btn-light:hover{color:#fff;}
        .hamburger{display:none;align-items:center;justify-content:center;background:none;border:none;padding:8px;color:var(--ink);}
        .hamburger .ico-close{display:none;}
        .hamburger.open .ico-open{display:none;}
        .hamburger.open .ico-close{display:block;}
        .mobile-menu{display:none;}

        /* SUBNAV */
        .subnav{background:var(--ink);color:rgba(250,248,244,.7);overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
        .subnav::-webkit-scrollbar{display:none;}
        .subnav-inner{display:flex;gap:4px;padding:0 32px;max-width:1280px;margin:0 auto;}
        .subnav a{flex-shrink:0;padding:15px 17px;font-size:14px;font-weight:600;letter-spacing:.04em;border-bottom:2px solid transparent;transition:color .2s,border-color .2s;}
        .subnav a:hover,.subnav a.active{color:#fff;border-bottom-color:var(--rosso);}

        /* PAGE HEAD */
        .page-head{padding:118px 0 26px;}
        .crumbs{display:flex;align-items:center;gap:8px;font-size:13.5px;color:var(--mute);margin-bottom:22px;flex-wrap:wrap;}
        .crumbs a:hover{color:var(--rosso);}
        .head-grid{display:flex;justify-content:space-between;align-items:flex-end;gap:30px;flex-wrap:wrap;}
        h1.car-title{font-family:var(--display);font-size:clamp(38px,5.4vw,64px);font-weight:500;letter-spacing:-.02em;line-height:1.0;}
        h1.car-title em{font-style:italic;color:var(--rosso);}
        .head-sub{margin-top:12px;font-size:17px;color:#4A505C;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
        .head-sub i{font-style:normal;color:var(--line);}
        .head-side{text-align:right;}
        .head-price small{display:block;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin-bottom:4px;}
        .head-price b{font-family:var(--display);font-size:clamp(34px,4vw,48px);font-weight:600;letter-spacing:-.02em;line-height:1;}
        .head-price span{display:block;font-size:13px;color:var(--slate);margin-top:6px;font-family:var(--display);font-style:italic;}
        .head-actions{display:flex;gap:10px;margin-top:16px;justify-content:flex-end;}
        .icon-act{width:44px;height:44px;border-radius:50%;border:1.5px solid var(--line);background:#fff;display:flex;align-items:center;justify-content:center;color:var(--ink);transition:all .3s var(--ease);}
        .icon-act:hover{border-color:var(--ink);transform:translateY(-2px);}
        .icon-act.on{background:var(--rosso);border-color:var(--rosso);color:#fff;}
        .icon-act.on svg{fill:#fff;}

        /* GALLERY */
        .gallery{padding:8px 0 0;}
        .gal-grid{display:grid;grid-template-columns:2.05fr 1fr;grid-template-rows:repeat(2,minmax(0,1fr));gap:12px;height:560px;}
        .gal-item{position:relative;border-radius:18px;overflow:hidden;background:var(--ink);cursor:pointer;}
        .gal-item:first-child{grid-row:1/3;}
        .gal-item img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease);}
        .gal-item:hover img{transform:scale(1.05);}
        .gal-more{position:absolute;right:14px;bottom:14px;z-index:2;background:rgba(12,14,18,.72);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;font-size:13px;font-weight:600;padding:10px 18px;border-radius:100px;border:1px solid rgba(255,255,255,.25);display:inline-flex;align-items:center;gap:8px;transition:background .25s;}
        .gal-more:hover{background:var(--rosso);}
        .gal-count{position:absolute;left:14px;bottom:14px;z-index:2;background:rgba(12,14,18,.6);color:#fff;font-size:12px;font-weight:600;padding:7px 13px;border-radius:100px;display:inline-flex;align-items:center;gap:7px;}
        .gal-strip{display:none;}

        /* BODY LAYOUT — no sticky, everything scrolls */
        .listing-body{padding:54px 0 90px;}
        .cols{display:grid;grid-template-columns:1fr 380px;gap:56px;align-items:start;}

        /* CHIPS */
        .chips{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:44px;}
        .chip{display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:600;padding:12px 20px;border-radius:100px;background:#fff;border:1px solid var(--line);}
        .chip svg{color:var(--rosso);}

        /* SECTION */
        .sec{margin-bottom:56px;scroll-margin-top:104px;}
        .sec-h{display:flex;align-items:baseline;gap:14px;margin-bottom:28px;}
        .sec-h .idx{font-family:var(--display);font-style:italic;font-size:14px;color:var(--rosso);}
        .sec-h h2{font-family:var(--display);font-size:clamp(26px,3vw,34px);font-weight:500;letter-spacing:-.015em;}
        .sec-h h2 em{font-style:italic;color:var(--rosso);}

        /* DESCRIPTION */
        .desc p{color:#474D59;font-weight:400;font-size:17px;line-height:1.8;margin-bottom:18px;max-width:680px;}
        .desc p strong{color:var(--ink);font-weight:600;}

        /* FACTS */
        .facts{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
        .fact{background:#fff;border:1px solid var(--line);border-radius:16px;padding:20px 20px 17px;}
        .fact small{display:block;font-size:11.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);margin-bottom:6px;}
        .fact b{font-family:var(--display);font-size:23px;font-weight:600;letter-spacing:-.01em;}

        /* SPEC TABLES — redesigned, bigger and more readable */
        .spec-group{background:#fff;border:1px solid var(--line);border-radius:18px;overflow:hidden;margin-bottom:16px;}
        .spec-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:20px 28px;cursor:pointer;user-select:none;background:var(--ink);color:var(--paper);}
        .spec-head h3{font-family:var(--display);font-size:19px;font-weight:500;letter-spacing:-.01em;color:var(--paper);}
        .spec-head svg{transition:transform .35s var(--ease);color:rgba(250,248,244,.5);flex-shrink:0;}
        .spec-group.open .spec-head svg{transform:rotate(180deg);}
        .spec-rows{display:none;border-top:none;}
        .spec-group.open .spec-rows{display:block;}
        .spec-row{display:grid;grid-template-columns:220px 1fr;gap:24px;padding:18px 28px;font-size:16px;border-bottom:1px solid var(--line);align-items:center;}
        .spec-row:last-child{border-bottom:none;}
        .spec-row:nth-child(even){background:var(--paper);}
        .spec-row dt{color:#565C68;font-weight:400;font-size:14.5px;letter-spacing:.01em;}
        .spec-row dd{font-weight:700;font-size:16px;color:var(--ink);}
        .spec-row dd.ok{color:#168752;display:flex;align-items:center;gap:8px;font-size:16px;}

        /* MODEL WIDGET */
        .model-widget{position:relative;background:var(--ink);color:var(--paper);border-radius:20px;padding:36px 36px;display:flex;align-items:center;justify-content:space-between;gap:24px;overflow:hidden;transition:transform .4s var(--ease);}
        .model-widget:hover{transform:translateY(-3px);}
        .model-widget::before{content:'';position:absolute;inset:0;background:radial-gradient(420px 200px at 90% 0%,rgba(225,24,39,.4),transparent 70%);}
        .model-widget > *{position:relative;}
        .mw-kicker{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(250,248,244,.55);margin-bottom:8px;}
        .mw-title{font-family:var(--display);font-size:28px;font-weight:500;}
        .mw-title em{font-style:italic;color:var(--rosso);}
        .mw-sub{font-size:15px;color:rgba(250,248,244,.6);font-weight:300;margin-top:8px;max-width:420px;}
        .mw-arrow{flex-shrink:0;width:58px;height:58px;border-radius:50%;border:1.5px solid rgba(250,248,244,.3);display:flex;align-items:center;justify-content:center;transition:all .35s var(--ease);}
        .model-widget:hover .mw-arrow{background:var(--rosso);border-color:var(--rosso);transform:rotate(-38deg);}

        /* COLLAGE */
        .collage{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:172px;gap:12px;}
        .cl{position:relative;border-radius:16px;overflow:hidden;cursor:pointer;background:var(--ink);}
        .cl img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease);}
        .cl:hover img{transform:scale(1.06);}
        .cl.b{grid-column:span 2;grid-row:span 2;}
        .cl.t{grid-row:span 2;}
        .cl.w{grid-column:span 2;}
        .cl-more{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:rgba(12,14,18,.58);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);color:#fff;font-weight:700;font-size:17px;transition:background .25s;}
        .cl:hover .cl-more{background:rgba(163,13,26,.7);}
        .cl-more small{font-size:12.5px;font-weight:500;color:rgba(255,255,255,.75);}

        /* SIDEBAR — NOT sticky, scrolls naturally */
        .sidebar{display:flex;flex-direction:column;gap:18px;}
        .side-card{background:#fff;border:1px solid var(--line);border-radius:20px;padding:28px;}
        .seller{display:flex;align-items:center;gap:14px;margin-bottom:20px;}
        .seller-avatar{width:56px;height:56px;border-radius:50%;background:var(--ink);color:#fff;font-family:var(--display);font-weight:600;font-size:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .seller b{display:block;font-size:16.5px;font-weight:700;}
        .seller-badge{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:#168752;font-weight:600;}
        .seller-meta{font-size:13.5px;color:var(--mute);}
        .side-divider{height:1px;background:var(--line);margin:18px 0;}
        .side-stats{display:flex;flex-direction:column;gap:10px;font-size:15px;color:var(--slate);}
        .side-stats div{display:flex;justify-content:space-between;}
        .side-stats b{color:var(--ink);font-weight:600;}
        .phone-reveal{width:100%;}

        /* CONTACT FORM — sidebar variant */
        .cform{display:flex;flex-direction:column;gap:12px;}
        .cform h3{font-family:var(--display);font-size:23px;font-weight:600;margin-bottom:4px;letter-spacing:-.01em;}
        .cform h3 em{font-style:italic;color:var(--rosso);}
        .frow{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
        .fld{border:1.5px solid var(--line);border-radius:13px;padding:12px 16px 10px;background:#fff;transition:border-color .25s,box-shadow .25s;}
        .fld:focus-within{border-color:var(--ink);box-shadow:0 0 0 3px rgba(12,14,18,.07);}
        .fld label{display:block;font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--ink);margin-bottom:3px;}
        .fld input,.fld textarea{width:100%;border:none;background:none;font-family:var(--body);font-size:16px;color:var(--slate);outline:none;resize:vertical;}
        .cform .consent{display:flex;gap:9px;align-items:flex-start;font-size:13px;color:var(--mute);line-height:1.45;}
        .cform .consent input{margin-top:3px;accent-color:var(--rosso);}

        /* CONTACT SECTION bottom — full width below model widget */
        .contact-sec{background:var(--paper-2);border:1px solid var(--line);border-radius:24px;padding:48px 56px;margin-top:48px;}
        .contact-sec .contact-head{margin-bottom:36px;}
        .contact-sec .contact-head h2{font-family:var(--display);font-size:clamp(28px,3.5vw,40px);font-weight:500;letter-spacing:-.02em;}
        .contact-sec .contact-head h2 em{font-style:italic;color:var(--rosso);}
        .contact-sec .contact-head p{font-size:17px;color:var(--slate);margin-top:10px;}
        .contact-sec .cform .frow{grid-template-columns:1fr 1fr 1fr;}
        .contact-sec .cform button[type=submit]{max-width:340px;}

        /* CERTIFICATIONS */
        .cert-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
        .cert-card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:22px 22px 20px;display:flex;align-items:center;gap:16px;}
        .cert-icon{width:48px;height:48px;border-radius:12px;background:#EAF7F0;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .cert-icon svg{color:#168752;}
        .cert-card small{display:block;font-size:11.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);margin-bottom:4px;}
        .cert-card b{font-size:17px;font-weight:700;color:#168752;}

        /* RELATED */
        .related{background:var(--ink);color:var(--paper);padding:96px 0;}
        .rel-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:42px;gap:20px;flex-wrap:wrap;}
        .car-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
        .car{position:relative;background:var(--ink-2);border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,.07);transition:transform .5s var(--ease),border-color .35s;}
        .car:hover{transform:translateY(-7px);border-color:rgba(255,255,255,.18);}
        .car-img{position:relative;height:215px;overflow:hidden;}
        .car-img img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease);}
        .car:hover .car-img img{transform:scale(1.07);}
        .car-tags{position:absolute;top:14px;left:14px;display:flex;gap:7px;z-index:2;}
        .tag{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:5px 11px;border-radius:100px;color:#fff;backdrop-filter:blur(6px);}
        .tag-r{background:rgba(225,24,39,.92);}.tag-g{background:rgba(31,164,99,.88);}.tag-k{background:rgba(12,14,18,.65);border:1px solid rgba(255,255,255,.25);}
        .car-body{padding:20px 20px 22px;}
        .car-meta{display:flex;align-items:center;gap:8px;font-size:11.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--rosso);}
        .car-meta i{font-style:normal;color:rgba(250,248,244,.4);}
        .car-name{font-family:var(--display);font-size:24px;font-weight:500;letter-spacing:-.01em;margin:8px 0 4px;color:var(--paper);line-height:1.08;}
        .car-loc{font-size:13px;color:rgba(250,248,244,.5);font-weight:300;}
        .car-divider{height:1px;background:rgba(255,255,255,.09);margin:16px 0 14px;}
        .car-foot{display:flex;align-items:flex-end;justify-content:space-between;}
        .car-price small{display:block;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(250,248,244,.45);font-weight:600;margin-bottom:2px;}
        .car-price b{font-family:var(--display);font-size:24px;font-weight:600;letter-spacing:-.01em;color:var(--paper);}
        .car-go{width:44px;height:44px;border-radius:50%;border:1.5px solid rgba(250,248,244,.3);display:flex;align-items:center;justify-content:center;color:var(--paper);transition:all .35s var(--ease);}
        .car:hover .car-go{background:var(--rosso);border-color:var(--rosso);transform:rotate(-38deg);}

        /* FOOTER */
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

        /* MOB CTA */
        .mob-cta{display:none;}

        /* LIGHTBOX */
        .lb{position:fixed;inset:0;z-index:400;background:rgba(8,9,12,.96);display:none;align-items:center;justify-content:center;}
        .lb.open{display:flex;}
        .lb img{max-width:92vw;max-height:84vh;border-radius:12px;object-fit:contain;}
        .lb-close{position:absolute;top:22px;right:22px;width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:none;color:#fff;display:flex;align-items:center;justify-content:center;}
        .lb-close:hover{background:var(--rosso);border-color:var(--rosso);}
        .lb-nav{position:absolute;top:50%;transform:translateY(-50%);width:54px;height:54px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:rgba(12,14,18,.5);color:#fff;display:flex;align-items:center;justify-content:center;transition:background .2s;}
        .lb-nav:hover{background:var(--rosso);border-color:var(--rosso);}
        .lb-prev{left:22px;}.lb-next{right:22px;}
        .lb-count{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.8);font-size:14px;font-weight:600;letter-spacing:.08em;}

        /* REVEAL */
        .rv{opacity:0;transform:translateY(30px);filter:blur(5px);transition:opacity .85s var(--ease),transform .85s var(--ease),filter .85s var(--ease);}
        .rv.in{opacity:1;transform:none;filter:none;}

        /* RESPONSIVE */
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
          .cols{grid-template-columns:1fr;gap:44px;}
          .facts{grid-template-columns:1fr 1fr;}
          .foot-grid{grid-template-columns:1fr 1fr;}
          .page-head{padding-top:104px;}
          .head-side{text-align:left;}
          .head-actions{justify-content:flex-start;}
          .cert-grid{grid-template-columns:1fr 1fr;}
          .contact-sec{padding:36px 32px;}
          .contact-sec .cform .frow{grid-template-columns:1fr 1fr;}
        }
        @media(max-width:640px){
          .wrap{padding:0 20px;}
          .subnav-inner{padding:0 20px;}
          .page-head{padding:96px 0 18px;}
          .gal-grid{display:none;}
          .gal-strip{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;margin:0 -20px;padding:0 20px;}
          .gal-strip::-webkit-scrollbar{display:none;}
          .gal-shot{position:relative;flex:0 0 86%;scroll-snap-align:center;border-radius:16px;overflow:hidden;height:250px;background:var(--ink);}
          .gal-shot img{width:100%;height:100%;object-fit:cover;}
          .listing-body{padding:36px 0 70px;}
          .facts{grid-template-columns:1fr 1fr;gap:10px;}
          .spec-row{grid-template-columns:1fr;gap:3px;padding:16px 20px;}
          .spec-row dt{font-size:12px;letter-spacing:.06em;text-transform:uppercase;}
          .collage{grid-template-columns:1fr 1fr;grid-auto-rows:128px;gap:9px;}
          .car-grid{grid-template-columns:1fr 1fr;gap:13px;}
          .car-img{height:124px;}
          .car-body{padding:13px 13px 15px;}
          .car-name{font-size:16.5px;}
          .car-price b{font-size:18px;}
          .mob-cta{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:80;background:rgba(250,248,244,.96);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-top:1px solid var(--line);padding:12px 18px calc(12px + env(safe-area-inset-bottom));align-items:center;justify-content:space-between;gap:14px;}
          .mob-cta .p small{display:block;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6A707C;}
          .mob-cta .p b{font-family:var(--display);font-size:25px;font-weight:600;letter-spacing:-.01em;}
          .mob-cta .btn{padding:15px 32px;font-size:16.5px;flex-shrink:0;}
          body{padding-bottom:84px;}
          .contact-sec{padding:28px 22px;}
          .contact-sec .cform .frow{grid-template-columns:1fr;}
          .frow{grid-template-columns:1fr;}
          .cert-grid{grid-template-columns:1fr;}
        }
        @media(max-width:360px){
          .car-grid{grid-template-columns:1fr;}
          .car-img{height:175px;}
        }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Figtree:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      <div className="progress" id="progress"></div>

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
          <button className="hamburger" id="navToggle" aria-label="Apri menu" aria-expanded="false">
            <svg className="ico-open" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
            <svg className="ico-close" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
          </button>
        </div>
      </header>

      <div className="mobile-menu" id="mobileMenu">
        <a href="/">Vetture in vendita</a>
        <a href="#">Schede ufficiali</a>
        <a href="#">Valutazione AI</a>
        <a href="#">Come funziona</a>
        <a href="#">Magazine</a>
        <div className="mobile-foot">
          <div className="lang-switch"><a href="#" className="active">IT</a><span>/</span><a href="#">EN</a></div>
          <a href="#" className="nav-login">Accedi</a>
          <button className="btn btn-rosso" style={{justifyContent:'center',padding:'15px'}}>Vendi la tua Ferrari</button>
        </div>
      </div>

      <div className="page-head">
        <div className="wrap">
          <div className="crumbs rv in">
            <a href="/">Home</a>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <a href="#">Vetture in vendita</a>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>Ferrari Testarossa 1989</span>
          </div>
          <div className="head-grid">
            <div>
              <h1 className="car-title">Ferrari <em>Testarossa</em></h1>
              <div className="head-sub">
                <span>1989</span><i>·</i>
                <span>42.000 km certificati</span><i>·</i>
                <span>Cambio manuale</span><i>·</i>
                <span>Modena, Italia</span>
              </div>
            </div>
            <div className="head-side">
              <div className="head-price">
                <small>Prezzo richiesto</small>
                <b>€ 145.000</b>
                <span>trattabile</span>
              </div>
              <div className="head-actions">
                <button className="icon-act" onClick={e => (e.currentTarget as HTMLButtonElement).classList.toggle('on')} aria-label="Salva nei preferiti">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>
                </button>
                <button className="icon-act" aria-label="Condividi">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>
                </button>
                <button className="icon-act" aria-label="Segnala annuncio">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="gallery wrap" id="galleria">
        <div className="gal-grid rv in">
          <div className="gal-item" data-i="0">
            <img src="https://www.welead.it/rossomania/img/foto1.jpeg" alt="Ferrari Testarossa — fronte" />
            <span className="gal-count">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg> 40 foto
            </span>
          </div>
          <div className="gal-item" data-i="1"><img src="https://www.welead.it/rossomania/img/foto2.jpeg" alt="Ferrari Testarossa — laterale" /></div>
          <div className="gal-item" data-i="2">
            <img src="https://www.welead.it/rossomania/img/foto3.jpeg" alt="Ferrari Testarossa — retro" />
            <button className="gal-more" data-i="2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3"/></svg>
              Vedi tutte
            </button>
          </div>
        </div>
        <div className="gal-strip">
          <div className="gal-shot" data-i="0"><img src="https://www.welead.it/rossomania/img/foto1.jpeg" alt="" /><span className="gal-count">1 / 40</span></div>
          <div className="gal-shot" data-i="1"><img src="https://www.welead.it/rossomania/img/foto2.jpeg" alt="" /></div>
          <div className="gal-shot" data-i="2"><img src="https://www.welead.it/rossomania/img/foto3.jpeg" alt="" /></div>
        </div>
      </div>

      <nav className="subnav" id="subnav" style={{marginTop:'34px'}}>
        <div className="subnav-inner">
          <a href="#panoramica" className="active">Panoramica</a>
          <a href="#descrizione">Descrizione</a>
          <a href="#foto">Galleria</a>
          <a href="#specifiche">Specifiche</a>
          <a href="#certificazioni">Certificazioni</a>
          <a href="#contatta">Contatta</a>
        </div>
      </nav>

      <div className="listing-body">
        <div className="wrap">
          <div className="cols">

            {/* ── COLONNA PRINCIPALE ── */}
            <div>
              <div className="chips rv" id="panoramica">
                {['Matching numbers','3 proprietari','Tagliando 03/2025','Km certificati'].map((c,i) => (
                  <span className="chip" key={i}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="20 6 9 17 4 12"/></svg> {c}
                  </span>
                ))}
              </div>

              <div className="sec rv">
                <div className="facts">
                  {[['Anno','1989'],['Chilometri','42.000'],['Motore','4.9 F12'],['Potenza','390 CV'],['Cambio','Manuale 5M'],['Esterno','Rosso Corsa'],['Interni','Pelle nera'],['Versione','Europea']].map(([k,v],i) => (
                    <div className="fact" key={i}><small>{k}</small><b>{v}</b></div>
                  ))}
                </div>
              </div>

              <div className="sec rv" id="descrizione">
                <div className="sec-h"><span className="idx">(01)</span><h2>La <em>vettura</em></h2></div>
                <div className="desc">
                  <p><strong>Esemplare europeo del 1989, terza serie</strong>, consegnato nuovo dalla concessionaria Crepaldi di Milano e rimasto in Italia per tutta la sua vita. Tre proprietari documentati, chilometraggio certificato da libretto tagliandi completo e timbrato.</p>
                  <p>La vettura conserva <strong>motore e cambio di primo impianto</strong> (matching numbers verificato da certificazione Ferrari Classiche, 2022). Vernice originale Rosso Corsa con riverniciatura parziale del cofano anteriore documentata, spessori verificabili in sede di visione.</p>
                  <p>Interni in pelle nera in <strong>condizioni da concorso (9/10)</strong>: sedili senza cedimenti, cruscotto perfetto, moquette originale. Completa di trousse attrezzi, portadocumenti, manuali e doppia chiave.</p>
                  <p>Ultimo tagliando completo eseguito a marzo 2025. <strong>Nessun lavoro da eseguire</strong>: la vettura è pronta all&apos;uso o al concorso.</p>
                </div>
              </div>

              <div className="sec rv" id="foto">
                <div className="sec-h"><span className="idx">(02)</span><h2>La <em>galleria</em></h2></div>
                <div className="collage">
                  <div className="cl b" data-i="0"><img src="https://www.welead.it/rossomania/img/foto1.jpeg" alt="" /></div>
                  <div className="cl" data-i="1"><img src="https://www.welead.it/rossomania/img/foto2.jpeg" alt="" /></div>
                  <div className="cl t" data-i="3"><img src="https://images.unsplash.com/photo-1696433919026-7da23fbf8707?auto=format&fit=crop&w=600&q=72" alt="" /></div>
                  <div className="cl" data-i="2"><img src="https://www.welead.it/rossomania/img/foto3.jpeg" alt="" /></div>
                  <div className="cl w" data-i="4"><img src="https://images.unsplash.com/photo-1658905097696-ec44846c3c3c?auto=format&fit=crop&w=900&q=72" alt="" /></div>
                  <div className="cl" data-i="5"><img src="https://images.unsplash.com/photo-1752253509655-112f2abab03c?auto=format&fit=crop&w=600&q=72" alt="" /></div>
                  <div className="cl" data-i="6">
                    <img src="https://images.unsplash.com/photo-1690998199897-c32c0798a456?auto=format&fit=crop&w=600&q=72" alt="" />
                    <span className="cl-more">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      +33 foto<small>Vedi tutte</small>
                    </span>
                  </div>
                </div>
              </div>

              <div className="sec rv" id="specifiche">
                <div className="sec-h"><span className="idx">(03)</span><h2>Scheda <em>tecnica</em></h2></div>
                {specGroups.map((g, gi) => (
                  <div className={`spec-group${g.open ? ' open' : ''}`} key={gi}>
                    <div className="spec-head">
                      <h3>{g.title}</h3>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    <dl className="spec-rows">
                      {g.rows.map(([k,v],ri) => (
                        <div className="spec-row" key={ri}>
                          <dt>{k}</dt>
                          <dd className={v.startsWith('✓') ? 'ok' : ''}>{v.startsWith('✓') ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><polyline points="20 6 9 17 4 12"/></svg>{v.slice(2)}</> : v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>

              <div className="sec rv" id="certificazioni">
                <div className="sec-h"><span className="idx">(04)</span><h2>Certificazioni</h2></div>
                <div className="cert-grid">
                  <div className="cert-card">
                    <div className="cert-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg></div>
                    <div><small>Ferrari Classiche</small><b>Certificata 2022</b></div>
                  </div>
                  <div className="cert-card">
                    <div className="cert-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                    <div><small>ASI</small><b>Targa Oro</b></div>
                  </div>
                  <div className="cert-card">
                    <div className="cert-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                    <div><small>Storico</small><b>Verificato</b></div>
                  </div>
                </div>
              </div>

              {/* Scheda ufficiale modello */}
              <div className="sec rv">
                <a href="#" className="model-widget" style={{display:'flex'}}>
                  <div>
                    <div className="mw-kicker">Scheda ufficiale del modello</div>
                    <div className="mw-title">Ferrari <em>Testarossa</em> — 1984–1996</div>
                    <p className="mw-sub">Storia, varianti, dati tecnici e guida all&apos;acquisto nella scheda editoriale curata da Rosso Mania.</p>
                  </div>
                  <span className="mw-arrow"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
                </a>
              </div>

              {/* Form contatto — riproposto in fondo alla colonna principale */}
              <div className="sec rv" id="contatta">
                <div className="contact-sec">
                  <div className="contact-head">
                    <h2>Richiedi <em>informazioni</em></h2>
                    <p>Compila il modulo e il venditore ti risponderà entro 24 ore. Nessun impegno.</p>
                  </div>
                  <ContactForm id="contactFormBottom" />
                </div>
              </div>
            </div>

            {/* ── SIDEBAR — non sticky ── */}
            <aside className="sidebar">
              <div className="side-card rv">
                <div className="seller">
                  <div className="seller-avatar">MV</div>
                  <div>
                    <b>Maranello Vintage</b>
                    <span className="seller-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><polyline points="20 6 9 17 4 12"/></svg> Dealer Ufficiale</span>
                    <div className="seller-meta">Modena, IT · Su Rosso Mania dal 2026</div>
                  </div>
                </div>
                <button className="btn btn-outline phone-reveal" id="phoneBtn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                  <span>Mostra numero</span>
                </button>
                <div className="side-divider"></div>
                <div className="side-stats">
                  <div><span>Annuncio</span><b>#RM-0274</b></div>
                  <div><span>Pubblicato</span><b>28 maggio 2026</b></div>
                  <div><span>Visualizzazioni</span><b>1.842</b></div>
                </div>
              </div>

              <div className="side-card rv">
                <ContactForm id="contactFormSide" />
              </div>
            </aside>

          </div>
        </div>
      </div>

      <section className="related">
        <div className="wrap">
          <div className="rel-head rv">
            <div className="sec-h" style={{marginBottom:0}}>
              <span className="idx">(05)</span>
              <h2 style={{color:'var(--paper)'}}>Potrebbero <em>interessarti</em></h2>
            </div>
            <a href="#" className="btn btn-light">Tutte le vetture</a>
          </div>
          <div className="car-grid">
            {[
              {img:'https://images.unsplash.com/photo-1658905097696-ec44846c3c3c?auto=format&fit=crop&w=720&q=72',tags:[{c:'tag-r',t:'In evidenza'}],year:'1992',km:'38.500 km',engine:'V12',name:'512 TR',loc:'Bologna, Italia — Conservata',price:'€ 198.000'},
              {img:'https://images.unsplash.com/photo-1752253509655-112f2abab03c?auto=format&fit=crop&w=720&q=72',tags:[{c:'tag-g',t:'ASI'}],year:'1979',km:'51.200 km',engine:'V12',name:'512 BB',loc:'Ginevra, Svizzera — Restaurata',price:'€ 320.000'},
              {img:'https://images.unsplash.com/photo-1696433919026-7da23fbf8707?auto=format&fit=crop&w=720&q=72',tags:[{c:'tag-r',t:'In evidenza'},{c:'tag-k',t:'Dealer'}],year:'1985',km:'29.800 km',engine:'V12',name:'Testarossa Monospecchio',loc:'Monaco, MC — Storico verificato',price:'€ 235.000'},
            ].map((car, i) => (
              <article className="car rv" key={i}>
                <div className="car-img">
                  <img src={car.img} alt={car.name} />
                  <div className="car-tags">{car.tags.map((t,j) => <span key={j} className={`tag ${t.c}`}>{t.t}</span>)}</div>
                </div>
                <div className="car-body">
                  <div className="car-meta">{car.year} <i>·</i> {car.km} <i>·</i> {car.engine}</div>
                  <h3 className="car-name">{car.name}</h3>
                  <p className="car-loc">{car.loc}</p>
                  <div className="car-divider"></div>
                  <div className="car-foot">
                    <div className="car-price"><small>Prezzo</small><b>{car.price}</b></div>
                    <a href="#" className="car-go" aria-label="Dettagli"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

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
            <div className="foot-col"><h5>Esplora</h5><a href="#">Vetture in vendita</a><a href="#">Schede ufficiali</a><a href="#">Valutazione AI</a><a href="#">Magazine</a></div>
            <div className="foot-col"><h5>Vendi</h5><a href="#">Pubblica un annuncio</a><a href="#">Come funziona</a><a href="#">Registrati</a><a href="#">Accedi</a></div>
            <div className="foot-col"><h5>Rosso Mania</h5><a href="#">Chi siamo</a><a href="#">Contatti</a><a href="#">Privacy policy</a><a href="#">Termini di utilizzo</a></div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 Rosso Mania. Tutti i diritti riservati.</span>
            <div className="lang-switch"><a href="#" className="active">IT</a><span>/</span><a href="#">EN</a></div>
            <span>Realizzato da Welead srl</span>
          </div>
        </div>
      </footer>

      <div className="mob-cta">
        <div className="p"><small>Prezzo</small><b>€ 145.000</b></div>
        <a href="#contatta" className="btn btn-rosso">Contatta</a>
      </div>

      <div className="lb" id="lb" role="dialog" aria-label="Galleria fotografica">
        <button className="lb-close" id="lbClose" aria-label="Chiudi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg></button>
        <button className="lb-nav lb-prev" id="lbPrev" aria-label="Precedente"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg></button>
        <img id="lbImg" src="" alt="Foto vettura" />
        <button className="lb-nav lb-next" id="lbNext" aria-label="Successiva"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></button>
        <div className="lb-count" id="lbCount">1 / 7</div>
      </div>
    </>
  );
}
