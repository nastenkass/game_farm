# Создает файлы processed-data-level1.js, processed-data-level2.js и т.д.
for level in 1 2 3; do
    echo "var characters = $(cat ./data/characters.json);" > ./data/processed-data-level${level}.js
    echo "var places = $(cat ./data/places.json);" >> ./data/processed-data-level${level}.js
    echo "var story = $(cat ./data/story-level${level}.json);" >> ./data/processed-data-level${level}.js
done