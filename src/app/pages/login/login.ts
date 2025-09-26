
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Profile } from '../../services/profile';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterOutlet, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm : FormGroup = new FormGroup({
    UserName: new FormControl("", [Validators.required, Validators.minLength(3)]),
    UserPassword: new FormControl("", [Validators.required, Validators.minLength(8)])
  });
  profileSrv = inject(Profile);
  router = inject(Router);
  loginCustomer() {
  const body = {
    UserName: this.loginForm.value.UserName,
    UserPassword: this.loginForm.value.UserPassword
  };

  console.log("📤 Sending login body:", body);

  this.profileSrv.loginCustomer(body).subscribe((res) => {
    console.log("📥 API Response:", res);
    if (res.result) {
      localStorage.setItem("user", JSON.stringify(res.data));
      this.router.navigateByUrl("/productsComponent");
    } else {
      alert(res.message);
    }
  });
}


}
