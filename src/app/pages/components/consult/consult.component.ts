import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.scss'],
})
export class ConsultComponent {
  urlFile: any;

  pqr: number = 0;

  viewPassword: boolean = false;

  constructor(
    private _httpService: HttpService,
    private sanitazer: DomSanitizer,
    private message: NzMessageService
  ) {}

  async generacionDeProyecto() {
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
          this.message.success('Generación de documento de PQR exitosamente');
        },
        error: (err: any) => {
          //console.log(err)
        },
        complete: () => {},
      });
  }
}
