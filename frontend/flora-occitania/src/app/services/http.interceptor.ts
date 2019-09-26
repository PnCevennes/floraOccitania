import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class MyCustomInterceptor implements HttpInterceptor {
  constructor(public inj: Injector, public router: Router) {}

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add a custom header
    const customReq = request.clone({
      withCredentials: true
    });
    // pass on the modified request object
    // and intercept error
    return next.handle(customReq).pipe(
        catchError((err: any) => {
            this.handleError(err);
            return Observable.throw(err);
        })
    )
  }
}
