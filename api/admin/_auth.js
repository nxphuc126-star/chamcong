const crypto = require("crypto");
function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}
function cookieOptions() {
  return "Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800";
}
function verify(req) {
  const raw = req.headers.cookie || "";
  const token = raw.split(";").map(x=>x.trim()).find(x=>x.startsWith("admin_session="))?.slice(14);
  if (!token || !process.env.ADMIN_SECRET) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const expected = sign(parts[0], process.env.ADMIN_SECRET);
  const a = Buffer.from(parts[1]), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a,b)) return false;
  try { const data=JSON.parse(Buffer.from(parts[0],"base64url").toString()); return data.exp>Date.now(); }
  catch { return false; }
}
function createSession() {
  const payload=Buffer.from(JSON.stringify({exp:Date.now()+8*60*60*1000})).toString("base64url");
  return payload+"."+sign(payload,process.env.ADMIN_SECRET);
}
module.exports={verify,createSession,cookieOptions};
