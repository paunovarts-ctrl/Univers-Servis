(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const COMPANY={name:'Univers Servis Poreč',addr:'Tarska ul. 26-22, 52440 POREČ (PARENZO)',phone:'+385 98 335 031',email:'uservis@net.hr'};
const REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
/* which side of the wall each line of the works schedule belongs to, and how
   kind each month is to a facade; both are facts, not copy, so they live here */
const WHERE=['in','in','both','both','in','in','out','both','both','both','out'];
const SEASON=[['no','ok','best','best','best','best','ok','ok','best','best','ok','no'],Array(12).fill('best')];
const LANGS=['hr','en','de','it'];
let current='hr';

/* ── intro ─────────────────────────────────────────────────────────────
   The mark draws itself, the wordmark lands, and the page starts revealing
   underneath while the overlay dissolves, so the handover is one motion. */
let readyDone=false;
function ready(){
  if(readyDone)return; readyDone=true; window.__ready=true;
  ['.hero-top','#heroH1','.hero-side'].forEach((s,i)=>{const el=$(s);if(el)setTimeout(()=>el.classList.add('in'),REDUCE?0:i*90);});
  /* looked up when it fires: on a repeat visit this runs before the stage code below has loaded */
  setTimeout(()=>{if(window.__stage)window.__stage();},REDUCE?0:260);
}
(function(){
  const intro=$('#intro'),body=document.body;
  if(!intro){ready();return;}
  let done=false;
  function finish(){
    if(done)return; done=true;
    intro.classList.add('gone'); body.classList.remove('intro-on'); ready();
    setTimeout(()=>{if(intro.parentNode)intro.remove();},620);
  }
  /* a returning visitor in the same tab has already watched it once */
  let seen=false; try{seen=sessionStorage.getItem('us-intro')==='1';sessionStorage.setItem('us-intro','1');}catch(e){}
  if(REDUCE||seen){intro.remove();ready();return;}
  body.classList.add('intro-on');
  intro.querySelectorAll('.intro-mark path').forEach(el=>el.style.setProperty('--len',Math.ceil(el.getTotalLength())));
  intro.addEventListener('click',finish);
  setTimeout(finish,1500);
  setTimeout(finish,3200);
})();

/* ── nav: hide on the way down (desktop only), progress, current section ─ */
const nav=$('#nav'),progress=$('.progress'),hero=$('#top'),stage=$('#stage');
const cssProgress=window.CSS&&CSS.supports&&CSS.supports('animation-timeline: scroll()');
let lastY=0,ticking=false;
/* over the hero photograph the bar is clear with light type; past it, plaster */
function navState(){
  /* only while the stage is pinned: once it starts to leave, the bar turns solid so the hero's own buttons never slide under clear type */
  const y=scrollY,over=!!stage&&!nav.classList.contains('solid')&&y<hero.offsetTop+hero.offsetHeight-stage.offsetHeight+2;
  nav.classList.toggle('over',over);
  nav.classList.toggle('scrolled',y>24&&!over);
}
function onScroll(){
  const y=scrollY;
  navState();
  if(y>160&&y>lastY){nav.classList.add('nav-hidden');closeAll();} else nav.classList.remove('nav-hidden');
  lastY=y; ticking=false;
  if(!cssProgress&&progress){const h=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(h>0?y/h:0)+')';}
  parallax();
}
/* photographs drift a little slower than the page */
const PX=$$('[data-px]');
function parallax(){
  if(REDUCE)return;
  const vh=innerHeight,rs=PX.map(f=>f.getBoundingClientRect());
  PX.forEach((f,i)=>{const r=rs[i];if(r.bottom<-80||r.top>vh+80)return;
    const c=Math.max(-1,Math.min(1,(r.top+r.height/2-vh/2)/(vh/2+r.height/2)));
    f.style.setProperty('--py',(-c*r.height*.06).toFixed(1)+'px');});
}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(onScroll);ticking=true;}},{passive:true});
const navLinks=$$('.nav-links a[data-nav]');
const secIO=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  navLinks.forEach(a=>a.setAttribute('aria-current',a.dataset.nav===e.target.id?'true':'false'));
}),{rootMargin:'-45% 0px -50% 0px'});
['top','branches','services','process','area','faq','contact','careers'].forEach(id=>{const s=document.getElementById(id);if(s)secIO.observe(s);});

/* ── words rise out of their own line ──────────────────────────────── */
function splitWords(root){
  if(!root||root.querySelector('.w'))return;
  let i=0;
  (function walk(n){
    [...n.childNodes].forEach(c=>{
      if(c.nodeType===3){
        const frag=document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(p=>{
          if(!p)return;
          if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(p));return;}
          const w=document.createElement('span');w.className='w';w.style.setProperty('--i',i++);
          const s=document.createElement('span');s.textContent=p;w.appendChild(s);frag.appendChild(w);
        });
        c.replaceWith(frag);
      }else if(c.nodeType===1)walk(c);
    });
  })(root);
}
const splitAll=()=>$$('[data-split]').forEach(splitWords);

/* ── reveal on scroll ──────────────────────────────────────────────── */
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('in'); io.unobserve(e.target);
  if(e.target.id==='logBox')playLog();
}),{rootMargin:'0px 0px -10% 0px',threshold:0.01});
function observeAll(){
  $$('[data-stagger]').forEach(g=>[...g.children].forEach((c,i)=>{if(!c.style.getPropertyValue('--i'))c.style.setProperty('--i',i);}));
  $$('[data-reveal],[data-split]:not([data-hero]),[data-stagger],.io').forEach(el=>{if(!el.classList.contains('in'))io.observe(el);});
}

/* the sample work log arrives one message at a time, like it would */
let logPlayed=false;
function playLog(){
  if(logPlayed)return; logPlayed=true;
  $$('#log .log-item').forEach((li,i)=>setTimeout(()=>li.classList.add('on'),REDUCE?0:350+i*650));
}

/* ── hero stage: the scroll rolls the finished room in over the old one ──
   An opening pass paints the first strip on its own, so the idea reads before
   anyone scrolls; from there the scroll position drives it, eased so a wheel's
   steps arrive as one smooth stroke. */
const P0=.16;
let stF=REDUCE?.5:0,stIntro=REDUCE?1:0,stT0=0,stRaf=0,stLast=0;
function stTick(now){
  stRaf=0;
  const span=Math.max(1,hero.offsetHeight-stage.offsetHeight),t=Math.min(1,Math.max(0,-hero.getBoundingClientRect().top/span));
  if(stT0){const k=Math.min(1,(now-stT0)/1100);stIntro=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;}
  const start=P0*stIntro,target=start+(1-start)*t;
  const dt=stLast?Math.min(64,now-stLast):16.7; stLast=now;
  stF+=(target-stF)*(1-Math.pow(.82,dt/16.7));
  if(Math.abs(target-stF)<.0004)stF=target;
  stage.style.setProperty('--f',stF.toFixed(4));
  stage.classList.toggle('moved',stF>P0+.05);
  stage.classList.toggle('done',stF>.97);
  if(stF!==target||(stT0&&stIntro<1))stRaf=requestAnimationFrame(stTick); else stLast=0;
}
function stKick(){if(stage&&!REDUCE&&!stRaf)stRaf=requestAnimationFrame(stTick);}
if(stage){
  stage.style.setProperty('--f',String(stF));
  if(REDUCE)stage.classList.add('moved');
  addEventListener('scroll',stKick,{passive:true});
  addEventListener('resize',stKick);
}
window.__stage=()=>{
  if(!stage||REDUCE||stT0)return;
  stT0=performance.now();stKick();
  setTimeout(()=>stage.classList.add('ready'),700);
};

/* ── lists: built in Croatian by the build, relabelled in place ────── */
function relabel(t){
  $$('#facts li span').forEach((s,i)=>{if(t.facts[i]!=null)s.textContent=t.facts[i];});
  [['#br1Tags',t.br1_tags],['#br2Tags',t.br2_tags]].forEach(([id,arr])=>$$(id+' li').forEach((li,i)=>{if(arr[i]!=null)li.textContent=arr[i];}));
  $$('#spec .spec-row:not(.spec-head)').forEach((r,i)=>{const s=t.svc[i];if(!s)return;
    $('.nm',r).textContent=s.n;$('.ds',r).textContent=s.d;$('.wh-chip',r).textContent=t['where_'+WHERE[i]];});
  $$('#steps .step').forEach((li,i)=>{const s=t.steps[i];if(!s)return;$('h3',li).textContent=s.h;$('p',li).textContent=s.p;});
  $$('#awList li span').forEach((s,i)=>{if(t.aw_list[i]!=null)s.textContent=t.aw_list[i];});
  $$('#log .log-item').forEach((li,i)=>{const s=t.log[i];if(!s)return;$('time',li).textContent=s.t;$('.m',li).textContent=s.m;});
  $$('#towns li').forEach((li,i)=>{$('.tn',li).textContent=t.towns[i];const b=$('.mono',li);if(b)b.textContent=t.base_tag;});
  $$('#cal .lbl').forEach((l,i)=>{l.textContent=t.season_rows[i];});
  $$('#faqList details').forEach((d,i)=>{const s=t.faq[i];if(!s)return;$('.faq-q',d).textContent=s.q;$('.faq-a',d).textContent=s.a;});
  $$('#jobRoles li').forEach((li,i)=>{const r=t.job_roles[i];if(!r)return;$('b',li).textContent=r.n;$('span',li).textContent=r.d;});
  const sel=$('#jobRole'),keep=sel.selectedIndex;
  t.job_roles.forEach((r,i)=>{sel.options[i].textContent=r.n;sel.options[i].value=r.n;});
  const last=sel.options[t.job_roles.length];last.textContent=t.job_other;last.value=t.job_other;
  sel.selectedIndex=keep<0?0:keep;
}
function applyLang(t){
  $$('[data-i18n]').forEach(el=>{const v=t[el.dataset.i18n];if(v!=null&&typeof v==='string')el.innerHTML=v;});
  $$('[data-i18n-alt]').forEach(el=>{const v=t[el.dataset.i18nAlt];if(v!=null)el.alt=v;});
  $$('[data-i18n-aria]').forEach(el=>{const v=t[el.dataset.i18nAria];if(v!=null)el.setAttribute('aria-label',v);});
  relabel(t); splitAll();
  /* anything already on screen keeps showing; only unseen sections animate */
  $$('[data-split]').forEach(el=>{if(el.dataset.seen)el.classList.add('in');});
  cvRender(); phRender();
}

/* ── SEO: one URL per language, head and structured data kept in step ─ */
const SEO_URL='https://www.universservisporec.com/';
const OG_LOCALE={hr:'hr_HR',en:'en_GB',de:'de_DE',it:'it_IT'};
const langPath=l=>location.pathname+(l==='hr'?'':'?lang='+l);
function applySeo(lang){
  const t=I18N[lang],url=SEO_URL+(lang==='hr'?'':'?lang='+lang);
  document.title=t.seo_title;
  const set=(sel,attr,val)=>{const el=$(sel);if(el)el.setAttribute(attr,val);};
  set('meta[name="description"]','content',t.seo_desc);
  set('link[rel="canonical"]','href',url);
  set('meta[property="og:title"]','content',t.seo_title);
  set('meta[property="og:description"]','content',t.seo_desc);
  set('meta[property="og:url"]','content',url);
  set('meta[property="og:locale"]','content',OG_LOCALE[lang]);
  set('meta[name="twitter:title"]','content',t.seo_title);
  set('meta[name="twitter:description"]','content',t.seo_desc);
  const ld=$('#ld-faq');
  if(ld)ld.textContent=JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',inLanguage:lang,
    mainEntity:t.faq.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))});
  if(!/[?&](sent|applied)=1/.test(location.search)){
    const want=langPath(lang)+location.hash;
    if(location.pathname+location.search+location.hash!==want)history.replaceState(null,'',want);
  }
}
const fadeEls=()=>[$('main'),$('.nav-links'),$('.nav-cta'),$('.sheet'),$('.foot')].filter(Boolean);
function setLang(lang,instant){
  const t=I18N[lang]; if(!t||(lang===current&&!instant))return; current=lang;
  document.documentElement.lang=lang;
  applySeo(lang);
  $$('[data-l]').forEach(a=>{if(a.closest('.lang-menu'))a.setAttribute('aria-current',a.dataset.l===lang?'true':'false');});
  $('#langCode').textContent=lang.toUpperCase();
  if(instant||REDUCE){applyLang(t);return;}
  const els=fadeEls(); els.forEach(el=>{el.style.transition='opacity 200ms ease';el.style.opacity='0';});
  setTimeout(()=>{applyLang(t);requestAnimationFrame(()=>els.forEach(el=>{el.style.opacity='';}));setTimeout(()=>els.forEach(el=>el.style.transition=''),260);},210);
}

/* ── menus ─────────────────────────────────────────────────────────── */
const langWrap=$('#lang'),langTrigger=$('#langTrigger'),burger=$('#burger'),sheet=$('#sheet');
function setSheet(open){sheet.classList.toggle('open',open);burger.classList.toggle('open',open);burger.setAttribute('aria-expanded',String(open));nav.classList.toggle('solid',open);navState();}
function setLangMenu(open){langWrap.classList.toggle('open',open);langTrigger.setAttribute('aria-expanded',String(open));}
function closeAll(){setSheet(false);setLangMenu(false);}
langTrigger.addEventListener('click',e=>{e.stopPropagation();setSheet(false);setLangMenu(!langWrap.classList.contains('open'));});
burger.addEventListener('click',e=>{e.stopPropagation();setLangMenu(false);setSheet(!sheet.classList.contains('open'));});
$$('#sheet a').forEach(a=>a.addEventListener('click',()=>setSheet(false)));
document.addEventListener('click',e=>{
  if(!langWrap.contains(e.target))setLangMenu(false);
  if(!sheet.contains(e.target)&&!burger.contains(e.target))setSheet(false);
});
addEventListener('keydown',e=>{if(e.key==='Escape')closeAll();});
/* the language links are real links (crawlable, shareable); with scripting
   on they switch in place instead of reloading */
$$('[data-l]').forEach(a=>a.addEventListener('click',e=>{
  if(e.metaKey||e.ctrlKey||e.shiftKey||e.button===1)return;
  e.preventDefault(); setLang(a.dataset.l); setLangMenu(false);
  if(a.closest('.foot'))scrollTo({top:0,behavior:REDUCE?'auto':'smooth'});
}));

/* ── phone numbers: a desk copies, a phone dials ───────────────────── */
const toast=$('#toast'),toastText=$('#toastText');let toastTimer=0;
function showToast(msg){toastText.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1800);}
function copyText(s){
  if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(s);
  return new Promise(res=>{const ta=document.createElement('textarea');ta.value=s;ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(_){}ta.remove();res();});
}
$$('.copy-num').forEach(el=>el.addEventListener('click',e=>{
  if(!FINE)return;
  e.preventDefault();
  const done=()=>{el.classList.add('copied');setTimeout(()=>el.classList.remove('copied'),900);showToast(I18N[current].copied_toast);};
  copyText(el.dataset.num).then(done,done);
}));

/* ── photo attachments ─────────────────────────────────────────────── */
const PH_MAX=8,PH_BUDGET=8*1024*1024,PH_EDGE=1600,PH_Q=.82;
const phDrop=$('#phDrop'),phInput=$('#phInput'),phGrid=$('#phGrid'),phMeta=$('#phMeta');
let photos=[];
const phSize=n=>n<1048576?Math.round(n/1024)+' KB':(n/1048576).toFixed(1)+' MB';
const phTotal=()=>photos.reduce((s,p)=>s+p.blob.size,0);
/* phone photos are 3-8MB each; FormSubmit caps a submission at 10MB, so shrink before queueing */
function shrink(file){
  return new Promise(res=>{
    const url=URL.createObjectURL(file),img=new Image();
    img.onload=()=>{
      let w=img.naturalWidth,h=img.naturalHeight;const k=Math.min(1,PH_EDGE/Math.max(w,h));
      w=Math.max(1,Math.round(w*k));h=Math.max(1,Math.round(h*k));
      const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);
      c.toBlob(b=>{URL.revokeObjectURL(url);res(b&&b.size<file.size?b:file);},'image/jpeg',PH_Q);
    };
    /* HEIC and anything the canvas cannot decode goes through at its original size */
    img.onerror=()=>{URL.revokeObjectURL(url);res(file);};
    img.src=url;
  });
}
function phRender(){
  const t=I18N[current]; phGrid.innerHTML='';
  photos.forEach((p,i)=>{
    const d=document.createElement('div');d.className='ph-thumb';
    const im=document.createElement('img');im.src=p.url;im.alt='';
    const x=document.createElement('button');x.type='button';x.className='ph-x';x.innerHTML='&times;';
    x.title=t.photos_remove;x.setAttribute('aria-label',t.photos_remove);
    x.addEventListener('click',e=>{e.stopPropagation();URL.revokeObjectURL(p.url);photos.splice(i,1);phRender();});
    d.append(im,x);phGrid.appendChild(d);
  });
  const tot=phTotal(),over=tot>PH_BUDGET;
  phMeta.classList.toggle('warn',over);
  phMeta.textContent=photos.length?(over?t.photos_too_big:t.photos_selected+' '+photos.length+' · '+phSize(tot)):'';
}
async function phAdd(files){
  const t=I18N[current];
  let list=[...files].filter(f=>/^image\//.test(f.type)||/\.(jpe?g|png|webp|heic|heif)$/i.test(f.name));
  if(photos.length+list.length>PH_MAX)list=list.slice(0,Math.max(0,PH_MAX-photos.length));
  if(!list.length){phMeta.classList.add('warn');phMeta.textContent=t.photos_too_many;return;}
  phMeta.classList.remove('warn');phMeta.textContent=t.photos_preparing;
  for(const f of list){const blob=await shrink(f);const name=blob===f?(f.name||'photo.jpg'):(f.name||'photo').replace(/\.[^.]+$/,'')+'.jpg';photos.push({blob,name,url:URL.createObjectURL(blob)});}
  phRender();
}
function wireDrop(drop,input,onFiles){
  drop.addEventListener('click',()=>input.click());
  drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();input.click();}});
  ['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('over');}));
  ['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('over');}));
  drop.addEventListener('drop',e=>{if(e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files.length)onFiles(e.dataTransfer.files);});
}
wireDrop(phDrop,phInput,phAdd);
phInput.addEventListener('change',()=>{phAdd(phInput.files);phInput.value='';});

/* FormSubmit's ajax endpoint accepts a multipart body, replies 200, and silently
   drops the files. Attachments only survive the plain endpoint as a real form post,
   with the first file field named 'attachment' per its convention. That navigates
   away, so _next brings the visitor back here. */
function fsPostForm(fields,files){
  const f=document.createElement('form');
  f.method='POST';f.action='https://formsubmit.co/'+COMPANY.email;f.enctype='multipart/form-data';f.style.display='none';
  Object.keys(fields).forEach(k=>{const i=document.createElement('input');i.type='hidden';i.name=k;i.value=fields[k];f.appendChild(i);});
  files.forEach((p,i)=>{
    const inp=document.createElement('input');inp.type='file';inp.name=i?'attachment'+(i+1):'attachment';
    const dt=new DataTransfer();dt.items.add(new File([p.blob],p.name,{type:p.blob.type||'application/octet-stream'}));
    inp.files=dt.files;f.appendChild(inp);
  });
  document.body.appendChild(f);f.submit();
}
const back=kind=>location.origin+location.pathname+'?'+kind+'=1'+(current==='hr'?'':'&lang='+current);
async function ajaxSend(fields){
  const r=await fetch('https://formsubmit.co/ajax/'+COMPANY.email,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(fields)});
  if(!r.ok)throw new Error('send');await r.json();
}
const mailto=(subject,body)=>{location.href='mailto:'+COMPANY.email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);};

const sendBtn=$('#sendBtn'),sendSpan=$('span',sendBtn),cfNote=$('#cfNote');
$('#quoteForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const t=I18N[current],v=id=>document.getElementById(id).value.trim();
  const name=v('fName'),email=v('fEmail'),phone=v('fPhone'),msg=v('fMsg');
  if(!name||(!email&&!phone)){cfNote.textContent=t.req_need;cfNote.classList.remove('ok');$('#fName').focus();return;}
  if(phTotal()>PH_BUDGET){phRender();phDrop.scrollIntoView({behavior:'smooth',block:'center'});return;}
  const subject=t.req_subject+' · '+name;
  const body=t.req_subject+' · '+COMPANY.name+'\n'+t.req_date+': '+new Date().toLocaleDateString(current)+'\n\n'+
    t.form_name_l+': '+name+'\n'+t.ci_email+': '+(email||'-')+'\n'+t.ci_phone+': '+(phone||'-')+'\n\n'+
    (msg?(t.form_msg_l+': '+msg+'\n'):'')+(photos.length?(t.photos_count+': '+photos.length+'\n'):'');
  const fields={name,email:email||'-',phone:phone||'-',message:msg,_subject:subject,_template:'table',_captcha:'false'};
  sendBtn.disabled=true;sendSpan.textContent=t.sending;
  if(photos.length){
    fields.photos=String(photos.length);fields._next=back('sent');
    try{fsPostForm(fields,photos);return;}
    catch(_){cfNote.textContent=t.send_err_photos;mailto(subject,body);sendBtn.disabled=false;sendSpan.textContent=t.btn_send;return;}
  }
  try{await ajaxSend(fields);sendSpan.textContent='✓';cfNote.textContent=t.sent_ok;cfNote.classList.add('ok');}
  catch(_){cfNote.textContent=t.send_err;mailto(subject,body);sendBtn.disabled=false;sendSpan.textContent=t.btn_send;}
});

/* ── careers ───────────────────────────────────────────────────────── */
const CV_MAX=6*1024*1024;
const cvDrop=$('#cvDrop'),cvInput=$('#cvInput'),cvMeta=$('#cvMeta');
let cvFile=null;
function cvRender(){
  const t=I18N[current]; cvMeta.textContent='';cvMeta.classList.remove('warn');
  if(!cvFile)return;
  if(cvFile.size>CV_MAX){cvMeta.classList.add('warn');cvMeta.textContent=t.job_cv_big;return;}
  const s=document.createElement('span');s.textContent=cvFile.name+' · '+phSize(cvFile.size);
  const x=document.createElement('button');x.type='button';x.className='cv-x';x.innerHTML='&times;';
  x.title=t.photos_remove;x.setAttribute('aria-label',t.photos_remove);
  x.addEventListener('click',()=>{cvFile=null;cvRender();});
  cvMeta.append(s,x);
}
wireDrop(cvDrop,cvInput,files=>{cvFile=files[0];cvRender();});
cvInput.addEventListener('change',()=>{cvFile=cvInput.files[0]||null;cvInput.value='';cvRender();});
const jobBtn=$('#jobSend'),jobSpan=$('span',jobBtn),jobNote=$('#jobNote');
$('#jobForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const t=I18N[current],v=id=>document.getElementById(id).value.trim();
  const name=v('jName'),phone=v('jPhone'),email=v('jEmail'),msg=v('jMsg'),role=$('#jobRole').value;
  if(!name||(!phone&&!email)){jobNote.textContent=t.job_need;jobNote.classList.remove('ok');$('#jName').focus();return;}
  if(cvFile&&cvFile.size>CV_MAX){cvRender();cvDrop.scrollIntoView({behavior:'smooth',block:'center'});return;}
  const subject=t.job_subject+' · '+role+' · '+name;
  const body=t.job_subject+'\n\n'+t.form_name_l+': '+name+'\n'+t.ci_phone+': '+(phone||'-')+'\n'+t.ci_email+': '+(email||'-')+'\n'+t.job_role_l+': '+role+'\n\n'+(msg||'');
  const fields={name,phone:phone||'-',email:email||'-',position:role,message:msg,_subject:subject,_template:'table',_captcha:'false'};
  jobBtn.disabled=true;jobSpan.textContent=t.sending;
  /* a CV is a file, so it takes the same plain multipart route the photos do */
  if(cvFile){fields._next=back('applied');try{fsPostForm(fields,[{blob:cvFile,name:cvFile.name}]);return;}catch(_){}}
  try{await ajaxSend(fields);jobSpan.textContent='✓';jobNote.textContent=t.job_sent_ok;jobNote.classList.add('ok');}
  catch(_){jobNote.textContent=t.send_err;mailto(subject,body);jobBtn.disabled=false;jobSpan.textContent=t.job_send;}
});

/* ── start ─────────────────────────────────────────────────────────── */
const yr=$('#year');if(yr)yr.textContent=String(new Date().getFullYear());
/* ?lang= wins: it is what the hreflang tags hand Google and what a shared
   link carries. Otherwise the page opens in Croatian, the owner's default. */
const q=(location.search.match(/[?&]lang=([a-z]{2})/i)||[])[1];
setLang(q&&LANGS.includes(q.toLowerCase())?q.toLowerCase():'hr',true);
splitAll(); observeAll(); onScroll();
/* remember which headings have played, so a language switch shows them at rest */
new MutationObserver(ms=>ms.forEach(m=>{const el=m.target;if(el.classList&&el.classList.contains('in')&&el.hasAttribute('data-split'))el.dataset.seen='1';}))
  .observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});

/* back from a multipart submission: say so, and drop the marker so a refresh does not repeat it */
const backFrom=/[?&]sent=1(?:&|$)/.test(location.search)?'quote':(/[?&]applied=1(?:&|$)/.test(location.search)?'job':'');
if(backFrom){
  history.replaceState(null,'',langPath(current));
  const quote=backFrom==='quote',note=quote?cfNote:jobNote;
  note.textContent=quote?I18N[current].sent_ok:I18N[current].job_sent_ok;note.classList.add('ok');
  setTimeout(()=>document.getElementById(quote?'contact':'careers').scrollIntoView({behavior:'smooth'}),500);
}
})();
