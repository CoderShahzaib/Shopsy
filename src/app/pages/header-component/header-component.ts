import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartComponent } from '../cart-component/cart-component';

@Component({
  selector: 'app-header-component',
  imports: [RouterLink, RouterOutlet, RouterLinkActive, CommonModule, CartComponent],
  standalone: true,
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {
  cartOpen = false;
  isMenuOpen = false;
  router = inject(Router);

  toggleCart() {
    this.cartOpen = !this.cartOpen;
  }

  closeCart() {
    this.cartOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }

  logOut() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }
}
