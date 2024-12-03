var E=Object.defineProperty;var M=(r,t,e)=>t in r?E(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var P=(r,t,e)=>M(r,typeof t!="symbol"?t+"":t,e);class R{static stringToHtmlElement(t){const e=document.createElement("div");return e.innerHTML=t,e.firstChild}}let T=null;const N="alien-roll-request";function p(){if(T)return T;const r=`/modules/${N}/templates/`;return T={moduleId:N,templatePath:r},T}function A(){game.settings.register(N,"hostile",{name:"Hostile Tokens",hint:"Unable or disable hostile tokens",scope:"world",config:!0,type:Boolean,default:!1})}class g{constructor(t){if(this.token=t,!this.tokenIsValidActor())throw new Error("Token is not a suitable actor")}getSkill(t){var e,s,n,o,a;return(s=(e=this.token.actor)==null?void 0:e.system)!=null&&s.skills[t]||console.error(`Skill ${attributeName} not found`),((a=(o=(n=this.token.actor)==null?void 0:n.system)==null?void 0:o.skills[t])==null?void 0:a.value)??0}getAttribute(t){var e,s,n,o,a;return(s=(e=this.token.actor)==null?void 0:e.system)!=null&&s.attributes[t]||console.error(`Attribute ${t} not found`),((a=(o=(n=this.token.actor)==null?void 0:n.system)==null?void 0:o.attributes[t])==null?void 0:a.value)??0}getStressValue(){return this.token.actor.system.header.stress.value}getPanicValue(){var t,e,s,n,o,a;return((s=(e=(t=this.token.actor.system)==null?void 0:t.general)==null?void 0:e.panic)==null?void 0:s.value)===1?(a=(o=(n=this.token.actor.system)==null?void 0:n.general)==null?void 0:o.panic)==null?void 0:a.lastRoll:0}getLastPanicMessage(){return this.token.actor.morePanic(this.getPanicValue())}getId(){return this.token.id}getName(){return this.token.name}getActor(){return this.token.actor}getOwners(t=!1){var e;return(e=game==null?void 0:game.users)==null?void 0:e.filter(s=>s.character===this.token.actor&&(t?s.active:!0))}tokenIsValidActor(){return!!this.token&&!!this.token.actor}static getTokenFromId(t){const e=canvas.tokens.get(t);return new this(e)}static getTokenFromActorId(t){const e=canvas.tokens.placeables.find(s=>{var n;return((n=s.actor)==null?void 0:n.id)===t});return new this(e)}static getPlayersFromList(t){const e=p(),s=[CONST.TOKEN_DISPOSITIONS.FRIENDLY,game.settings.get(e.moduleId,"hostile")?CONST.TOKEN_DISPOSITIONS.HOSTILE:null].filter(Boolean);try{return t.filter(n=>{var o;return((o=n.actor)==null?void 0:o.type)==="character"&&s.includes(n.document.disposition)})}catch{return console.error("Not a suitable list of tokens"),{}}}}class h{static async create(t){await ChatMessage.create(t)}static deleteMessage(t,e=!1){!t||!t instanceof ChatMessage||(this.isUserMessageOwner(t)?h.deleteMessageFromDb(t):e&&game.socket.emit("module.alien-roll-request",{action:"delete-roll-request",messageId:t.id}))}static deleteMessageFromDb(t){!t||!this.isUserMessageOwner(t)||t==null||t.delete()}static cleanChatMessageByClassName(t="message"){document.querySelectorAll(`.chat-message:has(.${t})`).forEach(e=>{const s=ChatMessage.get(e.dataset.messageId);h.deleteMessage(s)})}static isUserMessageOwner(t){return!t||!t instanceof ChatMessage,t.testUserPermission(game.user,CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)}static setMessageCreationListener(t){game.socket.on("module.alien-roll-request",e=>{if(e.action==="delete-roll-request"){const s=ChatMessage.get(e.messageId);h.deleteMessage(s)}}),Hooks.on("createChatMessage",e=>{var s,n,o,a;if(e.isRoll&&((o=(n=(s=e.rolls[0])==null?void 0:s.terms[0])==null?void 0:n.constructor)==null?void 0:o.name)==="AlienRPGBaseDie"){const l=R.stringToHtmlElement(e.content),i=g.getTokenFromActorId(l==null?void 0:l.dataset.actorId)??g.getTokenFromId((a=e.speaker)==null?void 0:a.token);setTimeout(()=>{e.update({speaker:{alias:i.getName()}})},100);const c=e.rolls[0];c&&i&&t.logRollResult(i,c)}Hooks.on("updateActor",(l,i,c,m)=>{var u,k;if((k=(u=i.system)==null?void 0:u.general)!=null&&k.panic){const d=g.getTokenFromActorId(l.id);t.syncPanic(d)}})})}static setCommonListeners(){Hooks.on("renderChatMessage",(t,e,s)=>{var n;(n=e.find(".rollable"))==null||n.on("click",o=>{var c;const l=o.currentTarget.dataset,i=g.getTokenFromId(l==null?void 0:l.token).token;(c=i==null?void 0:i.actor)==null||c.rollAbility(i==null?void 0:i.actor,l),h.deleteMessage(t,!0)})})}}const S="/systems/alienrpg/template.json";let w=null;async function I(){if(w)return w;const r=await L();return w={attributes:r.Actor.character.attributes,skills:r.Actor.character.skills},w}async function L(){const r=new URL(S,import.meta.url).href,t=await fetch(r);if(!t.ok)throw new Error(`Failed to load alien template.json: ${t.statusText}`);return await t.json()}const y=class y{constructor(t,e,s,n=!1){this.token=t,this.type=e,this.key=s,this.isPush=n,this.rollName="randomRoll",this.diceNumber=0,this.template="rollRequest.html"}async createRollNotification(t=[]){await this.determineDicesForRoll();const s=`${p().templatePath}${this.template}`,n=await renderTemplate(s,{tokenId:this.token.getId(),tokenName:this.token.getName(),label:this.rollName,number:this.diceNumber}),o={whisper:t,type:CONST.CHAT_MESSAGE_STYLES.OTHER,content:n};await h.create(o)}async determineDicesForRoll(){var e,s,n;const t=await I();switch(this.type){case y.RollTypeEnum.skill:const o=(e=t==null?void 0:t.skills[this.key])==null?void 0:e.ability;this.diceNumber=this.token.getSkill(this.key)+this.token.getAttribute(o),this.rollName=((s=t==null?void 0:t.skills[this.key])==null?void 0:s.label)??"undefined roll";break;case y.RollTypeEnum.attribute:this.diceNumber=this.token.getAttribute(this.key),this.rollName=((n=t==null?void 0:t.attributes[this.key])==null?void 0:n.label)??"undefined roll";break}}async characterRoll(){await this.determineDicesForRoll(),await game.alienrpg.yze.yzeRoll("character",!1,this.isPush,this.rollName,this.diceNumber,game.i18n.localize("ALIENRPG.Black"),this.token.getStressValue(),game.i18n.localize("ALIENRPG.Yellow"),this.token.getActor().id,"randomStringValue",1,null)}};P(y,"RollTypeEnum",{skill:"skill",attribute:"attribute"});let f=y;class F{static getDicesFromRoll(t){let e=0,s=0;return t==null||t.terms.forEach((n,o)=>{Array.isArray(n==null?void 0:n.results)&&(e+=n.results.filter(a=>a.result===6).length,s+=o!==0?n.results.filter(a=>a.result===1).length:0)}),{success:e,stress:s}}}class C{constructor(t){var e;if(!t){console.warn("Trigger is not a valid HTML element. Module cannot be set");return}this.trigger=t,this.rootNode=null,this.template="modale.html",this.templateRollLigne="roll-line.html",this.templatePanic="panic-line.html",(e=this.trigger)==null||e.addEventListener("click",()=>this.toggle())}async create(){const t=this,e=p(),s=await I(),n=`${e.templatePath}${this.template}`,o=g.getPlayersFromList(canvas.tokens.placeables),a=s.skills,l=s.attributes,i=await renderTemplate(n,{tokens:o,skills:a,attributes:l}),c=new Dialog({title:`${e.moduleId}`,content:i,buttons:{},render:m=>{let u=m==null?void 0:m.closest(".dialog");if(!u.find(".header-button.minimize").length){let k=u==null?void 0:u.find(".window-header .close"),d=$('<a class="header-button control minimize">Minimize</a>');d==null||d.on("click",()=>{var b;return(b=t.rootNode)==null?void 0:b.minimize()}),k.before(d)}t.applyFormListeners(m),this.syncPanic(...o)},close:()=>{t.rootNode=null}},{width:600});c.render(!0),t.rootNode=c}toggle(){if(!this.rootNode){this.create();return}this.rootNode.close()}async update(){var i;if(!this.rootNode)return;const t=p(),e=await I(),s=`${t.templatePath}${this.template}`,n=g.getPlayersFromList(canvas.tokens.placeables),o=e.skills,a=e.attributes,l=await renderTemplate(s,{tokens:n,skills:o,attributes:a});this.rootNode.data.content=l,(i=this.rootNode)==null||i.render(!0)}applyFormListeners(t){document.getElementById("arr-roll-button").addEventListener("click",()=>{this.formAction()}),t.find(".arr-attribute-input").on("change",function(){this.checked&&t.find(".arr-skill-input").prop("checked",!1)}),t.find(".arr-skill-input").on("change",function(){this.checked&&t.find(".arr-attribute-input").prop("checked",!1)}),document.getElementById("arr-cleanup-pending-requests").addEventListener("click",()=>{h.cleanChatMessageByClassName("alien-request-roll"),ui.notifications.warn("Pending Notifications has been cleared")}),document.getElementById("arr-update-modal-content").addEventListener("click",()=>{this.update()})}formAction(){var i,c;const t=Array.from(document.querySelectorAll(".arr-token-input:checked")).map(m=>m.value),e=document.querySelector(".arr-attribute-input:checked"),s=document.querySelector(".arr-skill-input:checked"),n=e?f.RollTypeEnum.attribute:f.RollTypeEnum.skill,o=e?e==null?void 0:e.value:s==null?void 0:s.value,a=(i=document.querySelector("#arr-roll-for-missing:checked"))==null?void 0:i.checked,l=(c=document.querySelector("#arr-force-for-present:checked"))==null?void 0:c.checked;if(t.length<1||!o){ui.notifications.warn("You need to select at least a token and a skill or attribute");return}t.forEach(m=>{const u=g.getTokenFromId(m);if(!u)return;const k=new f(u,n,o),d=u.getOwners(!0);(d.length===0?a:l)?k.characterRoll():k.createRollNotification(d==null?void 0:d.map(b=>b.id))})}async logRollResult(t,e){const s=document.querySelector(`#arr-token-item-${t.getId()} .arr-last-roll-result`);if(!s)return;const o=`${p().templatePath}${this.templateRollLigne}`,a=F.getDicesFromRoll(e);s.innerHTML=await renderTemplate(o,{token:t.token,roll:a}),await this.syncPanic(t)}async syncPanic(...t){const e=p();[...t].forEach(async s=>{s=s instanceof g?s:g.getTokenFromId((s==null?void 0:s.id)??s);const n=document.querySelector(`#arr-token-item-${s.getId()} .arr-panic-state`);if(!n)return;const o={isPanic:s.getPanicValue(),panicMessage:s.getLastPanicMessage()},a=`${e.templatePath}${this.templatePanic}`,l=await renderTemplate(a,{token:s.token,panic:o});n.innerHTML=l})}}Hooks.once("ready",async()=>{if(p(),game.user.isGM){const r=new C(document.querySelector("#chat-controls .chat-control-icon"));h.cleanChatMessageByClassName("alien-request-roll"),h.setMessageCreationListener(r),Hooks.on("createToken",t=>{r.update()}),Hooks.on("deleteToken",t=>{r.update()})}h.setCommonListeners()});Hooks.once("init",()=>{A()});
