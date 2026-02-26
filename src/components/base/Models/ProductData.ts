import { IProduct } from "../../../types";

export class ProductData {
  private _products: IProduct[] = [];
  private _preview: IProduct | null = null;

  set products(items: IProduct[]){
    this._products = items;
  }

  get products(): IProduct[] {
    return this._products;
  }

  set preview(item: IProduct | null) {
    this._preview = item;
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