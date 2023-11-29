/*
Временная шкала отображения сцены:
-Очищена сцена (со страницы удалены выборы и персонажи)
-Действия выполняются (изменение места, обновление переменных и т. д.)
-Персонаж отображается
-Условия каждого выбора оцениваются и отображаются доступные варианты.
-Игрок нажимает на выбор, что обычно приводит к смене сцены.
*/


function onSceneCleared()
{
 //Пользовательский код, который будет выполнен сразу после того, как сцена будет очищена от выбранных вариантов и символов,
 //перед обработкой любого содержимого сцены.
}

function onPlaceDisplayed(place){
    //Пользовательский код, который будет выполняться сразу после отображения места в сцене
}

function onCharacterDisplayed(character)
{
 //Пользовательский код, который будет выполняться сразу после отображения персонажа в сцене
}

var startTime; // Глобальная переменная для хранения времени начала игры
var gameOver = false; // Глобальная переменная, чтобы отслеживать состояние игры
var timerInterval;
var choicesEnabled = true;

function onSceneDisplayed(scene) {
 hideGameOverScreen();
    if (!startTime) {
        startTime = new Date().getTime(); // Устанавливаем время начала игры при первом вызове функции
        startTimer(); // Запускаем таймер при старте игры
    }
}

function startTimer() {
    timerInterval = setInterval(function () {
        var currentTime = new Date().getTime();
        if (currentTime - startTime >= 100000) { // 600000 миллисекунд = 10 минут
            clearInterval(timerInterval); // Остановить интервал, когда время вышло
            gameOver = true;
            showGameOverScreen();
        } else {
            // Обновляем таймер и отображаем его на экране
            var remainingTime = Math.ceil((100000 - (currentTime - startTime)) / 1000); // Оставшееся время в секундах
            $("#timerCounter").text("Время: " + formatTime(remainingTime));
        }
    }, 1000); // Обновлять каждую секунду (1000 миллисекунд)
}

function stopTimer() {
    clearInterval(timerInterval); // Остановить таймер
}

function showGameOverScreen() {
 document.getElementById("overlay").style.display = "block"; // Показать оверлей
   document.getElementById("popup").style.display = "block"; // Показать попап
}

function hideGameOverScreen() {
    document.getElementById("overlay").style.display = "none"; // Скрыть оверлей
  document.getElementById("popup").style.display = "none"; // Скрыть попап
}

function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return minutes + "м " + remainingSeconds + "с";
}

document.getElementById("restartButton").addEventListener("click", function() {
 // Здесь вы можете добавить код для перезапуска уровня
 // Например, перенаправьте пользователя на начало игры или выполните другие действия для перезапуска уровня
 // После этого, скройте попап
 location = "index.html"
 hideGameOverPopup();
});


function onChoiceClicked(targetSceneId) {
    //Пользовательский код, который будет выполняться, когда игрок нажмет на выбор

    //Пример пользовательского поведения при нажатии на выбор:
    //Перенаправление игрока на конечную страницу, если цель выбора называется "конец"
    if (targetSceneId.toLowerCase() == "end") {
        location = "end.html";
    }
}