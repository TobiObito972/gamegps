// GAMEGPS — WARFRAME RESOURCE ROUTES V5.13.1 STEP 1
// V5.13.1 étape 1 : corrige uniquement l'ordre des routes Bounties/Ticker. Le reste de V5.13 est préservé.
(()=>{
const GPS=window.WarframeGPS;if(!GPS)return;
const oldProfiles=GPS.resourceProfiles,oldRender=GPS.renderResource;
function cleanPath(path){let x=String(path||'').trim();x=x.replace(/^Bounties\s*→\s*Vénus\s*→\s*Vallée Orbis$/i,'Vénus → Vallée Orbis → Primes');x=x.replace(/^Bounties\s+in\s+Vénus\s*→\s*Vallée Orbis$/i,'Vénus → Vallée Orbis → Primes');x=x.replace(/^Ticker\s+in\s+Vénus\s*→\s*Fortuna$/i,'Vénus → Fortuna → Ticker');x=x.replace(/^Ticker\s*→\s*Vénus\s*→\s*Fortuna$/i,'Vénus → Fortuna → Ticker');return x}
GPS.resourceProfiles=function(name,item=null){const rows=oldProfiles.call(this,name,item);return rows.map(r=>({...r,path:cleanPath(r.path)}))};
GPS.renderResource=oldRender;
})();