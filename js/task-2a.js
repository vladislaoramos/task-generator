function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const OPERATIONS = ['+', '-', '*'];

function getCommands () {
    let commandSet = new Set();
    while (commandSet.size < 2) {
        let index = randomInteger(0, OPERATIONS.length - 1);
        let operand = randomInteger(1, 5);
        if (index == 2) {
            operand = randomInteger(2, 3);
        }
        commandSet.add([OPERATIONS[index], operand].toString());
    }
    let commands = Array.from(commandSet);
    return commands;
}

function transfromCommands (commands) {
    let result = [];
    for (let i = 0; i < commands.length; ++i) {
        let tempString = commands[i];
        result.push([tempString[0], parseInt(tempString[2])]);
    }
    return result;
}

function getSolution () {
    let cmds = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 6; ++i) {
        cmds[i] = randomInteger(1, 2);
    }
    return cmds;
}

function transformSolution (solution) {
    let text = '';
    for (let i = 0; i < solution.length; ++i) {
        text += solution[i].toString();
    }
    return text;
}

function getTextCmd (commands) {
    let text = ['', ''];
    for (let i = 0; i < commands.length; ++i) {
        if (commands[i][0] == '+') {
            text[i] = 'прибавь ' + commands[i][1].toString();
        } else if (commands[i][0] == '-') {
            text[i] = 'вычти ' + commands[i][1].toString();
        } else if (commands[i][0] == '*') {
            text[i] = 'умножь на ' + commands[i][1].toString();
        }
    }
    return text;
}

function generateResult (parameters) {
    let result = parameters.start;
    for (let i = 0; i < parameters.solution.length; ++i) {
        let cmd = parameters.cmd[parameters.solution[i] - 1];
        if (cmd[0] === '+') {
            result += cmd[1]
        } else if (cmd[0] == '-') {
            result -= cmd[1]
        } else if (cmd[0] == '*') {
            result *= cmd[1]
        }
    }
    return result;
}

function getResult (parameters) {
    let res = generateResult(parameters);
    while (true) {
        if (res >= 11 && res <= 20) {
            break;
        } else {
            parameters.start = randomInteger(1, 10);
            parameters.cmd = transfromCommands(getCommands());
            parameters.solution = getSolution();
            res = generateResult(parameters);
        }
    }
    return res;
}

TEXT =  "У исполнителя Калькулятор две команды, которым присвоены номера:\n" +
        "    1. {0}\n" +
        "    2. {1}\n" +
        "Выполняя первую из них, Калькулятор {2}, а выполняя вторую, \n" +
        "{3}. Запишите порядок команд в программе получения из числа \n" +
        "{4} числа {5}, содержащей 6 команд, указывая лишь номера команд.";

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
        let params = {
            start: randomInteger(1, 10),
            cmd: transfromCommands(getCommands()),
            solution: getSolution()
        };

        let finish = getResult(params);
        let textSolution = transformSolution(params.solution);

        let textCmd = getTextCmd(params.cmd);

        let commands = {
            first: textCmd[0],
            second: textCmd[1]
        };

        const verbForms = {
            'п': 'прибавляет к числу на экране',
            'в': 'вычитает из числа на экране',
            'у': 'умножает число на экране на'
        }

        let cmdForms = {
            first: verbForms[commands.first[0]] + ' ' + commands.first[commands.first.length - 1],
            second: verbForms[commands.second[0]] + ' ' + commands.second[commands.second.length - 1]
        };

        let text = TEXT.format(commands.first, commands.second, cmdForms.first, cmdForms.second, params.start, finish);
        
        addTask(text, i + 1, textSolution);
    }
    
    submitButton.disabled = true;

    Math.seedrandom(parseInt(key.value));
}