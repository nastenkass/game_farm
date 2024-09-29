//So uh these need to be initialized somewhere and I thought "Why not here?"
//Why not here, indeed.
var scenes = {};
var characters = {};
var places = {};
var variables = {};

function clearScene() {
  // Удаляем все элементы выбора из контейнера #choices
  $("#choices .choice").remove();
  // Удаляем элементы персонажа
  $(".character").remove();
}

function observeChoicesCharacter() {
  // Создаем экземпляр MutationObserver
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // Проверяем, если в #choices-character добавлен новый элемент
      if (mutation.addedNodes.length > 0) {
        // Удаляем все элементы с классом selected-choice из #choices-character
        $("#choices-character .choice.selected-choice").remove();
      }
    });
  });

  // Настраиваем наблюдатель на контейнер #choices-character
  var config = { childList: true };
  var targetNode = document.getElementById('choices-character');

  if (targetNode) {
    observer.observe(targetNode, config);
  }
}

// Вызов функции для начала наблюдения
observeChoicesCharacter();


function displayCharacter(characterData)
{
  //characterData содержит только идентификатор персонажа и позу
//Фактические изображения и имена находятся в словаре символов.
//Если данный ключ не существует, выдать ошибку и вместо этого вернуться к символу по умолчанию.
  if(!(characterData.id in characters))
  {
    console.error("Character "+characterData.id+" does not exist.");
    characterData.id = "default";
    characterData.pose = "hidden";
  }
  var character = characters[characterData.id];

  //Отображение имени персонажа
	$("#characterName").html(character.name);

  //Установите атрибуты персонажа и позы контейнера, чтобы можно было применять собственные правила CSS.
  $("#container").attr("character", characterData.id);
  $("#container").attr("pose", characterData.pose);

  //«Скрытая» поза просто означает, что персонаж скрыт и отображать нечего.
  if(characterData.pose != "hidden")
  {
    //Создайте элемент персонажа и установите его фон перед добавлением его в сцену.
    var characterElement = $("<div class='character'></div>");
    characterElement.css({"background-image": "url('"+character.poses[characterData.pose]+"')"});
    $("#sceneContent").append(characterElement);  
  }

  //Пользовательский код, который выполняется после показа символа, будет вызываться сейчас.
  onCharacterDisplayed(character);
}

var clickedChoices = {};

function displayChoices(choices, characterData) {

  console.log("Character ID:", characterData.id);

  for (var c in choices) {

    var targetDiv;
    if (characterData.id.id === "pharmacist_1") {
      targetDiv = "#choices";
    } else {
      targetDiv = "#choices-character";
    }
    console.log("targetDiv:", targetDiv);
    var choice = choices[c];
    var choiceElement = $("<div class='choice' data-target=" + choice.target + ">" + choice.text + "</div>");
    $(targetDiv).append(choiceElement);

    // Добавляем обработчик события для выбора
    choiceElement.on("click", (function (selectedChoice, element) {
      return function () {
        // Проверяем, был ли уже выбран этот вариант
        if (clickedChoices[selectedChoice.target]) {
          return;
        }

        // Помечаем вариант как выбранный
        clickedChoices[selectedChoice.target] = true;

        // Проверяем условия только для выбранного варианта
        if (selectedChoice.conditions && selectedChoice.conditions.length > 0) {
          var conditionsMet = true;

          for (var i = 0; i < selectedChoice.conditions.length; i++) {
            var condition = selectedChoice.conditions[i];
            conditionsMet = conditionsMet && evaluateCondition(condition);

            if (!conditionsMet) break;
          }

          // Если условия не выполнены, выходим
          if (!conditionsMet) return;
        }

        // Изменяем стиль выбранного варианта
        element.addClass("selected-choice");

        // Блокируем действие при клике
        element.off("click");

        // Здесь можно добавить код для перехода к следующей сцене или выполнения других действий
      };
    })(choice, choiceElement));
  }
}

function displayPlace(placeId)
{
  //Фактические изображения и имена находятся в словаре мест.
//Если данный ключ не существует, выдать ошибку и выйти из функции.
  if(!(placeId in places))
  {
    console.error("Place "+placeId+" does not exist.");
    return;
  }
  var place = places[placeId];
  
  //Показать его имя
  $("#placeName").html(place.name);
  //Установите атрибут Place в контейнере для применения пользовательских правил CSS.
  $("#container").attr("place", placeId);
  //Отобразить изображение места в качестве фона
  displayBackground(place.image);

  //Пользовательский код, который выполняется после смены мест, теперь будет вызываться.
  onPlaceDisplayed(place);
}

//Технически это можно вызвать из специального действия, например, для изменения фона без изменения места?
function displayBackground(url)
{
	$("#sceneContent").css({"background":"url('"+url+"')"});
}

function displayScene(sceneId)
{	
  clickedChoices = {};

  //Clear the scene
	clearScene();

  //Пользовательский код, который выполняется после очистки сцены, теперь будет вызываться.
  onSceneCleared();

  //Checks if the scene we're trying to display actually exists?
  if(!(sceneId in scenes))
  {
    console.error("Scene "+sceneId+" not found.");
    return;
  }
	var currentScene = scenes[sceneId];

  //Управляйте каждым действием в этой сцене
  for(var a in currentScene.actions)
  {
    var action = currentScene.actions[a];
    executeAction(action);
  }

  //Display the character
	displayCharacter(currentScene.character);

  //Показать варианты
	displayChoices(currentScene.choices, {id: currentScene.character});

  //Custom code that executes after displaying the scene will be called now
  onSceneDisplayed(currentScene);
}

//При нажатии на выбор
$(document).on("click", ".choice", function()
{
  //Вызов пользовательского кода, который обрабатывает клики по выбору.
  if( !onChoiceClicked($(this).data("target")) )
  {
    //Если ему нечего делать, просто используйте обычное поведение: отображение целевой сцены.
    displayScene($(this).data("target"));
  }
});