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
let key;
// Math.seed = key.value;

Math.seededRandom = function(max, min) {
    max = max || 1;
    min = min || 0;
 
    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;
 
    return Math.floor(min + rnd * (max - min));
}

function randomInteger(min, max) {
    return Math.seededRandom(min, max);
}

let taskID = document.querySelector('.task-id-text');
let supField = document.querySelector('.supremum');

form.onclick = function() {
    key = document.querySelector('.key-field');
    taskID.textContent = '';
    //.textContent = '';
    Math.seed = key.value;
}

form.onsubmit = function(evt) {
    evt.preventDefault();
    // console.log('Generate!');
    let number = randomInteger(20, 30);
    // console.log("number:", number);
    let answer = parseInt(generateResult(number), 2);
    // console.log("answer:", answer);
    let previous = parseInt(generateResult(number - 1), 2);
    // console.log("previous: ", previous);
    let sup = randomInteger(previous, answer - 1);
    // console.log("sup:", sup);
    let ansField = document.querySelector('.answer');
    ansField.textContent = answer.toString();
    supField.textContent = sup.toString();
    taskID.textContent = '';
    taskID.textContent = 'ID: #' + key.value.toString();
    Math.seed = key.value;
}