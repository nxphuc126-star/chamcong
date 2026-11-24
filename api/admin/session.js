const {verify}=require("./_auth");
module.exports=async function(req,res){
 if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
 return res.status(200).json({authenticated:verify(req)});
};
