const {createSession,cookieOptions}=require("./_auth");
module.exports=async function(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  if(!process.env.ADMIN_PASSWORD||!process.env.ADMIN_SECRET) return res.status(503).json({error:"Chưa cấu hình ADMIN_PASSWORD và ADMIN_SECRET trên Vercel"});
  const password=String(req.body?.password||"");
  const crypto=require("crypto");
  const a=crypto.createHash("sha256").update(password).digest();
  const b=crypto.createHash("sha256").update(process.env.ADMIN_PASSWORD).digest();
  if(!crypto.timingSafeEqual(a,b)) return res.status(401).json({error:"Mật khẩu không đúng"});
  res.setHeader("Set-Cookie","admin_session="+createSession()+"; "+cookieOptions());
  return res.status(200).json({ok:true});
};
