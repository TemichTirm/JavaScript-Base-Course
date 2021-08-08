// Функция отрисовки символов в разметке доски
function showSymbol(symbol) {
    symbol = symbol === undefined ? "" : symbol;
    document.write(`<td class="markSymbol">${symbol}</td>`);
}

// Функция отрисовки букв в разметке доски
function showLetters() {
    document.write('<tr>');
    for (let i = 0; i <= 9; i++) {
        if (i === 0 || i === 9) {
            showSymbol();
        }
        else {
            showSymbol(`&#${i + 64}`);
        }
    }
    document.write('</tr>');
}

// Функция отрисовки квадратов доски и фигур
function drawSquare(isBlack, isBlackSquare, path) {
    if (path === undefined) {
        if (isBlackSquare) {
            document.write(`<td class = "blackSquare"></td>`);
        }
        else {
            document.write(`<td class = "whiteSquare"></td>`);
        }
    }
    else {
        if (isBlackSquare) {
            document.write(`<td class = "blackSquare"><img class = "piece" src="${path}" height = "45px"></td>`);
        }
        else {
            document.write(`<td class = "whiteSquare"><img class = "piece" src="${path}" height = "45px"></td>`);
        }
    }
}

document.write('<table align="center" style="border-style : none; border-collapse: collapse;" border="1">');
showLetters(); // Отображение букв разметки сверху доски
const isBlackPiece = true;
const isBlackSquare = true;

// Прорисовка доски на странице
for (let row = 1; row <= 8; row++) {
    document.write('<tr>');
    if (row % 2 === 0) { // Формирование четных строк доски
        for (let column = 0; column <= 9; column++) {
            if (column === 0 || column === 9) { // Отображение цифр разметки справа и слева от доски на четных строках
                showSymbol(9 - row);
            }
            else if (column % 2 === 0) {
                switch (row) {
                    case 2: { // Отображение белых пешек на белых клетках
                        drawSquare(!isBlackPiece, !isBlackSquare, "Chess pieces/white_pawn.png");
                        break;
                    }
                    case 8: { // Отображение черных фигур на белых клетках
                        switch (column) {
                            case 2: {
                                drawSquare(isBlackPiece, !isBlackSquare, "Chess pieces/black_knight.png");
                                break;
                            }
                            case 4: {
                                drawSquare(isBlackPiece, !isBlackSquare, "Chess pieces/black_king.png");
                                break;
                            }
                            case 6: {
                                drawSquare(isBlackPiece, !isBlackSquare, "Chess pieces/black_bishop.png");
                                break;
                            }
                            case 8: {
                                drawSquare(isBlackPiece, !isBlackSquare, "Chess pieces/black_rook.png");
                                break;
                            }
                        }
                        break;
                    }
                    default: { // Отображение пустых белых клеток на четных строках
                        drawSquare(!isBlackPiece, !isBlackSquare);
                        break;
                    }
                }
            }
            else {
                switch (row) {
                    case 2: { // Отображение белых пешек на черных клетках
                        drawSquare(!isBlackPiece, isBlackSquare, "Chess pieces/white_pawn.png");
                        break;
                    }
                    case 8: { // Отображение черных фигур на черных клетках
                        switch (column) {
                            case 1: {
                                drawSquare(isBlackPiece, isBlackSquare, "Chess pieces/black_rook.png");
                                break;
                            }
                            case 3: {
                                drawSquare(isBlackPiece, isBlackSquare, "Chess pieces/black_bishop.png");
                                break;
                            }
                            case 5: {
                                drawSquare(isBlackPiece, isBlackSquare, "Chess pieces/black_queen.png");
                                break;
                            }
                            case 7: {
                                drawSquare(isBlackPiece, isBlackSquare, "Chess pieces/black_knight.png");
                                break;
                            }
                        }
                        break;
                    }
                    default: { // Отображение пустых черных клеток на четных строках
                        drawSquare(!isBlackPiece, isBlackSquare);
                        break;
                    }
                }
            };
        };
    }
    else { // Формирование нечетных строк доски
        for (let i = 0; i <= 9; i++) {
            if (i === 0 || i === 9) { // Отображение цифр разметки справа и слева от доски на нечетных строках
                showSymbol(9 - row);
            }
            else if (i % 2 === 0) {
                switch (row) {
                    case 1: { // Отображение белых фигур на черных клетках
                        switch (i) {
                            case 2: {
                                drawSquare(!isBlackPiece, isBlackSquare, "Chess pieces/white_knight.png");
                                break;
                            }
                            case 4: {
                                drawSquare(!isBlackPiece, isBlackSquare, "Chess pieces/white_king.png");
                                break;
                            }
                            case 6: {
                                drawSquare(!isBlackPiece, isBlackSquare, "Chess pieces/white_bishop.png");
                                break;
                            }
                            case 8: {
                                drawSquare(!isBlackPiece, isBlackSquare, "Chess pieces/white_rook.png");
                                break;
                            }
                        }
                        break;
                    }
                    case 7: { // Отображение черных пешек на черных клетках
                        drawSquare(isBlackPiece, isBlackSquare, "Chess pieces/black_pawn.png");
                        break;
                    }
                    default: { // Отображение пустых черных клеток на нечетных строках
                        drawSquare(isBlackPiece, isBlackSquare);
                        break;
                    }
                }
            }
            else {
                switch (row) {
                    case 1: {
                        switch (i) { // Отображение белых фигур на белых клетках
                            case 1: {
                                drawSquare(!isBlackPiece, !isBlackSquare, "Chess pieces/white_rook.png");
                                break;
                            }
                            case 3: {
                                drawSquare(!isBlackPiece, !isBlackSquare, "Chess pieces/white_bishop.png");
                                break;
                            }
                            case 5: {
                                drawSquare(!isBlackPiece, !isBlackSquare, "Chess pieces/white_queen.png");
                                break;
                            }
                            case 7: {
                                drawSquare(!isBlackPiece, !isBlackSquare, "Chess pieces/white_knight.png");
                                break;
                            }
                        }
                        break;
                    }
                    case 7: { // Отображение черных пешек на белых клетках
                        drawSquare(isBlackPiece, !isBlackSquare, "Chess pieces/black_pawn.png");
                        break;
                    }
                    default: { // Отображение пустых белых клеток на нечетных строках
                        drawSquare(isBlackPiece, !isBlackSquare);
                        break;
                    }
                }
            };
        };
    }
    document.write('</tr>');
};
showLetters(); // Отображение букв разметки снизу доски
document.write('</table>');

