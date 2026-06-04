const state = { cards: [], pool: [], index: 0, stage: 'all', hardOnly: false, quizPool: [], quizIndex: 0, score: 0, quizStage: 'all', answered: false };
const $ = (id) => document.getElementById(id);
const storageKey = 'jezyki_interpretowane_progress_v3';

function loadProgress(){ return JSON.parse(localStorage.getItem(storageKey) || '{}'); }
function saveProgress(p){ localStorage.setItem(storageKey, JSON.stringify(p)); renderStats(); }
function shuffle(arr){ return [...arr].sort(() => Math.random() - 0.5); }
function uniqueCategories(){ return [...new Set(state.cards.map(c => c.category))]; }
function escapeHtml(text){ return String(text).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }
function displayText(text){ return String(text).replace(/\\\//g, '/'); }

async function init(){
  state.cards = await fetch('data/cards.json').then(r => r.json());
  renderStages(); renderStats();
  $('resetStats').onclick = () => { localStorage.removeItem(storageKey); renderStats(); };
  $('backBtn').onclick = () => showScreen('start');
  $('quizBackBtn').onclick = () => showScreen('start');
  $('showBtn').onclick = showAnswer;
  $('okBtn').onclick = () => mark('known');
  $('againBtn').onclick = () => mark('hard');
  $('nextBtn').onclick = next;
  $('prevBtn').onclick = prev;
  $('shuffleBtn').onclick = () => startStage(state.stage, state.hardOnly);
  $('hardOnlyBtn').onclick = () => startStage(state.stage, true);
  $('quickQuizBtn').onclick = () => startQuiz('all');
  $('quizFromStageBtn').onclick = () => startQuiz(state.stage);
  $('restartQuizBtn').onclick = () => startQuiz(state.quizStage);
  $('quizNextBtn').onclick = quizNext;
}
function showScreen(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(id).classList.add('active'); }
function renderStages(){
  const box = $('stages'); box.innerHTML = '';
  const cats = uniqueCategories();
  const stages = [{name:'Wszystkie pytania', key:'all', count:state.cards.length}, ...cats.map(c=>({name:c,key:c,count:state.cards.filter(x=>x.category===c).length})), {name:'Tylko trudne', key:'hard', count:countHard()}];
  stages.forEach(s => {
    const btn = document.createElement('button'); btn.className='stage';
    btn.innerHTML = `<b>${escapeHtml(s.name)}</b><span>${s.count} pytań • kliknij, żeby zacząć powtórkę</span>`;
    btn.onclick = () => s.key === 'hard' ? startStage('all', true) : startStage(s.key, false);
    box.appendChild(btn);
  });
}
function renderStats(){
  const p=loadProgress();
  $('totalCards').textContent = state.cards.length || 0;
  $('knownCards').textContent = Object.values(p).filter(v=>v==='known').length;
  $('hardCards').textContent = Object.values(p).filter(v=>v==='hard').length;
  if(state.cards.length) renderStages();
}
function countHard(){ const p=loadProgress(); return state.cards.filter(c=>p[c.id]==='hard').length; }
function startStage(stage, hardOnly=false){
  state.stage=stage; state.hardOnly=hardOnly;
  const p=loadProgress();
  let pool = stage==='all' ? state.cards : state.cards.filter(c=>c.category===stage);
  if(hardOnly) pool = pool.filter(c=>p[c.id]==='hard');
  if(pool.length===0) pool = state.cards;
  state.pool = shuffle(pool); state.index=0;
  $('stageTitle').textContent = hardOnly ? 'Powtórka trudnych pytań' : (stage==='all' ? 'Wszystkie pytania' : stage);
  $('modeLabel').textContent = hardOnly ? 'Tryb powtórki' : 'Tryb nauki';
  showScreen('learn'); renderCard();
}
function renderCard(){
  const card = state.pool[state.index];
  $('question').textContent = card.id + ') ' + displayText(card.question);
  $('answer').textContent = card.answer;
  $('explain').textContent = displayText(card.explain || '');
  if(card.code){ $('codeBlock').textContent = card.code; $('codeBlock').classList.remove('hidden'); } else { $('codeBlock').classList.add('hidden'); }
  $('answer').classList.add('hidden'); $('explain').classList.add('hidden');
  $('showBtn').classList.remove('hidden');
  $('okBtn').classList.add('hidden'); $('againBtn').classList.add('hidden');
  $('counter').textContent = `${state.index+1} / ${state.pool.length}`;
  $('categoryPill').textContent = card.category;
  $('progress').style.width = `${((state.index+1)/state.pool.length)*100}%`;
}
function showAnswer(){ $('answer').classList.remove('hidden'); $('explain').classList.remove('hidden'); $('showBtn').classList.add('hidden'); $('okBtn').classList.remove('hidden'); $('againBtn').classList.remove('hidden'); }
function mark(type){ const card=state.pool[state.index]; const p=loadProgress(); p[card.id]=type; saveProgress(p); next(); }
function next(){ state.index = (state.index + 1) % state.pool.length; renderCard(); }
function prev(){ state.index = (state.index - 1 + state.pool.length) % state.pool.length; renderCard(); }

function startQuiz(stage='all'){
  state.quizStage = stage;
  let pool = stage === 'all' ? state.cards : state.cards.filter(c => c.category === stage);
  if(!pool.length) pool = state.cards;
  state.quizPool = shuffle(pool);
  state.quizIndex = 0;
  state.score = 0;
  state.answered = false;
  $('quizTitle').textContent = stage === 'all' ? 'Szybki quiz' : `Quiz: ${stage}`;
  showScreen('quiz');
  renderQuiz();
}
function renderQuiz(){
  const card = state.quizPool[state.quizIndex];
  state.answered = false;
  $('quizQuestion').textContent = card.id + ') ' + displayText(card.question);
  if(card.code){ $('quizCodeBlock').textContent = card.code; $('quizCodeBlock').classList.remove('hidden'); } else { $('quizCodeBlock').classList.add('hidden'); }
  $('quizCounter').textContent = `${state.quizIndex+1} / ${state.quizPool.length}`;
  $('quizScore').textContent = `${state.score} pkt`;
  $('quizProgress').style.width = `${((state.quizIndex+1)/state.quizPool.length)*100}%`;
  $('quizFeedback').classList.add('hidden');
  $('quizNextBtn').classList.add('hidden');
  const optionsBox = $('quizOptions'); optionsBox.innerHTML = '';
  shuffle(card.options).forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = opt;
    btn.onclick = () => chooseAnswer(btn, opt, card);
    optionsBox.appendChild(btn);
  });
}
function chooseAnswer(btn, opt, card){
  if(state.answered) return;
  state.answered = true;
  const buttons = [...document.querySelectorAll('.option')];
  buttons.forEach(b => {
    b.disabled = true;
    if(b.textContent === card.answer) b.classList.add('correct');
  });
  if(opt === card.answer){ state.score++; btn.classList.add('correct'); }
  else btn.classList.add('wrong');
  $('quizScore').textContent = `${state.score} pkt`;
  $('quizFeedback').innerHTML = `<b>Poprawna odpowiedź:</b> ${escapeHtml(card.answer)}<br>${escapeHtml(displayText(card.explain || ''))}`;
  $('quizFeedback').classList.remove('hidden');
  $('quizNextBtn').textContent = state.quizIndex === state.quizPool.length - 1 ? 'Zakończ quiz' : 'Następne pytanie';
  $('quizNextBtn').classList.remove('hidden');
}
function quizNext(){
  if(state.quizIndex === state.quizPool.length - 1){
    $('quizQuestion').textContent = `Koniec quizu: ${state.score} / ${state.quizPool.length}`;
    $('quizCodeBlock').classList.add('hidden');
    $('quizOptions').innerHTML = '';
    $('quizFeedback').innerHTML = state.score === state.quizPool.length ? 'Super, wszystko poprawnie.' : 'Wróć do fiszek i powtórz pytania, które sprawiły problem.';
    $('quizFeedback').classList.remove('hidden');
    $('quizNextBtn').classList.add('hidden');
    return;
  }
  state.quizIndex++;
  renderQuiz();
}

init();
