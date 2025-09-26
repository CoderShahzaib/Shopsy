import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginCustomerModel, LoginResponse, RegisterCustomerModel, SignupResponse } from '../models/profile';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Profile {
  http = inject(HttpClient);
  url = environment.apiUrl;

  registerUser(data: RegisterCustomerModel): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(this.url + '/RegisterCustomer', data);
  }


  loginCustomer(body: { UserName: string; UserPassword: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/Login`, body);
  }

}
