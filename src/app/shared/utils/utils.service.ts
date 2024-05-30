import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class UtilsService {
  // Contructor
  constructor() {}

  /**
   * @author  Luis valencia
   * @date 2023-10-11
   * @description  El método getLocalStorage(key: string) devuelve el valor de la key que esta en el localStorage
   */
  getLocalStorage(key: string): string | null {
    return localStorage.getItem(key) || null;
  }

  /**
   * @author  Luis valencia
   * @date 2023-10-11
   * @description  El método setLocalStorage(key: string, elemento: any) guarda en el localStorage la key y el valor.
   */
  setLocalStorage(key: string, elemento: any): void {
    localStorage.setItem(key, elemento);
  }

  /**
   * @author  Luis valencia
   * @date 2023-10-11
   * @description  El método clearToken(buscar: string) borra del localStorege la key que se pase.
   */
  clearToken(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * @author  Luis valencia
   * @date 2023-10-11
   * @description  El método decodeToken(key: string) decodifica con la key
   */
  decodeToken<T>(key: string): T | null {
    const elemento = this.getLocalStorage(key);
    return jwtDecode(elemento!) || null;
  }

  /**
   * Formatea el tamaño de bytes a una cadena legible por humanos con sufijos de unidades (Bytes, KB, MB, GB, etc.).
   * @param bytes El tamaño en bytes a formatear.
   * @param decimals El número de decimales a mostrar (opcional, por defecto es 2).
   * @returns La cadena formateada con el tamaño legible por humanos.
   */
  formatBytes(bytes: number, decimals = 2): string {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  /**
   * Formatea una fecha en formato 'YYYY-MM-DD'.
   * @param date La fecha a formatear.
   * @returns La fecha formateada en formato 'YYYY-MM-DD'.
   */
  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
