import './scss/styles.scss';
import { ProductData } from './components/Models/ProductData';
import { CartData } from './components/Models/CartData';
import { BuyerData } from './components/Models/BuyerData';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { AppApi } from './components/AppApi';
import { API_URL } from './utils/constants';

// Для класса ProductData
const productsModel = new ProductData();

// Проверяем методы set и get
productsModel.products = apiProducts.items; 
console.log('Массив товаров из каталога:', productsModel.products);

// Проверяем правильно ли отобрается первый объект массива по его id
const firstId = apiProducts.items[0].id;
const foundProduct = productsModel.getItemById(firstId);
console.log('Результат поиска первого объекта по его ID:', foundProduct);

// Проверяем set и get для подробного отображения первого объекта в массиве
if (foundProduct) {
productsModel.preview = foundProduct;
console.log('Выбранный товар:', productsModel.preview);
}

// Для класса CartData
const cartModel = new CartData ();
const product1 = apiProducts.items[0];
const product2 = apiProducts.items[1];

// Проверяем добавление товаров в корзину, счетчик и поиск по id
cartModel.add(product1);
cartModel.add(product2);
console.log('Список товаров в корзине:', cartModel.items);
console.log('Количество товаров в корзине', cartModel.count);
console.log('Цена товаров в корзине', cartModel.total);
console.log('Первый товар в корзине?', cartModel.inCart(product1.id));

// Проверяем удаление товара из корзины
cartModel.remove(product1);
console.log('Остался ли первый товар в корзине после удаления?', cartModel.inCart(product1.id));

// Очистка корзины
cartModel.clear();
console.log('Количество товаров в корзине после очистки', cartModel.count);

// Для класса BuyerData
const buyerModel = new BuyerData ();
console.log('Начальные данные покупателя', buyerModel.buyer);

// Проверяем сохранение данных покупателя и полноту их заполнения
buyerModel.setBuyer({
  address: 'ул. Кукушкино, 2',
  email: 'haha@com'
});
console.log('Новые данные покупателя:', buyerModel.buyer);
console.log('Проверка валидации', buyerModel.validate());

//Проверяем корректно ли проходит дозаполнение данных
buyerModel.setBuyer({
  address: 'ул. Кукушкино, 2',
  email: 'nehaha@com',
  phone: '1010011010',
  payment: 'card'
});
console.log('Обновленные данные покупателя:', buyerModel.buyer);
console.log('Проверка валидации при полностью заполненной форме', buyerModel.validate());

// Проверяем очистку данных покупателя
buyerModel.clear();
console.log('Данные покупателя после очистки', buyerModel.buyer)

// Проверяем запрос на сервер для получения данных
const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

appApi.getProducts()
  .then((products) => {
    productsModel.products = products;
    console.log('Данные полученные с сервера:', productsModel.products);
    console.log('Количество товаров:', productsModel.products.length);
  })
 .catch((err) => {
    console.error('Ошибка запроса:', err); 
  });





