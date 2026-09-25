/* ===================== Módulo E — Casos guardados ===================== */
var CASES_KEY="ppcp_cases_v1";
function fmtDate(ts){ if(!ts) return "—"; try{ var d=new Date(ts); return ("0"+d.getDate()).slice(-2)+"/("0"+(d.getMonth()+1)).slice(-2)+"/"+d.getFullYear()+" "+("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2); }catch(e){ return "—"; } }
function loadCasesStore(){
  try{
    var raw=localStorage.getItem(CASES_KEY);
    if(raw){
      var s=JSON.parse(raw);
      if(s&&s.cases) return s;
    }
    var old=localStorage.getItem("ppcp_v4_state")||localStorage.getItem("ppc_v4_state");
    var store={ activeId:null, cases:{} };
    if(old){
      var data=JSON.parse(old);
      var id="case_migr_"+Date.now();
      var name=(data.form&&data.form.numeroexpediente)?("Expte. "+data.form.numeroexpediente):"Caso migrado";
      store.cases[id]={ name:name, created:Date.now(), updated:Date.now(), data:data };
      store.activeId=id;
      saveCasesStore(store);
    }
    return store;
  }catch(e){ return { activeId:null, cases:{} }; }
}
function saveCasesStore(store){
  var payload;
  try{
    payload=JSON.stringify(store);
    localStorage.setItem(CASES_KEY,payload);
    return true;
  }catch(e){
    console.warn("Cuota de almacenamiento alcanzada; se intentará liberar espacio.",e);
  }
  try{
    ["ppc_v4_state","ppc_cases_v1","ppc_paquetes_v1","ppc_v4_types"].forEach(function(key){
      if(key!==CASES_KEY) localStorage.removeItem(key);
    });
    localStorage.setItem(CASES_KEY,payload);
    return true;
  }catch(e0){
    console.warn("No se pudo liberar el almacenamiento heredado.",e0);
  }
  try{
    var trimmed={activeId:store.activeId||null,cases:{}};
    var ids=Object.keys(store.cases||{}).sort(function(a,b){
      return (store.cases[b].updated||0)-(store.cases[a].updated||0);
    });
    var kept=0;
    for(var i=0;i<ids.length;i++){
      var id=ids[i];
      if(id!==trimmed.activeId&&kept>=8) continue;
      trimmed.cases[id]=store.cases[id];
      if(id!==trimmed.activeId) kept++;
    }
    payload=JSON.stringify(trimmed);
    localStorage.setItem(CASES_KEY,payload);
    store.activeId=trimmed.activeId;
    store.cases=trimmed.cases;
    return true;
  }catch(e2){
    console.warn("No se pudo guardar el registro reducido de casos.",e2);
  }
  try{
    var compact={activeId:store.activeId||null,cases:{}};
    var compactIds=Object.keys(store.cases||{}).sort(function(a,b){
      return (store.cases[b].updated||0)-(store.cases[a].updated||0);
    }).slice(0,3);
    for(var j=0;j<compactIds.length;j++){
      var compactId=compactIds[j], original=store.cases[compactId]||{};
      var data=original.data||{};
      compact.cases[compactId]={
        name:original.name||"Caso sin título",
        created:original.created||Date.now(),
        updated:original.updated||Date.now(),
        data:{
          body:data.body||null,
          resolutivos:data.resolutivos||[],
          form:data.form||{},
          closed:data.closed||{},
          extraOn:data.extraOn||{}
        }
      };
    }
    if(compact.activeId&&!compact.cases[compact.activeId]){
      compact.activeId=compactIds.length?compactIds[0]:null;
    }
    localStorage.setItem(CASES_KEY,JSON.stringify(compact));
    store.activeId=compact.activeId;
    store.cases=compact.cases;
    return true;
  }catch(e3){
    console.error("No se pudo guardar casos:",e3);
    if(typeof flash==="function") flash("Almacenamiento lleno: el caso sigue abierto, exportalo como .json");
    return false;
  }
}
function currentSnapshot(){
  commitSel();
  var hc=function(id){ var e=$(id); return !!(e&&e.classList&&e.classList.contains&&e.classList.contains("collapsed")); };
  return {
    body: state.body?state.body.key:null,
    resolutivos: JSON.parse(JSON.stringify(state.resolutivos)),
    form: JSON.parse(JSON.stringify(state.form)),
    closed: JSON.parse(JSON.stringify(state.closed||{})),
    selPerBody: JSON.parse(JSON.stringify(state.selPerBody||{})),
    extraOn: JSON.parse(JSON.stringify(state.extraOn||{})),
    hidden: { Cuerpos:hc("paneCuerpos"), Resolutivos:hc("paneResolutivos"), Planilla:hc("panePlanilla") }
  };
}
function applySnapshot(data){
  try{
    state.body=data.body?(CUERPOS.filter(function(x){return x.key===data.body;})[0]||null):null;
    state.resolutivos=(data.resolutivos||[]).filter(function(x){
      return state.body&&(state.body.resolutivos.some(function(r){ return r.id===x.id; })||(x.src&&CUERPOS.some(function(c){return c.key===x.src&&c.resolutivos.some(function(r){return r.id===x.id;});})))
    });
    state.form=data.form||{};
    state.closed=data.closed||{};
    state.selPerBody=data.selPerBody||{};
    state.extraOn={}; if(data.extraOn){ var ek2; for(ek2 in data.extraOn){ if(data.extraOn[ek2]) state.extraOn[ek2]=true; } }
    if(state.body&&!state.selPerBody[state.body.key]){
      state.selPerBody[state.body.key]=JSON.parse(JSON.stringify(state.resolutivos));
    }
    if(data.hidden){
      var hm={Cuerpos:"paneCuerpos",Resolutivos:"paneResolutivos",Planilla:"panePlanilla"};
      var hr={Cuerpos:"railCuerpos",Resolutivos:"railResolutivos",Planilla:"railPlanilla"};
      for(var hk in data.hidden){
        var pel=$(hm[hk]); if(!pel) continue;
        if(data.hidden[hk]){
          pel.classList.add("collapsed");
          var r=$(hr[hk]); if(r&&r.classList) r.classList.remove("on");
        } else {
          pel.classList.remove("collapsed");
          var r2=$(hr[hk]); if(r2&&r2.classList) r2.classList.add("on");
        }
      }
    }
  }catch(e){ console.error("applySnapshot error:", e); }
}
function getActiveCase(store){
  if(!store) store=loadCasesStore();
  if(!store.activeId||!store.cases[store.activeId]) return null;
  return { id:store.activeId, data:store.cases[store.activeId] };
}
function caseNameFromForm(){
  var f=state.form||{};
  var ex=(f.numeroexpediente||"").trim();
  var nombre=(f.nombreimputado1||"").trim();
  var delito=(f.delito||"").trim();
  if(ex) return "Expte. "+ex+(nombre?" — "+nombre:"");
  if(nombre) return nombre+(delito?" / "+delito:"");
  return "Caso sin título";
}
function ensureActiveCase(){
  var store=loadCasesStore();
  if(store.activeId&&store.cases[store.activeId]) return store;
  var id="case_"+Date.now()+"_"+Math.floor(Math.random()*1e4);
  store.cases[id]={ name:"Caso 1", created:Date.now(), updated:Date.now(), data:currentSnapshot() };
  store.activeId=id;
  saveCasesStore(store);
  return store;
}
function saveCurrentCase(silent){
  var store=ensureActiveCase();
  var c=store.cases[store.activeId];
  c.data=currentSnapshot();
  c.updated=Date.now();
  if(/^Caso \d+$/.test(c.name)){
    var auto=caseNameFromForm();
    if(auto!=="Caso sin título") c.name=auto;
  }
  saveCasesStore(store);
  if(!silent) updateExpte();
  return c;
}
function openCasos(){
  renderCasosModal();
  var cm=$("casosModal"); if(cm&&cm.classList&&cm.classList.remove) cm.classList.remove("hidden");
}
function closeCasos(){
  var cm=$("casosModal"); if(cm&&cm.classList&&cm.classList.add) cm.classList.add("hidden");
}
function renderCasosModal(){
  var store=loadCasesStore();
  var active=store.activeId;
  var ids=Object.keys(store.cases).sort(function(a,b){
    return (store.cases[b].updated||0)-(store.cases[a].updated||0);
  });
  var sub=$("casosSubtitle"); if(sub) sub.textContent=ids.length+" caso"+(ids.length===1?"":"s");
  var h=[];
  h.push('<div class="case-head-actions">');
  h.push('<button class="primary" onclick="caseNew()">＋ Nuevo caso (en blanco)</button>');
  h.push('<button onclick="caseDuplicateActive()">⧉ Duplicar actual</button>');
  h.push('<button onclick="caseImportJSON()">⬆ Importar .json</button>');
  h.push('<button onclick="caseExportActive()">⬇ Exportar actual (.json)</button>');
  h.push('</div>');
  h.push('<div class="info-chip" style="margin-bottom:12px">💡 Los casos se guardan en este navegador. Exportá a .json para backup o para compartir.</div>');
  if(!ids.length){
    h.push('<div class="case-empty"><b>No hay casos guardados</b>Empezá creando uno nuevo o duplicando el actual.<br><br><button class="btn primary" onclick="caseNew()">＋ Crear primer caso</button></div>');
    var cb0=$("casosBody"); if(cb0) cb0.innerHTML=h.join("");
    return;
  }
  h.push('<div class="cases-list">');
  for(var i=0;i<ids.length;i++){
    var id=ids[i], c=store.cases[id];
    var isAct=id===active;
    var ex=c.data&&c.data.form?(c.data.form.numeroexpediente||"—"):"—";
    var nres=c.data&&c.data.resolutivos?c.data.resolutivos.length:0;
    var nbody=c.data&&c.data.body?c.data.body:"—";
    var bodyLabel=(CUERPOS.filter(function(x){return x.key===nbody;})[0]||{}).label||nbody;
    h.push('<div class="case-row'+(isAct?' active':'')+'">');
    h.push('<div class="cr-ic">'+(isAct?'📌':'📄')+'</div>');
    h.push('<div class="cr-body">');
    h.push('<div class="cr-name">'+esc(c.name||"Sin título")+(isAct?' <span class="cr-active-badge">ACTIVO</span>':'')+'</div>');
    h.push('<div class="cr-meta">Expte: '+esc(ex)+' · '+esc(bodyLabel)+' · '+nres+' resolutivo'+(nres===1?'':'s')+'</div>');
    h.push('<div class="cr-meta">Modificado: '+fmtDate(c.updated)+'</div>');
    h.push('</div><div class="cr-actions">');
    if(!isAct) h.push('<button title="Cargar" onclick="caseLoad(\''+id+'\')">↥</button>');
    h.push('<button title="Renombrar" onclick="caseRename(\''+id+'\')">✎</button>');
    h.push('<button title="Duplicar" onclick="caseDuplicate(\''+id+'\')">⧉</button>');
    h.push('<button title="Exportar" onclick="caseExportOne(\''+id+'\')">⬇</button>');
    h.push('<button class="danger" title="Eliminar" onclick="caseDelete(\''+id+'\')">🗑</button>');
    h.push('</div></div>');
  }
  h.push('</div>');
  var cb=$("casosBody"); if(cb) cb.innerHTML=h.join("");
}
function caseNew(){
  var store=loadCasesStore();
  var id="case_"+Date.now()+"_"+Math.floor(Math.random()*1e4);
  store.cases[id]={name:"Caso nuevo",created:Date.now(),updated:Date.now(),data:{body:null,resolutivos:[],form:{},closed:{},selPerBody:{},extraOn:{},hidden:{}}};
  store.activeId=id; saveCasesStore(store); applySnapshot(store.cases[id].data); renderAll(); renderCasosModal();
}
function caseLoad(id){
  var store=loadCasesStore(), c=store.cases[id]; if(!c) return;
  store.activeId=id; saveCasesStore(store); applySnapshot(c.data||{}); renderAll(); renderCasosModal();
}
function caseRename(id){
  var store=loadCasesStore(), c=store.cases[id]; if(!c) return;
  var next=prompt("Nombre del caso:",c.name||""); if(next===null) return;
  c.name=next.trim()||"Caso sin título"; c.updated=Date.now(); saveCasesStore(store); renderCasosModal();
}
function caseDuplicate(id){
  var store=loadCasesStore(), c=store.cases[id]; if(!c) return;
  var newId="case_"+Date.now()+"_"+Math.floor(Math.random()*1e4);
  store.cases[newId]={name:(c.name||"Caso")+" (copia)",created:Date.now(),updated:Date.now(),data:JSON.parse(JSON.stringify(c.data||{}))};
  store.activeId=newId; saveCasesStore(store); applySnapshot(store.cases[newId].data); renderAll(); renderCasosModal();
}
function caseDuplicateActive(){ var store=loadCasesStore(); if(store.activeId) caseDuplicate(store.activeId); }
function caseDelete(id){
  var store=loadCasesStore(), c=store.cases[id]; if(!c) return;
  if(!confirm("¿Eliminar este caso guardado?")) return;
  delete store.cases[id];
  if(store.activeId===id){ var rest=Object.keys(store.cases); store.activeId=rest.length?rest[0]:null; if(store.activeId) applySnapshot(store.cases[store.activeId].data||{}); }
  saveCasesStore(store); renderAll(); renderCasosModal();
}
function caseExportOne(id){
  var store=loadCasesStore(), c=store.cases[id]; if(!c) return;
  var blob=new Blob([JSON.stringify({name:c.name,created:c.created,updated:c.updated,data:c.data},null,2)],{type:"application/json"});
  var a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="PPCP_caso_"+(c.name||"sin_titulo").replace(/[^a-z0-9_-]+/gi,"_")+".json"; a.click(); setTimeout(function(){URL.revokeObjectURL(a.href);},1000);
}
function caseExportActive(){
  var store=loadCasesStore();
  if(!store.activeId){ alert("No hay caso activo."); return; }
  caseExportOne(store.activeId);
}
function caseImportJSON(){
  var inp=document.createElement("input");
  inp.type="file"; inp.accept=".json,application/json";
  inp.onchange=function(){
    var f=inp.files&&inp.files[0]; if(!f) return;
    var r=new FileReader();
    r.onload=function(){
      try{
        var d=JSON.parse(r.result);
        var data=d.data?d.data:d;
        if(!data||typeof data!=="object") throw new Error("Formato inválido");
        if(!data.form&&!data.body&&!data.resolutivos) throw new Error("No parece un caso PPCP");
        var store=loadCasesStore();
        var id="case_"+Date.now()+"_"+Math.floor(Math.random()*1e4);
        store.cases[id]={ name:d.name||("Importado "+new Date().toLocaleDateString()), created:d.created||Date.now(), updated:Date.now(), data:data };
        saveCasesStore(store);
        renderCasosModal();
        alert("Caso importado correctamente. Ya aparece en la lista.");
      }catch(e){ alert("Error al importar: "+e.message); }
    };
    r.readAsText(f);
  };
  inp.click();
}
