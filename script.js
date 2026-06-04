const state = { cards: [], pool: [], index: 0, stage: 'all', hardOnly: false };
const quiz = { pool: [], index: 0, score: 0, answered: false, stage: 'all' };
const $ = (id) => document.getElementById(id);
const categories = ['Historia języków', 'Python', 'JavaScript'];

function loadProgress(){ return JSON.parse(localStorage.getItem('jezyki_interpretowane_progress') || '{}'); }
function saveProgress(p){ localStorage.setItem('jezyki_interpretowane_progress', JSON.stringify(p)); renderStats(); }
function shuffle(arr){ return [...arr].sort(() => Math.random() - 0.5); }
function showScreen(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(id).classList.add('active'); }

async function init(){
  state.cards = await fetch('data/cards.json').then(r => r.json());
  renderStages(); renderStats();
  $('resetStats').onclick = () => { localStorage.removeItem('jezyki_interpretowane_progress'); renderStats(); };
  $('backBtn').onclick = () => showScreen('start');
  $('quizBackBtn').onclick = () => showScreen('start');
  $('showBtn').onclick = showAnswer;
  $('okBtn').onclick = () => mark('known');
  $('againBtn').onclick = () => mark('hard');
  $('nextBtn').onclick = next;
  $('prevBtn').onclick = prev;
  $('shuffleBtn').onclick = () => startStage(state.stage, state.hardOnly);
  $('hardOnlyBtn').onclick = () => startStage(state.stage, true);
  $('quizStartBtn').onclick = () => startQuiz('all');
  $('quizFromStageBtn').onclick = () => startQuiz(state.stage);
  $('restartQuizBtn').onclick = () => startQuiz(quiz.stage);
  $('quizNextBtn').onclick = quizNext;
}

function renderStages(){
  const box = $('stages'); box.innerHTML = '';
  const all = [{name:'Wszystkie pytania', key:'all', count:state.cards.length}, ...categories.map(c=>({name:c,key:c,count:state.cards.filter(x=>x.category===c).length}))];
  all.push({name:'Tylko trudne', key:'hard', count:countHard()});
  all.forEach(s => {
    const btn = document.createElement('button'); btn.className='stage';
    const desc = s.key === 'hard' ? 'powtórka pytań oznaczonych jako trudne' : 'kliknij, żeby zacząć losową powtórkę';
    btn.innerHTML = `<b>${s.name}</b><span>${s.count} pytań • ${desc}</span>`;
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
  $('question').textContent = card.id + ') ' + card.question;
  $('answer').textContent = card.answer;
  $('answer').classList.add('hidden');
  $('showBtn').classList.remove('hidden');
  $('okBtn').classList.add('hidden'); $('againBtn').classList.add('hidden');
  $('counter').textContent = `${state.index+1} / ${state.pool.length}`;
  $('categoryPill').textContent = card.category;
  $('progress').style.width = `${((state.index+1)/state.pool.length)*100}%`;
}
function showAnswer(){ $('answer').classList.remove('hidden'); $('showBtn').classList.add('hidden'); $('okBtn').classList.remove('hidden'); $('againBtn').classList.remove('hidden'); }
function mark(type){ const card=state.pool[state.index]; const p=loadProgress(); p[card.id]=type; saveProgress(p); next(); }
function next(){ state.index = (state.index + 1) % state.pool.length; renderCard(); }
function prev(){ state.index = (state.index - 1 + state.pool.length) % state.pool.length; renderCard(); }

function startQuiz(stage='all'){
  quiz.stage = stage;
  let pool = stage==='all' ? state.cards : state.cards.filter(c=>c.category===stage);
  quiz.pool = shuffle(pool).slice(0, Math.min(12, pool.length));
  quiz.index = 0; quiz.score = 0; quiz.answered = false;
  $('quizTitle').textContent = stage==='all' ? 'Quiz ze wszystkich pytań' : `Quiz: ${stage}`;
  showScreen('quiz'); renderQuiz();
}
function makeOptions(card){
  const wrong = shuffle(state.cards.filter(c=>c.id!==card.id).map(c=>c.answer)).slice(0,3);
  return shuffle([card.answer, ...wrong]);
}
function renderQuiz(){
  const card = quiz.pool[quiz.index];
  quiz.answered = false;
  $('quizQuestion').textContent = card.id + ') ' + card.question;
  $('quizCounter').textContent = `${quiz.index+1} / ${quiz.pool.length}`;
  $('quizScore').textContent = `Wynik: ${quiz.score}`;
  $('quizProgress').style.width = `${((quiz.index+1)/quiz.pool.length)*100}%`;
  $('quizFeedback').classList.add('hidden');
  $('quizNextBtn').classList.add('hidden');
  const options = $('quizOptions'); options.innerHTML = '';
  makeOptions(card).forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option'; btn.textContent = opt;
    btn.onclick = () => chooseAnswer(btn, opt, card.answer);
    options.appendChild(btn);
  });
}
function chooseAnswer(btn, picked, correct){
  if(quiz.answered) return;
  quiz.answered = true;
  document.querySelectorAll('.option').forEach(o => {
    o.disabled = true;
    if(o.textContent === correct) o.classList.add('correct');
  });
  if(picked === correct){ quiz.score++; btn.classList.add('correct'); $('quizFeedback').textContent = 'Dobrze ✅'; }
  else { btn.classList.add('wrong'); $('quizFeedback').textContent = `Źle. Poprawna odpowiedź: ${correct}`; }
  $('quizScore').textContent = `Wynik: ${quiz.score}`;
  $('quizFeedback').classList.remove('hidden');
  $('quizNextBtn').classList.remove('hidden');
}
function quizNext(){
  if(quiz.index + 1 >= quiz.pool.length){
    $('quizQuestion').textContent = `Koniec quizu — wynik: ${quiz.score}/${quiz.pool.length}`;
    $('quizOptions').innerHTML = '';
    $('quizFeedback').textContent = quiz.score === quiz.pool.length ? 'Idealnie. Wszystko umiesz 🔥' : 'Zapisz trudne pytania i powtórz fiszki.';
    $('quizFeedback').classList.remove('hidden');
    $('quizNextBtn').classList.add('hidden');
    return;
  }
  quiz.index++; renderQuiz();
}
init();
