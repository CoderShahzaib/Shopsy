import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Profile } from '../../services/profile';
import { ToastService } from '../../services/toastservice';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, RouterOutlet, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  toast = inject(ToastService);
  registerForm: FormGroup = new FormGroup({
    Name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    MobileNo: new FormControl('', [Validators.required, Validators.minLength(10)]),
    Password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  profileSrv = inject(Profile);
  registerCustomer() {
    this.profileSrv.registerUser(this.registerForm.value).subscribe((res) => {
      if (res.result) {
        this.toast.success("User Registered Successfully");
      } else {
        this.toast.error(res.message);
      }
    });
  }
}
