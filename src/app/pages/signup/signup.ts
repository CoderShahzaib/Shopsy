import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Profile } from '../../services/profile';
import { ToastService } from '../../services/toastservice';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  toast = inject(ToastService);
  registerForm: FormGroup = new FormGroup({
    personName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
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
