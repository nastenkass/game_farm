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

var selectedMedications = [];

function openShelfPopup() {
    // Создаем оверлей
    var overlay = $('<div id="overlay-shelf"></div>');
    $('body').append(overlay);

    // Создаем попап с полкой
    var popup = $('<div id="shelfPopup" class="popup"></div>');

    // Append the popup to the overlay, not the body
    overlay.append(popup);

    // Добавляем галочку для подтверждения выбора
    var confirmCheckbox = $('<div class="confirm">&#10003;</div>');
    overlay.append(confirmCheckbox);

    // Добавляем фоновую картинку
    popup.css({
        'background-image': 'url(medicines/shelf.png)',
    });

    // Добавляем обработчик для закрытия попапа
    $('#closeShelfPopup, .close-btn').on('click', function () {
        closeShelfPopup();
        unblockBackground();
    });

    confirmCheckbox.on('click', function () {
        closeShelfPopup();
        showSelectedMedications();
    });

    // Показываем оверлей и попап
    overlay.fadeIn();
    popup.fadeIn();

    // Генерируем полки с препаратами и окна для препаратов
    generateShelves();
}

function showSelectedMedications() {
    var selectedMeds = $('.medicationImage.checked').map(function () {
        return $(this).attr('alt');
    }).get();

    var correctMedications = ['Но-шпа', 'Тримедат', 'Иберогаст'];

    // Проверяем, выбраны ли правильные препараты
    var isCorrectSelection = correctMedications.every(function (med) {
        return selectedMeds.indexOf(med) !== -1;
    });

    // Выводим сообщение в модальном окне
    if (selectedMeds.length < 3) {
        showModal('Выберите как минимум 3 препарата.', true, true);
    } else if (!isCorrectSelection) {
        showModal('Вы допустили ошибку. Выберите правильные препараты.', true, true);
        // Блокируем задний фон
        blockBackground();
    } else {
        showModal('Вы выбрали: ' + selectedMeds.join(', '));
    }
}

function blockBackground() {
    var overlay = $('<div id="overlay-blocking"></div>');
    $('body').append(overlay);

    overlay.fadeIn();
}

function closeModal() {
    var modal = $('#modal');
    modal.css('display', 'none');
    // Удаляем блокировку заднего фона при закрытии модального окна
    unblockBackground();
}

function unblockBackground() {
    var overlay = $('#overlay-blocking');
    overlay.fadeOut(function () {
        overlay.remove();
    });
}

function showModal(content, hasReturnButton, isError) {
    // Создаем оверлей
    var overlay = $('<div id="overlay-modal" class="overlay-modal"></div>');
    $('body').append(overlay);

    // Создаем модальное окно динамически
    var modal = $('<div id="modal" class="modal"></div>');
    var modalContent = $('<div class="modal-content"></div>');
    var closeModalBtn = $('<span class="close-modal-btn">&times;</span>');
    var modalMessage = $('<div id="selectedMedsDisplayModal">' + content + '</div>');

    modalContent.append(closeModalBtn, modalMessage);

    // Добавляем кнопку "Закрыть и вернуться" при необходимости
    if (hasReturnButton) {
        var closeAndGoToIndexBtn = $('<button class="close-and-go-to-index-btn">Закрыть и вернуться</button>');
        closeAndGoToIndexBtn.on('click', function () {
            closeModal();
            goToIndexPage();
        });
        modalContent.append(closeAndGoToIndexBtn);
    }

    modal.append(modalContent);

    // Добавляем модальное окно и оверлей к body
    $('body').append(modal);

    // Открываем модальное окно
    openModal();

    // Заблокируем возможность кликать на что-то другое, если это ошибка
    if (isError) {
        overlay.fadeIn();
    }

    // Обработчик для закрытия модального окна
    closeModalBtn.on('click', function () {
        closeModal();
        overlay.fadeOut();
    });
}


function openModal() {
    var modal = $('#modal');
    modal.css('display', 'block');
}


// Добавьте новую функцию для закрытия попапа с полками
function closeShelfPopup() {
    $('#overlay-shelf').fadeOut();
    $('#shelfPopup').fadeOut();
    medicationsOnShelves = []; // Сбрасываем массив при закрытии попапа
}

function generateShelves() {
    var shelfPopup = $('#shelfPopup'); 

    var medications = [
        { name: 'Аквамарис', image: 'medicines/аквамарис.png', description1: 'Аква Марис Стронг', description2: '(спрей)'},
        { name: 'Амиксин', image: 'medicines/амиксин.png', description1: 'Амиксин', description2: '(таблетки 125 мг)'},
        { name: 'Виферон', image: 'medicines/виферон.png', description1: 'Виферон', description2: '(суппозитории 500000 МЕ, мазь)' },
        { name: 'Кеторол-экспресс', image: 'medicines/кеторол_экспресс.png', description1: 'Кеторол Экспресс', description2:'(10 мг таблетки, диспергируемые в полости рта)'},
        { name: 'Аторис', image: 'medicines/аторис.png', description1: 'Аторис', description2:'(таблетки 20 мг)'},
        { name: 'Афобазол', image: 'medicines/афобазол.png', description1: 'Афобазол', description2: '(таблетки 10 мг)'},
        { name: 'Виброцил', image: 'medicines/виброцил.png', description1: 'Виброцил', description2:'(капли)'},
        { name: 'Аторвастин', image: 'medicines/аторвастин.png', description1: 'Аторвастатин', description2:'(таблетки 20 мг)'},
        { name: 'Амоксиклав', image: 'medicines/амоксиклав.png', description1: 'Амоксиклав', description2:'(таблетки 875 мг+125 мг)'},
        { name: 'Берокка', image: 'medicines/берокка.png', description1: 'Берокка Плюс', description2:'(таблетки)'},
        { name: 'Бепантен', image: 'medicines/бепантен.png', description1: 'Бепантен', description2:'(крем 5%, мазь 5%)'},
        { name: 'Банеоцин', image: 'medicines/банеоцин.png', description1: 'Банеоцин', description2:'(порошок)'},
        { name: 'Капсикам', image: 'medicines/капсикам.png', description1: 'Капсикам', description2:'(мазь)'},
        { name: 'Канефрон', image: 'medicines/канефрон.png', description1: 'Канефрон Н', description2:'(таблетки, раствор)'},
        { name: 'Ингавирин', image: 'medicines/ингавирин.png', description1: 'Ингавирин', description2: '(капсулы 90 мг)'},
        { name: 'Мидокалм', image: 'medicines/мидокалм.png', description1: 'Мидокалм', description2:'(таблетки 50 мг)'},
        { name: 'Метформин', image: 'medicines/метформин.png', description1: 'Метформин', description2:'(таблетки 1000 мг)'},
        { name: 'Иберогаст', image: 'medicines/иберогаст.png', description1: 'Иберогаст', description2:'(капли)'},
        { name: 'Гриппферон', image: 'medicines/гриппферон.png', description1: 'Гриппферон', description2:'(капли)'},
        { name: 'Пантенол', image: 'medicines/пантенол.png', description1: 'Пантенол', description2:'(мазь 5%)'},
        { name: 'Но-шпа', image: 'medicines/но-шпа.png', description1: 'Но-шпа', description2:'(таблетки 40 мг)'},
        { name: 'Мерифатин', image: 'medicines/мерифатин.png', description1: 'Мерифатин МВ 1000 мг', description2:'(таблетки)'},
        { name: 'Нурофен', image: 'medicines/нурофен.png', description1: 'Нурофен форте', description2:'(таблетки 400 мг)'},
        { name: 'Масло_облепиховое', image: 'medicines/масло_облепиховое.png', description1: 'Масло облепиховое', description2:'(масло для приема внутрь, местного и наружного применения)'},
        { name: 'Сиофор', image: 'medicines/сиофор.png', description1: 'Сиофор 1000', description2:'(таблетки 1000 мг)'},
        { name: 'Глюкофаж', image: 'medicines/глюкофаж.png', description1: 'Глюкофаж Лонг 1000 мг', description2:'(таблетки 1000 мг)'},
        { name: 'Вольтарен', image: 'medicines/вольтарен.png', description1: 'Вольтарен', description2:'(пластырь 30 мг/сут, гель 2%)'},
        { name: 'Лоратадин', image: 'medicines/лоратадин.png', description1: 'Лоратадин', description2:'(таблетки 10 мг)'},
        { name: 'Лизобакт', image: 'medicines/лизобакт.png', description1: 'Лизобакт', description2:'(таблетки)'},
        { name: 'Липримар', image: 'medicines/липримар.png', description1: 'Липримар', description2:'(таблетки 20 мг)'},
        { name: 'Супрадин', image: 'medicines/супрадин.png', description1: 'Супрадин', description2:'(таблетки, таблетки шипучие)'},
        { name: 'Тизин', image: 'medicines/тизин.png', description1: 'Тизин Алерджи', description2:'(спрей назальный 50мкг/доза)'},
        { name: 'Найз_активгель', image: 'medicines/найз_активгель.png', description1: 'Найз', description2:'(гель)'},
        { name: 'Фитолизин', image: 'medicines/фитолизин.png', description1: 'Фитолизин', description2:'(паста для приготовления суспензии, для приема внутрь)'},
        { name: 'Тенотен', image: 'medicines/тенотен.png', description1: 'Тенотен', description2:'(таблетки)'},
        { name: 'Тримедат', image: 'medicines/тримедат.png', description1: 'Тримедат', description2:'(таблетки 200 мг)'},
        { name: 'Новопассит', image: 'medicines/новопассит.png', description1: 'Ново-пассит', description2:'(таблетки, раствор)'},
        { name: 'Кеторол', image: 'medicines/кеторол.png', description1: 'Кеторол', description2:'(гель)'},
        { name: 'Цистон', image: 'medicines/цистон.png', description1: 'Цистон', description2:'(таблетки)'},
        { name: 'Сиалор аква', image: 'medicines/силораква.png', description1: 'Сиалор аква', description2:'(капли назальные)'},
        { name: 'Мирамистин', image: 'medicines/мирамистин.png', description1: 'Мирамистин', description2:'(раствор)'},
        { name: 'Називин', image: 'medicines/називин.png', description1: 'Називин Сенситив', description2:'(спрей 22,5 мкг/доза)'},
        { name: 'Пентовит', image: 'medicines/пентовит.png', description1: 'Пентовит', description2:'(таблетки)'},
        { name: 'Персен', image: 'medicines/персен.png', description1: 'Персен', description2:'(таблетки)'},
        { name: 'Циклоферон', image: 'medicines/циклоферон.png', description1: 'Циклоферон', description2:'(таблетки 150 мг)'},
        { name: 'Энтерол', image: 'medicines/энтерол.png', description1: 'Энтерол', description2:'(капсулы)'},
        { name: 'Тулип', image: 'medicines/тулип.png', description1: 'Тулип', description2:'(таблетки 20 мг)'},
        { name: 'Ундевит', image: 'medicines/ундевит_мбф.png', description1: 'Ундевит', description2:'(драже)'},
        { name: 'Фликсоназе', image: 'medicines/фликсоназе.png', description1: 'Фликсоназе', description2:'(спрей 50 мкг/доза)'},
        { name: 'Цинковая_паста', image: 'medicines/цинковая_паста.png', description1: 'Цинковая паста', description2:'(25%)'},
        // Добавьте другие препараты с соответствующими названиями и изображениями
    ];

    var shelfHeights = [340, 65, 65, 60, 60];

    medications = shuffleArray(medications);

    // Создаем 5 полок
    for (var i = 0; i < 5; i++) {
        var shelf = $('<div class="shelf"></div>');
        shelf.css('margin-top', shelfHeights[i] + 'px');

        // Добавляем препараты на полку
        var remainingWidth = 100;
        var medicationsOnShelf = [];

        medications.forEach(function (medication) {
            var medicationContainer = $('<div class="medicationContainer"></div>');
            var medicationImage = $('<img class="medicationImage" src="' + medication.image + '" alt="' + medication.name + '">');
            var description = $('<div class="medicationDescription1">' + '<h1>'+medication.description1+'</h1>'+ '<p>'+medication.description2+'</p>'  + '</div>');
            medicationContainer.append(medicationImage, description);
        
            // Определяем ширину препарата
            var medicationWidth = 10;
        
            // Если препарат вмещается в оставшееся пространство на полке, добавляем его
            if (remainingWidth >= medicationWidth) {
                medicationsOnShelf.push(medication);
        
                // Устанавливаем положение препарата и галочки по оси X
                medicationImage.css('left', (100 - remainingWidth) + '%');
        
                shelf.append(medicationContainer);

                medicationContainer.hover(
                    function (e) {
                        // Показываем описание
                        description.fadeIn(300);
                
                        // Вычисляем размеры описания
                        var descriptionWidth = description.width();
                        var descriptionHeight = description.height();
                
                        // Рассчитываем смещение относительно курсора
                        var offsetX = -descriptionWidth; // Регулируйте расстояние от курсора по горизонтали
                        var offsetY = -descriptionHeight + 100; // Регулируйте расстояние от курсора по вертикали
                
                        // Устанавливаем позицию описания рядом с курсором
                        description.css({
                            top: e.pageY + offsetY + 'px',
                            left: e.pageX + offsetX + 'px',
                        });
                
                        // Делаем описание некликальным
                        description.css('pointer-events', 'none');
                    },
                    function () {
                        // Скрываем описание
                        description.fadeOut(100);
                
                        // Восстанавливаем обработку клика после скрытия описания
                        description.css('pointer-events', 'auto');
                    }
                );
        
                remainingWidth -= medicationWidth;
            }
        });

        // Переносим оставшиеся препараты на следующую полку
        medications = medications.filter(function (medication) {
            return medicationsOnShelf.indexOf(medication) === -1;
        });

        shelfPopup.append(shelf);
    }

    // Обработчик двойного клика по препарату
    shelfPopup.on('dblclick', '.medicationImage', function () {
        var medicationImage = $(this);
        var medicationName = medicationImage.attr('alt');
    
        // Проверяем, был ли уже отмечен этот препарат
        var index = selectedMedications.indexOf(medicationName);
    
        if (index === -1) {
            // Препарат не отмечен, добавляем галочку и сохраняем в массив
            medicationImage.addClass('checked');
            selectedMedications.push(medicationName);
        } else {
            // Препарат уже отмечен, убираем галочку и удаляем из массива
            medicationImage.removeClass('checked');
            selectedMedications.splice(index, 1);
        }
    
        updateCheckmarksVisibility();
        if (selectedMedications.length > 3) {
            // Если превысило, снимаем галочку с последнего отмеченного препарата
            var lastSelected = selectedMedications.shift();
            $('.medicationImage[alt="' + lastSelected + '"]').removeClass('checked');
        }
    });
}

function updateCheckmarksVisibility() {
    $('.medicationImage').each(function () {
        var medicationImage = $(this);
        var medicationName = medicationImage.attr('alt');
        var isChecked = selectedMedications.indexOf(medicationName) !== -1;

        medicationImage.toggleClass('checked', isChecked);
    });
}

// Функция для случайного перемешивания массива
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

///////////////////////////////////////////////////////////////////////////////

function goToIndexPage() {
    window.location.href = 'index.html'; // Измените на свой URL
}

//////////////////////////////////////////////////////////////////////////////

function startTimer() {
    timerInterval = setInterval(function () {
        var currentTime = new Date().getTime();
        if (currentTime - startTime >= 600000) { // 600000 миллисекунд = 10 минут
            clearInterval(timerInterval); // Остановить интервал, когда время вышло
            gameOver = true;
            showGameOverScreen();
        } else {
            // Обновляем таймер и отображаем его на экране
            var remainingTime = Math.ceil((600000 - (currentTime - startTime)) / 1000); // Оставшееся время в секундах
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