import { Observable } from "rxjs";

/**
* @author  Luis valencia 
* @date 2023-10-11
* @description interfaz para manejar los metodos http, con metodos opcionales
*/
export interface MetodosHttp {

    obtener?<T>(ruta: string): Observable<T>;

    guardar?<T>(ruta: string, body: T): Observable<T>;

    actualizar?<T>(ruta: string, body: T): Observable<T>;

    eliminar?<T>(ruta: string, body: T): Observable<T>;
}
