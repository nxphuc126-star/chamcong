const $=s=>document.querySelector(s);let current="attendance",data={};
async function api(url,options={}){const r=await fetch(url,{...options,headers:{"Content-Type":"application/json",...(options.headers||{})}});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||"Có lỗi xảy ra");return j}
function show(){ $("#login").hidden=true;$("#dashboard").hidden=false; }
function paint(){ $("#notice").value=data[current]?.notice||"";document.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===current));}
async function load(){data=await api("/api/admin/data");show();paint();$("#status").textContent="Đã tải dữ liệu."}
$("#loginForm").addEventListener("submit",async e=>{e.preventDefault();$("#loginError").textContent="";try{await api("/api/admin/login",{method:"POST",body:JSON.stringify({password:$("#password").value})});$("#password").value="";await load()}catch(err){$("#loginError").textContent=err.message}});
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{current=b.dataset.tab;paint()}));
$("#save").addEventListener("click",async()=>{data[current]=data[current]||{};data[current].notice=$("#notice").value;$("#status").textContent="Đang lưu...";try{await api("/api/admin/data",{method:"PUT",body:JSON.stringify(data)});$("#status").textContent="Đã lưu thành công."}catch(e){$("#status").textContent=e.message}});
$("#logout").addEventListener("click",async()=>{await api("/api/admin/logout",{method:"POST"});$("#dashboard").hidden=true;$("#login").hidden=false});
(async()=>{try{const s=await api("/api/admin/session");if(s.authenticated)await load()}catch(e){}})();
