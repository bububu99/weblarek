import { IBuyer } from "../../types";

export type TFormErrors = Partial<Record<keyof IBuyer, string>>;

export class BuyerData {
  private _buyer: IBuyer = {
    payment: null,
    email: '',
    phone: '',
    address: ''
  };

  setBuyer(data: Partial<IBuyer>): void {
    this._buyer = {...this._buyer, ...data};
  }

  get buyer(): IBuyer {
    return this._buyer;
  }

  clear(): void {
    this._buyer = {
      payment: null,
      email: '',
      phone: '',
      address: ''
    };
  }

  validate(): TFormErrors {
    const errors: TFormErrors = {};

    if (this._buyer.payment === null) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }
    if (!this._buyer.email.trim()) {
      errors.email = 'Необходимо указать email';
    }
    if (!this._buyer.phone.trim()) {
      errors.phone = 'Необходимо указать номер телефона';
    }
    if(!this._buyer.address.trim()) {
      errors.address = 'Необходимо указать адрес доставки';
    }
    return errors;
  }
}