import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import {
  ProductModel,
  ProductsResponseData,
  CartItemModel,
  APIResponse
} from '../models/product';
import { CategoryModel } from '../models/category';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductsService {

  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  cartItems = signal<CartItemModel[]>([]);
  private cache = new Map<string, any>();


  private getCache<T>(key: string): T | null {
    const memory = this.cache.get(key);
    if (memory) return memory;

    const local = localStorage.getItem(key);
    if (!local) return null;

    const parsed = JSON.parse(local);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    this.cache.set(key, parsed.data);
    return parsed.data;
  }

  private setCache(key: string, data: any, ttlMin = 10): void {
    const expiry = Date.now() + ttlMin * 60_000;
    this.cache.set(key, data);
    localStorage.setItem(key, JSON.stringify({ data, expiry }));
  }


  getAllProducts(): Observable<APIResponse<ProductsResponseData>> {
    const key = 'products_all';
    const cached = this.getCache<APIResponse<ProductsResponseData>>(key);
    if (cached) return of(cached);

    return this.http
      .get<APIResponse<ProductsResponseData>>(`${this.baseUrl}/Product`)
      .pipe(tap(res => this.setCache(key, res)));
  }

  getProductById(id: number): Observable<APIResponse<ProductModel>> {
    const key = `product_${id}`;
    const cached = this.getCache<APIResponse<ProductModel>>(key);
    if (cached) return of(cached);

    return this.http
      .get<APIResponse<ProductModel>>(`${this.baseUrl}/Product/${id}`)
      .pipe(tap(res => this.setCache(key, res)));
  }

  getProductsByCategoryId(
    categoryId: number
  ): Observable<APIResponse<ProductsResponseData>> {
    const key = `products_category_${categoryId}`;
    const cached = this.getCache<APIResponse<ProductsResponseData>>(key);
    if (cached) return of(cached);

    return this.http
      .get<APIResponse<ProductsResponseData>>(
        `${this.baseUrl}/Category/${categoryId}`
      )
      .pipe(tap(res => this.setCache(key, res)));
  }


  getAllCategory(): Observable<APIResponse<CategoryModel[]>> {
    const key = 'categories_all';
    const cached = this.getCache<APIResponse<CategoryModel[]>>(key);
    if (cached) return of(cached);

    return this.http
      .get<APIResponse<CategoryModel[]>>(`${this.baseUrl}/Category`)
      .pipe(tap(res => this.setCache(key, res)));
  }


  addToCart(productId: number, quantity: number): Observable<APIResponse<any>> {
    return this.http
      .post<APIResponse<any>>(`${this.baseUrl}/Cart/addtocart`, {
        productId,
        quantity
      })
      .pipe(tap(() => this.refreshCart()));
  }

  getAllCartItems(): Observable<APIResponse<CartItemModel[]>> {
    return this.http.get<APIResponse<CartItemModel[]>>(
      `${this.baseUrl}/Cart`
    );
  }

  refreshCart(): void {
    this.getAllCartItems().subscribe(res => {
      this.cartItems.set(res.data ?? []);
    });
  }

  deleteCartItem(cartId: number): Observable<APIResponse<any>> {
    return this.http
      .delete<APIResponse<any>>(`${this.baseUrl}/Cart/${cartId}`)
      .pipe(tap(() => this.refreshCart()));
  }
}
