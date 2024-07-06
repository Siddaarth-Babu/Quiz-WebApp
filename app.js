const button = document.getElementsByTagName('button');
const scorecard = document.querySelector('.scoreCard');
const marks = document.querySelector('#score');
const body = document.querySelector('body');
const playButton = document.querySelector('.play-again');
const startGame = document.querySelector('.startGame');
const startGameBtn = document.querySelector('.startQuiz');
let seconds, correctOption, correctButton, response, data, score = 0, category = categoryGenerator();
const api_url = `https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`

async function getData() {
    response = await fetch(api_url);
    data = await response.json();
}

async function setQuestion(index) {
    if (index == 0) t = 3000;
    else t = 0;
    return new Promise((resolve, reject) => {
        let myInterval;
        setTimeout(() => {
            resetState();
            let newQuest = data.results[index].question;
            const newFlash = document.createElement('div');
            newFlash.classList.add('flashcard');
            newFlash.style.display = "flex"
            newFlash.innerHTML = `
            <div class="timer">10</div>
            <div class="question"></div>
            <div class="options">
                <button class="option1"></button>
                <button class="option2"></button>
                <button class="option3"></button>
                <button class="option4"></button>
            </div>`;

            body.appendChild(newFlash);
            correctOption = randomNumber();

            let i = 1;

            data.results[index].incorrect_answers.forEach(element => {
                if (i == correctOption) {
                    i++;
                }
                document.querySelector(`.option${i}`).innerHTML = element;
                i++;
            })
            correctButton = document.querySelector(`.option${correctOption}`);
            document.querySelector(`.option${correctOption}`).innerHTML = data.results[index].correct_answer;
            const quest = document.querySelector('.question');
            quest.innerHTML = newQuest;
            const timeSet = document.querySelector('.timer');
            seconds = parseInt(timeSet.innerHTML);
            myInterval = setInterval(() => {
                seconds--;
                if (seconds == 0) {
                    clearInterval(myInterval);
                    resolve("success");
                }
                timeSet.innerHTML = seconds < 10 ? '0' + seconds : seconds;
            }, 1000);
            checkAnswer();
        }, t)
    });
}

function categoryGenerator() {
    let m = Math.floor(Math.random() * 23 + 9);
    return m;
}

function randomNumber() {
    let j = Math.floor(Math.random() * 4 + 1);
    return j;
}

function checkAnswer() {
    for (let i = 0; i < button.length; i++) {
        button[i].addEventListener('click', () => {
            if ((button[i].getAttribute('class')) === (correctButton.getAttribute('class'))) {
                button[i].style.backgroundColor = "#0BDA51";
                score++;
            }
            else {
                button[i].style.backgroundColor = "#C51E3A";
                correctButton.style.backgroundColor = "#0BDA51";
            }
            Array.from(button).forEach(button => {
                button.disabled = true;
                playButton.disabled = false;
            })
        })
    }
}

function resetState() {
    const flashcard = document.querySelector('.flashcard');
    body.removeChild(flashcard);
}

function resetGame() {
    startGameBtn.addEventListener('click', async () => {
        startGame.style.display = "none";
        const countdown = document.querySelector('.countdown');
        const time = document.querySelector('#start-timer')
        let sec = 3;
        await getData();
        displayAllQuestion();
        countdown.style.display = "flex"
        const myInterval = setInterval(() => {
            sec--;
            time.innerHTML = '0' + sec
            if (sec == 0) { countdown.style.display = "none"; clearInterval(myInterval) }
        }, 1000);
    })
}

function displayScore() {
    const flashcard = document.querySelector('.flashcard');
    flashcard.style.display = "none";
    scorecard.style.display = "flex";
    marks.innerHTML = score;
}

async function displayAllQuestion() {

    for (let i = 0; i < 10; i++) {
        await setQuestion(i);
    }
    displayScore();
}

playButton.addEventListener('click', () => {
    window.location.reload();
})

resetGame();