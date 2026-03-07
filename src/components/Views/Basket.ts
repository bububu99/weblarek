import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  items: HTMLElement[];
  total: number;       
}

export class Basket extends Component<IBasket> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    
    this.buttonElement.addEventListener('click', () => {
      this.events.emit('order:open'); 
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length > 0) {
      this.listElement.replaceChildren(...items);
      this.buttonElement.disabled = false;
    } else {
      this.listElement.replaceChildren();
      this.buttonElement.disabled = true;
    }
  }

  set total(total: number) {
    this.totalElement.textContent = `${total} синапсов`;
  }
}