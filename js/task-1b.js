function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getDigitSum(number) {
    let s = 0;
    while (number > 0) {
        s += number % 10;
        number = Math.floor(number / 10);
    }
    return s;
}

function generateResult(number) {
    let binNumber = number.toString(2);
    let firstSum = getDigitSum(parseInt(binNumber)) % 2;
    let r0 = binNumber + firstSum.toString();
    return parseInt(r0 + '0');
}

let form = document.querySelector('form');
let submitButton = document.querySelector('.submit-button');
submitButton.disabled = true;
let key;
let varCount;


let taskID = document.querySelector('.task-id-text');
let supField = document.querySelector('.supremum');


form.onclick = function() {
    submitButton.disabled = false;
    key = document.querySelector('.key-field');
    varCount = document.querySelector('.count-field');
    Math.seedrandom(parseInt(key.value));
}

TEXT = "На вход алгоритма подаётся натуральное число N. Алгоритм строит по нему новое число R следующим образом.\n" +
    "  1) Строится двоичная запись числа N.\n" +
    "  2) К этой записи дописываются справа ещё два разряда по следующему правилу:\n" +
    "    а) складываются все цифры двоичной записи, и остаток от деления суммы на 2 " + 
    "дописывается в конец числа (справа). Например, запись 11100 преобразуется в запись 111001;\n" +
    "    б) над этой записью производятся те же действия — справа дописывается остаток от деления суммы цифр на 2.\n" +
    "Полученная таким образом запись (в ней на два разряда больше, чем в записи исходного числа N) является двоичной записью искомого " +
    "числа R. Укажите минимальное число R, которое превышает 100 и может являться результатом работы алгоритма. " + 
    "В ответе это число запишите в десятичной системе.";

function formatTaskText (supremum) {
    return TEXT.replace('превышает 100', 'превышает ' + supremum.toString());;
}

function addTask (text, varVal, ans) {
    let content = document.querySelector('#content');
    
    let taskContent = document.createElement('div');
    taskContent.setAttribute('class', 'task-content');
    
    let pVar = document.createElement('p');
    let emVar = document.createElement('em');
    emVar.textContent = 'Вариант ' + ' ' + varVal.toString(); //
    pVar.appendChild(emVar);

    let pTask = document.createElement('p');
    pTask.setAttribute('class', 'task-text');
    pTask.textContent = text;

    let spoiler = document.createElement('details');
    spoiler.setAttribute('class', 'answer-spoiler');

    let summary = document.createElement('summary');
    summary.setAttribute('class', 'answer');
    summary.textContent = 'Ответ';

    let answer = document.createElement('p');
    answer.textContent = ans;

    spoiler.appendChild(summary);
    spoiler.appendChild(answer);

    taskContent.appendChild(document.createElement('hr'));
    taskContent.appendChild(pVar);
    taskContent.appendChild(pTask);
    taskContent.appendChild(spoiler);

    content.appendChild(taskContent);

}

form.onsubmit = function(evt) {
    evt.preventDefault();

    let flag = document.getElementsByClassName('task-content').length;

    while (flag > 0) {
        let div = document.querySelector('.task-content');
        div.remove();
        flag = document.getElementsByClassName('task-content').length;
    }

    if (isNaN(parseInt(key.value)) 
        || (parseInt(key.value)).toString().length != (key.value).length 
        || (parseInt(varCount.value)).toString().length != (varCount.value).length 
        || isNaN(parseInt(varCount.value)) 
        || parseInt(varCount.value) > 500) {
        return;
    }
    
    for (let i = 0; i < parseInt(varCount.value); ++i) {
        let number = randomInteger(31, 45);
        let answer = parseInt(generateResult(number), 2);
        let previous = parseInt(generateResult(number - 1), 2);
        let sup = randomInteger(previous, answer - 1);
        let text = formatTaskText(sup);
        addTask(text, i + 1, answer);
    }
    submitButton.disabled = true;

    Math.seedrandom(parseInt(key.value));
}