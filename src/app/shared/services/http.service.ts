import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MetodosHttp } from '../interfaces/metodos-http';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpService implements MetodosHttp {

  // Varible para almacenar la url endpoint
  private API_URL: string;

  // Constructor
  constructor(private httpClient: HttpClient) {
    this.API_URL = '';
  }

  // GETTER Y SETTER
  get apiUrl(): string {
    return this.API_URL;
  }

  set apiUrl(api: string) {
    this.API_URL = api;
  }

  // MANEJO DE PETICIONES
  /**
  * @author  Luis valencia 
  * @date 2023-10-11
  * @description metodo para obtener los resultados
  */
  obtener<T>(ruta: string): Observable<T> {
    return this.httpClient.get<T>(`${this.apiUrl}${ruta}`);
  }

  /**
  * @author  Luis valencia 
  * @date 2023-10-11
  * @description metodo para guardar los resultados
  */
  guardar<T>(ruta: string, body: T): Observable<T> {
    return this.httpClient.post<T>(`${this.apiUrl}${ruta}`, body);
  }

  /**
  * @author  Luis valencia 
  * @date 2023-10-11
  * @description metodo para modificar los resultados
  */
  actualizar<T>(ruta: string, body: T): Observable<T> {
    return this.httpClient.put<T>(`${this.apiUrl}${ruta}`, body);
  }

  /**
  * @author  Luis valencia 
  * @date 2023-10-11
  * @description metodo eliminar los resultados
  */
  eliminar<T>(ruta: string): Observable<T> {
    return this.httpClient.delete<T>(`${this.apiUrl}${ruta}`);
  }

  
  generacionReports(body: any): Observable<Blob> {
    const headers = new HttpHeaders()
      .append('arn', 'A')
      .append('arn', 'hola')
      .append('region', 'A')
      .append('region', 'A')
      .append('typeDataSource', 'CONN')
      .append('region', 'hola');
    return this.httpClient.post<Blob>(`${environment.apiFilesReports}`, body, {
      headers,
      responseType: 'blob' as 'json',
    });
  }
}
