import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/product';
import { PaymentIntentModel } from '../models/paymentIntentModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Checkout {
  private http = inject(HttpClient);
  private readonly url = environment.apiUrl;

  createPaymentIntent() {
    return this.http.post<any>(`${this.url}/Orders/create-payment-intent`, {});
  }

  placeOrder(data: any) {
    return this.http.post<any>(`${this.url}/Orders/placeorder`, data);
  }
}
