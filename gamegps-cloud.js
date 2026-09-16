// GAMEGPS CLOUD V6.5 — shared Supabase account + save layer
(()=>{
const SUPABASE_URL='https://afyavcczswxoievqyanb.supabase.co';
const SUPABASE_KEY='sb_publishable_bqDSr5xHf3y3uU-ULjhruA_cmeUilR5';
let clientPromise=null;
async function client(){
  if(window.GameGPSAuth?.client)return window.GameGPSAuth.client;
  if(!clientPromise)clientPromise=import('https://esm.sh/@supabase/supabase-js@2').then(({createClient})=>createClient(SUPABASE_URL,SUPABASE_KEY));
  return clientPromise;
}
async function user(){const db=await client();const {data,error}=await db.auth.getUser();if(error)return null;return data.user||null}
async function save(gameId,saveKey,title,data){
  const db=await client(),u=await user();if(!u)return {cloud:false,reason:'guest'};
  const {error}=await db.from('game_saves').upsert({user_id:u.id,game_id:gameId,save_key:saveKey,title,data,updated_at:new Date().toISOString()},{onConflict:'user_id,game_id,save_key'});
  if(error){console.warn('GameGPS Cloud save:',error);return {cloud:false,error}}
  return {cloud:true};
}
async function load(gameId,saveKey){
  const db=await client(),u=await user();if(!u)return null;
  const {data,error}=await db.from('game_saves').select('data,title,updated_at').eq('user_id',u.id).eq('game_id',gameId).eq('save_key',saveKey).maybeSingle();
  if(error){console.warn('GameGPS Cloud load:',error);return null}return data||null;
}
async function list(gameId){const db=await client(),u=await user();if(!u)return[];const {data,error}=await db.from('game_saves').select('save_key,title,data,updated_at').eq('user_id',u.id).eq('game_id',gameId).order('updated_at',{ascending:false});return error?[]:(data||[])}
async function remove(gameId,saveKey){const db=await client(),u=await user();if(!u)return false;const {error}=await db.from('game_saves').delete().eq('user_id',u.id).eq('game_id',gameId).eq('save_key',saveKey);return !error}
window.GameGPSCloud={client,user,save,load,list,remove};
})();
