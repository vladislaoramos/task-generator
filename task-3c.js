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
            text[i] = 'Прибавить ' + commands[i][1].toString();
        } else if (commands[i][0] === '-') {
            text[i] = 'Вычесть ' + commands[i][1].toString();
        } else if (commands[i][0] === '*') {
            text[i] = 'Умножить на ' + commands[i][1].toString();
        }
    }
    return text;
}

function fillTable (start, currIndex, dynamic, operation) {
    if (operation[0] === '+' && currIndex - operation[1] >= start) {
        return dynamic[currIndex - operation[1]];
    } else if (operation[0] === '*' &&
                currIndex % operation[1] === 0 &&
                Math.floor(currIndex / operation[1]) >= start) {
        return dynamic[Math.floor(currIndex / operation[1])];
    } else {
        return 0;
    }
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

    for (let i = params.start + 1; i < params.include + 1; ++i) {
        for (let j = 0; j < params.commands.length; ++j) {
            table[i] += fillTable(params.start, i, table, params.commands[j]);
        }
    }

    for (let i = params.include + 1; i < params.exclude; ++i) {
        for (let j = 0; j < params.commands.length; ++j) {
            table[i] += fillTable(params.include, i, table, params.commands[j]);
        }
    }

    for (let i = params.exclude + 1; i < table.length; ++i) {
        for (let j = 0; j < params.commands.length; ++j) {
            table[i] += fillTable(params.include, i, table, params.commands[j]);
        }
    }

    return table[table.length - 1];
}

TEXT =  "Исполнитель преобразует число, записанное на экране. " +
        "У исполнителя есть три команды, которым присвоены номера:\n" +
        "    1. {0}\n" +
        "    2. {1}\n" +
        "Первая из них {2}, а вторая – " +
        "{3}. Программа для Исполнителя – это последовательность команд. " +
        "Сколько есть программ, для которых при исходном числе {4} " +
        "результатом является число {5}, и при этом траектория вычислений " +
        "программы содержит число {6} и не содержит число {7}?";

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
    key = document.querySelector('.key-field');
    varCount = document.querySelector('.count-field');
    Math.seedrandom(key.value);
}

form.onsubmit = function (evt) {
    evt.preventDefault();

    let flag = document.getElementsByClassName('task-content').length;

    while (flag > 0) {
        let div = document.querySelector('.task-content');
        div.remove();
        flag = document.getElementsByClassName('task-content').length;
    }

    for (let i = 0; i < parseInt(varCount.value); ++i) {
        let parameters = {
            start: randomInteger(1, 5),
            finish: randomInteger(15, 25),
            commands: transformCommands(generateCommands()),
            include: randomInteger(1, 5),
            exclude: randomInteger(20, 55)
        };

        let answer = generateResult(parameters);

        while (answer < 7 || answer > 100 ||
                parameters.include >= parameters.exclude ||
                parameters.exclude >= parameters.finish) {
            parameters.start = randomInteger(1, 5);
            parameters.finish = randomInteger(15, 25);
            parameters.commands = transformCommands(generateCommands());
            parameters.include = randomInteger(15, 25);
            parameters.exclude = randomInteger(20, 55);
            answer = generateResult(parameters);
        }

        let textCmd = getTextCmd(parameters.commands);

        let cmds = {
            first: textCmd[0],
            second: textCmd[1]
        };

        const verbForms = {
            'П': 'прибавляет к числу на экране',
            'В': 'вычитает из числа на экране',
            'У': 'умножает число на экране на'
        }

        let cmdForms = {
            first: verbForms[cmds.first[0]] + ' ' + cmds.first[cmds.first.length - 1],
            second: verbForms[cmds.second[0]] + ' ' + cmds.second[cmds.second.length - 1]
        };

        let text = TEXT.format(
            cmds.first, 
            cmds.second, 
            cmdForms.first, 
            cmdForms.second, 
            parameters.start, 
            parameters.finish, 
            parameters.include, 
            parameters.exclude
        );
        
        addTask(text, i + 1, answer);

    }

    Math.seedrandom(key.value);
}