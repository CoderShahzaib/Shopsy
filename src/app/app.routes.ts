import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products-component/products-component';
import { HeaderComponent } from './pages/header-component/header-component';
import { ProductDetails } from './pages/product-details/product-details';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { CartComponent } from './pages/cart-component/cart-component';
import { CheckoutComponent } from './pages/checkout-component/checkout-component';

export const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: '',
        redirectTo: 'productsComponent',
        pathMatch: 'full'
      },
      {
        path: 'productsComponent',
        component: ProductsComponent
      },
      {
        path: 'productDetails/:id',
        component: ProductDetails
      },
      {
        path: "login",
        component: Login
      },
      {
        path: "signup",
        component: Signup
      },
      {
        path: "cart",
        component: CartComponent
      },
      {
        path: "checkout",
        component: CheckoutComponent
      }
    ],
  },
  
];

