"use strict";
const L = globalThis.DAILY_LESSON;
const C = globalThis.PilotChecker;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const storageKey = `english-tutor:${L.id}`;
const initialState = () => ({schemaVersion:1,lessonId:L.id,updatedAt:new Date().toISOString(),step:0,fields:{scenario:L.defaultScenario||"english",voiceStyle:"curious"},writing:{},writingChecks:{},drills:{},drillChecks:{},selected:[...L.defaultSelected],visibleWriting:L.defaultWriting,visibleDrills:L.defaultRecall,meaningChoices:{},meaningChecked:{},repairs:{},surpriseIndex:0,taskNotes:{},taskRevisions:{...L.taskRevisions}});
let state = initialState();
let storageAvailable = true;
try { const raw=localStorage.getItem(storageKey); if(raw) state={...state,...JSON.parse(raw)}; } catch { storageAvailable=false; }
function cleanState(candidate) {
 const base=initialState();
 if(!candidate || candidate.lessonId!==L.id) return base;
 const safe={...base,...candidate,lessonId:L.id,schemaVersion:1};
 delete safe.conceptChoice;delete safe.conceptChecked;
 for(const key of ["fields","writing","writingChecks","drills","drillChecks","meaningChoices","meaningChecked","repairs","taskNotes"]) safe[key]=candidate[key] && typeof candidate[key]==="object" && !Array.isArray(candidate[key]) ? {...candidate[key]} : base[key];
 safe.selected=Array.isArray(candidate.selected)?[...new Set(candidate.selected)].filter(id=>L.phrases.some(p=>p.id===id)):base.selected;
 safe.visibleWriting=Math.min(L.writing.length,Math.max(L.defaultWriting,Number(candidate.visibleWriting)||L.defaultWriting));
 safe.visibleDrills=Math.min(L.phrases.length,Math.max(L.defaultRecall,Number(candidate.visibleDrills)||L.defaultRecall));
 safe.step=Math.min(7,Math.max(0,Number(candidate.step)||0));
 safe.surpriseIndex=Math.min(L.surprises.length-1,Math.max(0,Number(candidate.surpriseIndex)||0));
 const changed=L.tasks.filter(t=>candidate.taskRevisions?.[t.id]!==L.taskRevisions[t.id]).map(t=>t.id);
 if(changed.includes('sentence_breakdown'))safe.writingChecks={};
 if(changed.includes('phrase_trainer'))safe.drillChecks={};
 if(changed.includes('voice_support')){safe.surpriseChosen=false;safe.surpriseIndex=0;}
 safe.drillIndex=Math.max(0,Number(candidate.drillIndex)||0);
 safe.taskRevisions={...L.taskRevisions};
 return safe;
}
state=cleanState(state);
const requestedTask=location.hash.slice(1);
const requestedStep=L.tasks.findIndex(t=>t.id===requestedTask);
if(requestedStep>=0)state.step=requestedStep;
function saveDraft() {
 state.updatedAt=new Date().toISOString();
 try {localStorage.setItem(storageKey,JSON.stringify(state));storageAvailable=true;$("#save-status").textContent="Чернетку збережено в браузері";} catch {storageAvailable=false;$("#save-status").textContent="Браузер не зберіг чернетку — завантаж копію на кроці 8";}
}
function feedback(node,result) {node.hidden=false;node.dataset.status=result.status;node.textContent=[result.message,...(result.notes||[])].join("\n");}
function selectedPhrases(){return L.phrases.filter(p=>state.selected.includes(p.id));}
function setFields(){ $$('[data-save]').forEach(el=>{const value=state.fields[el.dataset.save]; if(el.type==="checkbox")el.checked=value===true;else {el.value=typeof value==="string"?value:"";if(el.tagName==="SELECT"&&el.selectedIndex<0)el.value="";}}); }
function renderStatic(){
 $("#model-text").innerHTML=L.model.map(t=>`<p>${escapeHtml(t)}</p>`).join("");
 $("#translation-text").innerHTML=L.translation.map(t=>`<p>${escapeHtml(t)}</p>`).join("");
 const context=$("#known-context");
 if(context)context.innerHTML=(L.knownContext||[]).map(n=>`<div class="context-note"><p>${escapeHtml(n.text)}</p><small>${escapeHtml(n.source)}</small></div>`).join("");
 const sources=$("#sources");
 if(sources)sources.innerHTML=(L.sources||[]).map(s=>`<li><a href="${escapeHtml(s.url)}" target="_blank" rel="noreferrer">${escapeHtml(s.label||s.title)}</a><p>${escapeHtml(s.status||"")}</p></li>`).join("");
}
function renderNavigation(){
 $("#step-tabs").innerHTML=$$(".quest-step").map((s,i)=>`<button class="step-tab" type="button" data-step="${i}" aria-label="${i+1}. ${escapeHtml(s.dataset.taskTitle)}" title="${i+1}. ${escapeHtml(s.dataset.taskTitle)}">${i+1}</button>`).join("");
 $$('[data-step]').forEach(b=>b.addEventListener('click',()=>showStep(Number(b.dataset.step))));
}
function showStep(index,scroll=true){
 state.step=Math.max(0,Math.min(7,index));
 document.body.dataset.activeStep=String(state.step);
 if(state.step!==5)stopTimer();
 const steps=$$(".quest-step");steps.forEach((s,i)=>s.hidden=i!==state.step);
 $("#quest-title").textContent=steps[state.step].dataset.taskTitle;
 $("#quest-phase").textContent=steps[state.step].dataset.phase;
 $("#quest-counter").textContent=`${state.step+1} / 8`;
 $$('[data-step]').forEach((b,i)=>{if(i===state.step)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 $("#prev-step").disabled=state.step===0;$("#next-step").disabled=state.step===7;
 updateMirrors(); updatePrompt();
 if(state.step===5)renderRehearsal();
 if(state.step===5 && !state.surpriseChosen){const material=[state.fields.realTask,state.fields.experimentResult,state.fields.fullAnswer].filter(Boolean).join(' ').toLowerCase();const match=L.surprises.findIndex(q=>(q.matchTerms||[]).some(term=>C.tokens(material).includes(term)));state.surpriseIndex=match>=0?match:0;state.surpriseChosen=true;renderSurprise();}
 if(scroll){saveDraft();steps[state.step].scrollIntoView({block:'start',behavior:'instant'});}
}
function rowMarkup(item,index,kind){
 const values=kind==='writing'?state.writing:state.drills;
 const cue=kind==='drill' ? `Напиши англійською: ${item.ua}` : item.ua;
 return `<article class="writing-row" data-row-id="${escapeHtml(item.id)}" data-kind="${kind}"><div class="row-number">${String(index+1).padStart(2,'0')} · ${kind==='writing'?(index<4?'ОСНОВА ІСТОРІЇ':'ДОДАТКОВО'):'З ТВОГО НАБОРУ'}</div><div class="exercise-cue"><span>Умова</span><p class="cue">${escapeHtml(cue)}</p></div>${item.source?`<p class="transformation" lang="en">${escapeHtml(item.source)}</p>`:""}<label class="helper" for="${kind}-${item.id}">Твоя англійська версія</label><textarea id="${kind}-${item.id}" rows="2" spellcheck="false">${escapeHtml(values[item.id]||'')}</textarea><div class="row-actions"><button type="button" data-check-row>Перевірити</button><button type="button" class="secondary" data-reveal-example>Показати приклад</button></div><p class="feedback" role="status" hidden></p><details class="writing-hint"><summary>Як побудувати думку</summary><div class="hint-content"><p>${escapeHtml(item.hint)}</p>${item.target?`<p><strong>Конструкція:</strong> <span lang="en">${escapeHtml(item.target)}</span></p>`:''}${item.wordBank?`<p><strong>Слова, які можуть допомогти:</strong> ${escapeHtml(item.wordBank)}</p>`:''}</div></details><div class="example-box feedback" hidden>${item.examples.map((e,i)=>`<p lang="en">${i+1}. ${escapeHtml(e)}</p>`).join('')}</div></article>`;
}
function bindRow(row,item,kind){
 const values=kind==='writing'?state.writing:state.drills;
 const checks=kind==='writing'?state.writingChecks:state.drillChecks;
 const input=row.querySelector('textarea'); const fb=row.querySelector('.feedback'); const example=row.querySelector('.example-box');
 if(checks[item.id] && values[item.id])feedback(fb,checks[item.id]);
 input.addEventListener('input',()=>{values[item.id]=input.value;delete checks[item.id];fb.hidden=true;example.hidden=true;saveDraft();updateMirrors();updatePrompt();updateCounts();});
 row.querySelector('[data-check-row]').addEventListener('click',()=>{
  const result=C.check(input.value,item);checks[item.id]=result;feedback(fb,result);example.hidden=true;
  saveDraft();updateCounts();updatePrompt();
 });
 row.querySelector('[data-reveal-example]').addEventListener('click',()=>{
  if(!input.value.trim()){feedback(fb,{status:'review',message:'Спочатку напиши хоча б частину власної версії. Якщо важко почати, відкрий «Як побудувати думку» — там є конструкція й пояснення.'});return;}
  const result=C.check(input.value,item);
  if(result.status==='accepted'){checks[item.id]=result;feedback(fb,result);example.hidden=true;saveDraft();updateCounts();return;}
  example.hidden=!example.hidden;
 });
}
function renderWriting(){
 $("#writing-rows").innerHTML=L.writing.slice(0,state.visibleWriting).map((r,i)=>rowMarkup(r,i,'writing')).join('');
 $$('#writing-rows .writing-row').forEach((r,i)=>bindRow(r,L.writing[i],'writing'));updateCounts();
}
function dialogueNature(p){return state.fields[`nature_${p.id}`]||'hypothetical';}
function currentPractice(){return selectedPhrases().slice(0,state.visibleDrills);}
function renderDrills(){
 const items=currentPractice();
 state.drillIndex=Math.min(Math.max(0,state.drillIndex||0),Math.max(0,items.length-1));
 $('#prev-drill').disabled=state.drillIndex===0;
 $('#next-drill').disabled=!items.length||state.drillIndex===items.length-1;
 $('#drill-position').textContent=items.length?`${state.drillIndex+1} / ${items.length}`:'Немає вибраних фраз';
 if(!items.length){
  $('#drill-grid').innerHTML='<p>Обери вираз, з якого почнемо:</p>'+L.phrases.slice(0,9).map(p=>`<label class="checkline"><input type="checkbox" data-local-phrase="${p.id}"> ${escapeHtml(p.en)} — ${escapeHtml(p.ua)}</label>`).join('');
  $$('#drill-grid [data-local-phrase]').forEach(el=>el.addEventListener('change',()=>{state.selected.push(el.dataset.localPhrase);saveDraft();renderPhraseLibrary();renderDrills();updateMirrors();updatePrompt();renderHintTable();}));updateCounts();return;
 }
 const p=items[state.drillIndex],item=p.practice;
 $('#drill-grid').innerHTML=`<article class="phrase-drill" data-drill-id="${p.id}"><div class="row-number">РЕПЛІКА ${state.drillIndex+1}</div><p class="dialogue-question" lang="en">${escapeHtml(p.question)}</p><p class="helper">${escapeHtml(item.questionUa)}</p><div class="exercise-cue"><span>Скажи саме цю думку англійською</span><p class="cue">${escapeHtml(item.cue)}</p></div><label for="drill-${p.id}">Напиши повне речення</label><textarea id="drill-${p.id}" rows="3" spellcheck="false" aria-describedby="practice-instruction">${escapeHtml(state.drills[p.id]||'')}</textarea><p id="practice-instruction" class="helper">Зміст уже задано вище. Якщо бракує слів — відкрий допомогу нижче.</p><div class="row-actions"><button type="button" data-check-drill>Перевірити речення</button><button type="button" class="secondary" data-example-drill>Показати можливу відповідь</button></div><p class="feedback" role="status" hidden></p><details class="writing-hint"><summary>Допомога саме до цієї репліки</summary><div class="hint-content"><p>${escapeHtml(item.hint)}</p><p><strong>Опорна фраза:</strong></p><p lang="en">${escapeHtml(item.target||p.en)}</p><p>${escapeHtml(item.cue)}</p><p class="helper">Якщо опорна фраза вже повністю передає українську думку, додаткові слова не потрібні.</p></div></details><div class="example-box" hidden><p>Один можливий варіант. Додаткові деталі не є обов’язковими:</p>${item.examples.map(e=>`<p lang="en">${escapeHtml(e)}</p>`).join('')}<p>Задана думка: ${escapeHtml(item.cue)}</p></div><div class="spoken-reply" hidden><strong>Тепер скажи свою версію вголос</strong><p lang="en"></p><button type="button" class="secondary" data-spoken-next>Я проговорив — наступна репліка →</button></div></article>`;
 const row=$('#drill-grid .phrase-drill'),input=row.querySelector('textarea'),fb=row.querySelector('.feedback'),example=row.querySelector('.example-box'),spoken=row.querySelector('.spoken-reply');
 const showResult=result=>{feedback(fb,result);example.hidden=true;spoken.hidden=result.status!=='accepted';if(!spoken.hidden)spoken.querySelector('p').textContent=input.value;};
 if(state.drillChecks[p.id])showResult(state.drillChecks[p.id]);
 input.addEventListener('input',()=>{state.drills[p.id]=input.value;delete state.drillChecks[p.id];fb.hidden=true;example.hidden=true;spoken.hidden=true;saveDraft();updateCounts();updateMirrors();updatePrompt();});
 row.querySelector('[data-check-drill]').onclick=()=>{
  const result=C.check(input.value,item);
  if(result.status==='review')result.message=`Твоя версія: «${input.value.trim()}»\nЯвної помилки в перевірених конструкціях не знайдено. Цей офлайн-перевіряльник не оцінює всі можливі перефразування, тому не називає твою версію неправильною.\nДля самоперевірки звір лише задану думку: «${item.cue}». Якщо вона передана повністю, можеш іти далі; довший приклад не є обов’язковим.`;
  state.drillChecks[p.id]=result;showResult(result);saveDraft();updateCounts();updatePrompt();
 };
 row.querySelector('[data-example-drill]').onclick=()=>{
  if(!input.value.trim()){feedback(fb,{status:'review',message:'Спочатку спробуй написати хоча б початок. Відкрий «Допомога: фраза та її побудова», якщо не знаєш, з чого почати.'});return;}
  const result=C.check(input.value,item);if(result.status==='accepted'){state.drillChecks[p.id]=result;showResult(result);saveDraft();return;}example.hidden=!example.hidden;
 };
 row.querySelector('[data-spoken-next]').onclick=()=>{
  state.fields[`practiceSpoken_${p.id}`]=true;saveDraft();
  if(state.drillIndex<items.length-1){state.drillIndex++;renderDrills();$('#drill-grid').scrollIntoView({block:'center',behavior:'smooth'});}
  else feedback(fb,{status:'accepted',message:'Ти позначив усне повторення. Поточний набір завершено. Можеш перейти до кроку 5 або додати ще дві репліки.'});
 };updateCounts();
}
function updateCounts(){
 const accepted=Object.keys(state.writingChecks).filter(id=>state.writing[id]?.trim()&&state.writingChecks[id]?.status==='accepted').length;
 const attempted=L.writing.filter(r=>state.writing[r.id]?.trim()).length;
 const unseen=L.writing.length-state.visibleWriting;
 $('#writing-status').textContent=`Написано ${attempted}; підтверджено перевіркою ${accepted}. Чотири речення — основа.${unseen?'':' Сьогодні все.'}`;
 $('#more-writing').disabled=unseen<=0;$('#more-writing').textContent=unseen?'Додати ще 2':'Сьогодні все';
 const items=currentPractice(),all=selectedPhrases(),done=all.filter(p=>state.drillChecks[p.id]?.status==='accepted').length;
 $('#drill-status').textContent=`Перевірено ${done} із ${all.length}. Доступно ${items.length}. Трьох спроб достатньо.`;
 $('#more-drills').disabled=items.length>=all.length;$('#more-drills').textContent=items.length>=all.length?'Сьогодні все':'Додати ще 2';
}

function renderPhraseLibrary(){
 const statuses={new:L.rotationLabel||'Нова у доступних пакетах',review:'Повторення',repair:'Із минулої помилки',optional:'За потреби · не нове завдання'};
 const markup=p=>`<article class="phrase-item"><div class="badge">${statuses[p.status]}</div><div class="phrase-line" lang="en">${escapeHtml(p.en)}</div><div class="translation">${escapeHtml(p.ua)}</div><label><input type="checkbox" data-phrase-id="${p.id}" ${state.selected.includes(p.id)?'checked':''}> У моєму наборі</label></article>`;
 $("#active-phrases").innerHTML=L.phrases.slice(0,9).map(markup).join('');$("#optional-phrases").innerHTML=L.phrases.slice(9).map(markup).join('');
 $$('[data-phrase-id]').forEach(el=>el.addEventListener('change',()=>{const id=el.dataset.phraseId;state.selected=el.checked?[...new Set([...state.selected,id])]:state.selected.filter(x=>x!==id);saveDraft();renderDrills();updateMirrors();updatePrompt();renderHintTable();}));
 $("#selected-count").textContent=`${state.selected.length} фраз`;
}
function renderAnswerParts(){
 $('#assembled-text').hidden=!state.fields.fullAnswer?.trim();
 state.answerIndex=Math.max(0,Math.min(3,Number(state.answerIndex)||0));
 $('#answer-part-position').textContent=`Речення ${state.answerIndex+1} / 4`;
 $('#prev-answer-part').disabled=state.answerIndex===0;
 $('#next-answer-part').textContent=state.answerIndex===3?'Зібрати відповідь ↓':'Наступне речення →';
 $('#answer-parts').innerHTML=L.answerGuide.map((g,i)=>`<article class="answer-part" data-answer-part="${i}" ${i!==state.answerIndex?'hidden':''}><h3>${i+1}. ${escapeHtml(g.label)}</h3><p class="answer-cue">${escapeHtml(g.cue)}</p><div class="answer-editor"><div><label for="answer-part-${i}">Твоє речення англійською</label><textarea id="answer-part-${i}" rows="3">${escapeHtml(state.fields[`answerPart_${i}`]||'')}</textarea><button type="button" class="secondary" data-check-part>Перевірити це речення</button></div><aside class="sentence-support"><strong>Почни так</strong><p lang="en">${escapeHtml(g.starter)}</p><p>${escapeHtml(g.wordBank)}</p><details class="writing-hint"><summary>Пояснення конструкції</summary><div class="hint-content">${escapeHtml(g.hint)}</div></details></aside></div><p class="feedback" role="status" hidden></p><button type="button" class="text-button" data-part-example>Показати приклад після спроби</button><div class="example-box" hidden><p lang="en">${escapeHtml(g.examples[0])}</p></div></article>`).join('');
 $$('#answer-parts .answer-part').forEach((row,i)=>{
  const input=row.querySelector('textarea'),fb=row.querySelector('.feedback'),example=row.querySelector('.example-box'),g=L.answerGuide[i];
  input.oninput=()=>{state.fields[`answerPart_${i}`]=input.value;fb.hidden=true;example.hidden=true;$('#assembly-status').textContent='Речення змінено. Натисни «Зібрати мою відповідь», щоб перенести правку в текст для говоріння.';saveDraft();};
  row.querySelector('[data-check-part]').onclick=()=>{const result=C.check(input.value,g);if(result.status==='review')result.message=`Твоя версія: «${input.value.trim()}»\nЯвної помилки в перевірених конструкціях не знайшов. Для цього речення перевір: ${g.cue}\nВільне формулювання потребує розбору у Voice; можеш використовувати цю чернетку.`;feedback(fb,result);example.hidden=true;};
  row.querySelector('[data-part-example]').onclick=()=>{if(!input.value.trim()){feedback(fb,{status:'review',message:'Спочатку спробуй продовжити початок речення з допомоги поруч. Навіть кількох слів достатньо для першої спроби.'});return;}const r=C.check(input.value,g);if(r.status==='accepted'){feedback(fb,r);example.hidden=true;return;}example.hidden=!example.hidden;};
 });
}
function importSentences(){
 let count=0;
 L.answerGuide.forEach((g,i)=>{const draft=state.writing[g.sourceId]?.trim();if(draft&&!String(state.fields[`answerPart_${i}`]||'').trim()){state.fields[`answerPart_${i}`]=draft;count++;}});
 renderAnswerParts();saveDraft();$('#import-status').textContent=count?`Перенесено ${count} речення. Тепер заміни навчальні деталі своїми у полях нижче.`:'Нових речень для перенесення немає. Твої правки збережені. Можна почати з опор у чотирьох полях нижче.';
 $('#answer-parts').scrollIntoView({block:'start',behavior:'smooth'});
}
function assembleAnswer(){
 const parts=L.answerGuide.map((_,i)=>String(state.fields[`answerPart_${i}`]||'').trim());
 const missing=parts.findIndex(s=>!s);
 if(missing>=0){state.answerIndex=missing;renderAnswerParts();$('#assembly-status').textContent=`Ще порожнє речення ${missing+1}: «${L.answerGuide[missing].label}». Напиши його за опорою поруч або перенеси свої чернетки з кроку 2.`;$('#assembly-status').scrollIntoView({block:'center',behavior:'smooth'});return;}
 const text=parts.join('\n');
 if(state.fields.fullAnswer?.trim()&&state.fields.fullAnswer!==state.fields.lastAssembly&&state.fields.fullAnswer!==text){
  $('#assembly-status').textContent='У підсумковому тексті є твої окремі правки. Вони збережені. Скопіюй потрібне речення з поля вище або очисти підсумковий текст, щоб зібрати всі чотири заново.';return;
 }
 $('#assembled-text').hidden=false;state.fields.fullAnswer=text;state.fields.lastAssembly=text;$('#full-answer').value=text;$('#full-answer-feedback').hidden=true;
 $('#assembly-status').textContent='Готово: нижче твоя відповідь із чотирьох речень. Прочитай її один раз. Потім натисни «Перейти до говоріння».';
 saveDraft();updatePrompt();$('#full-answer').scrollIntoView({block:'center',behavior:'smooth'});
}
function updateMirrors(){
 const replies=selectedPhrases().filter(p=>state.drills[p.id]?.trim());
 $('#mirrored-dialogue').innerHTML=replies.map(p=>`<blockquote lang="en">${escapeHtml(state.drills[p.id])}</blockquote>`).join('');
 $('#experiment-summary').innerHTML=`<p><strong>План:</strong> ${escapeHtml(state.fields.experimentPlan||'ще не вказано')}</p><p><strong>Спостереження:</strong> ${escapeHtml(state.fields.experimentResult||'ще не записано')}</p><p>${state.fields.experimentDone?'Ти позначив виконання дії.':'Дія поки лишається планом.'}</p>`;
 $('#selected-count').textContent=`${state.selected.length} фраз`;
 const drafts=L.writing.filter(r=>state.writing[r.id]?.trim());
 $('#mirrored-drafts').innerHTML=drafts.length?drafts.map(r=>`<blockquote lang="en">${escapeHtml(state.writing[r.id])}</blockquote>`).join(''):'<p>Попередніх чернеток ще немає. У кожному полі вище є початок і потрібні слова.</p>';
 $('#mirrored-phrases').innerHTML=selectedPhrases().map(p=>`<p lang="en">${escapeHtml(p.en)}<br><small>${escapeHtml(p.ua)}</small></p>`).join('');
 $('#personal-context-summary').textContent=state.fields.realTask?`Твоя справа: ${state.fields.realTask}`:'Обери для відповіді одну знайому справу: англійська, проєкт або текст.';
 $('#speaking-followup').hidden=!state.fields.rehearsed;
 $('#rehearsal-result').textContent=state.fields.rehearsed?'Ти позначив усну спробу. Тепер відповідай на одне уточнення нижче.':'';
}
function checkFullAnswer(){
 const value=$('#full-answer').value.trim(),fb=$('#full-answer-feedback');
 if(!value){feedback(fb,{status:'review',message:'Текст ще порожній. Заповни чотири поля вище й натисни «Зібрати мою відповідь». Саме цю відповідь потім говоритимеш.'});return;}
 const chunks=value.split(/\n+|[.!?]+(?:\s|$)/).map(s=>s.trim()).filter(Boolean);
 const major=C.check(value,{sentenceRequired:true});
 if(major.status==='revise'){feedback(fb,major);return;}
 feedback(fb,{status:'review',message:`У твоїй відповіді приблизно ${chunks.length} речень. Явної помилки в перевірених конструкціях не знайшов.${chunks.length<4?' Щоб завершити відповідь, перенеси відсутні думки з чотирьох полів вище.':''}\nПрочитай уголос: чи назвав ти конкретну дію й результат, який після неї залишиться? Повну змістову перевірку зробимо у Voice.\nТвій текст збережений і вже доступний у кроці 6.`});
 fb.scrollIntoView({block:'center',behavior:'smooth'});
}

let rehearsalCuesOnly=false;
let rehearsalStarted=false;
let rehearsalUseDemo=false;
function rehearsalMaterial(){
 if(state.fields.fullAnswer?.trim())return {kind:'personal',text:state.fields.fullAnswer.trim()};
 const drafts=L.writing.filter(r=>state.writing[r.id]?.trim()).slice(0,4).map(r=>state.writing[r.id].trim());
 if(drafts.length)return {kind:'drafts',text:drafts.join('\n')};
 if(rehearsalUseDemo)return {kind:'demo',text:L.speakingGuide.demo.join('\n')};
 return {kind:'empty',text:''};
}
function renderRehearsal(){
 $('#rehearsal-practice').hidden=!rehearsalStarted;
 $('#speaking-followup').hidden=!state.fields.rehearsed;
 const material=rehearsalMaterial(),labels={personal:'Твоя відповідь із кроку 5',drafts:'Твої речення з кроку 2 — чернетка для говоріння',demo:'Навчальний приклад — його можна потренувати; це не твій досвід'};
 $('#rehearsal-source').innerHTML=material.text?`<div class="rehearsal-text" ${rehearsalCuesOnly?'hidden':''}><h3>${labels[material.kind]}</h3>${material.text.split(/\n+/).filter(Boolean).map(s=>`<p lang="en">${escapeHtml(s)}</p>`).join('')}${material.kind==='demo'?`<details><summary>Переклад навчального прикладу</summary>${L.speakingGuide.demoUa.map(s=>`<p>${escapeHtml(s)}</p>`).join('')}</details>`:''}</div>`:'<div class="empty-lesson"><h3>Почнемо з готового матеріалу</h3><p>Власної відповіді ще немає. Можеш спочатку потренувати короткий навчальний приклад про англійську або скласти свою відповідь із підтримкою.</p><button id="use-speaking-demo" type="button">Потренувати навчальний приклад</button><button id="prepare-own-answer" class="secondary" type="button">Скласти свою відповідь →</button></div>';
 $('.speech-toolbar').hidden=!material.text;
 $('#rehearsal-instruction').hidden=!material.text;
 $('#rehearse-with-cues').disabled=!material.text;$('#show-rehearsal-text').disabled=!material.text||!rehearsalCuesOnly;
 $('#use-speaking-demo')?.addEventListener('click',()=>{rehearsalUseDemo=true;rehearsalCuesOnly=false;renderRehearsal();});
 $('#prepare-own-answer')?.addEventListener('click',()=>showStep(4));
 $('#speaking-anchors').innerHTML=L.speakingGuide.anchors.map(a=>`<article class="speaking-anchor"><strong>${escapeHtml(a.label)}</strong><p>${escapeHtml(a.cue)}</p><details><summary>Показати англійську опору</summary><p lang="en">${escapeHtml(a.starter)}</p><p>${escapeHtml(a.help)}</p></details></article>`).join('');
}
let timerId=null,timerEnd=0;
function stopTimer(){if(timerId)clearInterval(timerId);timerId=null;$("#start-timer").disabled=false;$("#stop-timer").disabled=true;}
function startTimer(){stopTimer();timerEnd=Date.now()+75000;$("#start-timer").disabled=true;$("#stop-timer").disabled=false;
 const tick=()=>{const s=Math.max(0,Math.ceil((timerEnd-Date.now())/1000));$("#timer-display").textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;if(s===0){stopTimer();$("#timer-display").textContent='Час минув';}};tick();timerId=setInterval(tick,250);
}
function renderSurprise(){
 const q=L.surprises[state.surpriseIndex];
 $('#surprise-question').innerHTML=`<p class="control-question" lang="en">${escapeHtml(q.q)}</p><p>${escapeHtml(q.ua)}</p><p class="tutor-message">${escapeHtml(q.hint)}</p><details><summary>Допомога до відповіді</summary><p lang="en">${escapeHtml(q.starter)}</p><p>Можливий приклад:</p><p lang="en">${escapeHtml(q.example)}</p><p>${escapeHtml(q.exampleUa)}</p></details><p class="helper">${state.surpriseIndex+1} із ${L.surprises.length}. Дай одну коротку відповідь уголос — цього достатньо.</p>`;
 $('#next-surprise').disabled=state.surpriseIndex===L.surprises.length-1;
 $('#next-surprise').textContent=state.surpriseIndex===L.surprises.length-1?'Сьогодні все':'Інше уточнення';
}
function renderHintTable(){
 const selected=new Set(state.selected);
 $('#visible-questions').innerHTML=L.followups.map(q=>`<article class="short-question"><p lang="en">${escapeHtml(q.q)}</p><p class="helper">${escapeHtml(q.ua)}</p><details><summary>Підказка для думки</summary><p>${escapeHtml(q.hint)}</p><p lang="en">${escapeHtml(q.starter)}</p></details></article>`).join('');
 $("#hint-table").innerHTML=L.followups.map(q=>{
  const relevant=q.phrases.map(id=>L.phrases.find(p=>p.id===id));
  return `<tr><td><span lang="en">${escapeHtml(q.q)}</span><br>${escapeHtml(q.ua)}<details><summary>Підказка</summary>${escapeHtml(q.hint)}</details></td><td>${relevant.map(p=>`<p><span lang="en">${escapeHtml(p.en)}</span><br>${escapeHtml(p.ua)}${selected.has(p.id)?'<br><small>У твоєму наборі</small>':''}</p>`).join('')}<small>${escapeHtml(q.hint)}</small></td></tr>`;
 }).join('');
}
function renderRepairs(){
 $("#repair-bank").innerHTML=L.repairs.map(p=>`<article class="repair-item"><strong lang="en">${escapeHtml(p.answer)}</strong><p>${escapeHtml(p.ua)}</p><p class="helper">${escapeHtml(p.context)}</p><details><summary>Чому ця фраза повернулася</summary><p>У записі було: <span lang="en">${escapeHtml(p.wrong)}</span></p><p>${escapeHtml(p.why)}</p><a href="../${escapeHtml(p.source)}">${escapeHtml(p.sourceLabel||"Джерело: збережена розмова")}</a></details><label class="checkline"><input type="checkbox" data-repair="${p.id}" ${state.repairs[p.id]?'checked':''}> Вжив у Voice</label></article>`).join('');
 $$('[data-repair]').forEach(el=>el.addEventListener('change',()=>{state.repairs[el.dataset.repair]=el.checked;saveDraft();updateRepairProgress();}));updateRepairProgress();
}
function updateRepairProgress(){$('#repair-progress').textContent=`Ти позначив використання ${L.repairs.filter(p=>state.repairs[p.id]).length} із ${L.repairs.length} фраз. Це твій звіт, не автоматична оцінка мовлення.`;}
function buildPrompt(){
 const style={curious:'Be curious and calm.',colleague:'Think through the example collaboratively.',challenge:'Offer more friendly challenges, but only to actual claims.'}[state.fields.voiceStyle]||'Be curious and calm.';
 const data={current_case:state.fields.realTask||L.voiceFallbackCase,blocker:state.fields.blocker||'Unknown; do not diagnose.',context_correction:state.fields.contextCorrection||'',draft:state.fields.fullAnswer||'',answer_parts:L.answerGuide.map((g,i)=>({purpose:g.label,text:state.fields[`answerPart_${i}`]||'',status:'Learner draft; personal facts need confirmation.'})),writing_practice:L.writing.filter(r=>state.writing[r.id]?.trim()).map(r=>({cue:r.ua,draft:state.writing[r.id],status:'Controlled teaching example. Do not assume autobiographical truth.'})),dialogue_practice:selectedPhrases().filter(p=>state.drills[p.id]?.trim()).map(p=>({question:p.question,reply:state.drills[p.id],nature:dialogueNature(p),check:state.drillChecks[p.id]?.status||'not checked'})),experiment:{plan:state.fields.experimentPlan||'',observation:state.fields.experimentResult||'',user_marked_done:state.fields.experimentDone===true},context:L.knownContext,next_question:state.fields.nextTopic||''};
 const slots={style,question:L.question,targets:selectedPhrases().map(p=>`${p.en} [${p.status}]`).join('; ')||'No selected target phrases; assess clarity in my own words.',learner:JSON.stringify(data,null,2)};
 return L.voiceTemplate.replace(/\{\{(style|question|targets|learner)\}\}/g,(_,key)=>slots[key]);
}
function updatePrompt(){$('#prompt').value=buildPrompt();}
async function copyText(value,statusNode){
 try{if(!navigator.clipboard?.writeText)throw new Error('clipboard');await navigator.clipboard.writeText(value);statusNode.textContent='Скопійовано.';}
 catch{statusNode.textContent='Автоматичне копіювання недоступне. Відкрий поле з текстом і скопіюй вручну.';const box=$('#prompt');if(value===box.value){box.closest('details').open=true;box.focus();box.select();}else downloadRecord();}
}
function recordForSave(){return {...state,meta:{date:L.date,unitDay:L.day,controlQuestion:L.question,progressPolicy:'User evidence only; navigation, typing and automatic checks are not mastery.',newPhrases:L.phrases.filter(p=>p.status==='new').map(p=>p.en),selectedPhrases:selectedPhrases().map(p=>({id:p.id,en:p.en,status:p.status})),followupInstruction:'Next lesson: read this record; verify personal facts vs hypotheses; use actual Voice errors to choose 3–5 review items; respond to learner feedback; do not award progress without evidence.'}};}
function recordText(){return `Це мій підсумок пробного уроку ${L.date}. Перевір зміст і англійську в моїх реальних відповідях; дрібні описки не блокують. Покажи одну головну правку за раз. Збережи підтверджені особисті факти окремо від гіпотез, обери 3–5 фраз на повторення й використай мій відгук для наступного уроку. Не переписуй загальні правила без мого окремого прохання і не став прогрес без доказів.\n\n${JSON.stringify(recordForSave(),null,2)}`;}
function downloadRecord(){
 const blob=new Blob([JSON.stringify(recordForSave(),null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${L.id}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);$('#memory-status').textContent='Підготовлено копію запису. Її можна передати в цей чат для наступного уроку.';
}
function taskRequest(id) {
 const task=L.tasks.find(t=>t.id===id),note=state.taskNotes[id]||{},scope=note.scope||'question';
 if(!task)throw new Error('Unknown task');
 const opening={question:'Поясни логіку й оціни доцільність цієї вправи. Чи допомагає вона відповісти на питання дня? Покажи, що можна спростити або замінити. Поки не змінюй вправу.',lesson:'Зміни цю вправу лише в зазначеному уроці. Врахуй пов’язані вправи й збережи мої чернетки.',future:'Зміни правило цієї вправи для майбутніх уроків. Поясни, як нове правило вплине на результат і пов’язані вправи.'}[scope]||'Поясни цю вправу.';
 return `Урок ${L.date}, день ${L.day}. Вправа ${task.number}: «${task.name}».\nПитання уроку: ${L.question}\n\n${opening}\n\nМоє зауваження: ${String(note.text||'Хочу зрозуміти, навіщо потрібен цей крок.').trim()}`;
}
function renderTaskControls() {
 for(const task of L.tasks){
  const note=$(`[data-task-note="${task.id}"]`),scope=$(`[data-task-scope="${task.id}"]`),button=$(`[data-copy-task="${task.id}"]`);
  if(!note||!scope||!button)continue;
  const saved=state.taskNotes[task.id]||{};note.value=typeof saved.text==='string'?saved.text:'';scope.value=['question','lesson','future'].includes(saved.scope)?saved.scope:'question';
  const persist=()=>{state.taskNotes[task.id]={text:note.value,scope:scope.value};$(`[data-task-copy-status="${task.id}"]`).textContent='';$(`[data-task-request="${task.id}"]`).hidden=true;$(`[data-task-request-label="${task.id}"]`).hidden=true;saveDraft();};
  note.oninput=persist;scope.onchange=persist;
  button.onclick=async()=>{
   const status=$(`[data-task-copy-status="${task.id}"]`);
   if(scope.value!=='question'&&!note.value.trim()){status.textContent='Спочатку опиши, що саме змінити. Для простого розбору вибери «Розібрати доцільність».';note.focus();return;}
   state.taskNotes[task.id]={text:note.value,scope:scope.value};saveDraft();
   const request=taskRequest(task.id),box=$(`[data-task-request="${task.id}"]`);box.value=request;box.hidden=false;$(`[data-task-request-label="${task.id}"]`).hidden=false;
   try{if(!navigator.clipboard?.writeText)throw new Error('clipboard');await navigator.clipboard.writeText(request);status.textContent='Скопійовано. Встав у чат; за потреби додай фото. Запит ще не надіслано.';}
   catch{status.textContent='Скопіюй текст із поля нижче й встав у чат. Запит ще не надіслано.';box.focus();box.select();}
  };
 }
}
function renderAll(){renderTaskControls();renderStatic();setFields();renderNavigation();renderWriting();renderPhraseLibrary();renderDrills();renderAnswerParts();renderRepairs();renderSurprise();renderHintTable();showStep(state.step,false);}
$$('[data-save]').forEach(el=>el.addEventListener(el.type==='checkbox'||el.tagName==='SELECT'?'change':'input',()=>{state.fields[el.dataset.save]=el.type==='checkbox'?el.checked:el.value;saveDraft();if(el.dataset.save==='fullAnswer')$('#full-answer-feedback').hidden=true;if(el.dataset.save==='rehearsed'&&el.checked){$('#speaking-followup').hidden=false;$('#speaking-followup').scrollIntoView({block:'center',behavior:'smooth'});}updateMirrors();updatePrompt();}));
$('#prev-step').addEventListener('click',()=>showStep(state.step-1));$('#next-step').addEventListener('click',()=>showStep(state.step+1));
$('#more-writing').addEventListener('click',()=>{state.visibleWriting=Math.min(L.writing.length,state.visibleWriting+2);renderWriting();saveDraft();});
$('#more-drills').addEventListener('click',()=>{state.drillIndex=currentPractice().length;state.visibleDrills=Math.min(selectedPhrases().length,state.visibleDrills+2);renderDrills();saveDraft();});
$('#assemble-answer').addEventListener('click',assembleAnswer);
$('#import-sentences').addEventListener('click',importSentences);
$('#prev-answer-part').addEventListener('click',()=>{state.answerIndex=Math.max(0,state.answerIndex-1);renderAnswerParts();saveDraft();});
$('#next-answer-part').addEventListener('click',()=>{if(state.answerIndex===3){assembleAnswer();return;}state.answerIndex++;renderAnswerParts();saveDraft();});
$('#check-full-answer').addEventListener('click',checkFullAnswer);
$('#start-timer').addEventListener('click',startTimer);$('#stop-timer').addEventListener('click',stopTimer);
$('#next-surprise').addEventListener('click',()=>{state.surpriseIndex=Math.min(L.surprises.length-1,state.surpriseIndex+1);renderSurprise();saveDraft();});
$('#prev-drill').addEventListener('click',()=>{state.drillIndex=Math.max(0,state.drillIndex-1);renderDrills();saveDraft();});
$('#next-drill').addEventListener('click',()=>{state.drillIndex=Math.min(currentPractice().length-1,state.drillIndex+1);renderDrills();saveDraft();});
$('#go-rehearse').addEventListener('click',()=>showStep(5));
$('#go-voice').addEventListener('click',()=>showStep(6));
$('#rehearse-with-cues').addEventListener('click',()=>{rehearsalStarted=true;rehearsalCuesOnly=true;renderRehearsal();$('#rehearsal-instruction').textContent='Говори за пунктами нижче. Почни зі своєї справи, потім поясни момент, дію й результат. Застряг — відкрий англійську опору біля потрібного пункту.';$('#speaking-anchors').scrollIntoView({block:'start',behavior:'smooth'});});
$('#show-rehearsal-text').addEventListener('click',()=>{rehearsalCuesOnly=false;renderRehearsal();$('#rehearsal-instruction').textContent='Повний текст знову видно. Переглянь потрібне речення й повтори його своїми словами.';$('#rehearsal-source').scrollIntoView({block:'start',behavior:'smooth'});});
$('#copy-prompt').addEventListener('click',()=>copyText(buildPrompt(),$('#copy-status')));
$('#export-memory').addEventListener('click',downloadRecord);$('#copy-record').addEventListener('click',()=>copyText(recordText(),$('#memory-status')));
let availableLessonId = '';
let checkingLesson = false;
async function checkCurrentLesson() {
 if (checkingLesson || availableLessonId || location.protocol === 'file:') return;
 checkingLesson = true;
 try {
  const response = await fetch(location.pathname, {cache:'no-store', signal:AbortSignal.timeout(5000)});
  if (!response.ok) return;
  const documentOnServer = new DOMParser().parseFromString(await response.text(), 'text/html');
  const serverLessonId = documentOnServer.querySelector('meta[name="lesson-id"]')?.content;
  if (!serverLessonId || serverLessonId === L.id) return;
  availableLessonId = serverLessonId;
  $('#lesson-update').hidden = false;
  $('#lesson-update-message').textContent = 'Є новий урок. Ця вкладка ще показує попередній матеріал.';
 } catch { /* Keep the current lesson available while the local server is unreachable. */ }
 finally { checkingLesson = false; }
}
$('#load-new-lesson').addEventListener('click', () => {
 saveDraft();
 if (!storageAvailable) {
  $('#lesson-update-message').textContent = 'Чернетку не вдалося зберегти. Завантаж її копію на кроці 8 перед оновленням.';
  return;
 }
 location.replace(`${location.pathname}?lesson=${encodeURIComponent(availableLessonId)}${location.hash}`);
});
window.addEventListener('focus', checkCurrentLesson);
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkCurrentLesson(); });
setInterval(() => { if (!document.hidden) checkCurrentLesson(); }, 60000);
renderAll();if(!storageAvailable)$('#save-status').textContent='Збереження браузера недоступне — завантаж копію на кроці 8';checkCurrentLesson();
// Read-only QA hooks: no progress or completed actions are generated here.
globalThis.PilotApp={buildPrompt,recordForSave,cleanState,taskRequest,rehearsalMaterial};
