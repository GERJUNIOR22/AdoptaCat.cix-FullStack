import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1), // Reintentar una vez en caso de error
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error del cliente: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 0:
              errorMessage = 'Backend no disponible. Verificar conexión.';
              break;
            case 400:
              errorMessage = 'Solicitud incorrecta. Verificar datos enviados.';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado.';
              break;
            case 500:
              errorMessage = 'Error interno del servidor.';
              break;
            default:
              errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
          }
        }

        console.error('Error HTTP:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}