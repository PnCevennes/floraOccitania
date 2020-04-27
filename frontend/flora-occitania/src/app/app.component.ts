import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { AuthenticationService, User } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'flora-occitania';
  currentUser: User;

  constructor(
      private router: Router,
      private authenticationService: AuthenticationService
  ) {
      this.authenticationService.currentUser.subscribe(
        x => this.currentUser = x
      );
  }

  logout() {
      this.authenticationService.logout();
      this.router.navigate(['/']);
  }
}