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

function generateResult (params, plus, times) {
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

let form = document.querySelector('form');
let key;

form.onclick = function () {
    key = document.querySelector('.key-field');
    Math.seedrandom(key.value);
}

form.onsubmit = function (evt) {
    evt.preventDefault();

    let parameters = {
        start: randomInteger(1, 5),
        finish: randomInteger(15, 25),
        commands: transformCommands(generateCommands())
    };

    let plus;
    let times;

    if (parameters.commands[0][0] === '+') {
        plus = parameters.commands[0][1];
        times = parameters.commands[1][1];
    } else {
        plus = parameters.commands[1][1];
        times = parameters.commands[0][1];
    }

    let answer = generateResult(parameters, plus, times);

    while (answer < 5) {
        parameters.start = randomInteger(1, 5);
        parameters.finish = randomInteger(15, 25);
        parameters.commands = transformCommands(generateCommands());
        answer = generateResult(parameters, plus, times);
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

    let firstCmd = document.querySelector('.first-cmd');
    firstCmd.textContent = cmds.first;

    let secondCmd = document.querySelector('.second-cmd');
    secondCmd.textContent = cmds.second;

    let firstVerbForm = document.querySelector('.first-verb-form');
    firstVerbForm.textContent = cmdForms.first;

    let secondVerbForm = document.querySelector('.second-verb-form');
    secondVerbForm.textContent = cmdForms.second;

    let begin = document.querySelector('.start-value');
    begin.textContent = parameters.start;

    let end = document.querySelector('.finish-value');
    end.textContent = parameters.finish;

    let ans = document.querySelector('.answer');
    ans.textContent = answer;

    let taskID = document.querySelector('.task-id-text');
    taskID.textContent = 'ID: #' + key.value.toString();

    Math.seedrandom(key.value);
}