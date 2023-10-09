'use strict'

let state = ["-","-","-","-","-","-","-","-","-"]
let playerTurn = true;
let activeRound = true;

let statO = 0;
let statX = 0;

// init & reset game

const resetFields = function() {
    for (let i = 0; i < state.length; i++) {
        document.querySelector(`[data-field="${i}"]`).classList.add('hidden')
        setTimeout(() => {
            document.querySelector(`[data-field="${i}"]`).classList.remove('winner')
        } ,100);        
    }
}

const resetGame = function() {
    state = ["-","-","-","-","-","-","-","-","-"]
    activeRound = true;
    playerTurn = true;
    if (difficulty == 'hard') {
        initHard()
    } else {
        firstCPUMove = true;
        resetFields()
    }
}

const initHard = function() {
    firstCPUMove = false;
    middleBlocked = true;
    resetFields()
    makeMoveCPU(4)
    setTimeout(() => {
        document.querySelector(`[data-field="4"]`).classList.remove('hidden')    
    }, 150);
}

// move making

const makeMove = function(index,symbol) {
    state[index] = symbol
    document.querySelector(`[data-field="${index}"]`).innerText = symbol
    setTimeout(document.querySelector(`[data-field="${index}"]`).classList.remove('hidden'),100);
    playerTurn = false;
    checkWinner()
}

const makeMoveCPU = function(index) {
    makeMove(index,'X')
    playerTurn = true;
    checkWinner()
}

document.querySelector('.gamefield').addEventListener('click',function(e) {
    const areaGuard = e.target.closest('.area')
    if(!areaGuard || !activeRound || !playerTurn) return

    const clickedField = e.target.closest('.area').dataset.area
    if (state[clickedField] !== "-") return

    makeMove(clickedField,'O')
    playerCPU()
})

// checking winners

const combinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]             
]

const statXSel = document.querySelector('.x-stat');
const statOSel = document.querySelector('.o-stat');
const checkWinner = function() {
    fullBoard()
    for (const combination of combinations) {
        const [a,b,c] = combination
        if (state[a] == "X" && state[b] == "X" && state[c] == "X" || state[a] == "O" && state[b] == "O" && state[c] == "O") {
            combination.forEach(el => {
                document.querySelector(`[data-field="${el}"]`).classList.add('winner')
                setTimeout(() => {
                    resetGame()
                }, 700);
            })
            activeRound = false;
            if (state[a] == "X") {
                statX += 0.5;
                statXSel.innerText = statX;
            };
            if (state[a] == "O") {
                statO++;
                statOSel.innerText = statO;
            };
            return
        }    
    }
}

const fullBoard = function() {
    let boardFull = true;
    for (let i = 0; i < state.length; i++) {
        if (state[i] === "-") {
            boardFull = false;
            break;
        }
    }
    if (boardFull) {
        setTimeout(() => {
            resetGame()
        }, 700);
    }
};


// autoplay

let selectedField;
let options
let middleBlocked = false;
let firstCPUMove = true;
const playerCPU = function() {
    if (!activeRound) return

    if (difficulty == 'easy') {
        options = [0,1,2,3,4,5,6,7,8].filter(field => state[field] == "-")
        selectedField = Math.trunc(Math.random()*options.length)
        setTimeout(() => {
            makeMoveCPU(options[selectedField])
            return
        }, 250);
    }

    if (firstCPUMove) {
        if (difficulty == 'medium') {
            options = [0,1,2,3,4,5,6,7,8].filter(field => state[field] == "-")
            selectedField = Math.trunc(Math.random()*options.length)
            setTimeout(() => {
                makeMoveCPU(options[selectedField])
                firstCPUMove = false;
                return
            }, 250);
        }
        return
    }

    for (const combination of combinations) {
        const [a, b, c] = combination;
        if ((state[a] === "X" && state[b] === "X" && state[c] === "-") ||
            (state[a] === "O" && state[b] === "O" && state[c] === "-")) {
            setTimeout(() => makeMoveCPU(c), 250);
            return;
        } else if ((state[a] === "X" && state[c] === "X" && state[b] === "-") ||
                   (state[a] === "O" && state[c] === "O" && state[b] === "-")) {
            setTimeout(() => makeMoveCPU(b), 250);
            return;
        } else if ((state[b] === "X" && state[c] === "X" && state[a] === "-") ||
                   (state[b] === "O" && state[c] === "O" && state[a] === "-")) {
            setTimeout(() => makeMoveCPU(a), 250);
            return;
        }
    }
    


    if (!middleBlocked && state[0] == "O" && state[2] == "O" && state[4] != "O" ||
        !middleBlocked && state[2] == "O" && state[8] == "O" && state[4] != "O" ||
        !middleBlocked && state[8] == "O" && state[6] == "O" && state[4] != "O" ||
        !middleBlocked && state[6] == "O" && state[0] == "O" && state[4] != "O") {
        setTimeout(() => {
            makeMoveCPU(4)
            middleBlocked = true;
            return
        }, 250);
    }
    else if (state[1] == "-" || state[3] == "-" || state[5] == "-" || state[7] == "-" ) {
        options = [1,3,5,7].filter(field => state[field] == "-")
        selectedField = Math.trunc(Math.random()*options.length)
        setTimeout(() => {
            makeMoveCPU(options[selectedField])
        }, 250);
    } else {
        options = [0,2,6,8].filter(field => state[field] == "-")
        selectedField = Math.trunc(Math.random()*options.length)
        setTimeout(() => {
            makeMoveCPU(options[selectedField])
        }, 250);
    }
}

// diff select

const difficultyStatus = document.querySelector('.difficulty-status')
let difficulty = 'easy';
document.querySelector('.difficulty-toggler').addEventListener('click',function(e){
    difficulty = e.target.dataset.difficulty;
    if (!difficulty) return
    const difficulties = ['easy','medium','hard']
    difficulties.forEach(diff => document.querySelector(`[data-difficulty="${diff}"]`).classList.remove('selected'))
    document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('selected')

    switch (difficulty) {
        case 'easy':
            indicatorStatus('2%','8.4rem','rgb(106, 204, 106)','0px 0px 5rem rgb(106, 204, 106)')
            resetGame()
            break;
        case 'medium':
            indicatorStatus('29%','12rem','rgb(204, 170, 106)','0px 0px 5rem rgb(204, 170, 106)')
            resetGame()
            break;
        case 'hard':
            indicatorStatus('68%','9rem','rgb(204, 106, 106)','0px 0px 5rem rgb(204, 106, 106)')
            resetGame()
            break;
        default:
            break;
    }
})


const indicatorStatus = function(left,width,backgroundColor,boxShadow) {
    difficultyStatus.style.left = left
    difficultyStatus.style.width = width
    difficultyStatus.style.backgroundColor = backgroundColor
    difficultyStatus.style.boxShadow = boxShadow
}