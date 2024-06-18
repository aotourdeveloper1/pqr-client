import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { merge, Observable, timer } from 'rxjs';
import { delay, finalize, map, scan } from 'rxjs/operators';
import { HttpService } from '../../../shared/services/http.service';
import { HttpImplentacionService } from '../../../shared/services/impl/http-implentacion.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from '../../../shared/utils/utils.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DomSanitizer } from '@angular/platform-browser';
import { IEntidad, entidad } from './models/IEntidad.interface';

interface SyncStep {
  id: number;
  title: string;
  description: string;
  async: false;
  percentage: null;
}

interface AsyncStep {
  id: number;
  title: string;
  description: string;
  async: true;
  percentage: number;
}

type Step = SyncStep | AsyncStep;

function mockAsyncStep(): Observable<number> {
  const subStep1 = timer(600).pipe(map(() => 25));
  const subStep2 = subStep1.pipe(delay(600));
  const subStep3 = subStep2.pipe(delay(600));
  const subStep4 = subStep3.pipe(delay(600));
  return merge(subStep1, subStep2, subStep3, subStep4).pipe(
    scan((a, b) => a + b)
  );
}

@Component({
  selector: 'app-register-pqr',
  templateUrl: './register-pqr.component.html',
  styleUrls: ['./register-pqr.component.scss'],
})
export class RegisterPqrComponent implements OnInit {
  formCotizaciones: FormGroup;

  @Output() setp: EventEmitter<number> = new EventEmitter();

  steps: Step[] = [
    {
      id: 1,
      title: `Tipo de solicitud`,
      description: `This step is synchronous.`,
      async: false,
      percentage: null,
    },
    {
      id: 2,
      title: `Descripción`,
      description: `This step is asynchronous.`,
      async: false,
      percentage: null,
    },
    {
      id: 3,
      title: `Documentos`,
      description: `This step is asynchronous.`,
      async: true,
      percentage: 0,
    },
    {
      id: 3,
      title: `Respuesta`,
      description: `This step is asynchronous.`,
      async: false,
      percentage: null,
    },
  ];

  tipoSolicitud: any[] = [];
  criticidad: any[] = [];
  medioNotificacion: any[] = [];
  causa: any[] = [];
  canal: any[] = [];
  listConductor: any[] = [];
  listEmpleados: any[] = [];
  listCentrosCostos: any[] = [];
  listCentrosCostosBase: any[] = [];
  tipoServicio: any[] = [];
  areaResponsable: any[] = [];

  listFileView: any[] = [];
  listFile: any[] = [];

  entidadList: IEntidad[] = entidad;

  current = 0;
  processing = false;

  currentFileName: string | null = null;
  currentFileSize: string | null = null;

  haveFile: boolean = false;

  file!: File | null;

  estadoPQR: boolean = true;

  modals: boolean = false;

  enviado: boolean = false;

  urlFile: any;

  tagActivo: number = 0;
  tag: any[] = [
    {
      id: 0,
      codigo: 'TIP',
      nombreTag: '1. Tipo de solicitud',
    },

    {
      id: 1,
      codigo: 'DES',
      nombreTag: '2. Descripción',
    },
    {
      id: 2,
      codigo: 'DOC',
      nombreTag: '3. Documentos',
    },
    {
      id: 3,
      codigo: 'RES',
      nombreTag: '3. Respuesta',
    },
  ];
  selectActive: boolean = false;

  constructor(
    private _httpService: HttpService,
    private _httpImplService: HttpImplentacionService,
    public _utilsService: UtilsService,
    private sanitazer: DomSanitizer,
    private message: NzMessageService,
    private formBuilder: FormBuilder
  ) {
    this.formCotizaciones = this.formBuilder.group({
      identificacion: ['', [Validators.required]],
      primerNombre: ['', [Validators.required]],
      primerApellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      fkMedioNotificacion: [25, [Validators.required]],
      fechaSolicitud: [new Date(), [Validators.required]],
      // fkConductor: [''],
      // fkEmpleado: [''],
      // otrosObsevacion: [''],
      // fkAreaResponsable: ['', [Validators.required]],
      fkSede: ['', [Validators.required]],
      fkCliente: ['', [Validators.required]],
      fkTipoSolicitud: ['', [Validators.required]],
      fkCausa: ['', [Validators.required]],
      fkTipoServicio: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
    });

    this.formCotizaciones.get('fkMedioNotificacion')?.disable();
    this.formCotizaciones.get('fkTipoSolicitud')?.disable();
  }
  ngOnInit(): void {
    this._httpService.apiUrl = environment.urlPQR;

    this.getMedioNotificacion();
    this.getAreaResponsable();
    this.getCausa();
    this.getCanal();
    this.getCriticidad();
    this.getTipoServicio();

    this._httpService.apiUrl = environment.url;
    this.getConductor();
    this.getCentroCosto();
    this.getListEmpleados();
    this._httpService.apiUrl = environment.urlPQR;
    // this.getTipoSolicitud();
  }

  // EVENTS
  tagSeleccionadoMet(item: any) {
    if (this.enviado) {
      return;
    }
    if (item.id == 3) {
      if (this.formCotizaciones.valid && this.currentFileName) {
        this.postEnviaPQR();
        return;
      } else if (this.formCotizaciones.valid && !this.currentFileName) {
        this.message.info(
          'Debe ingresar una evidencia para poder registrar la PQR'
        );
        this.tagActivo = 2;
        return;
      } else if (this.formCotizaciones.invalid) {
        this.message.info(
          'El registro de la PQR, no es valido faltán campos por llenar'
        );
        this.tagActivo = 0;
        return;
      }
      this.postEnviaPQR();
      this.tagActivo = 0;
    }
    this.tagActivo = item.id;
  }

  recibirEstadoModal(event: boolean) {
    this.modals = event;
  }

  changeClient() {
    this.formCotizaciones.get('fkTipoSolicitud')?.enable();
    this.formCotizaciones.get('fkTipoSolicitud')?.setValue(null);

    this.getTipoSolicitud();
  }

  searchClient(searchValue: string): void {
    this.listCentrosCostosMet(searchValue);
  }

  listCentrosCostosMet(searchValue?: string) {
    if (searchValue) {
      const regex = new RegExp(
        searchValue.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
        'i'
      );
      this.listCentrosCostos = this.listCentrosCostosBase.filter((item) =>
        regex.test(item.razonsocial)
      );
      return;
    }
  }

  pre(): void {
    this.tagActivo -= 1;
  }

  next(): void {
    this.tagActivo += 1;
  }

  async done(): Promise<void> {
    if (this.formCotizaciones.valid && this.listFileView.length > 0) {
      this.postEnviaPQR();
      return;
    } else if (this.formCotizaciones.valid && this.listFileView.length == 0) {
      this.message.info(
        'Debe ingresar una evidencia para poder registrar la PQR'
      );
      return;
    } else if (this.formCotizaciones.invalid) {
      this.message.info(
        'El registro de la PQR, no es valido faltán campos por llenar'
      );
      this.tagActivo = 0;
      return;
    }
    this.postEnviaPQR();
    this.tagActivo = 0;
  }

  nuevaPQR() {
    this.enviado = false;
    this.file = null;
    this.currentFileName = null;
    this.currentFileSize = null;
    this.formCotizaciones.reset();
    this.formCotizaciones.get('fechaSolicitud')?.setValue(new Date());
    this.formCotizaciones.get('fkMedioNotificacion')?.setValue(25);
    this.tagActivo = 0;

    this.listFile.length = 0;
    this.listFileView.length = 0;
  }

  trackById(_: number, item: Step): number {
    return item.id;
  }

  eliminarFileList(item: any) {
    this.listFileView = this.listFileView.filter(
      (value) => value.id != item.id
    );
    this.listFile = this.listFile.filter((file: any) => file.id != item.id);
  }

  onFileSelected(event: any) {
    const extencionesValidas = ['jpg', 'png', 'jpeg', 'pdf'];
    const file: File = event.target.files[0];
    const inputElement = document.getElementById(
      'fileInput'
    ) as HTMLInputElement;

    if (file) {
      if (event.target.files[0].size > 5000000) {
        inputElement.value = '';
        this.message.create('error', `El tamaño del archivo es muy grande`);
        return;
      } else if (
        !extencionesValidas.includes(
          file.name.split('.')[file.name.split('.').length - 1]
        )
      ) {
        inputElement.value = '';
        this.message.create('error', `Esta extensión de archivo no es válida`);
        return;
      }
      if (this.listFileView.length == 5) {
        this.message.info('No es posible subir mas evidencias maximo son 5');
        return;
      }

      this.currentFileName = event.target.files[0].name;
      this.currentFileSize = this._utilsService.formatBytes(
        event.target.files[0].size
      );

      // Cambiar el nombre del archivo
      this.file = new File(
        [file],
        `${
          this.listFileView.length == 0
            ? 1
            : this.listFileView[this.listFileView.length - 1].id + 1
        }_registro.${
          String(event.target.files[0].name).split('.')[
            String(event.target.files[0].name).split('.').length - 1
          ]
        }`
      );

      this.listFileView.push({
        id:
          this.listFileView.length == 0
            ? 1
            : this.listFileView[this.listFileView.length - 1].id + 1,
        name: `${
          this.listFileView.length == 0
            ? 1
            : this.listFileView[this.listFileView.length - 1].id + 1
        }_registro.${
          String(event.target.files[0].name).split('.')[
            String(event.target.files[0].name).split('.').length - 1
          ]
        }`,
      });

      this.listFile.push({
        id:
          this.listFile.length == 0
            ? 1
            : this.listFile[this.listFile.length - 1].id,
        file: this.file,
      });
    }
    inputElement.value = ''; // Restablecer el valor a una cadena vacía
  }

  emitirEvento(setp: number) {
    this.setp.emit(setp);
  }

  async getListEmpleados() {
    this._httpService.apiUrl = environment.url;
    await this._httpImplService
      .guardar('listusers', {})
      .then((value: any) => {
        this.listEmpleados = value.users;
      })
      .catch((reason) => {
        console.log(reason);
      });
  }

  async getCentroCosto() {
    await this._httpImplService
      .guardar('costcenterlist', {})
      .then((value: any) => {
        // this.listCentrosCostos = value.centrosdecosto;
        this.listCentrosCostosBase = value.centrosdecosto;
      })
      .catch((reason: any) => {
        console.log(reason);
      });
  }

  getMedioNotificacion() {
    this._httpImplService
      .obtener('parametria/list/tipos-pqr?codigo=MED')
      .then((value: any) => {
        this.medioNotificacion = value;
        this.medioNotificacion = this.medioNotificacion.filter(
          (value) => value.activo == true
        );
      })
      .catch((reason) => {
        console.log(reason);
      });
  }

  getCanal() {
    this._httpImplService
      .obtener('parametria/list/tipos-pqr?codigo=CAN')
      .then((value: any) => {
        this.canal = value;
        this.canal = this.canal.filter((value) => value.activo == true);
      })
      .catch((reason) => {
        console.log(reason);
      });
  }

  getConductor() {
    this._httpImplService
      .guardar('listdrivers', {})
      .then((value: any) => {
        this.listConductor = value.conductores;
      })
      .catch((reason) => {
        console.log(reason);
      });
  }

  getAreaResponsable() {
    this._httpImplService
      .obtener('parametria/list/tipos-pqr?codigo=ARE')
      .then((value: any) => {
        this.areaResponsable = value;
        this.areaResponsable = this.areaResponsable.filter(
          (value) => value.activo == true
        );
      })
      .catch((reason) => {
        console.log(reason);
      });
  }

  getTipoSolicitud() {
    this._httpImplService
      .obtener(
        'parametria/list/tipos-solicitud-pqr?centroCosto=' +
          this.formCotizaciones.value.fkCliente
      )
      .then((value: any) => {
        this.tipoSolicitud = value;
        this.tipoSolicitud = this.tipoSolicitud.filter(
          (value) => value.estado == true
        );
      })
      .catch((reason) => {
        console.log(reason);
      });
  }

  getCriticidad() {
    this._httpImplService
      .obtener('parametria/list/tipos-pqr?codigo=CRI')
      .then((value: any) => {
        this.criticidad = value;
        this.criticidad = this.criticidad.filter(
          (value) => value.activo == true
        );
      })
      .catch((reason) => {
        console.log(reason);
      });
  }

  getCausa() {
    this._httpImplService
      .obtener('parametria/list/tipos-pqr?codigo=CAU')
      .then((value: any) => {
        this.causa = value;
        this.causa = this.causa.filter((value) => value.activo == true);
      })
      .catch((reason) => {
        console.log(reason);
      });
  }

  getTipoServicio() {
    this._httpImplService
      .obtener('parametria/list/tipos-pqr?codigo=TIP')
      .then((value: any) => {
        this.tipoServicio = value;
        this.tipoServicio = this.tipoServicio.filter(
          (value) => value.activo == true
        );
      })
      .catch((reason) => {
        console.log(reason);
      });
  }

  postEnviaPQR() {
    if (this.formCotizaciones.invalid) {
      Object.values(this.formCotizaciones.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    // if (!this.isAutorize) {
    // this.message.info(
    // 'No es posible registrar la PQR, sino acepta los terminos y condiciones'
    // );
    // return;
    // }

    const json = this.formCotizaciones.value;

    const uuid: string = this._utilsService.generateUUID();

    this._httpImplService
      .guardar(`registro/created/registro-pqr?user=` + 0, {
        ...json,
        id: this._utilsService.formatDate(new Date()).replaceAll('-', ''),
        urlEvidencia:
          this.listFileView.length == 0
            ? null
            : this.listFileView.map(
                (value: any) =>
                  `https://pqr-registro.s3.amazonaws.com/${uuid}_${value.name}`
              ),
        fkMedioNotificacion: 25,
        fkCanalRegistro: this.canal.find((value) => value.codigo == 'PLA').id,
        fkEstado: 1,
        fkResponsable: null,
      })
      .then(async (value: any) => {
        if (this.listFileView.length > 0) {
          this.estadoPQR = true;
          this.enviado = true;
          this._httpService.apiUrl = environment.urlS3;

          await this.listFile.forEach(async (value: any) => {
            await this.generarFile(value.file, uuid);
          });
          this._httpService.apiUrl = environment.urlPQR;
        }

        this._httpService.apiUrl = environment.url;
        await this.sendEmailRegisterPQR(
          value.id,
          this.listFileView.length == 0
            ? null
            : this.listFileView.map(
                (value: any) =>
                  `https://pqr-registro.s3.amazonaws.com/${uuid}_${value.name}`
              )
        );

        this._httpService.apiUrl = environment.urlPQR;
        this.tagActivo = 3;
      })
      .catch((reason) => {
        this.estadoPQR = false;
        this.enviado = true;
      });
  }

  async generarFile(file: File, pqr: String) {
    const formData = new FormData();
    formData.append('file', file);
    await this._httpImplService
      .guardar(
        'uploadFile?bucketName=pqr-registro&identificador=' + pqr,
        formData
      )
      .then(async (value: any) => {})
      .catch((reason) => {});
  }

  async sendEmailRegisterPQR(pqr: number, url: null | string[]) {
    const copias: string[] = [
      'jefedetransporte@aotour.com.co',
      'j.ojeda@aotour.com.co',
      'gustelo@aotour.com.co',
    ];

    if (this.formCotizaciones.value.fkSede == 1) {
      copias.push('liderdetransporte@aotour.com.co');
    } else if (this.formCotizaciones.value.fkSede == 2) {
      copias.push('liderdetransportebog@aotour.com.co');
    } else {
      copias.push('liderdetransporte@aotour.com.co');
      copias.push('liderdetransportebog@aotour.com.co');
    }
    await this._httpImplService
      .guardar('sendemail', {
        titulo: 'PQR N° ' + pqr,
        texto: 'Se ha generado una nueva PQR',
        nombre: 'PQR N° ' + pqr,
        asunto: 'Registro de PQR desde link público',
        email: this.formCotizaciones.value.correo,
        copias: copias,
        url: url,
      })
      .then(async (value: any) => {})
      .catch((reason) => {});
  }
}
