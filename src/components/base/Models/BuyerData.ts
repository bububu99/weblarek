import { IBuyer, TPayment } from "../../../types";

export type FormErrors = {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string
}

export class BuyerData {
  private _buyer: IBuyer = {
    payment: null,
    email: '',
    phone: '',
    address: ''
  };

  private _errors: FormErrors = {};

  setBuyer(data: {
    payment?: TPayment;
    email?: string;
    phone?: string;
    address?: string
  }): void {
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

  get formErrors(): FormErrors {
    return this._errors;
  }

  validate(): FormErrors {
    const errors: FormErrors = {};

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
    this._errors = errors;
    return errors;
  }
}