export interface ProductModel {
  productId: number
  productSku: string
  productName: string
  productPrice: number
  productShortName: string
  productDescription: string
  createdDate: string
  deliveryTimeSpan: string
  categoryId: number
  productImageUrl: string
  categoryName: string
}
export interface CategoryModel {
  categoryId: number
  categoryName: string
  parentCategoryId: number
}
export interface APIResponse {
    message: string,
    result: boolean,
    data: any
}

export interface CartModel {
  CartId: number
  CustId: number
  ProductId: number
  Quantity: number
  AddedDate: string
}
export interface CartItemsModel {
  cartId: number
  custId: number
  productId: number
  quantity: number
  productShortName: string
  addedDate: string
  productName: string
  categoryName: string
  productImageUrl: string
  productPrice: number
}