const OPERATIONS = ['+', '*'];

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function generateCommands () {
    let commandSet = new Set();
    while (commandSet.size < 2) {
        let index = randomInteger(0, OPERATIONS.length - 1);
        let operand = 0;
        if (OPERATIONS[index] === '+') {
            operand = randomInteger(1, 3);
        } else {
            operand = randomInteger(2, 3);
        }
        commandSet.add([OPERATIONS[index], operand].toString());
    }
    return Array.from(commandSet);
}

function transformCommands (commands) {
    let result = [];
    for (let i = 0; i < commands.length; ++i) {
        let tempString = commands[i];
        result.push([tempString[0], parseInt(tempString[2])]);
    }
    return result;
}

function getTextCmd (commands) {
    let text = ['', ''];
    for (let i = 0; i < commands.length; ++i) {
        if (commands[i][0] === '+') {
            text[i] = 'прибавь ' + commands[i][1].toString();
        } else if (commands[i][0] === '-') {
            text[i] = 'вычти ' + commands[i][1].toString();
        } else if (commands[i][0] === '*') {
            text[i] = 'умножь на ' + commands[i][1].toString();
        }
    }
    return text;
}

function generateResult (params) {
    let plus;
    let times;

    if (params.commands[0][0] === '+') {
            plus = params.commands[0][1];
            times = params.commands[1][1];
    } else {
        plus = params.commands[1][1];
        times = params.commands[0][1];
    }

    let table = new Array(params.finish + 1);
    table.fill(0);
    table[params.start] = 1;
    let len = table.length - 1;
    let maxLen;

    if (Math.floor(len / times) < len) {
        maxLen = len - plus;
    } else {
        maxLen = Math.floor(len / times);
    }

    for (let i = params.start + 1; i < maxLen; ++i) {
        let first = 0;
        if (i - plus >= params.start - 1) {
            first = table[i - plus];
        }

        let second = 0;
        if (i % times === 0 && Math.floor(i / times) >= params.start - 1) {
            second = table[Math.floor(i / times)];
        }

        table[i] = first + second;
    }

    table[len] = table[len - plus * 2]

    if (len % times === 0) {
        table[len] += table[Math.floor(len / times) - 1];
    }
    return table[len];
}

TEXT =  "У Исполнителя есть две команды, которым присвоены номера:\n" +
        "    1. {0}\n" +
        "    2. {1}\n" +
        "Первая из них {2}, а вторая – " +
        "{3}. Сколько есть программ, преобразующих число {4} " +
        "в число {5}, предпоследней командой которых является «1»?";

String.prototype.format = function () {
    var a = this;

    for (var k in arguments) {
            a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
    }

    return a;
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

let form = document.querySelector('form');
let submitButton = document.querySelector('.submit-button');
let key;
let varCount;

form.onclick = function() {
    submitButton.disabled = false;
    key = document.querySelector('.key-field');
    varCount = document.querySelector('.count-field');
    Math.seedrandom(parseInt(key.value));
}

form.onsubmit = function (evt) {
    evt.preventDefault();

    let flag = document.getElementsByClassName('task-content').length;

    while (flag > 0) {
        let div = document.querySelector('.task-content');
        div.remove();
        flag = document.getElementsByClassName('task-content').length;
    }

    if (isNaN(parseInt(key.value)) 
        || (parseInt(key.value)).toString().length != (key.value).length 
        || isNaN(parseInt(varCount.value)) 
        || parseInt(varCount.value) > 500) {
        return;
    }

    for (let i = 0; i < parseInt(varCount.value); ++i) {
        let parameters = {
            start: randomInteger(1, 5),
            finish: randomInteger(15, 25),
            commands: transformCommands(generateCommands())
        };

        let answer = generateResult(parameters);

        while (answer < 5) {
            parameters.start = randomInteger(1, 5);
            parameters.finish = randomInteger(15, 25);
            parameters.commands = transformCommands(generateCommands());
            answer = generateResult(parameters);
        }

        let textCmd = getTextCmd(parameters.commands);

        let cmds = {
            first: textCmd[0],
            second: textCmd[1]
        };

        const verbForms = {
            'п': 'прибавляет к числу на экране',
            'в': 'вычитает из числа на экране',
            'у': 'умножает число на экране на'
        }

        let cmdForms = {
            first: verbForms[cmds.first[0]] + ' ' + cmds.first[cmds.first.length - 1],
            second: verbForms[cmds.second[0]] + ' ' + cmds.second[cmds.second.length - 1]
        };

        let text = TEXT.format(cmds.first, cmds.second, cmdForms.first, cmdForms.second, parameters.start, parameters.finish);
        
        addTask(text, i + 1, answer);

    }

    submitButton.disabled = true;

    Math.seedrandom(parseInt(key.value));
}