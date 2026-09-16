// GAMEGPS ACCOUNT V6.4 — Supabase Auth
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const db=createClient('https://afyavcczswxoievqyanb.supabase.co','sb_publishable_bqDSr5xHf3y3uU-ULjhruA_cmeUilR5');
const $=id=>document.getElementById(id),status=$('accountStatus'),guest=$('accountGuest'),connected=$('accountConnected');
const show=msg=>{status.textContent=msg};
function render(session){const u=session?.user;guest.hidden=!!u;connected.hidden=!u;if(u){$('accountPlayerName').textContent=u.user_metadata?.username||u.user_metadata?.full_name||'JOUEUR GAMEGPS';$('accountEmail').textContent=u.email||'Compte Discord';show('Compte connecté • synchronisation cloud prête.')}else show('Connecte-toi ou crée ton GameGPS ID pour synchroniser ta progression.')}
$('loginForm')?.addEventListener('submit',async e=>{e.preventDefault();show('Connexion...');const {error}=await db.auth.signInWithPassword({email:$('loginEmail').value.trim(),password:$('loginPassword').value});if(error)return show('Connexion impossible : '+error.message);const {data}=await db.auth.getSession();render(data.session)});
$('signupForm')?.addEventListener('submit',async e=>{e.preventDefault();show('Création du compte...');const {data,error}=await db.auth.signUp({email:$('signupEmail').value.trim(),password:$('signupPassword').value,options:{data:{username:$('signupName').value.trim()},emailRedirectTo:location.href.split('#')[0]}});if(error)return show('Création impossible : '+error.message);if(data.session)render(data.session);else show('Compte créé. Vérifie ton email pour confirmer ton GameGPS ID.')});
$('discordLogin')?.addEventListener('click',()=>show('Discord sera activé dès que les identifiants OAuth GameGPS auront été configurés.'));
$('logoutButton')?.addEventListener('click',async()=>{await db.auth.signOut();render(null)});
db.auth.onAuthStateChange((_event,session)=>render(session));
const {data}=await db.auth.getSession();render(data.session);
window.GameGPSAuth={client:db,getSession:()=>db.auth.getSession()};