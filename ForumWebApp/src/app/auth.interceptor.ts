import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {/*

    constructor(private auth:AuthService){}

     intercept(request : HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {

              console.log(this.auth.getToken());
               const token = this.auth.getToken();

                     if (token){


                       const copiedReq = request.clone({
                             params : request.params.set('token',token)
                         });
                         return next.handle(copiedReq);

                     } else {
                         return next.handle(request);
                     }


          }

}
*/
constructor(private authService: AuthService) {}
intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const token = this.authService.getToken();

  if (token) {
    // If we have a token, we set it to the header
    request = request.clone({
      setHeaders: {Authorization: `Authorization token ${token}`}
    });
  }

  return next.handle(request).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          // redirect user to the logout page
        }
      }
      return throwError(err);
    })
  )
}
}

