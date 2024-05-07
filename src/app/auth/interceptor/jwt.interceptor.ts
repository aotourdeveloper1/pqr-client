import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private _util: UtilsService
  ) { }

  // Método para interceptar cada solicitud HTTP y agregar un token JWT.
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Se obtiene el token JWT del servicio TokenService.
    // const idToken = this._util.getLocalStorage("token"); 
    // Si el token JWT está presente, se clona la solicitud original y se agrega un encabezado "Authorization" con el token JWT.
    if (true) {
      const cloned = request.clone({
        headers: request.headers.set("Authorization",
          "Bearer " + 'T87k1LPEOwdNg2fnRVrNeUuBbodrY7O6uHMtLCFF')
      });

      // Se llama al siguiente interceptor HTTP en la cadena con la solicitud clonada que contiene el token JWT.
      return next.handle(cloned);
    }

    // Si el token JWT no está presente, se llama al siguiente interceptor HTTP en la cadena con la solicitud original sin modificaciones.
    else {
      return next.handle(request);
    }
  }
}
