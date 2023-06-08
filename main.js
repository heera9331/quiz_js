var questions = [];


function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function shuffleOpts(question) {
    let options = [`<li class="option">
        
    <input type="radio" name="${question.q_id}" value="${question.incorrect_answers[0]}">
    ${question.incorrect_answers[0]}
    
    </li>`
        , `<li class="option">
    
    <input type="radio" name="${question.q_id}" value="${question.incorrect_answers[1]}">
    ${question.incorrect_answers[1]}
    </li>`, `<li class="option">
    
    <input type="radio" name="${question.q_id}" value="${question.incorrect_answers[2]}">
    ${question.incorrect_answers[2]}
    </li>`, `<li class="option">
    
    <input type="radio" name="${question.q_id}" value="${question.correct_answer}">
    ${question.correct_answer}
    </li>`
    ]

    options = shuffle(options)

    let res = ``;

    options.forEach((opt) => {
        res += opt;
    })

    return res;
}


function getElement(question) {
    return (
        `<div class="question m-4 border p-4" id='${question.q_id}'>
        <p class="desc">${question.question}</p>
        <ul class="options">
        ${shuffleOpts(question)}
        
        </ul>
        </div>`
    );
}

async function getQuestions() {

    function insert(data) {
        data = Promise.resolve(data.json()).then(function (result) {
            // adding id to the in result.results
            let results = result.results;
            let tmp = []
            for (let i = 0; i < results.length; i++) {
                tmp.push({ q_id: `q` + `${i + 1}`, ...results[i] });
            }

            questions = tmp;
            insertQuestion();

        })

    }

    // fatching questions from opentdb api
    await fetch('https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple')
        .then(function (data) {

            setTimeout(insert, 1000, data);
        })

        .catch(function (error) {
            // rejected
            console.log('error');

        })
        .finally(function () {
            // settled
            console.log('finally');
        });

}

async function insertQuestion() {
    console.log(questions);
    document.getElementById("loading").remove();
    let formedData = '';
    for (let i = 0; i < questions.length; i++) {
        formedData += getElement(questions[i]);
    }
    document.getElementById("questions-container").innerHTML += formedData;
}

function getResult() {


    let result = []
    // {q_id: 1, ans: user_clicked_ans}

    for (let i = 0; i < questions.length; i++) {
        let options = document.getElementsByName(`q${i + 1}`);
        // console.log(options);
        let flag = 1;
        options.forEach((opt) => {
            if (opt.checked) {
                flag = 0;
                result.push({ q_id: i + 1, ans: opt.value })
            }
        })

        if (flag) {
            result.push({ q_id: i + 1, ans: "null" });
        }
    }

    // result calculation
    let correct = 0;
    // let incorrect=0;


    for (let i = 0; i < questions.length; i++) {
        if (questions[i].correct_answer == result[i].ans) {
            correct++;
        }
    }

    console.log(result);
    alert('Your score is : ' + `${correct} / ${questions.length}`);


}

getQuestions(); 
