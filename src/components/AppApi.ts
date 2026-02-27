import { IApi,IProduct, IOrder, IOrderResult } from "../types";

export class AppApi {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  async getProducts(): Promise<IProduct[]> {
    return this._api.get<{ total: number, items: IProduct[] }>('/product')
      .then((data) => data.items)
  }

  async postOrder(order: IOrder): Promise<IOrderResult> {
    return this._api.post<IOrderResult>('/order', order);
  }
}