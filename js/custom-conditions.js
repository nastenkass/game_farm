//Пример пользовательского условия:
//Это значение равно true, когда данное число строго больше.
//чем случайно выбранное число от 0 до 99 (включительно).
//Пример использования: <<случайное 50>>
//Значение 50 означает, что это условие будет верным в 50% случаев.
var evaluateRandomCondition = function(condition)
{
	//Get a random integer between 0 and 99 (included)
	var n = Math.floor(Math.random()*100);
	//Проверьте, больше ли заданное число n
//0 никогда не будет строго больше n
//100 всегда будет строго больше n
//Ты всегда будешь больше, чем n ❤
  	return n < parseInt(condition.options[0]);
}

var checkAnswer = function(condition) {
	number = parseInt(condition.options[0]);
    colorAnswer1(number);
    return true;
}

//////////////////////////////////////////////////////////////////////////////

function colorAnswer1(number) {
    var element = $(".answer-state");
    var colorMap = {
        1: 'green',
        2: 'yellow',
		0: 'red'
        // Добавьте другие соответствия чисел и цветов по мере необходимости
    };

    // Если переданное число не существует в colorMap, используйте красный цвет
    var color = colorMap[number];

    // Создаем псевдоэлемент ::before динамически
    var pseudoElement = $("<div></div>").addClass("answer-state-shadow");
    element.append(pseudoElement);

    // Задаем стили для псевдоэлемента
    pseudoElement.css({
        'position': 'absolute',
        'top': '0',
        'left': '0',
        'width': '100%',
        'height': '100%',
        'pointer-events': 'none', // Позволяет кликам проходить через псевдоэлемент
        'opacity': '0', // Устанавливаем начальную прозрачность
        'box-shadow': 'inset 0 0 40px 15px ' + color // Используем переменную color для установки цвета
    });

    // Используем animate для анимации opacity и box-shadow
    pseudoElement.animate({
        'opacity': '1'
    }, {
        duration: 300,
        easing: 'linear',
        step: function (now, fx) {
            if (fx.prop === 'opacity') {
                // Выполняется на каждом шаге анимации opacity
                // Можно добавить дополнительные действия здесь
            }
        },
        complete: function () {
            // После завершения первой анимации, запускаем вторую анимацию
            pseudoElement.animate({
                'opacity': '0'
            }, {
                duration: 500,
                easing: 'linear',
                complete: function () {
                    // Удаляем псевдоэлемент после завершения второй анимации
                    pseudoElement.remove();
                }
            });
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////

function enableComputerClick(number) {
    if (number === 1) {
        canClickComputer = true;
        $('#pc').addClass('highlight');
    } else {
        canClickComputer = false;
        $('#pc').finish().removeClass('highlight');
    }
}

var turnOnComputer = function (condition) {
    number = parseInt(condition.options[0]);
    enableComputerClick(number);
    return true;
}

////////////////////////////////////////////////////////////////////////////////////

var openShelf = function (condition) {
    number = parseInt(condition.options[0]);
    openShelfPopup();
    return true;
}

/////////////////////////////////////////////////////////////////////////////////////

var pointAmount = function (condition) {
    var number = parseInt(condition.options[0]);
    if (number === 22) {
        checkPoint(0.5);
    } else {
        checkPoint(number);
    }
    return true;
};

var result = 0;
var maxPoints = 30;

function checkPoint(number) {
    result += number;
    if (number === 0) {
        showPoint(result + 3, maxPoints); // Передаём maxPoints
    }
    return result;
}

function showPoint(result, maxPoints) {
    var pointPopupElement = document.getElementById("pointPopup");
    var overlayElement = document.getElementById("overlay-point");

    if (pointPopupElement && overlayElement) {
        // Очищаем предыдущие содержимое
        pointPopupElement.innerHTML = '';

        // Создаем контейнер для прогресс-бара
        var progressContainer = document.createElement("div");
        progressContainer.id = "progressContainer";

        // Создаем прогресс-бар
        var progressBar = document.createElement("div");
        progressBar.id = "progressBar";
        progressBar.style.width = '0%'; // Изначально 0%

        // Добавляем прогресс-бар в контейнер
        progressContainer.appendChild(progressBar);
        pointPopupElement.appendChild(progressContainer);

        // Создаем текст с результатом
        var scoreText = document.createElement("div");
        scoreText.id = "scoreText";
        scoreText.innerText = "Набранные баллы — " + result + " из " + maxPoints;
        pointPopupElement.appendChild(scoreText);

        // Обновляем ширину прогресс-бара
        var progressPercentage = (result / maxPoints) * 100;
        progressBar.style.width = progressPercentage + "%";

        // Добавляем кнопку "Закрыть"
        var closeButton = document.createElement("div");
        closeButton.className = "closeButton-point";
        closeButton.innerHTML = "&#10006;";
        closeButton.onclick = function () {
            closePopup();
        };
        pointPopupElement.appendChild(closeButton);

        // Показываем попап и оверлей
        pointPopupElement.style.display = "block";
        overlayElement.style.display = "block";
    }
}

function closePopup() {
    var pointPopupElement = document.getElementById("pointPopup");
    var overlayElement = document.getElementById("overlay-point");
    pointPopupElement.style.display = "none";
    overlayElement.style.display = "none";
    window.location.href = "end.html";
}

//A dictionary of all the known custom conditions, and the function they use to be evaluated.
//Don't forget to add your own "name":function pairs here, too!
var customConditions = {
  "random": evaluateRandomCondition,
  "check_answer": checkAnswer,
  "turn_on_pc": turnOnComputer,
  "shelf": openShelf,
  "point": pointAmount,
  /* "custom":myCustomCondition, */
};