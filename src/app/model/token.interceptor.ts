import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { RestDataSource } from './rest.datasource';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public rest: RestDataSource) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // if (auth && this.rest.auth_token != null) {
    //     request = request.clone({
    //         setHeaders: {
    //           Authorization: `Bearer ${this.rest.auth_token}`
    //         }
    //       });
    // }

    return next.handle(request);
  }
}