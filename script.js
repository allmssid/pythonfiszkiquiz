const cards = [
  {q:"Język programowania stworzony w 1995 roku przez Japończyka Yukihiro Matsumoto to:", a:"Ruby"},
  {q:"Język programowania, który powstał w 1987 roku, został stworzony przez Larry’ego Walla:", a:"Perl"},
  {q:"Język, który został stworzony przez Brendona Eicha w firmie Netscape w 1995 to:", a:"JavaScript"},
  {q:"Twórcą języka Python jest:", a:"Guido van Rossum"},
  {q:"Jaką nazwę nosi zwyczajowo uchwyt do obiektu, który jest przekazywany do metody instancji (Python):", a:"self"},
  {q:"Jaką nazwę nosi metoda inicjalizacyjna (Python):", a:"init()"},
  {q:"Przykładem metody specjalnej jest (Python):", a:"str() (np. również init(), repr(), call())"},
  {q:"Które metody specjalne pozwalają na przekonwertowanie obiektu na łańcuch znaków (Python):", a:"str() oraz repr()"},
  {q:"Jaki błąd zawiera następujący kod (Python):", a:"Nie zawiera błędu (this może być nazwą parametru zamiast self)"},
  {q:"Co zostanie wypisane na ekranie po wykonaniu następującego kodu (Python):", a:"TypeError"},
  {q:"com = 2+2J, zmienna com jest w Pythonie typu:", a:"complex"},
  {q:"a = True, zmienna a jest w Pythonie typu:", a:"bool"},
  {q:"b = 1.0, zmienna b jest w Pythonie typu:", a:"float"},
  {q:"c = (1), zmienna c jest w Pythonie typu:", a:"int"},
  {q:"Jaka jest zawartość zmiennej s po wykonaniu następującego kodu (Python):", a:"TypeError"},
  {q:"x = (1, 2, 3), x jest (Python):", a:"tuple"},
  {q:"y = {'1': 4, '2': 3}, y jest (Python):", a:"dict"},
  {q:"z = [1, 2, 3], z jest (Python):", a:"list"},
  {q:"Funkcja, której głównym zadaniem jest przeźroczyste opakowanie innej funkcji lub klasy to, oznaczana symbolem @:", a:"Dekorator"},
  {q:"let x = /\\d+/g, x jest (JS):", a:"RegExp"},
  {q:"Są nieuporządkowaną kolekcją właściwości, które zawierają wartości typów podstawowych, innych obiektów lub funkcji (JS):", a:"Object"},
  {q:"Jaką wartość ma zmienna x po wykonaniu następującego kodu:", a:"undefined"},
  {q:"Po wykonaniu poniższego kodu (JS) z zawiera:", a:"1"},
  {q:"Jaką da wartość wyrażenie z ostatniej linijki poniższego kodu (JS):", a:"true"},
  {q:"Jaką da wartość wyrażenie z ostatniej linijki poniższego kodu (JS):", a:"false"},
  {q:"Wyrażenie regularne /\\d{4}/ dopasowuje do łańcucha:", a:"Dokładnie czterech cyfr"},
  {q:"Przy wyrażeniu regularnym /x+/ znak + oznacza:", a:"Jedno lub więcej wystąpień"},
  {q:"Przy wyrażeniu regularnym /x?/ znak ? oznacza:", a:"Zero lub jedno wystąpienie"},
  {q:"Połączenie obiektu funkcji z jej zasięgiem (wystarcza zbiór wiązań zmiennych wolnych) jest nazywane:", a:"Domknięciem (closure)"},
  {q:"Słowo let wyznacza w JS:", a:"Zasięg blokowy zmiennej"}
];

let order = [...cards.keys()];
let current = 0;
let flipped = false;
let known = new Set(JSON.parse(localStorage.getItem("knownCards") || "[]"));
let best = Number(localStorage.getItem("quizBest") || 0);
let quizOrder = [];
let quizIndex = 0;
let score = 0;
let answered = false;

const $ = (id) => document.getElementById(id);
const shuffle = (arr) => arr.map(v => [Math.random(), v]).sort((a,b) => a[0]-b[0]).map(x => x[1]);

function saveProgress(){ localStorage.setItem("knownCards", JSON.stringify([...known])); }
function updateStats(){
  $("totalCards").textContent = cards.length;
  $("knownCount").textContent = known.size;
  $("quizBest").textContent = `${best}%`;
}
function renderCard(){
  const idx = order[current];
  $("flashcard").classList.toggle("flipped", flipped);
  $("cardQuestion").textContent = cards[idx].q;
  $("cardAnswer").textContent = cards[idx].a;
  $("cardCounter").textContent = `${current + 1} / ${cards.length}`;
  const pct = Math.round(((current + 1) / cards.length) * 100);
  $("progressBar").style.width = `${pct}%`;
  $("progressText").textContent = `${pct}% przerobione`;
  updateStats();
}
function nextCard(){ current = (current + 1) % cards.length; flipped = false; renderCard(); }
function prevCard(){ current = (current - 1 + cards.length) % cards.length; flipped = false; renderCard(); }

function startQuiz(){
  quizOrder = shuffle([...cards.keys()]).slice(0, Math.min(10, cards.length));
  quizIndex = 0; score = 0; answered = false;
  $("resultBox").hidden = true;
  renderQuiz();
}
function renderQuiz(){
  answered = false;
  $("nextQuizBtn").disabled = true;
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  const idx = quizOrder[quizIndex];
  $("quizCounter").textContent = `Pytanie ${quizIndex + 1} / ${quizOrder.length}`;
  $("quizQuestion").textContent = cards[idx].q;
  const wrong = shuffle(cards.filter((_, i) => i !== idx).map(c => c.a)).slice(0, 3);
  const options = shuffle([cards[idx].a, ...wrong]);
  $("answers").innerHTML = options.map(opt => `<button class="answer-btn" data-answer="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`).join("");
  document.querySelectorAll(".answer-btn").forEach(btn => btn.addEventListener("click", () => checkAnswer(btn, cards[idx].a)));
}
function checkAnswer(button, correct){
  if(answered) return;
  answered = true;
  const chosen = button.dataset.answer;
  document.querySelectorAll(".answer-btn").forEach(btn => {
    btn.disabled = true;
    if(btn.dataset.answer === correct) btn.classList.add("correct");
  });
  if(chosen === correct){
    score++;
    button.classList.add("correct");
    $("feedback").textContent = "Dobrze!";
    $("feedback").classList.add("good");
  } else {
    button.classList.add("wrong");
    $("feedback").textContent = `Źle. Poprawna odpowiedź: ${correct}`;
    $("feedback").classList.add("bad");
  }
  $("nextQuizBtn").disabled = false;
}
function nextQuiz(){
  quizIndex++;
  if(quizIndex >= quizOrder.length){
    const pct = Math.round((score / quizOrder.length) * 100);
    best = Math.max(best, pct);
    localStorage.setItem("quizBest", best);
    updateStats();
    $("resultBox").hidden = false;
    $("resultBox").innerHTML = `<h2>Wynik: ${score}/${quizOrder.length} (${pct}%)</h2><p>${pct >= 80 ? "Elegancko, jesteś blisko gotowości." : "Powtórz fiszki i zrób quiz jeszcze raz."}</p>`;
    startQuiz();
  } else renderQuiz();
}
function renderList(filter=""){
  const term = filter.toLowerCase().trim();
  $("qaList").innerHTML = cards
    .filter(c => !term || c.q.toLowerCase().includes(term) || c.a.toLowerCase().includes(term))
    .map((c,i) => `<article class="qa-item"><h3>${i+1}. ${escapeHtml(c.q)}</h3><p><strong>Odp.:</strong> ${escapeHtml(c.a)}</p></article>`)
    .join("") || `<p class="hint">Brak wyników.</p>`;
}
function escapeHtml(text){
  return String(text).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}

document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  tab.classList.add("active");
  $(tab.dataset.view).classList.add("active");
}));
$("flashcard").addEventListener("click", () => { flipped = !flipped; renderCard(); });
$("flashcard").addEventListener("keydown", e => { if(e.code === "Space"){ e.preventDefault(); flipped = !flipped; renderCard(); }});
$("nextBtn").addEventListener("click", nextCard);
$("prevBtn").addEventListener("click", prevCard);
$("knowBtn").addEventListener("click", () => { known.add(order[current]); saveProgress(); nextCard(); });
$("shuffleBtn").addEventListener("click", () => { order = shuffle(order); current = 0; flipped = false; renderCard(); });
$("resetProgressBtn").addEventListener("click", () => { known.clear(); saveProgress(); updateStats(); });
$("newQuizBtn").addEventListener("click", startQuiz);
$("nextQuizBtn").addEventListener("click", nextQuiz);
$("searchInput").addEventListener("input", e => renderList(e.target.value));

document.addEventListener("keydown", e => {
  if(document.activeElement.tagName === "INPUT") return;
  if(e.key === "ArrowRight") nextCard();
  if(e.key === "ArrowLeft") prevCard();
});

renderCard();
renderList();
startQuiz();
