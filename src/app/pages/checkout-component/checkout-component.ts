import { Component, inject } from '@angular/core';
import { CartComponent } from "../cart-component/cart-component";
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products';
import { CartItemsModel } from '../../models/product';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout-component',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './checkout-component.html',
  styleUrl: './checkout-component.css'
})
export class CheckoutComponent {
  productSrv = inject(ProductsService);
  checkoutForm!: FormGroup;
  ngOnInit() {
     this.checkoutForm = new FormGroup({
      fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      shippingAddress: new FormControl('', [Validators.required]),
      paymentMethod: new FormControl('', [Validators.required]),
  });
  }
  get userCartItems(): CartItemsModel[] {
    return this.productSrv.cartItems();
  }
  onSubmit() {}
  getTotal(): number {
    return this.userCartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
  }
}
