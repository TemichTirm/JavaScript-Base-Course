const GAME_STATUS_STARTED = 'started';
const GAME_STATUS_PAUSED  = 'paused';
const GAME_STATUS_STOPPED = 'stopped';

const SNAKE_DIRECTION_UP = 'up';
const SNAKE_DIRECTION_DOWN = 'down';
const SNAKE_DIRECTION_LEFT = 'left';
const SNAKE_DIRECTION_RIGHT = 'right';

const GAME_OVER_MESSAGE = 'Игра окончена! Ваш счет: ';

/**
 * Объект с настройками конфигурации игры
 */
const config = {    
    size: 20,                       /* Размер поля. */
    snakeStartSpeed: 500,           /* Начальная скорость змейки задается задержкой таймера выполнения функции move в милисекундах */
    snakeSpeedIncreasingStep: 10,   /* Шаг увеличения скорости движения змейки на дополнительную единицу длины в милисекундах*/
};

/**
 * Основной объект игры.
 */
const game = {
    /**
     * Текущий счет игры.
     * По умолчанию: 0.
     */
    scores: 0,

    /**
     * Текущий статус игры.
     * По умолчанию: stopped.
     */
    status: GAME_STATUS_STOPPED,

    /**
     * Функция ищет HTML элемент контейнера игры на странице.
     *
     * @returns {HTMLElement} Возвращает HTML элемент.
     */
    getElement() {
        return document.getElementById('game');
    },

    /**
     * Функция увеличивает очки.
     */
    changeScores() {
        this.scores++;
        document.getElementById("score-value").innerText = this.scores;
    },

    /**
     * Функция выполняет старт игры.
     */
    start() {

        /* Проверка, что игра уже запущена. */
        if (this.status === GAME_STATUS_STARTED) {
            return;
        }

        this.setGameStatus(GAME_STATUS_STARTED);
        board.render();
        snake.render();
        food.render();        
        timerMoveObj.interval = snake.speed;
    },

    /**
     * Функция выполняет паузу игры.
     */
    pause() {
        /**
        * Если игра на паузе, запускает игру снова
        */
        if (this.status === GAME_STATUS_PAUSED) {
            timerMoveObj.interval = snake.speed;
            this.setGameStatus(GAME_STATUS_STARTED);
        }
        /**
        * Если игра запущена, ставит на паузу
        */
        else {
            this.setGameStatus(GAME_STATUS_PAUSED);
            timerMoveObj.paused = true;
        }
    },

    /**
     * Функция останавливает игру.
     */
    stop() {
        this.setGameStatus(GAME_STATUS_STOPPED);

        /* останавливаем таймер */
        timerMoveObj.paused = true;
        /* передаем текущий счет в модальное окно */
        document.getElementById("scores").innerText = this.scores;
        /* делаем модальное окно видимым */
        document.getElementById("gameOverWindow").style.display = "block";
        /* вешаем обработчик событий на кнопку Ок по нажатию перезагрузить страницу */
        let okButton = document.getElementById("button-ok");
        okButton.addEventListener("click", () => {
            location.reload(); 
        });      
    },

    /**
     * Функция выполняет передвижение змейки по полю.
     */
    move() {
        const nextPosition = snake.getNextPosition();

        /* проверяем совпадает ли следующая позиция с какой-нибудь едой */
        const foundFood = food.foundPosition(nextPosition);

        /* если найден индекс еды (то есть позиция совпадает) */
        if (foundFood !== -1) {
            /* устанавливаем следующую позицию змейки с вторым параметром "не удалять хвост змейки",
             * змейка съев еду вырастает на одну клетку */
            snake.setPosition(nextPosition, false);

            /* увеличиваем скорость змейки */
            snake.increaseSpeed();

            /* увеличиваем счет */
            game.changeScores();

            /* удаляем еду с поля */
            food.removeItem(foundFood);

            /* генерируем новую еду на поле */
            food.generateItem();

            /* перерендериваем еду */
            food.render();
        } else {
            /* если индекс не найден, то просто устанавливаем новую координату для змейки */
            snake.setPosition(nextPosition);
        }

        /* перерендериваем змейку */
        snake.render();
    },    

    /**
     * Функция устанавливает текущий статус игры,
     * раскрашивая контейнер игры в нужный цвет.
     *
     * @param status {GAME_STATUS_STARTED | GAME_STATUS_PAUSED | GAME_STATUS_STOPPED} Строка представляющая статус.
     */
    setGameStatus(status) {

        const element = game.getElement();
        this.status = status;
        element.classList.remove(GAME_STATUS_STARTED, GAME_STATUS_PAUSED, GAME_STATUS_STOPPED);
        element.classList.add(status);
    },    
};

/**
 * Объект, представляющий поле, где ползает змейка.
 */
const board = {

    /**
     * Функция ищет HTML элемент поля на странице.
     *
     * @returns {HTMLElement} Возвращает HTML элемент.
     */
    getElement() {
        return document.getElementById('board');
    },

    /**
     * Функция отрисовывает поле с клетками для игры.
     */
    render() {
        const board = this.getElement();
        board.innerHTML = '';

        /* рисуем на странице 20*20 клеток */
        for (let i = 0; i < config.size**2; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            /* высчитываем и записываем в data атрибуты
             * координаты от верхней и левой границы */
            cell.dataset.top = Math.trunc(i / config.size);
            cell.dataset.left = i % config.size;

            board.appendChild(cell);
        }
    }
};

/**
 * Объект, представляющий клетку на поле.
 */
const cells = {
    

    /**
     * Функция ищет HTML элементы клеток на странице.
     *
     * @returns { HTMLCollectionOf.<Element>} Возвращает набор HTML элементов.
     */
    getElements() {
        return document.getElementsByClassName('cell');
    },

    /**
     * Функция задает класс для клетки по заданным координатам.
     *
     * @param coordinates {Array.<{top: number, left: number}>} Массив координат клеток для изменения.
     * @param className {string} Название класса.
     */
    renderItems(coordinates, className) {
        const cells = this.getElements();

        /* для всех клеток на странице удаляем переданный класс */
        for (let cell of cells) {
            cell.classList.remove(className);
        }

        /* для заданных координат ищем клетку и добавляем класс */
        for (let coordinate of coordinates) {
            const cell = document.querySelector(`.cell[data-top="${coordinate.top}"][data-left="${coordinate.left}"]`);
            cell.classList.add(className);
        }
    }
};

/**
 * Объект, представляющий змейку.
 */
const snake = {
    
    /**
     * Текущая скорость движения змейки.
     * По умолчанию: задается значением из конфигурации.
     */
    speed: config.snakeStartSpeed,

    /**
     * Текущее направление движение змейки.
     * По умолчанию: направо, потому змейка при старте занимает первые три клетки.
     */
    direction: SNAKE_DIRECTION_RIGHT,
    
    /**
     * Содержит массив объектов с координатами частей тела змейки.
     * По умолчанию: первые три клетки.
     */
    parts: [
        { top: 0, left: 0 },
        { top: 0, left: 1 },
        { top: 0, left: 2 },
    ],
    
    /**
     * Функция получения длины змейки.
     */
    increaseSpeed() {
        this.speed -= config.snakeSpeedIncreasingStep;
        timerMoveObj.interval = this.speed;
    },

    /**
     * Функция изменяет направление движения змейки по полю.
     *
     * @param event {KeyboardEvent} Событие нажатия на клавишу.
     */
    changeDirection(event) {

        /* определяем нажатую клавишу
         * устанавливаем соответсвующее направление движения */
        switch (event.key) {
            case "ArrowUp":
                if (this.direction !== SNAKE_DIRECTION_DOWN) {
                    this.direction = SNAKE_DIRECTION_UP;
                }
                break;
            case "ArrowDown":
                if (this.direction !== SNAKE_DIRECTION_UP) {
                    this.direction = SNAKE_DIRECTION_DOWN;
                }
                break;
            case "ArrowLeft":
                if (this.direction !== SNAKE_DIRECTION_RIGHT) {
                    this.direction = SNAKE_DIRECTION_LEFT;
                }
                break;
            case "ArrowRight":
                if (this.direction !== SNAKE_DIRECTION_LEFT) {
                    this.direction = SNAKE_DIRECTION_RIGHT;
                }
                break;
            default:
                return;
        }
    },    

    /**
     * Функция считает следующую позицию головы змейки,
     * в зависимости от текущего направления.
     *
     * @returns {{top: number, left: number}} Возвращает объект с координатами.
     */
    getNextPosition() {
        /* получаем позицию головы змейки */
        const position = { ...this.parts[this.parts.length - 1] };

        /* в зависимости от текущего положения
         * высчитываем значение от верхней и левой границы */
        switch(this.direction) {
            case SNAKE_DIRECTION_UP:
                position.top -= 1;
                break;
            case SNAKE_DIRECTION_DOWN:
                position.top += 1;
                break;
            case SNAKE_DIRECTION_LEFT:
                position.left -= 1;
                break;
            case SNAKE_DIRECTION_RIGHT:
                position.left += 1;
                break;
        }

        /* если змейка выходит за верхний или нижний край поля,
         * то изменяем координаты на противоположную сторону,
         * чтобы змейка выходя за границы возвращалась обратно на поле */
        if (position.top === -1) {
            position.top = config.size - 1;
        } else if (position.top > config.size - 1) {
            position.top = 0;
        }

        /* если змейка выходит за левый или правый край поля,
         * то изменяем координаты на противоположную сторону,
         * чтобы змейка выходя за границы возвращалась обратно на поле */
        if (position.left === -1) {
            position.left = config.size - 1;
        } else if (position.left > config.size - 1) {
            position.left = 0;
        }

        /* проверяем не столкнулась ли голова змейки с телом,
         * если столкнулась, то игра останавливается */
        for (let part of this.parts) {
            if (position.top === part.top && position.left === part.left) {
                game.stop();
            }
        }

        return position;
    },

    /**
     * Функция устанавливает позицию для змейки.
     *
     * @param position {{top: number, left: number}} Координаты новой позиции.
     * @param shift Флаг, указывающий, нужно ли отрезать хвост для змейки.
     */
    setPosition(position, shift = true) {
        /* проверяем флаг, указывающий, нужно ли отрезать хвост для змейки,
         * если флаг положительный, то отрезаем хвост змейки (первый элемент в массиве),
         * чтобы длина змейки не изменилась,
         * если флаг будет отрицательным, то при установки позиции, мы не отрезаем хвост,
         * а значит увеличиваем змейку на одну клетку, это будет означать, что она съела еду */
        if (shift) {
            this.parts.shift();
        }

        /* добавляем новые координаты в конец массива (голова змейки) */

        this.parts.push(position);
    },

    /**
     * Функция отрисовывает змейку на поле.
     */
    render() {
         /* выделяем голову змейки и отрисовываем её */
        let snakeHead = [{   
            top: this.parts[this.parts.length-1].top, 
            left: this.parts[this.parts.length-1].left
        }];
        cells.renderItems(snakeHead, 'head');

         /* выделяем тело змейки и отрисовываем его */
        let snakeBody = [];
        for (let i = 0; i < this.parts.length-1; i++) {
            snakeBody[i] = { top: this.parts[i].top, left: this.parts[i].left};
        }
        cells.renderItems(snakeBody, 'snake');
    }
};

/**
 * Объект, представляющий еду для змейки.
 */
const food = {

    /**
     * Содержит массив объектов с координатами еды на поле.
     */
    items: [
        { top: 7, left: 12 },
        { top: 1, left: 4 },
        { top: 8, left: 6 }
    ],

    /**
     * Функция выполняет поиск переданных координат змейки в массиве с едой.
     *
     * @param snakePosition {{top: number, left: number}} Позиция головы змейки.
     *
     * @returns {number} Возвращает индекс найденного совпадения из массива с едой,
     * если ничего не найдено, то -1.
     */
    foundPosition(snakePosition) {
        /* здесь происходит вызов функции comparerFunction для каждого элемента в массиве,
         * если функция вернет true, то для этого элемента будет возвращен его индекс,
         * если функция ни разу не вернет true, то результатом будет -1 */
        return this.items.findIndex((item) =>
            item.top === snakePosition.top && item.left === snakePosition.left
        );
    },

    /**
     * Функция удаляет один элемент по индексу из массива с едой.
     *
     * @param foundPosition Индекс найденного элемента.
     */
    removeItem(foundPosition) {
        this.items.splice(foundPosition, 1);
    },

    /**
     * Функция генерирует объект с координатами новой еды.
     */
    generateItem() {
        let isNewCoordinatesCorrect = true;
        const newItem = {};
        do {
            newItem.top = getRandomNumber(0, config.size - 1);
            newItem.left = getRandomNumber(0, config.size - 1);

            /* проверка на совпадение новых координат еды с координатами частей змейки 
               если её включить, то в один из моментов она перегружает браузер и страница зависает 
               почему, я не смог разобраться. Без неё новая еда иногда попадает на змейку */
            // for (let part of snake.parts) {
            //     if (part.top === newItem.top && part.left === newItem.left) {
            //         isNewCoordinatesCorrect = false;
            //     }
            // };

            /* проверка на совпадение новых координат еды с координатами уже имеющейся еды */
            for (let item of this.items) {
                if (item.top === newItem.top && item.left === newItem.left) {
                    isNewCoordinatesCorrect = false;
                }
            };
        }
        while (!isNewCoordinatesCorrect) 
        this.items.push(newItem);
    },

    /**
     * Функция отрисовывает еду на поле.
     */
    render() {
        cells.renderItems(this.items, 'food');
    }
};

/**
 * Функция, которая выполняет инициализацию игры.
 */
function init() {
    /* получаем кнопки */
    const startButton = document.getElementById('button-start');
    const pauseButton = document.getElementById('button-pause');
    const stopButton = document.getElementById('button-stop');

    /* добавляем обработчики клика на кнопки */
    startButton.addEventListener('click', game.start.bind(game));
    pauseButton.addEventListener('click', game.pause.bind(game));
    stopButton.addEventListener('click', game.stop.bind(game));

    /* добавляем обработчик при нажатии на любую кнопку на клавиатуре,
     * далее в методе мы будем проверять нужную нам клавишу */
    window.addEventListener('keydown', snake.changeDirection.bind(snake));
}

/**
 * Создаем объект для управления интервалом запуска функции game.move()
 */
const timerMoveObj = { 
    timerId: 0, 
    func: game.move 
}; 

/* Определяем свойство для задания интервала задержки */
Object.defineProperty(timerMoveObj, 'interval', {
    set: function (val) {
        if (timerMoveObj.timerId) clearTimeout(timerMoveObj.timerId);
        timerMoveObj.timerId = setInterval(timerMoveObj.func, val);
    }
});

/* Определяем свойство для постановки игры на паузу */
Object.defineProperty(timerMoveObj, 'paused', {
    set: function () {
        if (timerMoveObj.timerId) clearTimeout(timerMoveObj.timerId);
    }
});

/**
 * Функция, генерирующая случайные числа.
 *
 * @param min {number} Нижняя граница генерируемого числа.
 * @param max {number} Верхняя граница генерируемого числа.
 *
 * @returns {number} Возвращает случайное число.
 */
function getRandomNumber(min, max) {
    return Math.trunc(Math.random() * (max - min) + min);
}

window.addEventListener('load', init);
