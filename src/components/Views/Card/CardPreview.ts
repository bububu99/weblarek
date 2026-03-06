import { categoryMap, CDN_URL } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Card, ICardActions } from "./Card";
import { TCardCatalog } from "./CardCatalog";

type CategoryKey = keyof typeof categoryMap;
export type TCardPreview = TCardCatalog & { description: string; buttonTitle?: string; buttonDisabled?: boolean; };

export class CardPreview extends Card<TCardPreview> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container); 

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onClick) {
      this.buttonElement.addEventListener('click', actions.onClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(categoryMap[key as CategoryKey], key === value);
    }
  }

  set image(image: string) {
      this.setImage(
        this.imageElement, 
        `${CDN_URL}${image.replace('svg', 'png')}`,
        this.titleElement.textContent || '');
    }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonTitle(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    if (this.buttonElement) {
        this.buttonElement.disabled = value;
    }
  }
}