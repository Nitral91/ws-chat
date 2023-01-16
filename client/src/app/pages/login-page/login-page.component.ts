import type { OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import type { AuthService } from '../../shared/services/auth/auth.service';
import type { MatSnackBar } from '@angular/material/snack-bar';
import type { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup;

  private readonly destroy$ = new Subject();

  constructor(
    private auth: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup<any>({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
    });

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        if (params['registered']) {
          // you can enter
        } else if (params['accessDenied']) {
          this._snackBar.open('Authorisation is needed to proceed', 'Close');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onSubmit(): void {
    this.form.disable();

    this.auth
      .login(this.form.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this._snackBar.open('Logged In', 'Close');
          this.router.navigate(['/lobby']);
        },
        error => {
          this._snackBar.open(error.error.message, 'Close');
          this.form.enable();
        }
      );
  }
}
