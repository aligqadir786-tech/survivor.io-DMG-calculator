const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
$("#menuBtn").onclick=()=>document.body.classList.toggle("nav-open");

const pets=[
["pet-01-chicken.jpg","Ruffled Rush","Feather shot / Rain of Fury"],
["pet-02-hedgehog.jpg","Chevalier's Edge","Woodsword Wave / Darkness Unleashed"],
["pet-03-pink.jpg","Neurotoxin","Neurotoxin Aura / Puffer Pop"],
["pet-04-penguin.jpg","Snowball Expert","Snowballs / Emergency Freeze"],
["pet-05-bear.jpg","Dual-Color Nut","Nutplosion / Giant Killer"],
["pet-06-cat.jpg","Sugar Starter","Riccball Rampage / Cola"],
["pet-07-umbra.jpg","Umbral Edict","Nightfall Orb / Evernight Crown"]
];
const mounts=[
["mount-01-disc.jpg","Volta Disc","Laceration / Shock"],
["mount-02-thorn.jpg","Thorn Shield","Shockwave / Shield Resonance"],
["mount-03-nether.jpg","Nethersoul Domain","Netherflame / Chilled targets"],
["mount-04-iron.jpg","Iron Resolve","Energy stacks / collision damage"]
];
const eq=[
["equipment-01.jpg","Equipment slot 01","Grade skills • Eternal / Void / Chaos reference"],
["equipment-02.jpg","Equipment slot 02","Grade skills • fusion reference"],
["equipment-03.jpg","Equipment slot 03","Grade skills • fusion reference"],
["equipment-04.jpg","Equipment slot 04","Grade skills • fusion reference"],
["equipment-05.jpg","Equipment slot 05","Grade skills • fusion reference"],
["equipment-06.jpg","Equipment slot 06","Grade skills • fusion reference"],
["equipment-07.jpg","Equipment slot 07","Grade skills • fusion reference"]
];
function render(list,id){
  $(id).innerHTML=list.map(x=>`<article class="card"><img src="assets/icons/${x[0]}" alt=""><div class="card-body"><h3>${x[1]}</h3><p>${x[2]}</p></div></article>`).join("");
}
render(pets,"#petGallery");render(mounts,"#mountGallery");render(eq,"#equipmentCards");

const survivorNames=[
"Survivor 01","Survivor 02","Survivor 03","Survivor 04","Survivor 05","Survivor 06",
"Survivor 07","Survivor 08","Survivor 09","Survivor 10","Survivor 11","Survivor 12"
];
const survivorFiles=[];
for(let i=1;i<=12;i++)survivorFiles.push(`survivor-a-${String(i).padStart(2,"0")}.jpg`);
for(let i=1;i<=12;i++)survivorFiles.push(`survivor-b-${String(i).padStart(2,"0")}.jpg`);
const survivorGallery=$("#survivorGallery");
function renderSurvivors(filter=""){
  survivorGallery.innerHTML=survivorFiles.map((f,i)=>{
    const name=(survivorNames[i%survivorNames.length]);
    return `<article class="card survivor-card" data-name="${name.toLowerCase()}"><img src="assets/icons/${f}" alt="${name}"><div class="card-body"><h3>${name}</h3><p>Portrait from supplied survivor reference sheet</p></div></article>`
  }).join("");
  $$(".survivor-card").forEach(c=>c.style.display=c.dataset.name.includes(filter.toLowerCase())?"block":"none");
}
renderSurvivors();
$("#survivorSearch").oninput=e=>renderSurvivors(e.target.value);

const sheets=[
"sheet-01.jpg","sheet-02.jpg","sheet-03.jpg","sheet-04.jpg","sheet-05.jpg",
"sheet-06.jpg","sheet-07.jpg","sheet-08.jpg","sheet-09.jpg"
];
$("#sheetGrid").innerHTML=sheets.map((s,i)=>`<figure class="sheet"><img src="assets/reference-sheets/${s}" alt="Supplied reference sheet ${i+1}" loading="lazy"><figcaption>Supplied reference sheet ${i+1}</figcaption></figure>`).join("");

function calc(){
  const dmg=+$("#critDmgCount").value||0, rate=+$("#critRateCount").value||0;
  const dmgPct=dmg*10, ratePct=rate*10;
  $("#critDmgResult").textContent=dmgPct+"%";$("#critRateResult").textContent=ratePct+"%";
  $("#critDmgHero").textContent=dmgPct+"%";$("#critRateHero").textContent=ratePct+"%";
}
["#critDmgCount","#critRateCount"].forEach(s=>$(s).oninput=calc);
$$(".checks input").forEach(x=>x.onchange=()=>{
  const n=$$(".checks input:checked").reduce((a,b)=>a+(+b.dataset.bonus||0),0);
  $("#buildScore").textContent=n+"%";
});
calc();
