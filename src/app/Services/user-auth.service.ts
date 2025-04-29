import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private apiUrl = 'https://dummyjson.com/auth/login';
  private isLoggedSubject: BehaviorSubject<boolean>;
  constructor(private http: HttpClient) {
   // this.isLoggedSubject = new BehaviorSubject<boolean>(this.isUserLogged);
   }
  login(username: string, password: string): Observable<any> {
    const body = {
      username: username,
      password: password
    };
    return this.http.post(this.apiUrl, body);
  }
}
