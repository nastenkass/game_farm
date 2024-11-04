REM Создает файлы processed-data-level1.js, processed-data-level2.js и т.д.
FOR %%L IN (1 2 3) DO (
    break > .\data\processed-data-level%%L.js
    echo var characters = >> .\data\processed-data-level%%L.js
    type .\data\characters.json >> .\data\processed-data-level%%L.js
    echo ; >> .\data\processed-data-level%%L.js
    echo var places = >> .\data\processed-data-level%%L.js
    type .\data\places.json >> .\data\processed-data-level%%L.js
    echo ; >> .\data\processed-data-level%%L.js
    echo var story = >> .\data\processed-data-level%%L.js
    type .\data\story-level%%L.json >> .\data\processed-data-level%%L.js
    echo ; >> .\data\processed-data-level%%L.js
)