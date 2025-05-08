import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  authToken = '654564654561fadfafg456432dsa54'
  constructor() { }
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const tokinzedReq = req.clone({
      setHeaders: {
        //'Content-Type' 'application/json',
        Authorization: `Bearer ${this.authToken}`
      }
    })
    return next.handle(req);
  }
}
