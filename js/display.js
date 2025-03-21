var scenes = {};
var characters = {};
var places = {};
var variables = {};

function clearScene() {
  $("#choices .choice").remove();
  $(".character").remove();
}

function observeChoicesCharacter() {
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        $("#choices-character .choice.selected-choice").remove();
      }
    });
  });

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
  if(!(characterData.id in characters))
  {
    console.error("Character "+characterData.id+" does not exist.");
    characterData.id = "default";
    characterData.pose = "hidden";
  }
  var character = characters[characterData.id];

  //Отображение имени персонажа
	$("#characterName").html(character.name);

  $("#container").attr("character", characterData.id);
  $("#container").attr("pose", characterData.pose);

  if(characterData.pose != "hidden")
  {
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
    // Проверяем, начинается ли ID персонажа с "pharmacist_"
    if (characterData.id.id.startsWith("pharmacist_")) {
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
        if (clickedChoices[selectedChoice.target] && selectedChoice.target !== "nextscene2") {
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
        if (selectedChoice.target !== "nextscene2") {
          element.addClass("selected-choice disabled");
          element.off("click");
        }

        // Здесь можно добавить код для перехода к следующей сцене или выполнения других действий
      };
    })(choice, choiceElement));

    // Применить ранее выбранный вариант сразу после добавления элемента
    if (clickedChoices[choice.target] && choice.target !== "nextscene2") {
      choiceElement.addClass("selected-choice disabled");
      choiceElement.off("click");
    }
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

  // Применить ранее выбранные варианты
  applyPreviouslySelectedChoices();

  //Custom code that executes after displaying the scene will be called now
  onSceneDisplayed(currentScene);
}

function applyPreviouslySelectedChoices() {
  $(".choice").each(function() {
    var target = $(this).data("target");

    // Проверяем, находится ли элемент внутри #choices
    var isInsideChoices = $(this).closest("#choices").length > 0;

    // Если элемент находится в #choices и имеет data-target="nextscene2"
    if (isInsideChoices && target !== "nextscene2") {
      if (clickedChoices[target]) {
        $(this).addClass("selected-choice disabled");
        $(this).off("click");
      }
    } 
    // Если элемент находится в #choices-character или любой другой, кроме "nextscene2"
    else if (!isInsideChoices && clickedChoices[target]) {
      $(this).addClass("selected-choice disabled");
      $(this).off("click");
    }
  });
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