import fs from 'fs';
const D=new URL('.',import.meta.url).pathname;
const rd=f=>fs.readFileSync(D+f,'utf8');
const i18nSrc=rd('i18n.js');
const I18N=new Function(i18nSrc+';return I18N;')();
const hr=I18N.hr;
const pad=n=>String(n).padStart(2,'0');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const ICON={
 arrow:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 10h12M11 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
 phone:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.5 2.5h-3a1 1 0 0 0-1 1C2.5 11.5 8.5 17.5 16.5 17.5a1 1 0 0 0 1-1v-3l-3.5-1.5-1.8 1.8a10 10 0 0 1-4.5-4.5L9.5 7.5 8 4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
 swap:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
 copy:'<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="7" y="7" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M13 4H4v9" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
 camera:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h4l2-3h6l2 3h4v11H3z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
 file:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6zM14 3v4h4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
 check:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
};
const thumb=n=>`<picture><source type="image/avif" srcset="/assets/img/${n}-640.avif"><source type="image/webp" srcset="/assets/img/${n}-640.webp"><img src="/assets/img/${n}-640.jpg" width="640" height="478" alt="" loading="lazy" decoding="async"></picture>`;
const WHERE=['in','in','both','both','in','in','out','both','both','both','out'];
const SEASON=[['no','ok','best','best','best','best','ok','ok','best','best','ok','no'],Array(12).fill('best')];
const ROMAN=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
const LISTS={
 facts:()=>hr.facts.map((f,i)=>`<li><b>${pad(i+1)}</b><span>${f}</span></li>`).join(''),
 br1_tags:()=>hr.br1_tags.map(t=>`<li>${t}</li>`).join(''),
 br2_tags:()=>hr.br2_tags.map(t=>`<li>${t}</li>`).join(''),
 spec:()=>hr.svc.map((s,i)=>`<div class="spec-row" role="row"><span class="pos mono" role="cell">${pad(i+1)}</span><span class="nm" role="cell">${s.n}</span><span class="ds" role="cell">${s.d}</span><span class="wh" role="cell"><span class="wh-chip mono ${WHERE[i]}">${hr['where_'+WHERE[i]]}</span></span></div>`).join('\n    '),
 steps:()=>hr.steps.map((s,i)=>`<li class="step" style="--i:${i}"><span class="n" aria-hidden="true">${pad(i+1)}</span><h3>${s.h}</h3><p>${s.p}</p></li>`).join(''),
 aw_list:()=>hr.aw_list.map(t=>`<li>${ICON.check}<span>${t}</span></li>`).join(''),
 log:()=>hr.log.map((l,i)=>`<li class="log-item"><time class="mono">${l.t}</time><div class="log-bubble"><span class="m">${l.m}</span>${i===0?thumb('before'):''}${i===3?thumb('after'):''}</div></li>`).join(''),
 towns:()=>hr.towns.map((n,i)=>`<li><span class="tn">${n}</span>${i===0?`<span class="mono">${hr.base_tag}</span>`:''}</li>`).join(''),
 cal:()=>'<span></span>'+ROMAN.map(r=>`<span class="mo">${r}</span>`).join('')+SEASON.map((row,ri)=>`<span class="lbl">${hr.season_rows[ri]}</span>`+row.map((s,k)=>`<span class="c ${s}" style="--i:${k+ri*3}"></span>`).join('')).join(''),
 faq:()=>hr.faq.map((f,i)=>`<details><summary><span class="pos mono">${pad(i+1)}</span><span class="faq-q">${f.q}</span><span class="pm" aria-hidden="true"></span></summary><div class="faq-body"><p class="faq-a">${f.a}</p></div></details>`).join('\n  '),
 roles:()=>hr.job_roles.map(r=>`<li><b>${r.n}</b><span>${r.d}</span></li>`).join(''),
 role_opts:()=>hr.job_roles.map(r=>`<option value="${esc(r.n)}">${r.n}</option>`).join('')+`<option value="${esc(hr.job_other)}">${hr.job_other}</option>`,
};
const ldFaq=JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',inLanguage:'hr',mainEntity:hr.faq.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))});
function fill(tpl){
  tpl=tpl.replace(/\{\{@(\w+)\}\}/g,(m,k)=>{if(!LISTS[k])throw new Error('no list '+k);return LISTS[k]();});
  tpl=tpl.replace(/\{\{icon_(\w+)\}\}/g,(m,k)=>{if(!ICON[k])throw new Error('no icon '+k);return ICON[k];});
  tpl=tpl.replace(/\{\{ld_faq\}\}/g,ldFaq);
  tpl=tpl.replace(/="\{\{(\w+)\}\}"/g,(m,k)=>{if(typeof hr[k]!=='string')throw new Error('no attr key '+k);return '="'+esc(hr[k].replace(/<[^>]+>/g,''))+'"';});
  tpl=tpl.replace(/>\{\{(\w+)\}\}</g,(m,k)=>{if(typeof hr[k]!=='string')throw new Error('no key '+k);return '>'+hr[k]+'<';});
  tpl=tpl.replace(/\{\{(\w+)\}\}/g,(m,k)=>{if(typeof hr[k]!=='string')throw new Error('no key '+k);return k.startsWith('seo_')?esc(hr[k]):hr[k];});
  return tpl;
}
const out=fill(rd('head.html'))+'<style>\n'+rd('style.css')+'</style>\n</head>\n<body>\n'+fill(rd('body.html'))+'\n<script>\n'+i18nSrc+'\n'+rd('app.js')+'</script>\n</body>\n</html>\n';
const left=out.match(/\{\{[^}]*\}\}/g); if(left)throw new Error('unfilled: '+left.join(','));
// every key the markup asks for must exist in every language
const keys=new Set([...out.matchAll(/data-i18n(?:-alt|-aria)?="(\w+)"/g)].map(m=>m[1]));
for(const l of Object.keys(I18N))for(const k of keys)if(I18N[l][k]==null)throw new Error(`missing ${l}.${k}`);
const shape=o=>Object.keys(o).sort().join(',');
for(const l of Object.keys(I18N))if(shape(I18N[l])!==shape(hr))throw new Error('key set differs in '+l+': '+Object.keys(hr).filter(k=>!(k in I18N[l])).concat(Object.keys(I18N[l]).filter(k=>!(k in hr))).join(','));
for(const l of Object.keys(I18N))for(const k of ['facts','br1_tags','br2_tags','svc','steps','aw_list','log','towns','season_rows','faq','job_roles'])if(I18N[l][k].length!==hr[k].length)throw new Error(`length ${l}.${k}`);
fs.writeFileSync(process.argv[2],out);
console.log('built',process.argv[2],out.length,'bytes;',keys.size,'i18n keys used, all present in',Object.keys(I18N).join('/'));
