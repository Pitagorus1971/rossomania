'use client';

import { useEffect, useRef } from 'react';

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Hero loaded
    const hero = heroRef.current;
    if (hero) {
      setTimeout(() => hero.classList.add('loaded'), 100);
    }

    // Hero slider
    const slides = Array.from(document.querySelectorAll<HTMLElement>('.hero-slide'));
    const bars = Array.from(document.querySelectorAll<HTMLButtonElement>('.hero-bar'));
    const counter = document.getElementById('slideNow');
    let cur = 0;
    let timer: ReturnType<typeof setInterval>;

    function show(n: number) {
      slides[cur].classList.remove('active');
      bars[cur].classList.remove('active');
      bars[cur].classList.add('played');
      cur = ((n % slides.length) + slides.length) % slides.length;
      if (cur === 0) bars.forEach(b => b.classList.remove('played'));
      slides[cur].classList.add('active');
      bars[cur].classList.remove('played');
      bars[cur].classList.remove('active');
      void bars[cur].offsetWidth;
      bars[cur].classList.add('active');
      if (counter) counter.textContent = String(cur + 1).padStart(2, '0');
    }

    function play() { timer = setInterval(() => show(cur + 1), 5200); }
    bars.forEach((b, i) => b.addEventListener('click', () => { clearInterval(timer); show(i); play(); }));
    play();

    // Header scroll
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
      if (logo) logo.src = solid ? LOGO_LIGHT : LOGO_DARK;
      if (y > lastY && y > 420 && !document.body.classList.contains('lock')) {
        nav?.classList.add('hidden');
      } else {
        nav?.classList.remove('hidden');
      }
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
        mm.classList.remove('open');
        btn.classList.remove('open');
        document.body.classList.remove('lock');
      }));
    }

    // Pills
    document.querySelectorAll('.filter-pills').forEach(g => {
      g.querySelectorAll('.pill').forEach(p => p.addEventListener('click', () => {
        g.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
        p.classList.add('active');
      }));
    });

    // Reveal on scroll
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.rv').forEach(el => io.observe(el));

    // Stagger grids
    (['.model-grid .model-card', '.car-grid .car'] as string[]).forEach(sel => {
      document.querySelectorAll(sel).forEach((el, i) => {
        (el as HTMLElement).style.transitionDelay = (i % 3) * 110 + 'ms';
      });
    });

    // AI report animation
    const rep = document.getElementById('aiReport');
    if (rep) {
      const rio = new IntersectionObserver(es => {
        es.forEach(e => {
          if (e.isIntersecting) {
            rep.classList.add('in');
            const el = document.getElementById('aiPrice');
            if (el) {
              const target = 145000, dur = 1500, t0 = performance.now();
              (function tk(now: number) {
                const p = Math.min((now - t0) / dur, 1), ez = 1 - Math.pow(1 - p, 3);
                el.textContent = '€ ' + Math.round(target * ez).toLocaleString('it-IT');
                if (p < 1) requestAnimationFrame(tk);
              })(t0);
            }
            rio.unobserve(rep);
          }
        });
      }, { threshold: 0.35 });
      rio.observe(rep);
    }

    // Parallax
    const hc = document.getElementById('heroContent');
    const parallax = () => {
      const y = window.scrollY;
      if (hc && y < window.innerHeight) hc.style.transform = `translateY(${y * 0.18}px)`;
    };
    window.addEventListener('scroll', parallax, { passive: true });

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', parallax);
    };
  }, []);

  return (
    <>
      <style>{`
        :root{
          --rosso:#E11827;--rosso-deep:#A30D1A;--ink:#0C0E12;--ink-2:#181B22;
          --paper:#FAF8F4;--paper-2:#F2EFE8;--slate:#5C6271;--mute:#979CA8;
          --line:#E5E1D8;--line-dark:rgba(255,255,255,.1);
          --display:'Fraunces',serif;--body:'Figtree',sans-serif;
          --ease:cubic-bezier(.22,.75,.25,1);--ease-out:cubic-bezier(.16,1,.3,1);
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:var(--body);background:var(--paper);color:var(--ink);font-size:15.5px;line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
        a{color:inherit;text-decoration:none;}
        img{display:block;max-width:100%;}
        button{font-family:var(--body);cursor:pointer;}
        .wrap{max-width:1280px;margin:0 auto;padding:0 32px;}
        ::selection{background:var(--rosso);color:#fff;}
        .progress{position:fixed;top:0;left:0;height:2.5px;width:0;background:var(--rosso);z-index:300;}
        header.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(250,248,244,0);transition:background .35s var(--ease),box-shadow .35s var(--ease),transform .4s var(--ease);}
        header.nav.solid{background:rgba(250,248,244,.92);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 1px 0 var(--line);}
        header.nav.hidden{transform:translateY(-100%);}
        .nav-inner{display:flex;align-items:center;justify-content:space-between;height:86px;padding:0 40px;}
        .brand-logo{display:block;height:52px;width:auto;transition:height .3s var(--ease);}
        header.nav.solid .brand-logo{height:46px;}
        .menu{display:flex;gap:2px;}
        .menu a{position:relative;padding:10px 16px;font-weight:500;font-size:14.5px;color:var(--ink);letter-spacing:.01em;}
        .menu a::after{content:'';position:absolute;left:16px;right:16px;bottom:5px;height:1.5px;background:var(--rosso);transform:scaleX(0);transform-origin:right;transition:transform .35s var(--ease);}
        .menu a:hover::after{transform:scaleX(1);transform-origin:left;}
        header.nav:not(.solid) .menu a{color:#fff;}
        header.nav:not(.solid) .lang-switch{color:rgba(255,255,255,.75);}
        header.nav:not(.solid) .lang-switch span{color:rgba(255,255,255,.3);}
        header.nav:not(.solid) .nav-login{color:#fff;}
        header.nav:not(.solid) .hamburger{color:#fff;}
        .nav-actions{display:flex;align-items:center;gap:18px;}
        .lang-switch{display:flex;align-items:center;gap:4px;font-size:13px;font-weight:600;color:var(--mute);}
        .lang-switch span{color:var(--line);}
        .lang-switch a{padding:2px 8px;border-radius:6px;transition:background .2s,color .2s;}
        .lang-switch a.active{background:var(--rosso);color:#fff;}
        .nav-login{font-weight:500;font-size:14.5px;transition:color .2s;}
        .nav-login:hover{color:var(--rosso);}
        .btn{position:relative;display:inline-flex;align-items:center;gap:9px;font-weight:600;font-size:14.5px;border:none;border-radius:100px;padding:13px 26px;overflow:hidden;transition:color .3s var(--ease),border-color .3s;isolation:isolate;}
        .btn::before{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;transform:translateY(101%);transition:transform .45s var(--ease-out);}
        .btn:hover::before{transform:translateY(0);}
        .btn-rosso{background:var(--rosso);color:#fff;}
        .btn-rosso::before{background:var(--ink);}
        .btn-ink{background:var(--ink);color:#fff;}
        .btn-ink::before{background:var(--rosso);}
        .btn-outline{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--ink);}
        .btn-outline::before{background:var(--ink);}
        .btn-outline:hover{color:#fff;}
        .btn-light{background:#fff;color:var(--ink);}
        .btn-light::before{background:var(--rosso);}
        .btn-light:hover{color:#fff;}
        .hamburger{display:none;align-items:center;justify-content:center;background:none;border:none;padding:8px;color:var(--ink);}
        .hamburger .ico-close{display:none;}
        .hamburger.open .ico-open{display:none;}
        .hamburger.open .ico-close{display:block;}
        .mobile-menu{display:none;}
        .hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;color:#fff;overflow:hidden;background:var(--ink);}
        .hero-slides{position:absolute;inset:0;}
        .hero-slide{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 55%;opacity:0;transition:opacity 1.4s ease;}
        @keyframes kb{from{transform:scale(1.02)}to{transform:scale(1.11)}}
        .hero-slide.active{opacity:1;animation:kb 7s ease-out forwards;}
        .hero-veil{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(12,14,18,.78) 0%,rgba(12,14,18,.25) 18%,transparent 30%),linear-gradient(to top,rgba(12,14,18,.92) 0%,rgba(12,14,18,.35) 38%,rgba(12,14,18,.15) 62%);}
        .hero-content{position:relative;z-index:3;padding:0 0 56px;}
        .hero-kicker{display:flex;align-items:center;gap:14px;margin-bottom:26px;font-size:15px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#fff;text-shadow:0 1px 14px rgba(0,0,0,.55);}
        .hero-kicker::before{content:'';width:48px;height:1.5px;background:var(--rosso);}
        .hero h1{font-family:var(--display);font-size:clamp(52px,8.2vw,116px);font-weight:500;line-height:.98;letter-spacing:-.02em;max-width:13ch;margin-bottom:30px;}
        .hero h1 em{font-style:italic;color:#fff;font-weight:500;}
        .hero h1 .line{display:block;overflow:hidden;}
        .hero h1 .line > span{display:inline-block;transform:translateY(110%);transition:transform 1s var(--ease-out);}
        .hero.loaded h1 .line > span{transform:translateY(0);}
        .hero.loaded h1 .line:nth-child(2) > span{transition-delay:.12s;}
        .hero-sub{max-width:480px;font-size:17px;font-weight:300;color:rgba(255,255,255,.82);margin-bottom:38px;opacity:0;transform:translateY(16px);transition:opacity .9s var(--ease) .45s,transform .9s var(--ease) .45s;}
        .hero.loaded .hero-sub{opacity:1;transform:none;}
        .hero-cta{display:flex;gap:14px;align-items:center;flex-wrap:wrap;opacity:0;transform:translateY(16px);transition:opacity .9s var(--ease) .6s,transform .9s var(--ease) .6s;}
        .hero.loaded .hero-cta{opacity:1;transform:none;}
        .hero-meta{position:relative;z-index:3;display:flex;align-items:center;justify-content:space-between;padding:26px 0 34px;border-top:1px solid rgba(255,255,255,.18);margin-top:50px;}
        .hero-count{font-family:var(--display);font-size:15px;letter-spacing:.06em;color:rgba(255,255,255,.85);}
        .hero-count b{font-weight:600;color:#fff;font-size:19px;}
        .hero-bars{display:flex;gap:8px;}
        .hero-bar{width:54px;height:2.5px;background:rgba(255,255,255,.25);border:none;padding:0;position:relative;overflow:hidden;border-radius:2px;}
        .hero-bar i{position:absolute;inset:0;background:var(--rosso);transform:scaleX(0);transform-origin:left;display:block;}
        .hero-bar.played i{transform:scaleX(1);}
        .hero-bar.active i{animation:fill 5.2s linear forwards;}
        @keyframes fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        .hero-scroll{position:absolute;right:40px;bottom:34px;z-index:4;display:flex;flex-direction:column;align-items:center;gap:10px;color:rgba(255,255,255,.6);font-size:10.5px;letter-spacing:.26em;text-transform:uppercase;writing-mode:vertical-rl;}
        .hero-scroll::after{content:'';width:1.5px;height:44px;background:linear-gradient(var(--rosso),transparent);animation:drip 1.8s ease-in-out infinite;}
        @keyframes drip{0%,100%{opacity:.4;transform:scaleY(.6);transform-origin:top}50%{opacity:1;transform:scaleY(1)}}
        .marquee{background:var(--ink);color:var(--paper);overflow:hidden;white-space:nowrap;padding:17px 0;border-top:1px solid rgba(255,255,255,.06);}
        .marquee-track{display:inline-flex;gap:0;animation:scroll 36s linear infinite;}
        .marquee:hover .marquee-track{animation-play-state:paused;}
        @keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .marquee span{font-family:var(--display);font-style:italic;font-size:17px;font-weight:500;letter-spacing:.02em;padding:0 28px;position:relative;color:rgba(250,248,244,.9);}
        .marquee span::after{content:'·';position:absolute;right:-5px;color:var(--rosso);font-style:normal;}
        section.block{padding:110px 0;position:relative;}
        .sec-label{display:flex;align-items:baseline;gap:20px;margin-bottom:54px;}
        .sec-index{font-family:var(--display);font-size:15px;font-style:italic;color:var(--rosso);flex-shrink:0;letter-spacing:.04em;}
        .sec-title{font-family:var(--display);font-size:clamp(34px,4.6vw,58px);font-weight:500;line-height:1.02;letter-spacing:-.018em;}
        .sec-title em{font-style:italic;color:var(--rosso);}
        .sec-side{margin-left:auto;align-self:flex-end;}
        .sec-sub{color:var(--slate);font-size:16.5px;font-weight:300;max-width:520px;margin-top:18px;}
        .ghost{position:absolute;top:36px;right:-10px;z-index:0;pointer-events:none;font-family:var(--display);font-size:clamp(160px,24vw,340px);font-weight:600;font-style:italic;color:transparent;-webkit-text-stroke:1px var(--line);line-height:1;user-select:none;}
        .search-zone{margin-top:-1px;background:var(--ink);padding:0 0 96px;}
        .search-card{background:#fff;border-radius:24px;padding:26px 26px 24px;box-shadow:0 36px 90px -34px rgba(0,0,0,.6);}
        .search-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:18px;gap:14px;flex-wrap:wrap;}
        .search-head h3{font-family:var(--display);font-size:27px;font-weight:500;letter-spacing:-.01em;}
        .search-head h3 em{font-style:italic;color:var(--rosso);}
        .search-head span{font-size:13.5px;color:var(--mute);font-weight:500;}
        .search-grid{display:grid;grid-template-columns:repeat(4,1fr) 1.05fr;gap:12px;}
        .sfield{border:1.5px solid #D8D2C4;border-radius:16px;background:#fff;padding:14px 18px 12px;transition:border-color .25s var(--ease),box-shadow .25s;}
        .sfield:hover{border-color:#A9A293;}
        .sfield:focus-within{border-color:var(--ink);box-shadow:0 0 0 3px rgba(12,14,18,.08);}
        .sfield label{display:block;font-size:13.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--ink);margin-bottom:4px;}
        .sfield select{width:100%;border:none;background:none;font-family:var(--body);font-size:15px;font-weight:400;color:var(--slate);outline:none;cursor:pointer;}
        .s-submit{display:flex;}
        .s-submit .btn{width:100%;justify-content:center;border-radius:16px;font-size:17.5px;font-weight:700;gap:10px;padding:0;}
        .models{position:relative;background:#fff;}
        .model-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;position:relative;z-index:2;}
        .model-card{position:relative;background:#fff;border:1px solid var(--line);border-radius:18px;padding:30px 28px 26px;overflow:hidden;transition:transform .45s var(--ease),box-shadow .45s var(--ease),border-color .3s;}
        .model-card:hover{transform:translateY(-6px);box-shadow:0 24px 50px -22px rgba(12,14,18,.25);border-color:transparent;}
        .model-card::after{content:'';position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--rosso);transform:scaleX(0);transform-origin:left;transition:transform .45s var(--ease);}
        .model-card:hover::after{transform:scaleX(1);}
        .model-years{font-size:11.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--rosso);}
        .model-name{font-family:var(--display);font-size:30px;font-weight:500;letter-spacing:-.01em;line-height:1.05;margin:8px 0 6px;}
        .model-desc{font-size:14px;color:var(--slate);font-weight:300;margin-bottom:20px;}
        .model-cta{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--ink);}
        .model-cta svg{transition:transform .35s var(--ease);}
        .model-card:hover .model-cta svg{transform:translateX(5px);}
        .model-card:hover .model-cta{color:var(--rosso);}
        .model-card.all{background:var(--ink);color:#fff;border-color:var(--ink);display:flex;flex-direction:column;justify-content:center;align-items:flex-start;}
        .model-card.all .model-name{color:#fff;font-style:italic;}
        .model-card.all .model-cta{color:#fff;}
        .model-card.all:hover .model-cta{color:var(--rosso);}
        .listings{background:var(--ink);color:var(--paper);}
        .listings .sec-title{color:var(--paper);}
        .listings .ghost{-webkit-text-stroke-color:rgba(255,255,255,.07);}
        .filter-pills{display:flex;gap:10px;margin-bottom:46px;flex-wrap:wrap;}
        .pill{padding:10px 22px;border-radius:100px;font-size:13px;font-weight:600;letter-spacing:.03em;background:transparent;color:rgba(250,248,244,.6);border:1px solid rgba(250,248,244,.2);transition:all .3s var(--ease);}
        .pill:hover{border-color:rgba(250,248,244,.5);color:var(--paper);}
        .pill.active{background:var(--rosso);border-color:var(--rosso);color:#fff;}
        .car-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
        .car{position:relative;background:var(--ink-2);border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,.07);transition:transform .5s var(--ease),border-color .35s;}
        .car:hover{transform:translateY(-7px);border-color:rgba(255,255,255,.18);}
        .car-img{position:relative;height:230px;overflow:hidden;}
        .car-img img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease);}
        .car:hover .car-img img{transform:scale(1.07);}
        .car-img::after{content:'';position:absolute;top:0;bottom:0;left:-80%;width:50%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.16),transparent);transform:skewX(-18deg);transition:left .7s var(--ease);}
        .car:hover .car-img::after{left:130%;}
        .car-tags{position:absolute;top:14px;left:14px;display:flex;gap:7px;z-index:2;}
        .tag{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:5px 11px;border-radius:100px;color:#fff;backdrop-filter:blur(6px);}
        .tag-r{background:rgba(225,24,39,.92);}
        .tag-g{background:rgba(31,164,99,.88);}
        .tag-k{background:rgba(12,14,18,.65);border:1px solid rgba(255,255,255,.25);}
        .car-save{position:absolute;top:12px;right:12px;z-index:2;width:38px;height:38px;border-radius:50%;background:rgba(12,14,18,.5);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;color:#fff;transition:background .25s,transform .25s;}
        .car-save:hover{transform:scale(1.1);background:rgba(12,14,18,.75);}
        .car-save.on{background:var(--rosso);border-color:var(--rosso);}
        .car-save.on svg{fill:#fff;}
        .car-body{padding:22px 22px 24px;}
        .car-meta{display:flex;align-items:center;gap:8px;font-size:11.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--rosso);}
        .car-meta i{font-style:normal;color:rgba(250,248,244,.4);}
        .car-name{font-family:var(--display);font-size:25px;font-weight:500;letter-spacing:-.01em;margin:8px 0 4px;color:var(--paper);line-height:1.08;}
        .car-loc{font-size:13px;color:rgba(250,248,244,.5);font-weight:300;}
        .car-divider{height:1px;background:rgba(255,255,255,.09);margin:18px 0 16px;}
        .car-foot{display:flex;align-items:flex-end;justify-content:space-between;}
        .car-price small{display:block;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(250,248,244,.45);font-weight:600;margin-bottom:2px;}
        .car-price b{font-family:var(--display);font-size:26px;font-weight:600;letter-spacing:-.01em;color:var(--paper);}
        .car-go{width:46px;height:46px;border-radius:50%;border:1.5px solid rgba(250,248,244,.3);display:flex;align-items:center;justify-content:center;color:var(--paper);transition:all .35s var(--ease);}
        .car:hover .car-go{background:var(--rosso);border-color:var(--rosso);transform:rotate(-38deg);}
        .listings-more{text-align:center;margin-top:54px;}
        .ai{position:relative;overflow:hidden;background:#fff;}
        .ai-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;position:relative;z-index:2;}
        .ai-eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--rosso);margin-bottom:20px;}
        .ai-eyebrow::before{content:'';width:32px;height:1.5px;background:var(--rosso);}
        .ai h2{font-family:var(--display);font-size:clamp(36px,4.4vw,56px);font-weight:500;line-height:1.03;letter-spacing:-.018em;margin-bottom:22px;}
        .ai h2 em{font-style:italic;color:var(--rosso);}
        .ai p{color:var(--slate);font-size:16.5px;font-weight:300;max-width:480px;margin-bottom:14px;}
        .ai-points{margin:26px 0 34px;display:flex;flex-direction:column;gap:13px;}
        .ai-point{display:flex;gap:13px;align-items:flex-start;font-size:15px;color:var(--ink-2);}
        .ai-point svg{flex-shrink:0;margin-top:3px;color:var(--rosso);}
        .report{position:relative;background:var(--ink);color:var(--paper);border-radius:24px;padding:30px 30px 26px;box-shadow:0 44px 100px -38px rgba(12,14,18,.6);overflow:hidden;}
        .report::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(460px 220px at 88% -8%,rgba(225,24,39,.38),transparent 70%);}
        .report > *{position:relative;}
        .report-head{display:flex;align-items:center;gap:10px;font-size:11.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(250,248,244,.6);}
        .ai-dot{width:8px;height:8px;border-radius:50%;background:#46E08C;animation:pulse 2.2s infinite;}
        @keyframes pulse{0%{box-shadow:0 0 0 0 rgba(70,224,140,.55)}70%{box-shadow:0 0 0 9px rgba(70,224,140,0)}100%{box-shadow:0 0 0 0 rgba(70,224,140,0)}}
        .report-id{margin-left:auto;font-family:var(--display);font-style:italic;font-size:13px;letter-spacing:.04em;color:rgba(250,248,244,.4);text-transform:none;}
        .report-car{margin:22px 0 0;}
        .report-car b{font-family:var(--display);font-size:24px;font-weight:600;display:block;letter-spacing:-.01em;}
        .report-car span{font-size:13px;color:rgba(250,248,244,.55);}
        .report-price{margin:20px 0 8px;}
        .report-price small{display:block;font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(250,248,244,.5);margin-bottom:5px;}
        .report-price b{font-family:var(--display);font-size:clamp(40px,4.6vw,54px);font-weight:600;letter-spacing:-.02em;line-height:1;display:block;}
        .report-range{margin:24px 0 4px;}
        .range-track{position:relative;height:10px;border-radius:6px;background:rgba(255,255,255,.13);}
        .range-zone{position:absolute;top:0;bottom:0;left:34%;width:36%;border-radius:6px;background:rgba(225,24,39,.5);transform:scaleX(0);transform-origin:left;transition:transform 1s var(--ease-out) .25s;}
        .report.in .range-zone{transform:scaleX(1);}
        .range-marker{position:absolute;top:50%;left:4%;width:22px;height:22px;border-radius:50%;background:var(--paper);border:5.5px solid var(--rosso);transform:translate(-50%,-50%);transition:left 1.5s var(--ease-out) .35s;box-shadow:0 4px 16px rgba(0,0,0,.45);}
        .report.in .range-marker{left:52%;}
        .range-labels{display:flex;justify-content:space-between;font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(250,248,244,.45);margin-top:11px;}
        .report-factors{display:flex;flex-wrap:wrap;gap:8px;margin:22px 0 0;}
        .factor{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;padding:8px 14px;border-radius:100px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);opacity:0;transform:translateY(10px);transition:opacity .55s var(--ease),transform .55s var(--ease);}
        .report.in .factor{opacity:1;transform:none;}
        .report .factor:nth-child(1){transition-delay:.55s;}
        .report .factor:nth-child(2){transition-delay:.72s;}
        .report .factor:nth-child(3){transition-delay:.89s;}
        .factor b{font-weight:800;}
        .factor.up b{color:#46E08C;}
        .factor.down b{color:#FF7A86;}
        .report-verdict{margin-top:24px;padding-top:19px;border-top:1px solid rgba(255,255,255,.11);display:flex;align-items:center;gap:11px;font-size:14.5px;font-weight:500;color:rgba(250,248,244,.75);}
        .report-verdict svg{color:#46E08C;flex-shrink:0;}
        .report-verdict em{font-family:var(--display);font-style:italic;font-weight:500;color:#46E08C;font-size:17.5px;}
        .how{padding:84px 0;}
        .how-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:40px 44px;display:grid;grid-template-columns:auto 1fr;gap:50px;align-items:center;}
        .how-box .sec-index{display:block;margin-bottom:8px;}
        .how-box .sec-title{font-size:clamp(28px,3vw,40px);}
        .how-steps{display:grid;grid-template-columns:repeat(3,1fr);}
        .hstep{display:flex;gap:15px;padding:4px 28px;align-items:flex-start;}
        .hstep:first-child{padding-left:0;}
        .hstep + .hstep{border-left:1px solid var(--line);}
        .hstep b{font-family:var(--display);font-style:italic;font-size:27px;font-weight:500;color:var(--rosso);line-height:1.05;}
        .hstep h4{font-family:var(--display);font-size:19.5px;font-weight:600;margin-bottom:3px;letter-spacing:-.01em;}
        .hstep p{font-size:13.5px;font-weight:300;color:var(--slate);line-height:1.5;}
        .cta-zone{padding:110px 0;}
        .cta{position:relative;border-radius:26px;overflow:hidden;background:var(--ink);padding:90px 70px;color:#fff;}
        .cta-bg{position:absolute;inset:0;}
        .cta-bg img{width:100%;height:100%;object-fit:cover;opacity:.34;}
        .cta-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,rgba(12,14,18,.94) 20%,rgba(163,13,26,.55) 100%);}
        .cta-inner{position:relative;z-index:2;max-width:640px;}
        .cta h2{font-family:var(--display);font-size:clamp(38px,5vw,64px);font-weight:500;line-height:1.0;letter-spacing:-.02em;margin-bottom:22px;}
        .cta h2 em{font-style:italic;color:var(--rosso);}
        .cta p{font-size:17px;font-weight:300;color:rgba(255,255,255,.8);margin-bottom:36px;max-width:480px;}
        .cta-row{display:flex;gap:14px;flex-wrap:wrap;}
        footer.site{background:var(--ink);color:rgba(250,248,244,.7);padding:80px 0 0;}
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
        .rv{opacity:0;transform:translateY(34px);filter:blur(5px);transition:opacity .9s var(--ease),transform .9s var(--ease),filter .9s var(--ease);}
        .rv.in{opacity:1;transform:none;filter:none;}
        @media(max-width:1080px){
          .menu,.nav-actions{display:none;}
          .hamburger{display:flex;}
          .nav-inner{height:72px;padding:0 22px;}
          .brand-logo{height:44px;}
          .mobile-menu{display:flex;flex-direction:column;position:fixed;top:72px;left:0;right:0;height:calc(100dvh - 72px);background:var(--paper);z-index:95;padding:10px 0 30px;overflow-y:auto;opacity:0;transform:translateY(-10px);pointer-events:none;transition:opacity .25s var(--ease),transform .25s var(--ease);}
          .mobile-menu.open{opacity:1;transform:none;pointer-events:auto;}
          .mobile-menu > a{font-family:var(--display);font-size:26px;font-weight:500;padding:19px 26px;border-bottom:1px solid var(--line);color:var(--ink);display:flex;justify-content:space-between;align-items:center;}
          .mobile-menu > a::after{content:'→';font-size:18px;color:var(--rosso);}
          .mobile-foot{padding:24px 26px 0;display:flex;flex-direction:column;gap:18px;}
          body.lock{overflow:hidden;}
          header.nav{background:rgba(250,248,244,.96);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 1px 0 var(--line);}
          .ai-grid{grid-template-columns:1fr;gap:50px;}
          .search-grid{grid-template-columns:1fr 1fr;}
          .s-submit{grid-column:1/-1;}
          .model-grid{grid-template-columns:1fr 1fr;}
          .car-grid{grid-template-columns:1fr 1fr;}
          .how-box{grid-template-columns:1fr;gap:26px;padding:32px 28px;}
          .how-steps{grid-template-columns:1fr;}
          .hstep{padding:14px 0;}
          .hstep + .hstep{border-left:none;border-top:1px solid var(--line);}
          .foot-grid{grid-template-columns:1fr 1fr;}
          .hero-scroll{display:none;}
        }
        @media(max-width:640px){
          section.block{padding:74px 0;}
          .wrap{padding:0 20px;}
          .hero h1{font-size:clamp(44px,12vw,60px);}
          .ghost{display:none;}
          .model-grid{grid-template-columns:1fr 1fr;gap:12px;}
          .car-grid{grid-template-columns:1fr 1fr;gap:13px;}
          .car-img{height:124px;}
          .car-body{padding:13px 13px 15px;}
          .car-name{font-size:16.5px;}
          .car-price b{font-size:18px;}
          .cta{padding:54px 26px;border-radius:18px;}
          .search-grid{grid-template-columns:1fr;}
          .s-submit{grid-column:1;}
        }
        @media(max-width:360px){
          .car-grid,.model-grid{grid-template-columns:1fr;}
        }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Figtree:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <div className="progress" id="progress"></div>

      <header className="nav" id="nav" ref={navRef}>
        <div className="nav-inner">
          <a href="#" aria-label="Rosso Mania"><img className="brand-logo" alt="Rosso Mania" src="https://www.welead.it/rossomania/logo/logo_rn.png" id="logoImg" /></a>
          <nav className="menu">
            <a href="#listings">Vetture in vendita</a>
            <a href="#models">Schede ufficiali</a>
            <a href="#ai">Valutazione AI</a>
            <a href="#come-funziona">Come funziona</a>
            <a href="#magazine">Magazine</a>
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
        <a href="#listings">Vetture in vendita</a>
        <a href="#models">Schede ufficiali</a>
        <a href="#ai">Valutazione AI</a>
        <a href="#come-funziona">Come funziona</a>
        <a href="#magazine">Magazine</a>
        <div className="mobile-foot">
          <div className="lang-switch"><a href="#" className="active">IT</a><span>/</span><a href="#">EN</a></div>
          <a href="#" className="nav-login">Accedi</a>
          <button className="btn btn-rosso" style={{justifyContent:'center',padding:'15px'}}>Vendi la tua Ferrari</button>
        </div>
      </div>

      <section className="hero" id="hero" ref={heroRef}>
        <div className="hero-slides" id="heroSlides">
          <img className="hero-slide active" src="https://www.welead.it/rossomania/img/foto1.jpeg" alt="" />
          <img className="hero-slide" src="https://www.welead.it/rossomania/img/foto2.jpeg" alt="" />
          <img className="hero-slide" src="https://www.welead.it/rossomania/img/foto3.jpeg" alt="" />
        </div>
        <div className="hero-veil"></div>
        <div className="wrap hero-content" id="heroContent">
          <div className="hero-kicker">Il marketplace delle Ferrari d&apos;epoca</div>
          <h1>
            <span className="line"><span>La passione</span></span>
            <span className="line"><span>ha un <em>colore.</em></span></span>
          </h1>
          <p className="hero-sub">Vetture certificate, schede ufficiali dei modelli e valutazione AI. Il punto d&apos;incontro tra collezionisti, in italiano e inglese.</p>
          <div className="hero-cta">
            <a href="#listings" className="btn btn-rosso" style={{padding:'15px 32px'}}>Esplora le vetture</a>
            <a href="#ai" className="btn btn-light" style={{padding:'15px 32px'}}>Valuta la tua Ferrari</a>
          </div>
          <div className="hero-meta">
            <div className="hero-count"><b id="slideNow">01</b> / 03</div>
            <div className="hero-bars" id="heroBars">
              <button className="hero-bar active" aria-label="Foto 1"><i></i></button>
              <button className="hero-bar" aria-label="Foto 2"><i></i></button>
              <button className="hero-bar" aria-label="Foto 3"><i></i></button>
            </div>
          </div>
        </div>
        <div className="hero-scroll">Scorri</div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>Testarossa</span><span>250 GT</span><span>Dino 246</span><span>F40</span><span>365 Daytona</span><span>308 GTB</span><span>288 GTO</span><span>512 BB</span><span>328 GTS</span><span>275 GTB</span>
          <span>Testarossa</span><span>250 GT</span><span>Dino 246</span><span>F40</span><span>365 Daytona</span><span>308 GTB</span><span>288 GTO</span><span>512 BB</span><span>328 GTS</span><span>275 GTB</span>
        </div>
      </div>

      <div className="search-zone">
        <div className="wrap">
          <div className="search-card rv">
            <div className="search-head">
              <h3>Trova la tua <em>Ferrari</em></h3>
              <span>Ricerca tra le vetture in vendita</span>
            </div>
            <div className="search-grid">
              <div className="sfield"><label>Modello</label><select><option>Tutti i modelli</option><option>Testarossa</option><option>308 GTB</option><option>Dino 246 GT</option><option>365 GTB/4 Daytona</option><option>250 GT</option><option>F40</option></select></div>
              <div className="sfield"><label>Anno (da)</label><select><option>Indifferente</option><option>1950</option><option>1960</option><option>1970</option><option>1980</option><option>1990</option></select></div>
              <div className="sfield"><label>Prezzo max</label><select><option>Indifferente</option><option>€ 100.000</option><option>€ 250.000</option><option>€ 500.000</option><option>€ 1.000.000+</option></select></div>
              <div className="sfield"><label>Paese</label><select><option>Tutti i paesi</option><option>Italia</option><option>Germania</option><option>Regno Unito</option><option>Svizzera</option><option>USA</option></select></div>
              <div className="s-submit"><button className="btn btn-rosso"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Cerca</button></div>
            </div>
          </div>
        </div>
      </div>

      <section className="block models" id="models">
        <div className="ghost">01</div>
        <div className="wrap">
          <div className="sec-label rv">
            <span className="sec-index">(01)</span>
            <div>
              <h2 className="sec-title">Schede <em>ufficiali</em><br />dei modelli</h2>
              <p className="sec-sub">Storia, varianti, dati tecnici e guida all&apos;acquisto. Ogni annuncio è collegato alla scheda editoriale del suo modello.</p>
            </div>
            <a href="#" className="sec-side btn btn-outline">Tutte le schede</a>
          </div>
          <div className="model-grid">
            {[
              {years:'1984 — 1996',name:'Testarossa',desc:"L'icona degli anni '80. Dodici cilindri boxer e le indimenticabili branchie laterali."},
              {years:'1969 — 1974',name:'Dino 246 GT',desc:'La piccola di Maranello dedicata ad Alfredo Ferrari. Equilibrio e linea senza tempo.'},
              {years:'1987 — 1992',name:'F40',desc:"L'ultima Ferrari voluta da Enzo. Pura, brutale, definitiva. Il mito dei miti."},
              {years:'1975 — 1985',name:'308 GTB / GTS',desc:"La V8 che ha definito un'epoca, tra cinema e collezionismo internazionale."},
              {years:'1968 — 1973',name:'365 Daytona',desc:'Il gran turismo definitivo. V12 anteriore e 280 km/h nel 1968.'},
            ].map((m,i) => (
              <div className="model-card rv" key={i}>
                <div className="model-years">{m.years}</div>
                <h3 className="model-name">{m.name}</h3>
                <p className="model-desc">{m.desc}</p>
                <a href="#" className="model-cta">Scopri la scheda <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
              </div>
            ))}
            <div className="model-card all rv">
              <h3 className="model-name">Tutti i modelli</h3>
              <p className="model-desc" style={{color:'rgba(250,248,244,.6)'}}>L&apos;archivio completo delle Ferrari d&apos;epoca, da sfogliare per serie e decennio.</p>
              <a href="#" className="model-cta">Vai all&apos;archivio <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
            </div>
          </div>
        </div>
      </section>

      <section className="block listings" id="listings">
        <div className="ghost">02</div>
        <div className="wrap">
          <div className="sec-label rv">
            <span className="sec-index">(02)</span>
            <div><h2 className="sec-title">Vetture <em>in vendita</em></h2></div>
          </div>
          <div className="filter-pills rv">
            <button className="pill active">In evidenza</button>
            <button className="pill">Più recenti</button>
            <button className="pill">Più viste</button>
          </div>
          <div className="car-grid">
            {[
              {img:'https://images.unsplash.com/photo-1696433919026-7da23fbf8707?auto=format&fit=crop&w=720&q=72',tags:[{c:'tag-r',t:'In evidenza'},{c:'tag-g',t:'Classiche'}],year:'1989',km:'42.000 km',engine:'V12',name:'Testarossa',loc:'Modena, Italia — Storico verificato',price:'€ 145.000'},
              {img:'https://images.unsplash.com/photo-1658905097696-ec44846c3c3c?auto=format&fit=crop&w=720&q=72',tags:[{c:'tag-r',t:'In evidenza'},{c:'tag-k',t:'Dealer'}],year:'1972',km:'68.500 km',engine:'V6',name:'Dino 246 GT',loc:'Stuttgart, Germania — Conservata',price:'€ 385.000'},
              {img:'https://images.unsplash.com/photo-1752253509655-112f2abab03c?auto=format&fit=crop&w=720&q=72',tags:[{c:'tag-g',t:'ASI · FIVA'}],year:'1971',km:'54.200 km',engine:'V12',name:'365 GTB/4 Daytona',loc:'Londra, Regno Unito — Restaurata',price:'€ 720.000'},
              {img:'https://images.unsplash.com/photo-1690998199897-c32c0798a456?auto=format&fit=crop&w=720&q=72',tags:[{c:'tag-g',t:'Classiche'}],year:'1990',km:'18.900 km',engine:'V8 Turbo',name:'F40',loc:'Zurigo, Svizzera — Storico verificato',price:'€ 2.400.000'},
              {img:'https://images.unsplash.com/photo-1758620328615-2815f2689169?auto=format&fit=crop&w=720&q=72',tags:[{c:'tag-k',t:'Dealer'}],year:'1982',km:'89.000 km',engine:'V8',name:'308 GTS',loc:'Torino, Italia — Conservata',price:'€ 78.000'},
              {img:'https://images.unsplash.com/photo-1716265816511-3693aeac2b60?auto=format&fit=crop&w=720&q=72',tags:[{c:'tag-r',t:'In evidenza'}],year:'1963',km:'61.000 km',engine:'V12',name:'250 GT Lusso',loc:'Maranello, Italia — Restaurata',price:'€ 1.850.000'},
            ].map((car,i) => (
              <article className="car rv" key={i}>
                <div className="car-img">
                  <img src={car.img} alt={car.name} />
                  <div className="car-tags">{car.tags.map((t,j) => <span key={j} className={`tag ${t.c}`}>{t.t}</span>)}</div>
                  <button className="car-save" onClick={e => (e.currentTarget as HTMLButtonElement).classList.toggle('on')} aria-label="Salva">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>
                  </button>
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
          <div className="listings-more rv">
            <a href="#" className="btn btn-light" style={{padding:'15px 34px'}}>Vedi tutte le vetture</a>
          </div>
        </div>
      </section>

      <section className="block ai" id="ai">
        <div className="ghost">03</div>
        <div className="wrap">
          <div className="ai-grid">
            <div className="rv">
              <div className="ai-eyebrow">Esclusiva Rosso Mania</div>
              <h2>Il prezzo giusto?<br />Lo dice <em>il mercato.</em></h2>
              <p>Inserisci le variabili della tua vettura — originalità, carrozzeria, interni, manutenzione, certificazioni — e l&apos;intelligenza artificiale le confronta con le quotazioni reali del mercato.</p>
              <p>In pochi minuti sai se il prezzo a cui vuoi vendere o comprare una Ferrari è coerente, ottimista o un&apos;occasione.</p>
              <div className="ai-points">
                <div className="ai-point"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="20 6 9 17 4 12"/></svg> Fascia di valore con prezzo target consigliato</div>
                <div className="ai-point"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="20 6 9 17 4 12"/></svg> Analisi dei fattori che alzano o abbassano il valore</div>
                <div className="ai-point"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="20 6 9 17 4 12"/></svg> Report esportabile in PDF e condivisibile</div>
              </div>
              <a href="#" className="btn btn-ink" style={{padding:'15px 32px'}}>Valuta ora la tua vettura</a>
            </div>
            <div className="report rv" id="aiReport">
              <div className="report-head"><span className="ai-dot"></span> Report di valutazione AI <span className="report-id">#RM-0274</span></div>
              <div className="report-car"><b>Ferrari Testarossa</b><span>1989 · 42.000 km · Ferrari Classiche · Modena, IT</span></div>
              <div className="report-price"><small>Prezzo target consigliato</small><b id="aiPrice">€ 145.000</b></div>
              <div className="report-range">
                <div className="range-track"><div className="range-zone"></div><div className="range-marker"></div></div>
                <div className="range-labels"><span>Sotto mercato</span><span>In linea</span><span>Premium</span></div>
              </div>
              <div className="report-factors">
                <span className="factor up">Ferrari Classiche <b>+9%</b></span>
                <span className="factor up">Matching numbers <b>+6%</b></span>
                <span className="factor down">Riverniciatura parziale <b>−4%</b></span>
              </div>
              <div className="report-verdict">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><circle cx="12" cy="12" r="10"/><polyline points="8 12.5 11 15.5 16 9.5"/></svg>
                Il prezzo richiesto è <em>in linea col mercato</em>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="block how" id="come-funziona">
        <div className="wrap">
          <div className="how-box rv">
            <div>
              <span className="sec-index">(04)</span>
              <h2 className="sec-title">Come<br /><em>funziona</em></h2>
            </div>
            <div className="how-steps">
              <div className="hstep"><b>01</b><div><h4>Cerca</h4><p>Filtra le vetture per modello, anno, prezzo e certificazioni.</p></div></div>
              <div className="hstep"><b>02</b><div><h4>Valuta</h4><p>L&apos;AI ti dice se il prezzo è coerente col mercato.</p></div></div>
              <div className="hstep"><b>03</b><div><h4>Contatta</h4><p>Tratti direttamente con il venditore, senza intermediari.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="cta-zone">
        <div className="wrap">
          <div className="cta rv">
            <div className="cta-bg"><img src="https://images.unsplash.com/photo-1690998199897-c32c0798a456?auto=format&fit=crop&w=1500&q=70" alt="" /></div>
            <div className="cta-inner">
              <h2>Hai una Ferrari<br />da <em>vendere?</em></h2>
              <p>Pubblica il tuo annuncio con il wizard guidato e raggiungi collezionisti qualificati in tutta Europa. Registrazione gratuita.</p>
              <div className="cta-row">
                <a href="#" className="btn btn-rosso" style={{padding:'16px 34px'}}>Pubblica un annuncio</a>
                <a href="#" className="btn btn-light" style={{padding:'16px 34px'}}>Scopri i vantaggi</a>
              </div>
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
              <div className="foot-social">
                <a href="#" aria-label="Facebook"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>
                <a href="#" aria-label="Instagram"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
                <a href="#" aria-label="YouTube"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 6.4a2.8 2.8 0 00-2-2C18.8 4 12 4 12 4s-6.8 0-8.5.4a2.8 2.8 0 00-2 2A29 29 0 001 12a29 29 0 00.5 5.6 2.8 2.8 0 002 2C5.2 20 12 20 12 20s6.8 0 8.5-.4a2.8 2.8 0 002-2A29 29 0 0023 12a29 29 0 00-.5-5.6zM10 15V9l5 3z"/></svg></a>
              </div>
            </div>
            <div className="foot-col">
              <h5>Esplora</h5>
              <a href="#listings">Vetture in vendita</a>
              <a href="#models">Schede ufficiali</a>
              <a href="#ai">Valutazione AI</a>
              <a href="#magazine">Magazine</a>
            </div>
            <div className="foot-col">
              <h5>Vendi</h5>
              <a href="#">Pubblica un annuncio</a>
              <a href="#come-funziona">Come funziona</a>
              <a href="#">Registrati</a>
              <a href="#">Accedi</a>
            </div>
            <div className="foot-col">
              <h5>Rosso Mania</h5>
              <a href="#">Chi siamo</a>
              <a href="#">Contatti</a>
              <a href="#">Privacy policy</a>
              <a href="#">Termini di utilizzo</a>
            </div>
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
