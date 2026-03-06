import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface IForm {
  valid: boolean;
  errors: string;
}

export class Form<T> extends Component<IForm & T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  protected form: HTMLFormElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);
    this.form = container;

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.form);

    this.form.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });

    
    this.form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.form.name}:submit`);
    });
  }

  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.form.name}.${String(field)}:change`, {
      field,
      value
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

 
  clear() {
    this.form.reset();
  }
}