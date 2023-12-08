// function getRandomInt(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// // Функция для отображения попапа с продуктами на стеллаже
// function showPopup() {
//     // Создаем элементы DOM для стеллажа и продуктов
//     const shelf = document.createElement('div');
//     shelf.id = 'shelf';

//     // Добавляем стеллаж на страницу
//     document.body.appendChild(shelf);

//     // Массив путей к изображениям продуктов
//     const productImages = ['medicines/аквамарис.png', 'medicines/амиксин.png', 'medicines/виферон.png', 'medicines/кеторол_экспресс.png'];

//     // Количество полок (высот) на стеллаже
//     const numberOfShelves = 4;

//     // Счетчик для уникальных ID продуктов
//     let productIdCounter = 1;

//     // Добавляем продукты на каждую полку
//     for (let i = 0; i < numberOfShelves; i++) {
//         // Количество продуктов на каждой полке (можно настроить)
//         const numberOfProducts = 3;

//         for (let j = 0; j < numberOfProducts; j++) {
//             // Создаем продукт
//             const product = document.createElement('img');
//             product.className = 'product';

//             // Генерируем уникальный ID для продукта
//             const productId = `product_${productIdCounter++}`;
//             product.id = productId;

//             // Задаем случайные координаты X и Y
//             const x = getRandomInt(0, 350); // 350 - ширина стеллажа минус ширина продукта
//             const y = i * 50; // 50 - высота продукта

//             // Задаем позицию и изображение продукта
//             product.src = productImages[getRandomInt(0, productImages.length - 1)];
//             product.style.left = x + 'px';
//             product.style.top = y + 'px';

//             // Добавляем продукт на стеллаж
//             shelf.appendChild(product);

//             // Добавляем информацию о продукте в словарь (можно использовать объект)
//             const productInfo = {
//                 id: productId,
//                 x: x,
//                 y: y,
//                 image: product.src,
//                 // Другие данные о продукте, если необходимо
//             };
//             // Сохраняем информацию о продукте в словаре (можно использовать объект)
//             // В данном примере просто выводим информацию о продукте в консоль
//             console.log(productInfo);
//         }
//     }
// }