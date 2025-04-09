import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal-a',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponentA implements OnInit {
  @Input() title: string = '';
  @Input() show: boolean = false;
  @Input() PQR: number = 0;
  @Output() close = new EventEmitter<void>();

  reclamante: any = null;
  respuesta: any = null;
  mensajeNoRespuesta: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.PQR) {
      this.pqrData();
    }
  }

  onClose() {
    this.close.emit();
  }

  async pqrData(): Promise<void> {
    try {
      const data = await this.http.post<any>(
        'https://updeveloment.online/api/registro/consulta/detalle-pqr',
        { pqrId: this.PQR }
      ).toPromise();

      if (data && data.respuesta) {
        this.reclamante = {
          fecha_solicitud: data.fecha_solicitud,
          tipo_solicitud: data.tipo_solicitud,
          cliente: data.cliente,
          nombre: data.nombre,
          correo: data.correo_reclamante,
        };

        this.respuesta = {
          fecha: data.fecha_respuesta,
          texto: data.respuesta,
        };
      } else {
        this.mensajeNoRespuesta = `La PQR N° ${this.PQR} aún no tiene respuesta.`;
      }
    } catch (error) {
      console.error('Error al consultar PQR', error);
      this.mensajeNoRespuesta = `La información de la PQR N° ${this.PQR} no está disponible. Verifica que el número sea correcto o espere a que se registre una respuesta.`;
    }
  }
}
