//So uh these need to be initialized somewhere and I thought "Why not here?"
//Why not here, indeed.
var scenes = {};
var characters = {};
var places = {};
var variables = {};

//Clears the scene, removing every choice and character elemnt that was added in the previous scene
function clearScene()
{
	$(".choice").remove();
  $(".character").remove();
}

function displayCharacter(characterData)
{
  //characterData only contains a character id and a pose
  //The actual images and names are in the characters dictionary
  //If the given key does not exist, throw an error and revert to the default character instead.
  if(!(characterData.id in characters))
  {
    console.error("Character "+characterData.id+" does not exist.");
    characterData.id = "default";
    characterData.pose = "hidden";
  }
  var character = characters[characterData.id];

  //Display the name of the character
	$("#characterName").html(character.name);

  //Set the character and pose attributes of the container so that custom CSS rules can be applied
  $("#container").attr("character", characterData.id);
  $("#container").attr("pose", characterData.pose);

  //the "hidden" pose simply means the character is hidden and there's nothing to display
  if(characterData.pose != "hidden")
  {
    //Create a character element and set its background before adding it to the scene
    var characterElement = $("<div class='character'></div>");
    characterElement.css({"background-image": "url('"+character.poses[characterData.pose]+"')"});
    $("#sceneContent").append(characterElement);  
  }

  //Custom code that executes after showing a character be called now
  onCharacterDisplayed(character);
}

var clickedChoices = {};

function displayChoices(choices) {
  for (var c in choices) {
    var choice = choices[c];

    // Создаем элемент выбора и добавляем его на страницу
    var choiceElement = $("<div class='choice' data-target=" + choice.target + ">" + choice.text + "</div>");
    $("#choices").append(choiceElement);

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
  //The actual images and names are in the places dictionary
  //If the given key does not exist, throw an error and exit the function.
  if(!(placeId in places))
  {
    console.error("Place "+placeId+" does not exist.");
    return;
  }
  var place = places[placeId];
  
  //Show its name
  $("#placeName").html(place.name);
  //Set the place attribute in the container for custom CSS rules to apply
  $("#container").attr("place", placeId);
  //Display the place's image as the background
  displayBackground(place.image);

  //Custom code that executes after changing places will be called now
  onPlaceDisplayed(place);
}

//This could technically be called from an custom action,
//to change the background without changing places for example?
function displayBackground(url)
{
	$("#sceneContent").css({"background":"url('"+url+"')"});
}

function displayScene(sceneId)
{	
  //Clear the scene
	clearScene();

  //Custom code that executes after clearing the scene will be called now
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
	displayChoices(currentScene.choices);

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