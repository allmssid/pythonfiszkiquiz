const DATA = [
{cat:'Historia języków',q:'Język programowania stworzony w 1995 roku przez Japończyka Yukihiro Matsumoto to:',a:'Ruby',opts:['Ruby','Python','Perl','JavaScript']},
{cat:'Historia języków',q:'Język programowania, który powstał w 1987 roku, został stworzony przez Larry’ego Walla:',a:'Perl',opts:['Perl','Ruby','PHP','Lua']},
{cat:'Historia języków',q:'Język, który został stworzony przez Brendana Eicha w firmie Netscape w 1995 to:',a:'JavaScript',opts:['JavaScript','Java','TypeScript','Python']},
{cat:'Historia języków',q:'Twórcą języka Python jest:',a:'Guido van Rossum',opts:['Guido van Rossum','Yukihiro Matsumoto','Larry Wall','Brendan Eich']},
{cat:'Python OOP',q:'Jaką nazwę nosi zwyczajowo uchwyt do obiektu, który jest przekazywany do metody instancji w Pythonie?',a:'self',opts:['self','this','object','me']},
{cat:'Python OOP',q:'Jaką nazwę nosi metoda inicjacyjna w Pythonie?',a:'__init__',opts:['__init__','init()','constructor','__start__']},
{cat:'Python OOP',q:'Przykładem metody specjalnej w Pythonie jest:',a:'Np. __init__, __str__, __repr__, __len__',opts:['__init__','start','main','method']},
{cat:'Python OOP',q:'Które metody specjalne pozwalają na przekonwertowanie obiektu na łańcuch znaków?',a:'__str__ oraz __repr__',opts:['__str__ oraz __repr__','__int__ oraz __float__','__len__ oraz __size__','__get__ oraz __set__']},
{cat:'Python kod',q:'Jaki błąd zawiera kod z class Kwadrat, def pole(this), this.x=10, print(Kwadrat.pole(k))?',a:'Kod nie ma błędu składniowego. Parametr nie musi nazywać się self — może nazywać się this. Wywołanie Kwadrat.pole(k) też zadziała i wypisze 100.',opts:['Nie ma błędu, wypisze 100','Brakuje słowa self, więc zawsze błąd','Nie można użyć return','Klasy w Pythonie nie mają metod']},
{cat:'Python kod',q:'Co zostanie wypisane po kodzie: k = Kwadrat(10); print(k.pole(k)), gdy klasa nie ma __init__?',a:'Wystąpi TypeError, bo Kwadrat() nie przyjmuje argumentu 10. Dodatkowo metoda pole przyjmuje tylko self, więc k.pole(k) też byłoby błędne.',opts:['TypeError','100','10','None']},
{cat:'Python typy',q:'com = 2+2J, zmienna com jest w Pythonie typu:',a:'complex',opts:['complex','int','float','str']},
{cat:'Python typy',q:'a = True, zmienna a jest w Pythonie typu:',a:'bool',opts:['bool','int','str','tuple']},
{cat:'Python typy',q:'b = 1.0, zmienna b jest w Pythonie typu:',a:'float',opts:['float','int','complex','bool']},
{cat:'Python typy',q:'c = (1), zmienna c jest w Pythonie typu:',a:'int, bo nawiasy nie tworzą jednoelementowej krotki. Krotka to byłoby (1,).',opts:['int','tuple','list','set']},
{cat:'Python typy',q:"Jaka jest zawartość zmiennej s po wykonaniu kodu: s = '123'; s[0] = 'x'?",a:'Nie powstanie nowa zawartość, bo stringi są niemutowalne. Wystąpi TypeError.',opts:['TypeError','x23','123','None']},
{cat:'Python typy',q:'x = (1, 2, 3), x jest:',a:'tuple, czyli krotką',opts:['tuple','list','dict','set']},
{cat:'Python typy',q:"y = {'1': 4, '2': 3}, y jest:",a:'dict, czyli słownikiem',opts:['dict','list','tuple','string']},
{cat:'Python typy',q:'z = [1, 2, 3], z jest:',a:'list, czyli listą',opts:['list','tuple','dict','set']},
{cat:'Python funkcje',q:'Funkcja, której głównym zadaniem jest przezroczyste opakowanie innej funkcji lub klasy, oznaczana symbolem @, to:',a:'dekorator',opts:['dekorator','iterator','generator','komparator']},
{cat:'JavaScript',q:'let x = /d+/g, x jest w JS:',a:'wyrażeniem regularnym / obiektem RegExp. Uwaga: zapis /d+/ oznacza literę d, a /\\d+/ oznacza cyfry.',opts:['RegExp','Array','String','Number']},
{cat:'JavaScript',q:'Są nieuporządkowaną kolekcją właściwości, które zawierają wartości typów podstawowych, innych obiektów lub funkcji:',a:'obiekty',opts:['obiekty','tablice','funkcje','regexy']},
{cat:'JavaScript',q:'Jaką wartość ma x po kodzie: let lst = [1,2,3]; let x = lst[3];',a:'undefined, bo indeksy tablicy zaczynają się od 0, więc lst[3] nie istnieje.',opts:['undefined','3','null','Błąd składni']},
{cat:'JavaScript',q:'Po wykonaniu kodu: let tab = [1,2,3,4]; let z = tab.indexOf(2); z zawiera:',a:'1, bo element 2 znajduje się pod indeksem 1.',opts:['1','2','0','-1']},
{cat:'JavaScript',q:'Jaką wartość da wyrażenie: let x = "1"; x == 1;',a:'true, bo == wykonuje konwersję typów.',opts:['true','false','undefined','TypeError']},
{cat:'JavaScript',q:'Jaką wartość da wyrażenie: let x = "1"; x === 1;',a:'false, bo === porównuje wartość i typ bez konwersji.',opts:['false','true','undefined','null']},
{cat:'Regex',q:'Wyrażenie regularne /\\d{4}/ dopasowuje do łańcucha:',a:'cztery cyfry z rzędu, np. 2026.',opts:['cztery cyfry','dowolne cztery znaki','jedną literę d','cztery litery']},
{cat:'Regex',q:'Przy wyrażeniu regularnym /x+/ znak + oznacza:',a:'jedno lub więcej wystąpień znaku x.',opts:['jedno lub więcej','zero lub jedno','dokładnie jedno','początek tekstu']},
{cat:'Regex',q:'Przy wyrażeniu regularnym /x?/ znak ? oznacza:',a:'zero lub jedno wystąpienie znaku x.',opts:['zero lub jedno','jedno lub więcej','dowolny znak','koniec tekstu']},
{cat:'Funkcje',q:'Połączenie obiektu funkcji z jej zasięgiem jest nazywane:',a:'domknięcie, czyli closure.',opts:['domknięcie / closure','rekurencja','dziedziczenie','referencja']},
{cat:'JavaScript',q:'Słowo let wyznacza w JS:',a:'zmienną o zasięgu blokowym.',opts:['zmienną o zasięgu blokowym','stałą globalną','funkcję anonimową','klasę']}
];

let cards = [...DATA];
const categories = [...new Set(DATA.map(x=>x.cat))];
const categoryFilter = document.getElementById('categoryFilter');
categories.forEach(c=>{ const o=document.createElement('option'); o.value=c; o.textContent=c; categoryFilter.appendChild(o); });
document.getElementById('totalCards').textContent = DATA.length;

function renderCards(){
  const grid=document.getElementById('cardsGrid'); grid.innerHTML='';
  const term=document.getElementById('searchInput').value.toLowerCase();
  const cat=categoryFilter.value;
  cards.filter(item=>(cat==='all'||item.cat===cat)&&(item.q.toLowerCase().includes(term)||item.a.toLowerCase().includes(term)))
  .forEach((item,i)=>{
    const el=document.createElement('article'); el.className='flip-card';
    el.innerHTML=`<div class="flip-inner"><div class="face front"><span class="badge">${item.cat}</span><p class="q">${item.q}</p><span class="hint">Kliknij, żeby zobaczyć odpowiedź</span></div><div class="face back"><span class="badge">Odpowiedź</span><p class="a">${item.a}</p><span class="hint">Kliknij, żeby wrócić</span></div></div>`;
    el.addEventListener('click',()=>el.classList.toggle('flipped'));
    grid.appendChild(el);
  });
}
document.getElementById('searchInput').addEventListener('input',renderCards);
categoryFilter.addEventListener('change',renderCards);
document.getElementById('shuffleCards').addEventListener('click',()=>{cards.sort(()=>Math.random()-0.5);renderCards();});

function showView(view){
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.view===view));
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active-view',v.id===view));
}
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>showView(t.dataset.view)));

let quizOrder=[], current=0, score=0, answered=0, locked=false;
function startQuiz(){ quizOrder=[...DATA].sort(()=>Math.random()-0.5); current=0; score=0; answered=0; locked=false; renderQuiz(); }
function renderQuiz(){
  locked=false; const item=quizOrder[current];
  document.getElementById('quizTitle').textContent=`Pytanie ${current+1} z ${quizOrder.length}`;
  document.getElementById('score').textContent=score; document.getElementById('answered').textContent=answered;
  document.getElementById('progressBar').style.width=`${(answered/quizOrder.length)*100}%`;
  document.getElementById('quizQuestion').textContent=item.q;
  document.getElementById('feedback').textContent='';
  const options=document.getElementById('quizOptions'); options.innerHTML='';
  [...item.opts].sort(()=>Math.random()-0.5).forEach(opt=>{
    const b=document.createElement('button'); b.className='option'; b.textContent=opt;
    b.addEventListener('click',()=>chooseAnswer(b,opt,item)); options.appendChild(b);
  });
}
function chooseAnswer(button,opt,item){
  if(locked) return; locked=true; answered++;
  const ok=opt===item.opts[0]; if(ok) score++;
  document.querySelectorAll('.option').forEach(b=>{ if(b.textContent===item.opts[0]) b.classList.add('correct'); });
  if(!ok) button.classList.add('wrong');
  document.getElementById('score').textContent=score; document.getElementById('answered').textContent=answered;
  document.getElementById('progressBar').style.width=`${(answered/quizOrder.length)*100}%`;
  document.getElementById('feedback').textContent= ok ? 'Dobrze ✅' : `Nie tym razem. Poprawna odpowiedź: ${item.a}`;
}
document.getElementById('nextQuestion').addEventListener('click',()=>{ current++; if(current>=quizOrder.length){ document.getElementById('feedback').textContent=`Koniec quizu! Wynik: ${score}/${quizOrder.length}`; current=0; startQuiz(); } else renderQuiz(); });
document.getElementById('restartQuiz').addEventListener('click',startQuiz);

const answerList=document.getElementById('answerList');
DATA.forEach((item,i)=>{const div=document.createElement('div');div.className='answer-item';div.innerHTML=`<h3>${i+1}. ${item.q}</h3><p><b>Odpowiedź:</b> ${item.a}</p>`;answerList.appendChild(div);});
renderCards(); startQuiz();
