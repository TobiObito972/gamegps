// GAMEGPS — WARFRAME RESOURCE ROUTES V5.13.1 STEP 2.1
// Petit correctif ciblé chargé après le moteur V5.13.1 : reconnaît explicitement les routes Orb Vallis Bounty comme doublons de la méthode Primes.
(()=>{
const GPS=window.WarframeGPS;if(!GPS?.resourceProfiles)return;
const previous=GPS.resourceProfiles;
GPS.resourceProfiles=function(name,item=null){
  const rows=previous.call(this,name,item);
  const hasOrbVallisBounty=rows.some(r=>/vall[eé]e orbis.*primes|orb vallis.*bount/i.test(String(r?.path||''))&&/primes|bount/i.test(String(r?.label||'')+' '+String(r?.path||'')));
  if(!hasOrbVallisBounty)return rows;
  let keptMain=false;
  return rows.filter(r=>{
    const path=String(r?.path||'');
    const label=String(r?.label||'');
    const isMain=/vall[eé]e orbis.*primes/i.test(path)&&/primes/i.test(label+' '+path);
    if(isMain){if(keptMain)return false;keptMain=true;return true;}
    const isRawOrbBounty=/orb vallis.*bounty/i.test(path);
    return !isRawOrbBounty;
  });
};
})();