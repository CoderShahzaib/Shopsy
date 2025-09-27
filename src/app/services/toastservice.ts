
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {} 

  show(
    message: string,
    action: string = 'Close',
    duration = 3000,
    panelClass?: string | string[],
    config?: Partial<MatSnackBarConfig>
  ) {
    const cfg: MatSnackBarConfig = {
      duration,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass,
      ...config,
    };
    this.snackBar.open(message, action, cfg); 
  }

  success(message: string, duration = 3000) {
    this.show(message, 'OK', duration, ['snack-success']);
  }

  error(message: string, duration = 5000) {
    this.show(message, 'Close', duration, ['snack-error']);
  }

  info(message: string, duration = 3000) {
    this.show(message, 'OK', duration, ['snack-info']);
  }
}
