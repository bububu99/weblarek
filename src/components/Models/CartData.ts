import { IProduct } from "../../types";

export class CartData {
  private _items: IProduct[] = [];

  get items(): IProduct[] {
    return this._items;
  }

  add(item: IProduct): void {
    this._items.push(item);
  }

  remove(item: IProduct): void {
    this._items = this._items.filter(el =>
      el.id !== item.id
    );
  }

  clear(): void {
    this._items = [];
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