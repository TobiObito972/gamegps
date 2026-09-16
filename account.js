// GAMEGPS ACCOUNT V6.3 — UI foundation. Cloud auth is intentionally disabled until backend configuration is added.
(()=>{
const status=document.getElementById('accountStatus');
const show=msg=>{if(status)status.textContent=msg};
function pending(e){e.preventDefault();show('Compte GameGPS : interface prête. Prochaine étape : connecter l’authentification et la base de données sécurisée.');}
document.getElementById('loginForm')?.addEventListener('submit',pending);
document.getElementById('signupForm')?.addEventListener('submit',pending);
})();