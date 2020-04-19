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
        commands: transformCommands(generateCommands()),
        include: randomInteger(1, 5),
        exclude: randomInteger(20, 55)
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

    while (answer < 7 ||
            answer > 100 ||
            parameters.include >= parameters.exclude ||
            parameters.exclude >= parameters.finish) {
        parameters.start = randomInteger(1, 5);
        parameters.finish = randomInteger(15, 25);
        parameters.commands = transformCommands(generateCommands());
        parameters.include = randomInteger(15, 25);
        parameters.exclude = randomInteger(20, 55);
        answer = generateResult(parameters, plus, times);
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

    let inc = document.querySelector('.include-value');
    inc.textContent = parameters.include;

    let exc = document.querySelector('.exclude-value');
    exc.textContent = parameters.exclude;

    let ans = document.querySelector('.answer');
    ans.textContent = answer;

    let taskID = document.querySelector('.task-id-text');
    taskID.textContent = 'ID: #' + key.value.toString();

    Math.seedrandom(key.value);
}