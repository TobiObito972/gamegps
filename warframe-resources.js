// GAMEGPS — WARFRAME RESOURCE ROUTES V5.6.1
// V5.6 + images résilientes pour les ressources WFCD.
(() => {
  const GPS = window.WarframeGPS;
  if (!GPS) return;

  const routes = {
    neurodes: [{label:"RECOMMANDÉ",path:"Terre → Mariana → Extermination",method:"Explore toute la mission, détruis les conteneurs et élimine les ennemis."},{label:"RAPIDE",path:"Deimos → Magnacidium → Assassination",method:"Runs courts sur Lephantis avec extraction immédiate après le boss."},{label:"DÉBUTANT",path:"Terre → E Prime → Extermination",method:"Accessible tôt : explore les salles et ouvre les conteneurs pendant l'extermination."}],
    morphics: [{label:"RECOMMANDÉ",path:"Mars → Wahiba → Survie",method:"Reste en Survie et maintiens un flux élevé d'ennemis."},{label:"RAPIDE",path:"Mercure → Tolstoj → Assassination",method:"Enchaîne les runs courts et récupère les ressources sur le trajet."},{label:"DÉBUTANT",path:"Mars → Ara → Capture",method:"Capture la cible puis fouille rapidement les salles avant l'extraction."}],
    plastids: [{label:"RECOMMANDÉ",path:"Uranus → Ophelia → Survie",method:"Reste en Survie et élimine un maximum d'ennemis en groupe."},{label:"RAPIDE",path:"Saturne → Piscinas → Survie",method:"Farm compact : tue les groupes d'ennemis et récupère les ressources au sol."},{label:"DÉBUTANT",path:"Phobos → Zeugma → Survie",method:"Option accessible plus tôt pour accumuler progressivement des Plastids."}],
    polymerbundle: [{label:"RECOMMANDÉ",path:"Uranus → Ophelia → Survie",method:"Concentre les ennemis, élimine-les en masse et ouvre les conteneurs."},{label:"RAPIDE",path:"Uranus → Assur → Survie",method:"Enchaîne les groupes d'ennemis sans interrompre le rythme de farm."},{label:"DÉBUTANT",path:"Vénus → Tessera → Défense",method:"Enchaîne les vagues et récupère toutes les ressources entre les manches."}],
    orokincell: [{label:"RECOMMANDÉ",path:"Cérès → Gabii → Survie",method:"Reste en mission, cherche les dépôts et élimine un maximum d'ennemis."},{label:"RAPIDE",path:"Saturne → Tethys → Assassination",method:"Enchaîne les runs sur Sargas Ruk et récupère les ressources du trajet."},{label:"DÉBUTANT",path:"Cérès → Exta → Assassination",method:"Élimine les boss puis explore rapidement avant l'extraction."}],
    neuralsensors: [{label:"RECOMMANDÉ",path:"Jupiter → Cameria → Survie",method:"Reste en mission pour multiplier les ennemis et les chances de ressources."},{label:"RAPIDE",path:"Jupiter → Themisto → Assassination",method:"Élimine Alad V et Zanuka puis relance immédiatement la mission."},{label:"DÉBUTANT",path:"Jupiter → Io → Défense",method:"Enchaîne les vagues et récupère les ressources entre chaque rotation."}]
  };

  const key=name=>GPS.compact(name);
  const text=item=>GPS.normalize([item?.type,item?.category,item?.productCategory,item?.description,item?.uniqueName,item?.name].filter(Boolean).join(' '));
  const svgPlaceholder=name=>`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="14" fill="#0b1524"/><circle cx="64" cy="53" r="25" fill="none" stroke="#52d9f5" stroke-width="4"/><path d="M39 93h50M49 103h30" stroke="#52d9f5" stroke-width="4" stroke-linecap="round"/><text x="64" y="58" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="#ffffff">GPS</text></svg>`)}`;

  function imageCandidates(item){
    const n=String(item?.imageName||'').replace(/^\/+/,''),out=[];
    if(n){out.push(`https://cdn.warframestat.us/img/${n}`);out.push(`https://raw.githubusercontent.com/WFCD/warframe-items/master/data/img/${n}`)}
    return [...new Set(out)];
  }
  function resourceImage(item,name){
    const candidates=imageCandidates(item),fallback=svgPlaceholder(name);
    if(!candidates.length)return `<img src="${fallback}" alt="${GPS.escape(name)}" data-gamegps-placeholder="1">`;
    const encoded=encodeURIComponent(JSON.stringify(candidates.slice(1)));
    return `<img src="${candidates[0]}" alt="${GPS.escape(name)}" data-image-fallbacks="${encoded}" data-placeholder="${encodeURIComponent(fallback)}">`;
  }
  function armImageFallbacks(root){
    root?.querySelectorAll('img[data-image-fallbacks]').forEach(img=>{
      img.addEventListener('error',()=>{
        let rest=[];try{rest=JSON.parse(decodeURIComponent(img.dataset.imageFallbacks||'%5B%5D'))}catch{}
        if(rest.length){img.dataset.imageFallbacks=encodeURIComponent(JSON.stringify(rest.slice(1)));img.src=rest[0];return}
        img.removeAttribute('data-image-fallbacks');img.src=decodeURIComponent(img.dataset.placeholder||'');
      });
    });
  }

  function contextualProfile(item){
    const raw=text(item),name=item?.name||'Cette ressource';
    if(/fish|servofish|poisson/.test(raw))return{label:"MÉTHODE D’OBTENTION",path:"MONDE OUVERT → PÊCHE",method:`${name} est lié à la pêche. Utilise la zone ouverte, l'appât et le cycle adaptés à cette espèce ; GameGPS évite d'inventer une mission classique.`};
    if(/plant|flora|plante/.test(raw))return{label:"MÉTHODE D’OBTENTION",path:"MISSIONS / MONDES OUVERTS → SCAN DE PLANTES",method:`${name} est une ressource végétale. Équipe un scanner et récolte-la dans son environnement plutôt que de chercher un drop de mission classique.`};
    if(/gem|\bore\b|mineral|mining|minerai/.test(raw))return{label:"MÉTHODE D’OBTENTION",path:"MONDE OUVERT → MINAGE",method:`${name} provient du minage ou de son raffinage. Mine les veines dans la zone ouverte correspondante puis raffine la matière si nécessaire.`};
    if(/alloy|alliage/.test(raw))return{label:"FABRICATION / RAFFINAGE",path:"FONDERIE → MATÉRIAU BRUT → ALLIAGE",method:`${name} est traité comme un matériau raffiné. Obtiens d'abord sa matière brute et le schéma requis, puis fabrique-le à la Fonderie.`};
    return null;
  }

  GPS.resourceProfiles=function(name,item=null){const custom=routes[key(name)];if(custom)return custom;const base=this.resourceGuide(name);if(base)return[{label:"RECOMMANDÉ",path:base.path,method:base.method}];const contextual=contextualProfile(item||{name});return contextual?[contextual]:[]};

  GPS.renderResource=function(item){
    const name=item?.name||"Ressource",profiles=this.resourceProfiles(name,item),drops=this.getDrops(item),best=this.bestDrop(drops),desc=item?.description||"Ressource de fabrication Warframe.";
    if(!profiles.length){if(best)profiles.push({label:"SOURCE DÉTECTÉE",path:this.routePath(best),method:`Source détectée dans les données Warframe • ${this.formatChance(best)}`});else profiles.push({label:"SOURCE À IDENTIFIER",path:"Aucune mission directe détectée",method:"Cette ressource existe dans le catalogue, mais les données actuellement disponibles ne fournissent pas une source exploitable. GameGPS n'affiche pas de destination inventée."})}
    const cards=profiles.map((r,i)=>`<div class="wf-route"><div><span>${i===0?"OBTENTION • ":"ALTERNATIVE • "}${this.escape(r.label)}</span><strong>${this.escape(r.path)}</strong><small>${this.escape(r.method)}</small></div></div>`).join("");
    this.results.innerHTML=`<article class="wf-result-card"><div class="wf-result-head">${resourceImage(item,name)}<div><span class="wf-kicker">GAMEGPS / RESSOURCE V5.6.1</span><h3>${this.escape(name)}</h3><small>RESSOURCE • ${profiles.length} SOURCE${profiles.length>1?"S":""}</small></div></div><p class="wf-description">${this.escape(desc)}</p>${cards}${drops.length?`<div class="wf-components"><h4>SOURCES DÉTECTÉES</h4>${drops.slice(0,5).map(d=>`<div class="wf-row"><span><b>${this.escape(this.routePath(d))}</b><small>Source disponible</small></span><strong>${this.escape(this.formatChance(d))}</strong></div>`).join("")}</div>`:""}</article>`;
    armImageFallbacks(this.results);
  };
})();