import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login-success',
  standalone: true,
  template: '<p>Login successful, redirecting...</p>'
})
export class LoginSuccessComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const name = params['name'];
      const email = params['email'];
      if (name && email) {
        this.authService.login({ name, email });
        this.router.navigate(['/']);
      } else {
        // Handle error
        this.router.navigate(['/']);
      }
    });
  }
}