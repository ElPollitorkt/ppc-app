function autosave(silent){ if(__asT)clearTimeout(__asT); __asT=setTimeout(function(){ saveTemplate(silent); },600); }
function saveTemplate(silent){
  commitSel();
  try{ saveCurrentCase(true); }catch(e){}
  var hc=function(id){ var e=$(id); return !!(e.classList&&e.classList.contains&&e.classList.contains("collapsed")); };
  var data={body:state.body?state.body.key:null,resolutivos:state.resolutivos,form:state.form,closed:state.closed||{},selPerBody:state.selPerBody,onlyUsed:state.onlyUsed,extraOn:state.extraOn||{},imputadoCount:state.imputadoCount||1,hidden:{Cuerpos:hc("paneCuerpos"),Resolutivos:hc("paneResolutivos"),Planilla:hc("panePlanilla")}};
  try{
    localStorage.setItem("ppcp_v4_state",JSON.stringify(data));
    if(!silent){ flash("Guardado"); stampSave(); }
  }catch(e){
    console.warn("No se pudo guardar el estado automático:",e);
    if(!silent&&typeof flash==="function") flash("Almacenamiento lleno: exportá el caso como .json");
  }
}
function clearAll(){
  if(!confirm("¿Limpiar todo? Se borrarán los datos cargados en esta sesión."))return;
  state.resolutivos=[]; state.form={}; state.selPerBody={}; state.closed={}; state.extraOn={}; undoStack=[]; redoStack=[];
  renderAll();
}
function loadState(){
  try{
    var raw=localStorage.getItem("ppcp_v4_state")||localStorage.getItem("ppc_v4_state"); if(!raw)return;
    var g=JSON.parse(raw);
    if(g.body){ state.body=CUERPOS.filter(function(x){return x.key===g.body;})[0]||null; }
    if(g.resolutivos) state.resolutivos=g.resolutivos.filter(function(x){ return state.body&&(state.body.resolutivos.some(function(r){return r.id===x.id;})||(x.src&&CUERPOS.some(function(c){return c.key===x.src&&c.resolutivos.some(function(r){return r.id===x.id;});}))); });
    if(g.form) state.form=g.form;
    state.closed=state.closed||{};
    if(g.closed) state.closed=g.closed;
    else if(g.groups&&g.groups.closed) for(var ck in g.groups.closed){ state.closed[ck]=g.groups.closed[ck]; }
    if(g.selPerBody) state.selPerBody=g.selPerBody;
    else if(state.body) state.selPerBody[state.body.key]=JSON.parse(JSON.stringify(state.resolutivos));
    if(g.onlyUsed) state.onlyUsed=true;
    state.extraOn=state.extraOn||{};
    if(g.extraOn){ var ek; for(ek in g.extraOn){ if(g.extraOn[ek]) state.extraOn[ek]=true; } }
    if(g.imputadoCount) state.imputadoCount=Math.max(1,parseInt(g.imputadoCount,10)||1);
    if(state.onlyUsed){ var cu=$("chipOnlyUsed"); if(cu&&cu.classList&&cu.classList.add) cu.classList.add("on"); }
    if(g.hidden){ var hm={Cuerpos:"paneCuerpos",Resolutivos:"paneResolutivos",Planilla:"panePlanilla"},hr={Cuerpos:"railCuerpos",Resolutivos:"railResolutivos",Planilla:"railPlanilla"};
      for(var hk in g.hidden){ if(hk==="Cuerpos") continue; if(g.hidden[hk]&&$(hm[hk])&&$(hm[hk]).classList){ $(hm[hk]).classList.add("collapsed"); if($(hr[hk])&&$(hr[hk]).classList)$(hr[hk]).classList.remove("on"); } }
    }
  }catch(e){}
}

/* ------------------ Tabs y responsive ------------------ */
function togglePane(name){
  var map={Cuerpos:"paneCuerpos",Resolutivos:"paneResolutivos",Planilla:"panePlanilla"};
  var el=$(map[name]);
  var collapsed=el.classList.toggle("collapsed");
  var rb=$({Cuerpos:"railCuerpos",Resolutivos:"railResolutivos",Planilla:"railPlanilla"}[name]);
  if(rb&&rb.classList) rb.classList.toggle("on",!collapsed);
}
function showPane(name){
  var el=$({Cuerpos:"paneCuerpos",Resolutivos:"paneResolutivos",Planilla:"panePlanilla"}[name]);
  if(el&&el.classList&&el.classList.contains("collapsed")) togglePane(name);
}
function mobileTab(tab){
  state.tab=tab;
  ["paneCuerpos","paneResolutivos","panePlanilla","paneActa"].forEach(function(id){ $(id).classList.toggle("show-m",id==="pane"+{cuerpos:"Cuerpos",resolutivos:"Resolutivos",planilla:"Planilla",acta:"Acta"}[tab]); });
  var btns=$("mTabs").querySelectorAll("button");
  for(var i=0;i<btns.length;i++) btns[i].classList.toggle("on",btns[i].getAttribute("data-tab")===tab);
  $("mCount").textContent=state.resolutivos.length?" ("+state.resolutivos.length+")":"";
}
