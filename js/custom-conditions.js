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
        $('#pc img').addClass('highlight');
    } else {
        canClickComputer = false;
        $('#pc img').finish().removeClass('highlight');
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

//A dictionary of all the known custom conditions, and the function they use to be evaluated.
//Don't forget to add your own "name":function pairs here, too!
var customConditions = {
  "random": evaluateRandomCondition,
  "check_answer": checkAnswer,
  "turn_on_pc": turnOnComputer,
  "shelf": openShelf,
  /* "custom":myCustomCondition, */
};