import { ensureAllElements, ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form } from "./Form";

interface IOrderForm {
  address: string;
  payment: string;
}

export class OrderForm extends Form<IOrderForm> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

    
    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.payment = button.name; 
        this.onInputChange('payment', button.name);
      });
    });
  }

  set payment(name: string) {
    this.paymentButtons.forEach(button => {
      button.classList.toggle('button_alt-active', button.name === name);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}