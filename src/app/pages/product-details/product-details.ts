import { Component, inject, OnInit } from '@angular/core';
import { ProductModel } from '../../models/product';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products';
import { ToastService } from '../../services/toastservice';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  productId!: number;
  product!: ProductModel;
  route = inject(ActivatedRoute);
  productSrv = inject(ProductsService);
  toast = inject(ToastService);

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    this.productSrv.getProductById(this.productId).subscribe((res) => {
      this.product = res.data;
    });
  }
  
  checkUserLogin(): boolean {
    return localStorage.getItem('user') !== null;
  }

  addCart(Id: number, quantity: number) {
    

    this.productSrv.addToCart(Id, quantity = 1).subscribe((res) => {
      console.log('Item added to cart:', res);
      this.toast.success('Item added to cart');
      
    });
  }
}
