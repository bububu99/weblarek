import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CartData {
  private _items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  protected changed() {
    this.events.emit('cart:changed', {
      items: this._items,
      total: this.total,
      count: this.count
    });
  }

  get items(): IProduct[] {
    return this._items;
  }

  add(item: IProduct): void {
    this._items.push(item);
    this.changed();
  }

  remove(item: IProduct): void {
    this._items = this._items.filter(el =>
      el.id !== item.id
    );
    this.changed();
  }

  clear(): void {
    this._items = [];
    this.changed();
  }

  get total(): number {
    return this._items.reduce((sum, item) => 
    sum + (item.price || 0), 0);
  }

  get count(): number {
    return this._items.length;
  }

  inCart(id: string): boolean {
    return this._items.some(item =>
      item.id === id
    ); 
  }
}