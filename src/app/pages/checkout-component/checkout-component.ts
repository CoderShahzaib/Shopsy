import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { ProductsService } from '../../services/products';
import { Checkout } from '../../services/checkout';
import { CartItemModel } from '../../models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-component.html',
  styleUrls: ['./checkout-component.css']
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  checkoutForm!: FormGroup;
  productSrv = inject(ProductsService);
  checkoutService = inject(Checkout);
  router = inject(Router);
  stripe: Stripe | null = null;
  card: StripeCardElement | null = null;
  clientSecret: string = '';

  loading: boolean = false;
  cardError: string = '';

  ngOnInit() {
    this.checkoutForm = new FormGroup({
      personName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      deliveryAddress: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      paymentMethod: new FormControl('card', [Validators.required])
    });
  }

  async ngAfterViewInit() {
    this.stripe = await loadStripe('pk_test_51Se9SL4AlCeaxIwY7H4BN840pMHnCbkyDVpDR4eMSj1LsZTcFTWbbWVOohqXta8oDgYNWdx4V90TbazW893Yew3Q00NMRef0FN'); 
    if (!this.stripe) return;

    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');

    this.card.on('change', (event) => {
      this.cardError = event.error ? event.error.message : '';
    });
  }

  get userCartItems(): CartItemModel[] {
    return this.productSrv.cartItems();
  }

  getTotal(): number {
    return this.userCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + 200; // Add shipping
  }

  async onSubmit() {
    if (this.checkoutForm.invalid) return alert('Please fill all required fields');

    const formValue = this.checkoutForm.value;

    if (formValue.paymentMethod === 'card') {
      this.loading = true;

      // 1. Create Payment Intent
      const paymentResponse = await this.checkoutService.createPaymentIntent().toPromise();
      if (!paymentResponse.result || !paymentResponse.data) {
        this.loading = false;
        return alert('Failed to create payment intent');
      }
      this.clientSecret = paymentResponse.data.clientSecret;

      if (!this.stripe || !this.card) {
        this.loading = false;
        return alert('Stripe not loaded');
      }

      // 2. Confirm card payment
      const { paymentIntent, error } = await this.stripe.confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: {
            name: formValue.personName,
            email: formValue.email
          }
        }
      });

      if (error) {
        this.loading = false;
        return alert(error.message);
      }

      if (!paymentIntent?.id) {
        this.loading = false;
        return alert('PaymentIntent ID not returned');
      }

      if (paymentIntent.status === 'succeeded') {
        await this.placeOrder(formValue, paymentIntent.id);
        this.productSrv.getAllCartItems().subscribe(cart => {
          this.productSrv.cartItems.set(cart.data!);
          this.router.navigateByUrl('/productsComponent');
        });
      } else {
        this.loading = false;
        alert('Payment failed: ' + paymentIntent.status);
      }

    } else {
      // Cash on Delivery
      await this.placeOrder(formValue, null);
      this.productSrv.getAllCartItems().subscribe(cart => {
          this.productSrv.cartItems.set(cart.data!);
          this.router.navigateByUrl('/productsComponent');
        });
    }
  }

  private async placeOrder(formValue: any, paymentIntentId: string | null) {
    const placeOrderDto = {
      personName: formValue.personName,
      deliveryAddress: formValue.deliveryAddress,
      city: formValue.city,
      email: formValue.email,
      paymentMethod: formValue.paymentMethod,
      paymentIntentId: paymentIntentId
    };

    const orderResponse = await this.checkoutService.placeOrder(placeOrderDto).toPromise();
    this.loading = false;

    if (orderResponse.result) {
      alert('Order placed successfully! Order ID: ' + orderResponse.data);
      this.checkoutForm.reset({ paymentMethod: 'card' });
    } else {
      alert('Order failed: ' + orderResponse.message);
    }
  }
}
