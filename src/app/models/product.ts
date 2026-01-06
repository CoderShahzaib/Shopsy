export interface ProductModel {
  id: number;       
  name: string;         
  price: number;         
  description: string;
  quantity: number;
  categoryId: number;
  productImageUrl: string;
  category?: any | null;
}

export interface APIResponse<T> {
  message: string;
  result: boolean;
  data: T;
}
export interface ProductsResponseData {
  totalProducts: number;
  products: ProductModel[];
}


export interface CartProductModel {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: number;
  productImageUrl: string;
}



export interface CartItemModel {
  id: number;
  userId: string;
  productId: number;
  quantity: number;
  product: CartProductModel;
}