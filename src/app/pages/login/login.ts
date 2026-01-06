import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Profile } from '../../services/profile';
import { ToastService } from '../../services/toastservice';
import { ProductsService } from '../../services/products';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterOutlet, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  toast = inject(ToastService);
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  profileSrv = inject(Profile);
  router = inject(Router);
  cartSrv = inject(ProductsService);

  loginCustomer() {
    const body = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    console.log('📤 Sending login body:', body);

    this.profileSrv.loginCustomer(body).subscribe((res) => {
      console.log('📥 API Response:', res);

      if (res.result) {
        // 🔑 Store ONLY the raw JWT token
        localStorage.setItem('token', res.data!.token.token);

        // Optionally store user info separately
        localStorage.setItem('user', JSON.stringify(res.data!.user));

        this.cartSrv.getAllCartItems().subscribe(cart => {
          this.cartSrv.cartItems.set(cart.data!);
          this.router.navigateByUrl('/productsComponent');
        });
      } else {
        this.toast.error(res.message);
      }
    });
  }
}
