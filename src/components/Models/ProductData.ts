import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductData {
  private _products: IProduct[] = [];
  private _preview: IProduct | null = null;

  constructor(protected events: IEvents) {}

  set products(items: IProduct[]){
    this._products = items;
    this.events.emit('items:changed', {items: this._products});
  }

  get products(): IProduct[] {
    return this._products;
  }

  set preview(item: IProduct | null) {
    this._preview = item;
    if (item !== null) {
      this.events.emit('preview:changed', {item: this._preview});
    }
  }

  get preview(): IProduct | null{
    return this._preview;
  }

  getItemById(id: string): IProduct | undefined {
    return this._products.find(item =>
      item.id === id
    );
  }
}