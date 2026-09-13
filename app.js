const $=s=>document.querySelector(s);
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#"+b.dataset.page).classList.add("active")});

const shapes=[[[1,1],[1,1]],[[1,1,1]],[[1,0],[1,1]],[[1,1,1],[0,1,0]],[[1,1,0],[0,1,1]]];
let comps=[{name:"Component A",tier:3,shape:0,selected:false},{name:"Component B",tier:2,shape:1,selected:false},{name:"Component C",tier:1,shape:2,selected:false}];
function renderComponents(){
  $("#components").innerHTML="";
  comps.forEach((c,i)=>{
    const d=document.createElement("div");d.className="component";
    d.innerHTML=`<input value="${c.name}"><select><option value="3">Gold</option><option value="2">Purple</option><option value="1">Blue</option></select><button title="rotate">↻</button><input type="checkbox" title="priority">`;
    d.children[1].value=c.tier;
    d.children[2].onclick=()=>{c.shape=(c.shape+1)%shapes.length;solve()};
    d.children[3].checked=c.selected;
    d.children[3].onchange=e=>c.selected=e.target.checked;
    d.children[0].oninput=e=>c.name=e.target.value;
    d.children[1].onchange=e=>c.tier=+e.target.value;
    $("#components").appendChild(d);
  });
}
$("#addComponent").onclick=()=>{comps.push({name:"Component "+String.fromCharCode(65+comps.length),tier:1,shape:Math.floor(Math.random()*shapes.length),selected:false});renderComponents();};
$("#reset").onclick=()=>{comps=[{name:"Component A",tier:3,shape:0,selected:false},{name:"Component B",tier:2,shape:1,selected:false},{name:"Component C",tier:1,shape:2,selected:false}];renderComponents();solve()};
function rotate(m){return m[0].map((_,i)=>m.map(r=>r[i]).reverse())}
function orientations(m){let out=[],x=m;for(let k=0;k<4;k++){let key=JSON.stringify(x);if(!out.some(v=>JSON.stringify(v)==key))out.push(x);x=rotate(x)}return out}
function solve(){
 const w=+$("#width").value,h=8,grid=Array.from({length:h},()=>Array(w).fill(null));
 let placements=0,states=0,start=performance.now();
 const ordered=[...comps].sort((a,b)=>b.tier-a.tier);
 function can(m,r,c){for(let y=0;y<m.length;y++)for(let x=0;x<m[y].length;x++)if(m[y][x]&&(!grid[r+y]||grid[r+y][c+x]))return false;return true}
 function put(m,r,c,v){for(let y=0;y<m.length;y++)for(let x=0;x<m[y].length;x++)if(m[y][x])grid[r+y][c+x]=v}
 for(const c of ordered){
   let best=null,bestScore=-1;
   for(const m of orientations(shapes[c.shape])) for(let r=0;r<h-m.length+1;r++) for(let col=0;col<w-m[0].length+1;col++){
     placements++; if(!can(m,r,col))continue;
     let cells=m.flat().filter(Boolean).length, score=cells*c.tier*100;
     if($("#fill").checked) score+=((w*h)-(grid.flat().filter(Boolean).length+cells))*0.01;
     if(c.selected)score+=500;
     if(score>bestScore){bestScore=score;best=[m,r,col]}
   }
   if(best){put(...best,c.name);states++}
 }
 let filled=grid.flat().filter(Boolean).length, lines=grid.filter(row=>row.every(Boolean)).length;
 $("#boardGrid").style.gridTemplateColumns=`repeat(${w},minmax(26px,1fr))`;
 $("#boardGrid").innerHTML=grid.flat().map(v=>`<div class="cell ${v?"filled":""}" title="${v||"Empty"}">${v?v.replace("Component ","C"):""}</div>`).join("");
 $("#stats").innerHTML=`<b>Total points</b> ${ordered.reduce((s,c)=>s+c.tier*grid.flat().filter(v=>v===c.name).length,0)}<br><b>Lines completed</b> ${lines}<br><b>Cells filled</b> ${filled}<br><b>Cells empty</b> ${w*h-filled}<br><b>Placements searched</b> ${placements}<br><b>States searched</b> ${states}<br><b>Solve time</b> ${(performance.now()-start).toFixed(2)} ms`;
}
$("#solve").onclick=solve;$("#another").onclick=()=>{comps.forEach(c=>c.shape=(c.shape+1+Math.floor(Math.random()*3))%shapes.length);solve()};$("#width").onchange=solve;renderComponents();solve();

function damage(atk,skill,crit,critDmg,bonus){let base=atk*(skill/100)*(1+bonus/100), expected=base*((1-crit/100)+(crit/100)*(critDmg/100));return {base,expected}}
$("#calcDamage").onclick=()=>{
 const r=damage(+$("#atk").value,+$("#skill").value,+$("#crit").value,+$("#critDmg").value,+$("#bonus").value);
 const speed=+$("#speed").value;
 $("#damageResult").innerHTML=`<div class="metric"><span>Base hit</span><b>${r.base.toFixed(0)}</b></div><div class="metric"><span>Expected hit</span><b>${r.expected.toFixed(0)}</b></div><div class="metric"><span>Estimated DPS</span><b>${(r.expected*speed).toFixed(0)}</b></div>`;
};
function build(id){return {atk:+$("#"+id+"Atk").value,crit:+$("#"+id+"Crit").value,skill:+$("#"+id+"Skill").value,bonus:+$("#"+id+"Bonus").value}}
function score(b){return damage(b.atk,b.skill,b.crit,200,b.bonus).expected}
$("#compare").onclick=()=>{let a=score(build("a")),b=score(build("b"));$("#comparison").innerHTML=`<div class="metric"><span>Build A</span><b>${a.toFixed(0)}</b></div><div class="metric"><span>Build B</span><b>${b.toFixed(0)}</b></div><div class="winner">${a>b?"🏆 Build A wins":"🏆 Build B wins"} by ${Math.abs(a-b).toFixed(0)} expected damage</div>`};
