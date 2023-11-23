const cells = document.querySelectorAll("[refcell]");
let boardList = [["", "", ""], ["", "", ""], ["", "", ""]];
const winnermessagetextElement = document.querySelector('[datawinnermessagetext]');
const winnermessageElement = document.querySelector('[datawinnermessage]');
const restartbutton = document.querySelector('[datarestartbutton]');


/*Função que analisa se a board está cheia ou não. Pois estando cheia o jogo acaba.*/
function checkBoard(board) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                return false;
            }
        }
    }
    return true;
}

/*Função que analisa se na board existe um ganhador, "x" ou "o"*/
function checkWinner(board) {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] == "x" && board[i][1] == "x" && board[i][2] == "x") {
            return "x";
        }
        if ((board[i][0] == "o" && board[i][1] == "o" && board[i][2] == "o")) {
            return "o";
        }
    }

    for (let j = 0; j < 3; j++) {
        if (board[0][j] == "x" && board[1][j] == "x" && board[2][j] == "x") {
            return "x";
        }
        if (board[0][j] == "o" && board[1][j] == "o" && board[2][j] == "o") {
            return "o";
        }
    }

    if (board[0][0] == "x" && board[1][1] == "x" && board[2][2] == "x") {
        return "x";
    }
    if (board[0][0] == "o" && board[1][1] == "o" && board[2][2] == "o") {
        return "o";
    }

    if (board[0][2] == "x" && board[1][1] == "x" && board[2][0] == "x") {
        return "x";
    }
    if (board[0][2] == "o" && board[1][1] == "o" && board[2][0] == "o") {
        return "o";
    }

    return null;
}

/*Função que retorna a mensagem de vencedor quando há um vencedor na board.*/
function gameVerification() {
    const winner = checkWinner(boardList);
    if (winner == 'x') {
        winnermessagetextElement.innerText = '"X" Venceu!';
        winnermessageElement.classList.add("showmessage");
    }
    if (winner == 'o') {
        winnermessagetextElement.innerText = '"O" Venceu!';
        winnermessageElement.classList.add("showmessage");
    }
    if (winner == null && checkBoard(boardList) == true) {
        winnermessagetextElement.innerText = 'Empate!';
        winnermessageElement.classList.add("showmessage");
    }
}

/*Função que faz uma cópia da board passada como parâmetro.*/
function copyBoard(board) {
    const newBoard = [['', '', ''], ['', '', ''], ['', '', '']];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            newBoard[i][j] = board[i][j];
        }
    }
    return newBoard;
}

/*Função que retorna um modelo futuro da board com a jogada disponível no vetorPosição.*/
function jogadaFutura(board, vetorPosicao, jogador) {
    const boardFutura = copyBoard(board);
    boardFutura[vetorPosicao[0]][vetorPosicao[1]] = jogador;
    return boardFutura;
}

/*Função que analisa as jogadas disponíveis na board, ou seja, as posições com ''.*/
function jogadasLivres(board) {
    const jogadas = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                jogadas.push([i, j]);
            }
        }
    }
    return jogadas;
}

/*Função que contém o algoritmo minmax. Aqui temos uma função recursiva que entra profundamente na arvore de 
possibilidades de jogada em um estado de board. As condições de parada são winner == "x" que retorna 1 (max),
winner == "o" que retorna -1 (min) e winner == null e a board completamente cheia que retorna 0, empatando o jogo. */
function minmax(boardFuturo, jogador) {
    const winner = checkWinner(boardFuturo);
    if (winner == 'x') {
        return 1;
    }
    if (winner == 'o') {
        return -1;
    }
    if (winner == null && checkBoard(boardFuturo) == true) {
        return 0;
    }

    const possibilidadesminmax = jogadasLivres(boardFuturo);
    let melhorValorminmax = null;
    for (let n = 0; n < possibilidadesminmax.length; n++) {
        const resultadoFuturominmax = jogadaFutura(boardFuturo, possibilidadesminmax[n], jogador);
        if (jogador == 'x') {
            const valorXminmax = minmax(resultadoFuturominmax, 'o');
            if (melhorValorminmax == null) {
                melhorValorminmax = valorXminmax;
            } else {
                if (valorXminmax > melhorValorminmax) {
                    melhorValorminmax = valorXminmax;
                }
            }
        }
        if (jogador == 'o') {
            const valorOminmax = minmax(resultadoFuturominmax, 'x');
            if (melhorValorminmax == null) {
                melhorValorminmax = valorOminmax;
            } else {
                if (valorOminmax < melhorValorminmax) {
                    melhorValorminmax = valorOminmax;
                }
            }
        }
    }
    return melhorValorminmax;
}

/*Função que marca o movimento da IA na interface e na board game (a matriz 3x3 do jogo).*/
function targetCircle(melhormovimento) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (i == melhormovimento[0] && j == melhormovimento[1]) {
                boardList[i][j] = "o";
                for (let n = 0; n < cells.length; n++) {
                    if (n == 0 && melhormovimento[0] == 0 && melhormovimento[1] == 0) {
                        cells[n].classList.add("circle");
                    }
                    if (n == 1 && melhormovimento[0] == 0 && melhormovimento[1] == 1) {
                        cells[n].classList.add("circle");     
                    }
                    if (n == 2 && melhormovimento[0] == 0 && melhormovimento[1] == 2) {
                        cells[n].classList.add("circle");
                    }
                    if (n == 3 && melhormovimento[0] == 1 && melhormovimento[1] == 0) {
                        cells[n].classList.add("circle");
                    }
                    if (n == 4 && melhormovimento[0] == 1 && melhormovimento[1] == 1) {
                        cells[n].classList.add("circle");
                    }
                    if (n == 5 && melhormovimento[0] == 1 && melhormovimento[1] == 2) {
                        cells[n].classList.add("circle");
                    }
                    if (n == 6 && melhormovimento[0] == 2 && melhormovimento[1] == 0) {
                        cells[n].classList.add("circle");
                    }
                    if (n == 7 && melhormovimento[0] == 2 && melhormovimento[1] == 1) {
                        cells[n].classList.add("circle");
                    }
                    if (n == 8 && melhormovimento[0] == 2 && melhormovimento[1] == 2) {
                        cells[n].classList.add("circle");
                    }
                }
            }
        }
    }
}

/*Função que começa a jogada da IA. Neste jogo a IA sempre é a "o" e o jogador humano é sempre o "x". Dessa forma,
o jogador humano sempre começa jogando e na vez da IA essa função recebe o board com o primeiro estado (estado com a primeira jogada "x" do jogador humano).
E, em seguida, analisa as possiblidades de jogada na board e coloca uma possivel jogada da "o". Por fim, a função
chama a função minmax para retornar o valor (1, -1, 0) daquela possibilidade de jogada e faz isso com todas as possibilidades, analisando, posteriormente
o melhor valor e consequentemente a melhor jogada (para a IA que joga minimizando as possibilidades de vitória de "x" a melhor pontuação é -1) */
function movimentoIA(board) {
    const possibilidades = jogadasLivres(board);
    let melhorValor = null;
    let melhormovimento = null;
    for (let k = 0; k < possibilidades.length; k++) {
        const resultadoFuturo = jogadaFutura(board, possibilidades[k], 'o');
        const valor = minmax(resultadoFuturo, 'x');
        if (melhorValor == null) {
            melhorValor = valor;
            melhormovimento = possibilidades[k];
        } else {
            if (valor < melhorValor) {
                melhorValor = valor;
                melhormovimento = possibilidades[k];
            }
        }
    }
    targetCircle(melhormovimento);
    gameVerification();

}

/*Função que marca na board matriz 3x3 o click do jogador humano, que joga com "x".*/
const addxBordList = () => {
    count = 1;
    for (const cell of cells) {
        if (cell.classList.contains("x")) {
            if (count == 1) {
                boardList[0][0] = "x"
            }
            if (count == 2) {
                boardList[0][1] = "x"
            }
            if (count == 3) {
                boardList[0][2] = "x"
            }
            if (count == 4) {
                boardList[1][0] = "x"
            }
            if (count == 5) {
                boardList[1][1] = "x"
            }
            if (count == 6) {
                boardList[1][2] = "x"
            }
            if (count == 7) {
                boardList[2][0] = "x"
            }
            if (count == 8) {
                boardList[2][1] = "x"
            }
            if (count == 9) {
                boardList[2][2] = "x"
            }
        }
        count++;
    }
}

/*Função de click da interface que marca "x" na grid do jogo, depois chama a função que faz a marcação na board 3x3,
verifica se há algum vitorioso ou empate para exibir na tela e faz o movimento da IA ("o") */
const clikAction = (e) => {
    const cell = e.target;
    cell.classList.add("x");
    addxBordList();
    gameVerification();
    movimentoIA(boardList);
};

/*Função de click do botão de restart que aparece após uma vitoria ou empate no jogo. Essa função remove os "Xs" e "Os" 
da interface e retorna a board para o estado de totalmente vazia.*/
function restartGame() {
    for (const cell of cells) {
        cell.classList.remove("x");
        cell.classList.remove("circle");
        cell.removeEventListener('click', clikAction);
        cell.addEventListener('click', clikAction, { once: true });
    }
    boardList = [["", "", ""], ["", "", ""], ["", "", ""]];
    winnermessageElement.classList.remove("showmessage");
}


for (const cell of cells) {
    cell.addEventListener('click', clikAction, { once: true });
}

restartbutton.addEventListener('click', restartGame);