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

const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if(productsModel.preview) {
        events.emit('card:toBasket', productsModel.preview);
      }
    }
});
const basket = new Basket(cloneTemplate(basketTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactForm(cloneTemplate(contactsTemplate), events);

events.on('items:changed', () => {
  gallery.catalog = productsModel.products.map(item => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
    });
              
    return card.render(item);
  });
});

events.on('card:select', (item: IProduct) => {
  productsModel.preview = item; 
});

events.on('preview:changed', () => {
  const item = productsModel.preview;
  if (!item) return;
  
  const isPriceNull = item.price === null;
  const inCart = cartModel.inCart(item.id);

  let buttonTitle = 'В корзину';
  if (isPriceNull) {
    buttonTitle = 'Недоступно';
  } else if (inCart) {
    buttonTitle = 'Удалить из корзины';
  }
    
  modal.render({
    content: card.render({
    title: item.title,
    image: item.image,
    category: item.category,
    description: item.description,
    price: item.price,
    buttonTitle: buttonTitle,
    buttonDisabled: isPriceNull 
    })
  });
});

events.on('card:toBasket', (item: IProduct) => {
  if (cartModel.inCart(item.id)) {
    cartModel.remove(item);
  } else {
  cartModel.add(item);
  }

  modal.close();
});

events.on('cart:changed', () => {
  header.counter = cartModel.count;

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
});

events.on('basket:open', () => {
  modal.render({
    content: basket.render()
  })

});

events.on('buyer:changed', () => {
  const buyer = buyerModel.buyer;
  const errors = buyerModel.validate();
  const { address, payment, email, phone } = errors;
  
  orderForm.render({
    address: buyer.address || '',
    payment: buyer.payment || '',
    valid: !address && !payment,
    errors: [address, payment].filter(Boolean).join('; ')
  });

  contactsForm.render({
    email: buyer.email || '',
    phone: buyer.phone || '',
    valid: !email && !phone,
    errors: [email, phone].filter(Boolean).join('; ')
  });
  
})

events.on(/^order\..*:change|^contacts\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
  buyerModel.setBuyer({ [data.field]: data.value });
});

events.on('order:open', () => {
  const buyer = buyerModel.buyer;
  const errors = buyerModel.validate();
  modal.render({
    content: orderForm.render({
      address: buyer.address || '',
      payment: buyer.payment || '',
      valid: !errors.address && !errors.payment,
      errors: [errors.address, errors.payment].filter(Boolean).join('; ')
    })
  });
});

events.on('order:submit', () => {
  const buyer = buyerModel.buyer;
  const errors = buyerModel.validate()
  modal.render({
    content: contactsForm.render({
      email: buyer.email || '',
      phone: buyer.phone || '',
      valid: !errors.email && !errors.phone,
      errors: [errors.email, errors.phone].filter(Boolean).join('; ')
    })
  });
});

events.on('contacts:submit', () => {
  appApi.postOrder({
    ...buyerModel.buyer,
    total: cartModel.total,
    items: cartModel.items.map(item => item.id)
  })
  .then((result) => {
    modal.render({
      content: success.render({
        total: result.total
      })
    });

    cartModel.clear();
    buyerModel.clear();
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
  })
 .catch((err) => {
    console.error('Ошибка запроса:', err); 
  });





