import { Component, OnInit } from '@angular/core';
//import { FormsModule } from '@angular/forms';
import { UserAuthService } from 'src/app/Services/user-auth.service';

@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css'],
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  isUserLogged: boolean = false;
  constructor(private authService: UserAuthService) {}

  ngOnInit(): void {
    //this.isUserLogged = this.authService.isUserLogged;
  }
  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful!', response);
        // Handle successful login (e.g., store token, redirect)
      },
      error: (error) => {
        console.error('Login failed!', error);
      }
    });
  }
}
