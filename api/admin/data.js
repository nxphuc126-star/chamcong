const {verify}=require("./_auth");
const KEY="chamcong:admin:page-content";
async function kv(command){
 const base=process.env.KV_REST_API_URL,token=process.env.KV_REST_API_TOKEN;
 if(!base||!token)throw new Error("Chưa cấu hình KV_REST_API_URL và KV_REST_API_TOKEN");
 const r=await fetch(base.replace(/\/$/,"")+"/"+command,{headers:{Authorization:"Bearer "+token}});
 if(!r.ok)throw new Error("Không thể truy cập kho dữ liệu");
 const j=await r.json();return j.result;
}
module.exports=async function(req,res){
 if(!verify(req))return res.status(401).json({error:"Unauthorized"});
 try{
  if(req.method==="GET"){
   const value=await kv("GET/"+encodeURIComponent(KEY));
   return res.status(200).json(value?JSON.parse(value):{attendance:{notice:""},hr:{notice:""},production:{notice:""}});
  }
  if(req.method==="PUT"){
   const data=req.body;
   if(!data||typeof data!=="object"||JSON.stringify(data).length>100000)return res.status(400).json({error:"Dữ liệu không hợp lệ"});
   const base=process.env.KV_REST_API_URL,token=process.env.KV_REST_API_TOKEN;
   if(!base||!token)return res.status(503).json({error:"Chưa cấu hình Vercel KV"});
   const r=await fetch(base.replace(/\/$/,""),{method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify(["SET",KEY,JSON.stringify(data)])});
   if(!r.ok)throw new Error("Không lưu được dữ liệu");
   return res.status(200).json({ok:true});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){return res.status(500).json({error:e.message})}
};
