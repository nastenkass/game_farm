function init_local()
{
	initCharacters();
	parseStory();
	onInit();
}


function init_async()
{
	$.getJSON("data/characters.json", function(jsonCharacters) {
		characters = jsonCharacters;
		initCharacters();

		$.getJSON("data/places.json", function(jsonPlaces) {

			places = jsonPlaces;
			$.getJSON("data/story.json", function(jsonStory) {

				story = jsonStory;
				parseStory();
				onInit();
			});
		});
	});
}



function loadLevelData(level) {
    const script = document.createElement("script");
    script.src = `data/processed-data-level${level}.js`;
    script.onload = function () {
        init_local();
    };
    script.onerror = function () {
        console.error("Не удалось загрузить данные для уровня " + level);
    };
    document.head.appendChild(script);
}

function getLevelFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('level') || 1;
}


window.currentLevel = getLevelFromURL();
loadLevelData(window.currentLevel);

function initCharacters()
{
	for(var c in characters)
	{
		characters[c].approval = 0;
	}
}

function onInit()
{
	displayScene("start");
}

init_local();
//init_async();
