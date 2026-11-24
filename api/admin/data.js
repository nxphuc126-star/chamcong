const {verify}=require("./_auth");
const {get,put}=require("@vercel/blob");
const PATH="admin/site-data.json";
const EMPTY={pages:{attendance:{notice:""},hr:{notice:""},production:{notice:""}},appData:null};
async function readData(){
  try{
    const item=await get(PATH,{access:"private"});
    if(!item||item.statusCode!==200)return EMPTY;
    const response=await new Response(item.stream).text();
    return {...EMPTY,...JSON.parse(response)};
  }catch(e){if(e.statusCode===404||e.code==="BLOB_NOT_FOUND")return EMPTY;throw e}
}
module.exports=async function(req,res){
 if(!verify(req))return res.status(401).json({error:"Unauthorized"});
 try{
  if(req.method==="GET")return res.status(200).json(await readData());
  if(req.method==="PUT"){
   const data=req.body;
   if(!data||typeof data!=="object"||JSON.stringify(data).length>2_000_000)return res.status(400).json({error:"Dữ liệu không hợp lệ hoặc vượt quá 2 MB"});
   await put(PATH,JSON.stringify(data),{access:"private",addRandomSuffix:false,allowOverwrite:true,contentType:"application/json"});
   return res.status(200).json({ok:true});
  }
  return res.status(405).json({error:"Method not allowed"});
 }catch(e){return res.status(500).json({error:"Không thể truy cập kho dữ liệu: "+e.message})}
};
