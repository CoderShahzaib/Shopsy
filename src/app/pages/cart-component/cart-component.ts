import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ProductsService } from '../../services/products';
import { CartItemModel } from '../../models/product';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toastservice';

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
  toast = inject(ToastService);
  closeCart() {
    this.close.emit();
  }

  ngOnInit() {
    
  }
  goToCheckout() {
    this.router.navigateByUrl('/checkout');
  }
  get userCartItems(): CartItemModel[] {
    return this.productSrv.cartItems();
  }

  getTotal(): number {
    return this.userCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }
  deleteCartItem(cartId: number) {

    this.productSrv.deleteCartItem(cartId).subscribe({
      next: () => this.toast.success('Item removed from cart'),
      error: () => this.toast.error('Failed to remove item'),
    });
  }
}
