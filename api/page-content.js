module.exports=async function(req,res){
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 try{
  const base=process.env.KV_REST_API_URL,token=process.env.KV_REST_API_TOKEN;
  if(!base||!token)return res.status(200).json({});
  const r=await fetch(base.replace(/\/$/,"")+"/GET/"+encodeURIComponent("chamcong:admin:page-content"),{headers:{Authorization:"Bearer "+token}});
  if(!r.ok)return res.status(200).json({});
  const j=await r.json();return res.status(200).json(j.result?JSON.parse(j.result):{});
 }catch(e){return res.status(200).json({})}
};
