// Импортируем стили (чтобы Webpack включил их в сборку)
import './styles/main.scss';

// Импортируем наши классы
import { Player } from './game/Player';
import { Input } from './game/Input';
import { GameLoop } from './game/GameLoop';

// Получаем ссылку на canvas и контекст рисования
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Создаём экземпляр игрока. Размеры: 50x50, начальная позиция — центр canvas, скорость 5.
const player = new Player(
    canvas.width / 2 - 25,
    canvas.height / 2 - 25,
    50,
    50,
    5
);

// Создаём объект для обработки ввода
const input = new Input();

// Функция обновления логики (вызывается каждый кадр)
function update() {
    // Передаём игроку текущее состояние клавиш и размеры canvas
    player.update(input.getState(), canvas.width, canvas.height);
}

// Функция отрисовки (вызывается каждый кадр)
function draw() {
    // Очищаем весь canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Рисуем игрока
    player.draw(ctx);
}

// Создаём игровой цикл и запускаем его
const gameLoop = new GameLoop(update, draw);
gameLoop.start();