
const questions = ['Język programowania stworzony w 1995 roku przez Yukihiro Matsumoto?', 'Język programowania stworzony przez Larry’ego Walla?', 'Język stworzony przez Brendona Eicha w Netscape?', 'Twórca języka Python?', 'Jak nazywa się uchwyt do obiektu przekazywany do metody instancji?', 'Jak nazywa się metoda inicjacyjna w Pythonie?', 'Przykład metody specjalnej w Pythonie?', 'Które metody konwertują obiekt na tekst?', 'Jaki błąd zawiera podany kod klasy Kwadrat?', 'Co wypisze drugi przykład klasy Kwadrat?', 'Typ zmiennej com = 2+2J?', 'Typ zmiennej a = True?', 'Typ zmiennej b = 1.0?', 'Typ zmiennej c = (1)?', "Co stanie się po s[0]='x'?", 'Typ x=(1,2,3)?', "Typ y={'1':4,'2':3}?", 'Typ z=[1,2,3]?', 'Funkcja oznaczana @?', 'Typ let x=/d+/g?', 'Czym są obiekty JS?', 'Wartość lst[3]?', 'Wynik indexOf(2)?', "Wynik '1' == 1?", "Wynik '1' === 1?", 'Co dopasowuje /\\d{4}/?', 'Znaczenie + w regex?', 'Znaczenie ? w regex?', 'Jak nazywa się połączenie funkcji z zasięgiem?', 'Co wyznacza let w JS?'];

function showTab(id){
 document.getElementById('flashcards').style.display=id==='flashcards'?'block':'none';
 document.getElementById('quiz').style.display=id==='quiz'?'block':'none';
}

const flash=document.getElementById('flashcards');
questions.forEach((q,i)=>{
 let d=document.createElement('div');
 d.className='card';
 d.innerHTML='<b>Pytanie '+(i+1)+':</b> '+q+'<br><i>Miejsce na własną odpowiedź.</i>';
 flash.appendChild(d);
});

const qc=document.getElementById('quizContainer');
questions.forEach((q,i)=>{
 let div=document.createElement('div');
 div.className='card';
 div.innerHTML=`<p>${i+1}. ${q}</p><input type="text" style="width:100%">`;
 qc.appendChild(div);
});

function checkQuiz(){
 document.getElementById('result').innerText='Quiz w trybie samooceny.';
}
