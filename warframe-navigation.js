// GAMEGPS — WARFRAME NAVIGATION V6.7
(()=>{
const KEY='gamegps:warframe:navigation';
const categories={
 resources:{title:'RESSOURCES',desc:'Toutes les ressources Warframe. Recherche rapidement celle que tu veux farmer.'},
 warframes:{title:'WARFRAMES',desc:'Parcours les Warframes et lance directement leur GPS d’obtention.'},
 weapons:{title:'ARMES',desc:'Parcours les armes et ouvre leur plan de fabrication et de farm.'},
 progression:{title:'PROGRESSION',desc:'Retrouve tes parcours sauvegardés et reprends ta progression.'},
 relics:{title:'RELIQUES',desc:'Recherche une relique et consulte son contenu, ses raffinements et ses routes.'},
 gps:{title:'GPS / ASSISTANT',desc:'Combine plusieurs objectifs pour créer un itinéraire de farm optimisé.'}
};
const $=id=>document.getElementById(id);
function save(v){localStorage.setItem(KEY,JSON.stringify(v))}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
function openCategory(id,persist=true){const c=categories[id];if(!c)return;document.querySelector('.warframe-hero')?.setAttribute('hidden','');$('tools')?.setAttribute('hidden','');const view=$('categoryView');view.hidden=false;$('categoryKicker').textContent='WARFRAME / CATÉGORIE';$('categoryTitle').textContent=c.title;$('categoryDescription').textContent=c.desc;const input=$('warframeSearchInput');if(input){input.value='';input.placeholder=id==='gps'?'Ex : Rhino + Soma...':id==='relics'?'Ex : Lith A1...':`Rechercher dans ${c.title.toLowerCase()}...`}const results=$('warframeSearchResults');if(results)results.innerHTML=`<div class="wf-status">${id==='progression'?'Ouvre ton espace joueur pour retrouver tous tes parcours Cloud.':'Tape un nom dans la recherche pour ouvrir rapidement son GPS. Le catalogue complet arrive dans cette catégorie.'}</div>`;if(id==='progression'&&results)results.innerHTML='<div class="wf-status">Ta progression est synchronisée avec ton compte GameGPS. <a class="game-link" href="account.html">OUVRIR MES PARCOURS →</a></div>';if(persist)save({category:id});history.replaceState(null,'',`warframe.html?category=${encodeURIComponent(id)}#categoryView`);setTimeout(()=>view.scrollIntoView({block:'start'}),0)}
function home(){document.querySelector('.warframe-hero')?.removeAttribute('hidden');$('tools')?.removeAttribute('hidden');$('categoryView').hidden=true;localStorage.removeItem(KEY);history.replaceState(null,'','warframe.html')}
function init(){document.querySelectorAll('[data-wf-category]').forEach(b=>b.addEventListener('click',()=>openCategory(b.dataset.wfCategory)));$('categoryBack')?.addEventListener('click',home);const p=new URLSearchParams(location.search),cat=p.get('category'),assistant=p.get('assistant');if(assistant)return;const saved=load();if(cat&&categories[cat])openCategory(cat,false);else if(saved?.category&&categories[saved.category])openCategory(saved.category,false)}
window.WarframeNavigation={openCategory,home};document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();