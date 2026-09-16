// GAMEGPS — WARFRAME RESOURCE ROUTES V5.5
// Extension non destructive du moteur V5.4 : plusieurs profils de farm par ressource.
(() => {
  const GPS = window.WarframeGPS;
  if (!GPS) return;

  const routes = {
    neurodes: [
      {label:"RECOMMANDÉ", path:"Terre → Mariana → Extermination", method:"Explore toute la mission, détruis les conteneurs et élimine les ennemis."},
      {label:"RAPIDE", path:"Deimos → Magnacidium → Assassination", method:"Runs courts sur Lephantis avec extraction immédiate après le boss."},
      {label:"DÉBUTANT", path:"Terre → E Prime → Extermination", method:"Accessible tôt : explore les salles et ouvre les conteneurs pendant l'extermination."}
    ],
    morphics: [
      {label:"RECOMMANDÉ", path:"Mars → Wahiba → Survie", method:"Reste en Survie et maintiens un flux élevé d'ennemis."},
      {label:"RAPIDE", path:"Mercure → Tolstoj → Assassination", method:"Enchaîne les runs courts et récupère les ressources sur le trajet."},
      {label:"DÉBUTANT", path:"Mars → Ara → Capture", method:"Capture la cible puis fouille rapidement les salles avant l'extraction."}
    ],
    plastids: [
      {label:"RECOMMANDÉ", path:"Uranus → Ophelia → Survie", method:"Reste en Survie et élimine un maximum d'ennemis en groupe."},
      {label:"RAPIDE", path:"Saturne → Piscinas → Survie", method:"Farm compact : tue les groupes d'ennemis et récupère les ressources au sol."},
      {label:"DÉBUTANT", path:"Phobos → Zeugma → Survie", method:"Option accessible plus tôt pour accumuler progressivement des Plastids."}
    ],
    polymerbundle: [
      {label:"RECOMMANDÉ", path:"Uranus → Ophelia → Survie", method:"Concentre les ennemis, élimine-les en masse et ouvre les conteneurs."},
      {label:"RAPIDE", path:"Uranus → Assur → Survie", method:"Enchaîne les groupes d'ennemis sans interrompre le rythme de farm."},
      {label:"DÉBUTANT", path:"Vénus → Tessera → Défense", method:"Enchaîne les vagues et récupère toutes les ressources entre les manches."}
    ],
    orokincell: [
      {label:"RECOMMANDÉ", path:"Cérès → Gabii → Survie", method:"Reste en mission, cherche les dépôts et élimine un maximum d'ennemis."},
      {label:"RAPIDE", path:"Saturne → Tethys → Assassination", method:"Enchaîne les runs sur Sargas Ruk et récupère les ressources du trajet."},
      {label:"DÉBUTANT", path:"Cérès → Exta → Assassination", method:"Élimine les boss puis explore rapidement avant l'extraction."}
    ],
    neuralSensors: [
      {label:"RECOMMANDÉ", path:"Jupiter → Cameria → Survie", method:"Reste en mission pour multiplier les ennemis et les chances de ressources."},
      {label:"RAPIDE", path:"Jupiter → Themisto → Assassination", method:"Élimine Alad V et Zanuka puis relance immédiatement la mission."},
      {label:"DÉBUTANT", path:"Jupiter → Io → Défense", method:"Enchaîne les vagues et récupère les ressources entre chaque rotation."}
    ]
  };

  const key = name => GPS.compact(name);
  routes.neuralsensors = routes.neuralSensors;
  delete routes.neuralSensors;

  GPS.resourceProfiles = function(name) {
    const custom = routes[key(name)];
    if (custom) return custom;
    const base = this.resourceGuide(name);
    return base ? [{label:"RECOMMANDÉ", path:base.path, method:base.method}] : [];
  };

  GPS.renderResource = function(item) {
    const name=item?.name||"Ressource", profiles=this.resourceProfiles(name), drops=this.getDrops(item), best=this.bestDrop(drops), desc=item?.description||"Ressource de fabrication Warframe.", image=item?.imageName?`https://cdn.warframestat.us/img/${item.imageName}`:"";
    if(!profiles.length) profiles.push({label:"SOURCE DÉTECTÉE",path:best?this.routePath(best):"Destination à déterminer",method:best?`Source détectée • ${this.formatChance(best)}`:"GameGPS n'a pas encore de route optimisée pour cette ressource."});
    const cards=profiles.map((r,i)=>`<div class="wf-route"><div><span>${i===0?"ITINÉRAIRE DE FARM • ":"ALTERNATIVE • "}${this.escape(r.label)}</span><strong>${this.escape(r.path)}</strong><small>${this.escape(r.method)}</small></div></div>`).join("");
    this.results.innerHTML=`<article class="wf-result-card"><div class="wf-result-head">${image?`<img src="${image}" alt="${this.escape(name)}">`:""}<div><span class="wf-kicker">GAMEGPS / RESSOURCE V5.5</span><h3>${this.escape(name)}</h3><small>RESSOURCE • ${profiles.length} ROUTE${profiles.length>1?"S":""}</small></div></div><p class="wf-description">${this.escape(desc)}</p>${cards}${drops.length?`<div class="wf-components"><h4>SOURCES DÉTECTÉES</h4>${drops.slice(0,5).map(d=>`<div class="wf-row"><span><b>${this.escape(this.routePath(d))}</b><small>Source disponible</small></span><strong>${this.escape(this.formatChance(d))}</strong></div>`).join("")}</div>`:""}</article>`;
  };
})();