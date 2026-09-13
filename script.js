const CFG={phone:"996507668866",address:"Бишкек",hours:"09:00–21:00"};let lang=localStorage.getItem("mmLang")||"ky",cat="all",sub="",cart=[],qty={};
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s), name=p=>lang==="ru"?p.ru:p.ky, tr=(a,b)=>lang==="ru"?b:a;
const welcome=()=>{const w=$("#welcome");if(!w)return;const seen=sessionStorage.getItem("mmWelcome");if(seen)w.classList.add("hide");$("#enterSite")?.addEventListener("click",()=>{w.classList.add("hide");sessionStorage.setItem("mmWelcome","1")})};welcome();
function cats(){ $("#cats").innerHTML=C.map(x=>`<button class="cat ${x[0]===cat?"active":""}" data-c="${x[0]}"><i>${x[3]}</i><b>${lang==="ru"?x[2]:x[1]}</b>${x[4].length?`<small>${x[4].length} ${tr("бөлүм","разделов")}</small>`:""}</button>`).join("");$$(".cat").forEach(b=>b.onclick=()=>{cat=b.dataset.c;sub="";cats();subs();products()})}
function subs(){let x=C.find(a=>a[0]===cat),el=$("#subs");el.innerHTML=x&&x[4].length?x[4].map(a=>`<button class="${a[0]===sub?"on":""}" data-s="${a[0]}">${lang==="ru"?a[2]:a[1]}</button>`).join(""):"";$$(".subs button").forEach(b=>b.onclick=()=>{sub=b.dataset.s;subs();products()})}
function productImage(p){
  return p.img
    ? `<img src="${p.img}" alt="${name(p)}" loading="lazy" decoding="async">`
    : `<span class="emoji-product" aria-hidden="true">${p.e}</span>`;
}
function products(){
  let q=$("#search").value.toLowerCase(),list=P.filter(p=>(cat==="all"||p.c===cat)&&(!sub||p.s===sub)&&name(p).toLowerCase().includes(q));
  $("#products").innerHTML=list.length?list.map(p=>`<article class="product" data-product-id="${p.id}">
    <div class="visual"><span>${p.tag}</span>${productImage(p)}</div>
    <h3>${name(p)}</h3>
    <p>${lang==="ru"?(p.descRu||"Профессиональная фотография товара."): (p.descKy||"Профессионалдуу товар сүрөтү.")}</p>
    <b>${p.price?`${p.price} сом`:"Баасы кийин"}</b>
    <button class="add" data-id="${p.id}">+</button>
  </article>`).join(""):`<div class="empty">${tr("Бул бөлүмгө товарлар эртең кошулат.","Товары в этот раздел будут добавлены завтра.")}`;
  $$(".add").forEach(b=>b.onclick=()=>add(+b.dataset.id,b))
}
function add(id,el){let p=P.find(x=>x.id===id);if(!p.price)return toast(tr("Баасы эртең кошулат.","Цена будет добавлена завтра."));cart.push(p);qty[id]=(qty[id]||0)+1;$("#count").textContent=cart.length;calc();burst(el);toast("✨ "+name(p)+" "+tr("кошулду!","добавлен!"))}
function calc(){let ids=Object.keys(qty);$("#calcRows").innerHTML=ids.length?ids.map(id=>{let p=P.find(x=>x.id==id);return `<div class="row"><span>${name(p)}<small>${p.price} ×</small></span><input min="0" type="number" value="${qty[id]}" data-id="${id}"><strong>${p.price*qty[id]} сом</strong></div>`}).join(""):`<div class="empty">${tr("Товар тандалган эмес.","Товары не выбраны.")}</div>`;$$(".row input").forEach(i=>i.oninput=()=>{qty[i.dataset.id]=+i.value||0;if(!qty[i.dataset.id])delete qty[i.dataset.id];calc()});$("#total").textContent=ids.reduce((s,id)=>s+P.find(p=>p.id==id).price*qty[id],0)+" сом"}
function wa(text){return CFG.phone?`https://wa.me/${CFG.phone}?text=${encodeURIComponent(text)}`:`https://wa.me/?text=${encodeURIComponent(text)}`}
function orderText(){
  const ids=Object.keys(qty);
  let lines=ids.map((id,i)=>{
    const p=P.find(x=>x.id==id), sum=p.price*qty[id];
    const image=p.img ? `\n🖼️ Товардын сүрөтү: ${new URL(p.img, location.href).href}` : "";
    return `${i+1}. ${name(p)}\n   Саны: ${qty[id]} даана\n   Баасы: ${p.price} сом\n   Суммасы: ${sum} сом${image}`;
  });
  return `Салам! Мой Маркеттен заказ берейин. 🛒\n\n${lines.join("\n\n")}\n\n💰 ЖАЛПЫ: ${$("#total").textContent}\n🚚 Жеткирип берүү: төлөмдүү\n📱 WhatsApp: +996 507 66 88 66`;
}
$("#order").onclick=()=>{
  if(!Object.keys(qty).length){toast(tr("Алгач товар тандаңыз.","Сначала выберите товар."));return}
  location.href=wa(orderText());
};
$("#cart").onclick=()=>{
  const ids=Object.keys(qty);
  $("#modal").classList.add("show");
  if(!ids.length){$("#modalBody").innerHTML=`<h2>🛒 ${tr("Себет бош","Корзина пуста")}</h2>`;return}
  const list=ids.map(id=>{
    const p=P.find(x=>x.id==id);
    return `<div class="cart-item">
      <div class="cart-thumb">${productImage(p)}</div>
      <div><b>${name(p)}</b><small>${qty[id]} × ${p.price} сом</small><strong>${p.price*qty[id]} сом</strong></div>
    </div>`;
  }).join("");
  $("#modalBody").innerHTML=`<h2>🛒 ${tr("Себет","Корзина")}</h2><div class="cart-list">${list}</div><h3 class="cart-total">${$("#total").textContent}</h3><button class="primary cart-order" onclick="document.querySelector('#order').click()">🟢 WhatsApp · Заказ берүү</button>`;
};
$("#close").onclick=()=>$("#modal").classList.remove("show");$("#modal").onclick=e=>{if(e.target.id==="modal")$("#modal").classList.remove("show")};
$("#search").oninput=products;
$$(".langs button").forEach(b=>b.onclick=()=>{lang=b.dataset.lang;localStorage.setItem("mmLang",lang);$$(".langs button").forEach(x=>x.classList.toggle("active",x===b));$$("[data-ky]").forEach(e=>e.textContent=lang==="ru"?e.dataset.ru:e.dataset.ky);cats();subs();products();calc()});
$("#surprise").onclick=()=>{let p=P[Math.floor(Math.random()*P.length)];$("#modal").classList.add("show");$("#modalBody").innerHTML=`<div class="surpriseBox"><div class="big">${p.e}</div><span class="eyebrow">🎁 SURPRISE</span><h2>${name(p)}</h2><p>${p.price?p.price+" сом":tr("Баасы кийин","Цена позже")}</p>${p.price?`<button class="primary" onclick="add(${p.id},this);$('#modal').classList.remove('show')">${tr("Себетке кошуу","Добавить")}</button>`:""}</div>`;burst($("#surprise"))};
$("#magic").onclick=()=>{for(let i=0;i<20;i++)setTimeout(()=>burst($("#magic")),i*18);toast(tr("✨ WOW!","✨ WOW!"))};
function burst(el){let r=el.getBoundingClientRect();for(let i=0;i<12;i++){let x=document.createElement("i");x.className="conf";x.style.left=r.left+r.width/2+"px";x.style.top=r.top+r.height/2+"px";x.style.setProperty("--x",(Math.random()*180-90)+"px");x.style.setProperty("--y",(Math.random()*160-100)+"px");document.body.append(x);setTimeout(()=>x.remove(),1000)}}
$("#wa").href=wa("Салам! Мой Маркет боюнча маалымат керек.");
const heroWa=$("#heroWa"); if(heroWa) heroWa.href=wa("Салам! Мой Маркеттен заказ берейин.");
cats();subs();products();calc();