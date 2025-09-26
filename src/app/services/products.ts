import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { API_ENDPOINT } from '../constants/api-endpoint';
import { Observable, tap, of } from 'rxjs';
import { APIResponse, CartItemsModel, CartModel } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private url = environment.apiUrl;
  private http = inject(HttpClient);

  cartItems = signal<CartItemsModel[]>([]);
  private cache = new Map<string, any>();

  private getFromCache(key: string): any | null {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const cached = localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);

      if (parsed.expiry && Date.now() > parsed.expiry) {
        localStorage.removeItem(key); 
        return null;
      }

      this.cache.set(key, parsed.data);
      return parsed.data;
    }

    return null;
  }

  private setCache(key: string, data: any, ttlMinutes = 10): void {
    this.cache.set(key, data);

    const expiry = Date.now() + ttlMinutes * 60 * 1000;
    localStorage.setItem(key, JSON.stringify({ data, expiry }));
  }

  getAllProducts(): Observable<APIResponse> {
    const key = 'all_products';
    const cached = this.getFromCache(key);

    if (cached) {
      return of(cached); 
    }

    return this.http
      .get<APIResponse>(this.url + '/products')
      .pipe(tap((res) => this.setCache(key, res)));
  }
  getAllCategory(): Observable<APIResponse> {
    const key = 'all_category';
    const cached = this.getFromCache(key);

    if (cached) {
      return of(cached);
    }

    return this.http
      .get<APIResponse>(this.url + API_ENDPOINT.ALL_CATEOGRY)
      .pipe(tap((res) => this.setCache(key, res)));
  }

  getProductById(id: number): Observable<APIResponse> {
    const key = `product_${id}`;
    const cached = this.getFromCache(key);

    if (cached) {
      return of(cached);
    }

    return this.http
      .get<APIResponse>(`${this.url}${API_ENDPOINT.GET_PRODUCT_BY_ID}?id=${id}`)
      .pipe(tap((res) => this.setCache(key, res)));
  }

  getProductsByCategoryId(id: number): Observable<APIResponse> {
    const key = `products_category_${id}`;
    const cached = this.getFromCache(key);

    if (cached) {
      return of(cached);
    }

    return this.http
      .get<APIResponse>(`${this.url}${API_ENDPOINT.Get_PRODUCTS_BY_CATEGORY}?id=${id}`)
      .pipe(tap((res) => this.setCache(key, res)));
  }

  addToCart(data: CartModel): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.url + API_ENDPOINT.ADD_TO_CART, data).pipe(
      tap(() => {
        if (data.CustId) {
          this.loadCart(data.CustId);
        }
      })
    );
  }

  getAllCartItems(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.url + API_ENDPOINT.GET_ALL_CART_ITEMS);
  }

  loadCart(userId: number) {
    this.getAllCartItems().subscribe((res: any) => {
      const filtered = res.data.filter((item: CartItemsModel) => item.custId === userId);
      this.cartItems.set(filtered);
      console.log('Cart updated:', filtered);
    });
  }

  deleteProductFromCartById(cartId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.url}${API_ENDPOINT.DELETE_PRODUCT_FROM_CART}?id=${cartId}`
    );
  }

  deleteCartItem(cartId: number, userId: number) {
    this.deleteProductFromCartById(cartId).subscribe({
      next: (res) => {
        console.log('API Response:', res);

        if (res.result) {
          this.cartItems.update((items) => items.filter((item) => item.cartId !== cartId));
        } else {
          console.warn('Delete failed:', res.message);
        }

        this.loadCart(userId);
      },
      error: (err) => {
        console.error('Error deleting cart item:', err);
      },
    });
  }
}
