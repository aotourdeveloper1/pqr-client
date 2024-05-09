import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable()
export class HttpImplentacionService {

  // Constructor
  constructor(private _http: HttpService) { }

  /**
  * @author  Luis valencia 
  * @date 2023-10-11
  * @description metodo para manejar los resultados obtenidos
  */
  async obtener<T>(ruta: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this._http.obtener<T>(ruta).subscribe({
        next: (value: T) => {
          resolve(value);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  /**
  * @author  Luis valencia 
  * @date 2023-10-11
  * @description metodo para manejar los resultados a guardar
  */
  guardar<T>(ruta: string, body: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this._http.guardar<T>(ruta, body).subscribe({
        next: (value: T) => {
          resolve(value);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  /**
  * @author  Luis valencia 
  * @date 2023-10-11
  * @description metodo para manejar los resultados a actualizar
  */
  actualizar<T>(ruta: string, body: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this._http.actualizar<T>(ruta, body).subscribe({
        next: (value: T) => {
          resolve(value);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  /**
  * @author  Luis valencia 
  * @date 2023-10-11
  * @description metodo para manejar los resultados a eliminar
  */
  eliminar<T>(ruta: string, body: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this._http.guardar<T>(ruta, body).subscribe({
        next: (value: T) => {
          resolve(value);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
}
