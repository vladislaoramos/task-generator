let form = document.querySelector('form');
let key;

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const OPERATIONS = ['+', '-', '*'];

function getCommands () {
    let commandSet = new Set();
    while (commandSet.size < 3) {
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
        cmds[i] = randomInteger(1, 3);
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
    let text = ['', '', ''];
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
        if (res >= 30 && res <= 45) {
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

form.onclick = function() {
    key = document.querySelector('.key-field');
    Math.seedrandom(key.value);
}

form.onsubmit = function(evt) {
    evt.preventDefault();
    
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
        second: textCmd[1],
        third: textCmd[2]
    };

    const verbForms = {
        'п': 'прибавляет к числу на экране',
        'в': 'вычитает из числа на экране',
        'у': 'умножает число на экране на'
    }

    let cmdForms = {
        first: verbForms[commands.first[0]] + ' ' + commands.first[commands.first.length - 1],
        second: verbForms[commands.second[0]] + ' ' + commands.second[commands.second.length - 1],
        third: verbForms[commands.third[0]] + ' ' + 'x'
    };

    let verbForm1 = document.querySelector('.first-verb-form');
    verbForm1.textContent = cmdForms.first;

    let verbForm2 = document.querySelector('.second-verb-form');
    verbForm2.textContent = cmdForms.second;

    let verbForm3 = document.querySelector('.third-verb-form');
    verbForm3.textContent = cmdForms.third;

    let first = document.querySelector('.first-cmd');
    first.textContent = commands.first;

    let second = document.querySelector('.second-cmd');
    second.textContent = commands.second;

    let third = document.querySelector('.third-cmd');
    console.log(third);
    third.textContent = commands.third.slice(0, commands.third.length - 1) + 'x';

    let begin = document.querySelector('.start-value');
    begin.textContent = params.start;

    let end = document.querySelector('.finish-value');
    end.textContent = finish; // посчитать

    let taskSol = document.querySelector('.task-sol');
    taskSol.textContent = textSolution;

    let ans = document.querySelector('.answer');
    ans.textContent = commands.third[commands.third.length - 1];

    let taskID = document.querySelector('.task-id-text');
    taskID.textContent = 'ID: #' + key.value.toString();

    Math.seedrandom(key.value);
}