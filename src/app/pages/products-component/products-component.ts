import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CategoryModel, ProductModel } from '../../models/product';
import { ProductsService } from '../../services/products';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-component',
  imports: [],
  templateUrl: './products-component.html',
  styleUrl: './products-component.css',
})
export class ProductsComponent implements OnInit {
  productsList = signal<ProductModel[]>([]);
  categoryList = signal<CategoryModel[]>([]);
  router = inject(Router);
  productSrv = inject(ProductsService);
  selectedCategoryId = signal<number | null>(null);

  @ViewChild('categoryContainer') categoryContainer!: ElementRef<HTMLDivElement>;
  ngOnInit() {
    this.getProducts();
    this.getCategory();
  }
  setCategory(categoryId: number | null) {
    this.selectedCategoryId.set(categoryId);
  }

  getFilteredProducts() {
    if (this.selectedCategoryId() == null) {
      return this.productsList();
    }
    return this.productsList().filter((p) => p.categoryId === this.selectedCategoryId());
  }
  scrollCategories(direction: 'left' | 'right') {
    const container = this.categoryContainer.nativeElement;
    const scrollAmount = 200;

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
  getProducts() {
    this.productSrv.getAllProducts().subscribe((res) => {
      this.productsList.set(res.data);
      console.log(res.data);
    });
  }
  getCategory() {
    this.productSrv.getAllCategory().subscribe((res) => {
      this.categoryList.set(res.data);
      console.log(res.data);
    });
  }
  

  goToProductDetails(id: number) {
    this.router.navigateByUrl(`/productDetails/${id}`);
  }
}
