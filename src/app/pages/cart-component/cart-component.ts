import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ProductsService } from '../../services/products';
import { CartItemsModel } from '../../models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-component',
  imports: [CommonModule],
  templateUrl: './cart-component.html',
  styleUrls: ['./cart-component.css'],
})
export class CartComponent implements OnInit {
  @Input() isOpen: boolean = false;
  productSrv = inject(ProductsService);
  @Output() close = new EventEmitter<void>();
  router = inject(Router);
  closeCart() {
    this.close.emit();
  }

  ngOnInit() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userObj = JSON.parse(userString);
      this.productSrv.loadCart(userObj.custId);
    }
  }
  goToCheckout() {
    this.router.navigateByUrl('/checkout');
  }
  get userCartItems(): CartItemsModel[] {
    return this.productSrv.cartItems();
  }

  getTotal(): number {
    return this.userCartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
  }
  deleteCartItem(cartId: number) {
    const userString = localStorage.getItem('user');
    if (!userString) {
      console.warn('No user logged in');
      return;
    }

    const userObj = JSON.parse(userString);

    this.productSrv.deleteCartItem(cartId, userObj.custId);
  }
}
