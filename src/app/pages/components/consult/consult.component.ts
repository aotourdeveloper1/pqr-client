import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpService } from 'src/app/shared/services/http.service';
import { HttpImplentacionService } from 'src/app/shared/services/impl/http-implentacion.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.scss'],
})
export class ConsultComponent implements OnInit {
  urlFile: any;

  pqr: number = 0;
  listPQR: any[] = [];

  viewPassword: boolean = false;

  constructor(
    private _httpService: HttpService,
    private _httpImplService: HttpImplentacionService,
    private sanitazer: DomSanitizer,
    private message: NzMessageService
  ) {}
  ngOnInit(): void {
    this._httpService.apiUrl = environment.urlPQR;
    this.getPQR();
  }

  getPQR() {
    this._httpImplService
      .obtener('registro/list/registro-json-pqr?cliente=0')
      .then((value: any) => {
        this.listPQR = value;
      })
      .catch((reason) => {});
  }

  async generacionDeProyecto() {
    if (this.listPQR ? this.listPQR.filter((value: any) => value.id == this.pqr).length > 0 : false) {
      if (
        this.listPQR.find((value: any) => value.id == this.pqr).is_respuesta ==
        1
      ) {
        this._httpService
          .generacionReports({
            fileName: 'pqr-registro',
            type: 'PDF',
            typeDataSource: 'CONN',
            connect: 'UPNET',
            params: {
              pqr: Number(this.pqr),
            },
          })
          .subscribe({
            next: (value: Blob) => {
              const urlCreator = window.URL || window.webkitURL;
              this.urlFile = this.sanitazer.bypassSecurityTrustUrl(
                urlCreator.createObjectURL(value)
              );
              const url = URL.createObjectURL(value);
              const a = document.createElement('a');
              a.href = url;
              a.download = `pqr-registro.pdf`;
              a.click();
              URL.revokeObjectURL(url);
              this.message.success(
                'Generación de documento de PQR exitosamente'
              );
            },
            error: (err: any) => {
              //console.log(err)
            },
            complete: () => {},
          });
      }else {
        this.message.info(
          'Esta PQR, No tiene una respuesta todavia para su generación'
        );
      }
    } else {
      this.message.info(
        'Esta PQR, No se encuentra registrada en el sistema'
      );
    }
  }
}
