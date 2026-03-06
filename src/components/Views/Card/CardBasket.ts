import { ensureElement } from "../../../utils/utils";
import { Card, ICardActions } from "./Card";

export type TCardBasket = { index: number };

export class CardBasket extends Card<TCardBasket> {
  protected indexElement: HTMLElement;
  protected buttonDeleteElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.buttonDeleteElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (actions?.onClick) {
      this.buttonDeleteElement.addEventListener('click', actions.onClick);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}