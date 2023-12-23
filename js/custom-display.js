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

    // Добавляем кнопку закрытия в overlay-shelf
    var closeBtn = $('<div class="close-btn">&#10006;</div>');
    overlay.append(closeBtn);

    // Добавляем галочку для подтверждения выбора
    var confirmCheckbox = $('<div class="confirm">&#10003;</div>');
    overlay.append(confirmCheckbox);

    // Добавляем фоновую картинку
    popup.css({
        'background-image': 'url(medicines/shelf.png)',
    });

    // Добавляем обработчик для закрытия попапа
    $('#closeShelfPopup, .close-btn').on('click', closeShelfPopup);

    confirmCheckbox.on('click', function() {
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
    var selectedMeds = $('.medicationImage.checked').map(function() {
        return $(this).attr('alt');
    }).get();

    if (selectedMeds.length > 0) {
        showModal('Вы выбрали: ' + selectedMeds.join(', '));
    } else {
        showModal('Вы не выбрали ни одного препарата.');
    }
}

function showModal(content) {
    // Создаем модальное окно динамически
    var modal = $('<div id="modal" class="modal"></div>');
    var modalContent = $('<div class="modal-content"></div>');
    var closeModalBtn = $('<span class="close-modal-btn">&times;</span>');
    var modalMessage = $('<div id="selectedMedsDisplayModal">' + content + '</div>');

    modalContent.append(closeModalBtn, modalMessage);
    modal.append(modalContent);

    // Добавляем модальное окно к body
    $('body').append(modal);

    // Открываем модальное окно
    openModal();

    // Обработчик для закрытия модального окна
    closeModalBtn.on('click', closeModal);
}

function openModal() {
    var modal = $('#modal');
    modal.css('display', 'block');
}

function closeModal() {
    var modal = $('#modal');
    modal.css('display', 'none');
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
        { name: 'аквамарис', image: 'medicines/аквамарис.png', description: 'Аква Марис Стронг (спрей)' },
        { name: 'амиксин', image: 'medicines/амиксин.png', description: 'Амиксин (таблетки 125 мг)'  },
        { name: 'виферон', image: 'medicines/виферон.png', description: 'Виферон (суппозитории 500000 МЕ, мазь)'  },
        { name: 'кеторол-экспресс', image: 'medicines/кеторол_экспресс.png', description: 'Кеторол Экспресс (10 мг таблетки, диспергируемые в полости рта)' },
        { name: 'аторис', image: 'medicines/аторис.png', description: 'Аторис (таблетки 20 мг)' },
        { name: 'афобазол', image: 'medicines/афобазол.png', description: 'Афобазол (таблетки 10 мг)' },
        { name: 'виброцил', image: 'medicines/виброцил.png', description: 'Виброцил (капли)' },
        { name: 'аторвастин', image: 'medicines/аторвастин.png', description: 'Аторвастатин (таблетки 20 мг)' },
        { name: 'амоксиклав', image: 'medicines/амоксиклав.png', description: 'Амоксиклав (таблетки 875 мг+125 мг)' },
        { name: 'берокка', image: 'medicines/берокка.png', description: 'Берокка Плюс (таблетки)' },
        { name: 'бепантен', image: 'medicines/бепантен.png', description: 'Бепантен (крем 5%, мазь 5%)' },
        { name: 'банеоцин', image: 'medicines/банеоцин.png', description: 'Банеоцин (порошок)' },
        { name: 'капсикам', image: 'medicines/капсикам.png', description: 'Капсикам (мазь)' },
        { name: 'канефрон', image: 'medicines/канефрон.png', description: 'Канефрон Н (таблетки, раствор)' },
        { name: 'ингавирин', image: 'medicines/ингавирин.png', description: 'Ингавирин (капсулы 90 мг)' },
        { name: 'мидокалм', image: 'medicines/мидокалм.png', description: 'Мидокалм (таблетки 50 мг)' },
        { name: 'метформин', image: 'medicines/метформин.png', description: 'Метформин (таблетки 1000 мг)' },
        { name: 'иберогаст', image: 'medicines/иберогаст.png', description: 'Иберогаст (капли)' },
        { name: 'гриппферон', image: 'medicines/гриппферон.png', description: 'Гриппферон (капли)' },
        { name: 'пантенол', image: 'medicines/пантенол.png', description: 'Пантенол (мазь 5%)' },
        { name: 'но-шпа', image: 'medicines/но-шпа.png', description: 'Но-шпа (таблетки 40 мг)' },
        { name: 'мерифатин', image: 'medicines/мерифатин.png', description: 'Мерифатин МВ 1000 мг (таблетки)' },
        { name: 'нурофен', image: 'medicines/нурофен.png', description: 'Нурофен форте (таблетки 400 мг)' },
        { name: 'масло_облепиховое', image: 'medicines/масло_облепиховое.png', description: 'Масло облепиховое (масло для приема внутрь, местного и наружного применения)' },
        { name: 'Сиофор', image: 'medicines/сиофор.png', description: 'Сиофор 1000 (таблетки 1000 мг)' },
        { name: 'глюкофаж', image: 'medicines/глюкофаж.png', description: 'Глюкофаж Лонг 1000 мг (таблетки 1000 мг)' },
        { name: 'вольтарен', image: 'medicines/вольтарен.png', description: 'Вольтарен (пластырь 30 мг/сут, гель 2%)' },
        { name: 'лоратадин', image: 'medicines/лоратадин.png', description: 'Лоратадин (таблетки 10 мг)' },
        { name: 'лизобакт', image: 'medicines/лизобакт.png', description: 'Лизобакт (таблетки)' },
        { name: 'липримар', image: 'medicines/липримар.png', description: 'Липримар (таблетки 20 мг)' },
        { name: 'супрадин', image: 'medicines/супрадин.png', description: 'Супрадин (таблетки, таблетки шипучие)' },
        { name: 'Тизин', image: 'medicines/тизин.png', description: 'Тизин Алерджи (спрей назальный 50мкг/доза)' },
        { name: 'найз_активгель', image: 'medicines/найз_активгель.png', description: 'Найз (гель)' },
        { name: 'Фитолизин', image: 'medicines/фитолизин.png', description: 'Фитолизин (паста для приготовления суспензии, для приема внутрь)' },
        { name: 'тенотен', image: 'medicines/тенотен.png', description: 'Тенотен (таблетки)' },
        { name: 'Тримедат', image: 'medicines/тримедат.png', description: 'Тримедат (таблетки 200 мг)' },
        { name: 'новопассит', image: 'medicines/новопассит.png', description: 'Ново-пассит (таблетки, раствор)' },
        { name: 'кеторол', image: 'medicines/кеторол.png', description: 'Кеторол (гель)' },
        { name: 'цистон', image: 'medicines/цистон.png', description: 'Цистон (таблетки)' },
        { name: 'Сиалор аква', image: 'medicines/силораква.png', description: 'Сиалор аква (капли назальные)' },
        { name: 'мирамистин', image: 'medicines/мирамистин.png', description: 'Мирамистин (раствор)' },
        { name: 'називин', image: 'medicines/називин.png', description: 'Називин Сенситив (спрей 22,5 мкг/доза)' },
        { name: 'пентовит', image: 'medicines/пентовит.png', description: 'Пентовит (таблетки)' },
        { name: 'персен', image: 'medicines/персен.png', description: 'Персен (таблетки)' },
        { name: 'циклоферон', image: 'medicines/циклоферон.png', description: 'Циклоферон (таблетки 150 мг)' },
        { name: 'энтерол', image: 'medicines/энтерол.png', description: 'Энтерол (капсулы)' },
        { name: 'тулип', image: 'medicines/тулип.png', description: 'Тулип (таблетки 20 мг)' },
        { name: 'Ундевит', image: 'medicines/ундевит_мбф.png', description: 'Ундевит (драже)' },
        { name: 'Фликсоназе', image: 'medicines/фликсоназе.png', description: 'Фликсоназе (спрей 50 мкг/доза)' },
        { name: 'цинковая_паста', image: 'medicines/цинковая_паста.png', description: 'Цинковая паста (25%)' },
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
            var description = $('<div class="medicationDescription">' + medication.description + '</div>');
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