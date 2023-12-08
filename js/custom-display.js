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

//////////////////////////////////

var pdfViewer = null;

function openFilePopup(filePath) {
    if (canClickComputer) {
        if ($('#filePopup').length === 0) {
            var popup = $('<div id="filePopup" class="popup">\
                              <div id="pdfContainer"></div>\
                              <button id="closePopup">Закрыть</button>\
                              <div id="buttonContainer"></div>\
                            </div>');

            $('body').append(popup);

            $('#closePopup').on('click', closeFilePopup);
        }

        $('#filePopup').fadeIn();

        pdfjsLib.getDocument(filePath).promise.then(function(pdfDoc) {
            pdfViewer = pdfDoc;

            var pdfContainer = document.getElementById('pdfContainer');
            pdfContainer.innerHTML = '';

            for (var pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber++) {
                pdfDoc.getPage(pageNumber).then(function(page) {
                    var canvas = document.createElement('canvas');
                    pdfContainer.appendChild(canvas);

                    var context = canvas.getContext('2d');
                    var viewport = page.getViewport({ scale: 1 });

                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };

                    page.render(renderContext);
                }).catch(function(error) {
                    console.error('Ошибка при загрузке страницы PDF:', error);
                });
            }

            // Сброс скролла вверх
            pdfContainer.scrollTop = 0;
        }).catch(function(error) {
            console.error('Ошибка при загрузке PDF:', error);
        });
    }
}


function closeFilePopup() {
    $('#filePopup').fadeOut();

    if (pdfViewer !== null) {
        pdfViewer.destroy();
        pdfViewer = null;
    }
}

// Массив с парами "название файла" и "путь"
var files = [
    { name: 'Афобазол', path: 'files/afobazol.pdf' },
    { name: 'Амиксин', path: 'files/amiksin.pdf' },
    { name: 'Аторис', path: 'files/atoris.pdf' },
    { name: 'Фитолизин', path: 'files/fitolizin.pdf' },
    { name: 'Глюкофаж лонг', path: 'files/glukofazhlong.pdf' },
    { name: 'Но-шпа', path: 'files/noshpa.pdf' },
    { name: 'Нурофен форте', path: 'files/nurofen_forte.pdf' },
    { name: 'Пантенол', path: 'files/pantenol.pdf' },
    { name: 'Супрадин', path: 'files/supradin.pdf' },
    { name: 'Тизин алерджи', path: 'files/tizin_alerdzhi.pdf' },
    // Добавьте другие файлы с соответствующими названиями и путями
];

// Добавляем обработчик событий для нажатия на изображение внутри #pc
$('#pc').on('click', function() {
    // При нажатии вызываем функцию открытия попапа с первым файлом
    openFilePopup(files[0].path);

    // Добавляем динамически кнопки внутри контейнера #buttonContainer
    var buttonContainer = $('#buttonContainer');
    buttonContainer.html(''); // Очищаем контейнер перед добавлением новых кнопок

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var button = $('<button class="fileButton">' + file.name + '</button>');

        // Используем замыкание для правильного захвата значения переменной file
        (function(filePath) {
            button.on('click', function() {
                openFilePopup(filePath);
            });
        })(file.path);

        buttonContainer.append(button);
    }
});

////////////////////////////////////////////////////////////////////////////////

function openShelfPopup() {
    if ($('#shelfPopup').length === 0) {
        var popup = $('<div id="shelfPopup" class="popup">\
                          <div id="shelfContainer"></div>\
                          <button id="closeShelfPopup">Закрыть</button>\
                      </div>');

        $('body').append(popup);

        // Добавляем фоновую картинку
        popup.css({
            'background-image': 'url(medicines/shelf.png)',
        });

        $('#closeShelfPopup').on('click', closeShelfPopup);
    }

    $('#shelfPopup').fadeIn();

    // Генерируем полки с препаратами
    generateShelves();
}



// Добавьте новую функцию для закрытия попапа с полками
function closeShelfPopup() {
    $('#shelfPopup').fadeOut();
}

function generateShelves() {
    var shelfPopup = $('#shelfPopup');
    shelfPopup.html('');

    var medications = [
        { name: 'аквамарис', image: 'medicines/аквамарис.png', description: 'Описание препарата 1' },
        { name: 'амиксин', image: 'medicines/амиксин.png', description: 'Описание препарата 1'  },
        { name: 'виферон', image: 'medicines/виферон.png', description: 'Описание препарата 1'  },
        { name: 'кеторол-экспресс', image: 'medicines/кеторол_экспресс.png', description: 'Описание препарата 1' },
        { name: 'аторис', image: 'medicines/аторис.png', description: 'Описание препарата 1' },
        { name: 'афобазол', image: 'medicines/афобазол.png', description: 'Описание препарата 1' },
        { name: 'виброцил', image: 'medicines/виброцил.png', description: 'Описание препарата 1' },
        { name: 'аторвастин', image: 'medicines/аторвастин.png', description: 'Описание препарата 1' },
        { name: 'амоксиклав', image: 'medicines/амоксиклав.png', description: 'Описание препарата 1' },
        // Добавьте другие препараты с соответствующими названиями и изображениями
    ];

    var shelfHeights = [295, 35, 35, 35];
    var tooltipSize = '200px'; // Размер плашки подсказки

    // Перемешиваем препараты
    medications = shuffleArray(medications);

    // Создаем четыре полки
    for (var i = 0; i < 4; i++) {
        var shelf = $('<div class="shelf"></div>');

        // Устанавливаем фиксированное положение по оси Y
        shelf.css('margin-top', shelfHeights[i] + 'px');

        // Выбираем случайное количество препаратов для каждой полки (от 1 до 3, например)
        var numberOfMedications = Math.floor(Math.random() * 100) + 1; ////////////////////// тут проблема? не все препараты высвечиваются //////////////

        // Добавляем препараты на полку
        for (var j = 0; j < numberOfMedications; j++) {
            if (medications.length > 0) {
                var medication = medications.pop();
                var medicationImage = $('<img class="medicationImage" src="' + medication.image + '" alt="' + medication.name + '">');

                // Устанавливаем случайное положение по оси X
                medicationImage.css('left', Math.random() * 100 + '%');

                // Добавляем всплывающую подсказку при наведении
                var tooltip = $('<div class="tooltip">' + medication.description + '</div>');
                tooltip.css('max-width', tooltipSize);
                medicationImage.append(tooltip);

                // Используйте замыкание для правильного захвата значения переменной medicationName
                (function(medicationName) {
                    medicationImage.on('click', function() {
                        alert('Выбран препарат: ' + medicationName);
                        // Здесь вы можете выполнить дополнительные действия при выборе препарата
                    });
                })(medication.name);

                shelf.append(medicationImage);
            }
        }

        // Добавляем полку на страницу
        shelfPopup.append(shelf);
    }
}

// Функция для случайного перемешивания массива
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


//////////////////////////////////////////////////////////////////////////////

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