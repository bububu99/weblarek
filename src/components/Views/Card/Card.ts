import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export interface ICardActions {
  onClick: (events: MouseEvent) => void;
}

export interface ICard {
    title: string;
    price: number | null;
}

export class Card<T> extends Component<ICard & T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    
    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
      }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value 
            ? `${value} синапсов` 
            : 'Бесценно';
    }
}