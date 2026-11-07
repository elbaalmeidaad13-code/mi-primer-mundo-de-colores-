const colors=[
 {name:"rojo",hex:"#f15b5b",emoji:"🍎",object:"manzana"},
 {name:"azul",hex:"#55a9ed",emoji:"🐟",object:"pez"},
 {name:"amarillo",hex:"#ffd447",emoji:"☀️",object:"sol"},
 {name:"verde",hex:"#69c77a",emoji:"🐸",object:"rana"},
 {name:"naranja",hex:"#ff9b45",emoji:"🍊",object:"naranja"},
 {name:"morado",hex:"#a77be8",emoji:"🍇",object:"uvas"}
];
const $=id=>document.getElementById(id);
let sound=true, currentGame="", target=null, round=0, currentLearn=0, choices=[];
const home=$("home"),game=$("game"),area=$("playArea"),prompt=$("prompt"),feedback=$("feedback"),next=$("next"),repeat=$("repeat");
function speak(text){if(!sound||!("speechSynthesis"in window))return; speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="es-ES";u.rate=.78;u.pitch=1.08;speechSynthesis.speak(u)}
function sayTarget(){if(currentGame==="find"||currentGame==="sort")speak(`¿Dónde está el color ${target.name}?`);else if(currentGame==="objects")speak(`¿Dónde está la ${target.object} ${target.name}?`);else speak(target.name)}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function start(kind){currentGame=kind;home.classList.remove("active");game.classList.add("active");feedback.textContent="";next.classList.add("hidden");round=0;
 const titles={learn:"Aprende los colores",find:"Encuentra el color",objects:"Toca el objeto",sort:"Elige por su color"};$("gameTitle").textContent=titles[kind];
 if(kind==="learn"){currentLearn=0;showLearn()}else newRound()}
function showLearn(){const c=colors[currentLearn];target=c;prompt.textContent="¡Mira este color!";area.innerHTML=`<div style="display:flex;flex-direction:column;align-items:center"><button class="learn-card" style="background:${c.hex}" aria-label="${c.name}">${c.emoji}</button><div class="learn-name">${c.name.toUpperCase()}</div></div><div class="learn-controls"><button id="prevLearn">←</button><button id="sayLearn">🔊 Escuchar</button><button id="nextLearn">→</button></div>`;area.querySelector(".learn-card").onclick=()=>speak(c.name);$("sayLearn").onclick=()=>speak(c.name);$("prevLearn").onclick=()=>{currentLearn=(currentLearn+5)%6;showLearn()};$("nextLearn").onclick=()=>{currentLearn=(currentLearn+1)%6;showLearn()};speak(c.name)}
function newRound(){feedback.textContent="";next.classList.add("hidden");round++;target=colors[Math.floor(Math.random()*colors.length)];choices=shuffle([target,...shuffle(colors.filter(c=>c!==target)).slice(0,2)]);prompt.textContent=currentGame==="objects"?`¿Dónde está la ${target.object}?`:`¿Dónde está el color ${target.name}?`;area.innerHTML="";
 choices.forEach(c=>{let b=document.createElement("button");b.className=currentGame==="objects"?"object-choice": "color-tile";if(currentGame==="objects"){b.textContent=c.emoji;b.setAttribute("aria-label",c.object)}else{b.style.background=c.hex;b.setAttribute("aria-label",c.name)}b.onclick=()=>answer(c,b);area.appendChild(b)});
 setTimeout(sayTarget,250)}
function answer(c,button){if(next.classList.contains("hidden")===false)return;if(c===target){feedback.textContent="¡Muy bien! ¡Lo has conseguido! ⭐";button.classList.add("success");speak(`¡Muy bien! ¡Es ${target.name}!`);celebrate();next.classList.remove("hidden")}else{feedback.textContent="¡Vamos a probar otra vez! 💛";speak("¡No pasa nada! Vamos a probar otra vez.");button.animate([{transform:"scale(1)"},{transform:"scale(1.08)"},{transform:"scale(1)"}],{duration:350})}}
function celebrate(){for(let i=0;i<3;i++){setTimeout(()=>{const s=document.createElement("span");s.textContent=["✨","⭐","🎉"][i];s.style.cssText="position:fixed;left:"+ (25+i*25)+"%;top:35%;font-size:38px;pointer-events:none;animation:pop .8s ease forwards";document.body.appendChild(s);setTimeout(()=>s.remove(),850)},i*100)}}
$("soundToggle").onclick=()=>{sound=!sound;$("soundToggle").textContent=sound?"🔊":"🔇";if(!sound&&"speechSynthesis"in window)speechSynthesis.cancel()};
document.querySelectorAll("[data-game]").forEach(b=>b.onclick=()=>start(b.dataset.game));
$("back").onclick=()=>{if("speechSynthesis"in window)speechSynthesis.cancel();game.classList.remove("active");home.classList.add("active")};
repeat.onclick=()=>{if(currentGame==="learn")speak(colors[currentLearn].name);else sayTarget()};
next.onclick=()=>{if(currentGame==="learn")return;newRound()};
if("serviceWorker"in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
