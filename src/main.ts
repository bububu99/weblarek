import './scss/styles.scss';
import { ProductData } from './components/Models/ProductData';
import { CartData } from './components/Models/CartData';
import { BuyerData } from './components/Models/BuyerData';
import { Api } from './components/base/Api';
import { AppApi } from './components/AppApi';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Gallery } from './components/Views/Gallery';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardCatalog } from './components/Views/Card/CardCatalog';
import { IProduct } from './types';
import { CardPreview } from './components/Views/Card/CardPreview';
import { Modal } from './components/Views/Modal';
import { Basket } from './components/Views/Basket';
import { CardBasket } from './components/Views/Card/CardBasket';
import { Header } from './components/Views/Header';
import { OrderForm } from './components/Views/Form/OrderForm';
import { ContactForm } from './components/Views/Form/ContactForm';
import { Success } from './components/Views/Success';
import { IBuyer } from './types';



const events = new EventEmitter();
const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

const productsModel = new ProductData(events);
const cartModel = new CartData(events);
const buyerModel = new BuyerData(events);

const gallery = new Gallery(ensureElement<HTMLElement>('.page'));
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactForm(cloneTemplate(contactsTemplate), events);

events.on('items:changed', () => {
  const products = productsModel.products;
  const cardsArray = products.map(item => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
    });
              
    return card.render({
      category: item.category,
      title: item.title,
      image: item.image,
      price: item.price
    });
  });
    
  gallery.render({ catalog: cardsArray });
});

events.on('card:select', (item: IProduct) => {
  productsModel.preview = item; 
});

events.on('preview:changed', ({ item }: { item: IProduct }) => {
  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('card:toBasket', item)
  });

  const isPriceNull = item.price === null;
  const inCart = cartModel.inCart(item.id);

  let buttonTitle = 'В корзину';
  if (isPriceNull) {
    buttonTitle = 'Недоступно';
  } else if (inCart) {
    buttonTitle = 'Уже в корзине';
  }
    
  modal.render({
    content: card.render({
    title: item.title,
    image: item.image,
    category: item.category,
    description: item.description,
    price: item.price,
    buttonTitle: buttonTitle,
    buttonDisabled: isPriceNull || inCart
    })
  });
});

events.on('card:toBasket', (item: IProduct) => {
  cartModel.add(item);
  modal.close();
});

events.on('cart:changed', () => {
  header.counter = cartModel.count;
});

events.on('basket:open', () => {
  const basket = new Basket(cloneTemplate(basketTemplate), events);
        
  const renderBasketItems = () => {
    const items = cartModel.items.map((item, index) => {
      const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
          onClick: () => cartModel.remove(item) 
      });
      return card.render({
        title: item.title,
        price: item.price,
        index: index + 1
      });
    });

    basket.render({
      items,
      total: cartModel.total
    });

  };

  events.on('cart:changed', renderBasketItems);

  const cleanup = () => {
    events.off('cart:changed', renderBasketItems);
    events.off('modal:close', cleanup);
  };
    
  events.on('modal:close', cleanup)
    
  modal.render({
    content: basket.render()
  });
  renderBasketItems();
});


events.on('order:open', () => {
  const buyer = buyerModel.buyer;
  modal.render({
    content: orderForm.render({
      address: buyer.address || '',
      payment: buyer.payment || '',
      valid: false,
      errors: ''
      })
  });
  buyerModel.validate();
});

events.on(/^order\..*:change|^contacts\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
  buyerModel.setBuyer({ [data.field]: data.value });
  buyerModel.validate(); 
});

events.on('formErrors:change', (errors: Partial<IBuyer>) => {
  const { address, payment, email, phone } = errors;
        
  orderForm.valid = !address && !payment;
  orderForm.errors = Object.values({ address, payment }).filter(i => !!i).join('; ');

  contactsForm.valid = !email && !phone;
  contactsForm.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});

events.on('order:submit', () => {
  const buyer = buyerModel.buyer;
  modal.render({
    content: contactsForm.render({
      email: buyer.email || '',
      phone: buyer.phone || '',
      valid: false,
      errors: ''
    })
  });
  buyerModel.validate();
});

events.on('contacts:submit', () => {
  appApi.postOrder({
    ...buyerModel.buyer,
    total: cartModel.total,
    items: cartModel.items.map(item => item.id)
  })
  .then((result) => {
    const success = new Success(cloneTemplate(successTemplate), events);
        
    modal.render({
      content: success.render({
      total: result.total
      })
    });

    cartModel.clear();
    buyerModel.clear();
    orderForm.clear();
    contactsForm.clear();
  })
  .catch(err => {
    console.error('Ошибка оформления заказа:', err);
  });
});

events.on('success:close', () => {
  modal.close();
});

appApi.getProducts()
  .then((products) => {
    productsModel.products = products;
    console.log('Данные полученные с сервера:', productsModel.products);
    console.log('Количество товаров:', productsModel.products.length);
  })
 .catch((err) => {
    console.error('Ошибка запроса:', err); 
  });





