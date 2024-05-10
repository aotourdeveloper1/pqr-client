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
  tipoServicio: any[] = [];
  areaResponsable: any[] = [];

  current = 0;
  processing = false;

  currentFileName: string | null = null;
  currentFileSize: string | null = null;

  haveFile: boolean = false;

  file!: File | null;

  estadoPQR: boolean = false;

  modals: boolean = false;

  enviado: boolean = true;

  urlFile: any;

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
      fkCliente: ['', [Validators.required]],
      fkConductor: [''],
      fkEmpleado: [''],
      otrosObsevacion: [''],
      fkAreaResponsable: ['', [Validators.required]],
      fkTipoSolicitud: ['', [Validators.required]],
      fkCriticidad: ['', [Validators.required]],
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

  recibirEstadoModal(event: boolean) {
    this.modals = event;
  }

  changeClient() {
    if (
      this.listCentrosCostos.filter(
        (value: any) =>
          value.nit == this.formCotizaciones.get('fkCliente')?.value
      ).length > 0
    ) {
      this.formCotizaciones.get('fkTipoSolicitud')?.enable();
      this.formCotizaciones.get('fkTipoSolicitud')?.setValue(null);

      this.getTipoSolicitud();
      return;
    }
    this.formCotizaciones.get('fkCliente')?.setValue(null);
    this.message.info(
      'Este nit de cliente no se encuentra registrado en el sistema'
    );
    this.formCotizaciones.get('fkTipoSolicitud')?.setValue(null);
  }

  changeAreResponsable(event: any) {
    if (event.codigo == 'OPE') {
      this.formCotizaciones
        .get('fkConductor')
        ?.addValidators(Validators.required);
      this.formCotizaciones.get('fkConductor')?.updateValueAndValidity();

      this.formCotizaciones.get('fkEmpleado')?.clearValidators();
      this.formCotizaciones.get('fkEmpleado')?.updateValueAndValidity();

      this.formCotizaciones.get('otrosObsevacion')?.clearValidators();
      this.formCotizaciones.get('otrosObsevacion')?.updateValueAndValidity();
    } else if (event.codigo == 'COO') {
      this.formCotizaciones.get('fkConductor')?.clearValidators();
      this.formCotizaciones.get('fkConductor')?.updateValueAndValidity();

      this.formCotizaciones
        .get('fkEmpleado')
        ?.addValidators(Validators.required);
      this.formCotizaciones.get('fkEmpleado')?.updateValueAndValidity();

      this.formCotizaciones.get('otrosObsevacion')?.clearValidators();
      this.formCotizaciones.get('otrosObsevacion')?.updateValueAndValidity();
    } else {
      this.formCotizaciones.get('fkConductor')?.clearValidators();
      this.formCotizaciones.get('fkConductor')?.updateValueAndValidity();

      this.formCotizaciones.get('fkEmpleado')?.clearValidators();
      this.formCotizaciones.get('fkEmpleado')?.updateValueAndValidity();

      this.formCotizaciones
        .get('otrosObsevacion')
        ?.addValidators(Validators.required);
      this.formCotizaciones.get('otrosObsevacion')?.updateValueAndValidity();
    }
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.loadingAndStep();
  }

  async done(): Promise<void> {
    if (this.formCotizaciones.valid && this.currentFileName) {
      await this.loadingAndStep();
      this.emitirEvento(this.current);
      this.postEnviaPQR();
      return;
    } else if (this.formCotizaciones.valid && !this.currentFileName) {
      this.message.info(
        'Debe ingresar una evidencia para poder registrar la PQR'
      );
      return;
    }
    this.postEnviaPQR();
    this.current = 0;
  }

  nuevaPQR() {
    this.enviado = true;
    this.file = null;
    this.currentFileName = null;
    this.currentFileSize = null;
    this.formCotizaciones.reset();
    this.formCotizaciones.get('fechaSolicitud')?.setValue(new Date());
    this.formCotizaciones.get('fkMedioNotificacion')?.setValue(25);
    this.current = 0;
  }

  trackById(_: number, item: Step): number {
    return item.id;
  }

  loadingAndStep(): void {
    if (this.current < this.steps.length) {
      const step = this.steps[this.current];
      if (step.async) {
        this.processing = true;
        mockAsyncStep()
          .pipe(
            finalize(() => {
              step.percentage = 0;
              this.processing = false;
              this.current += 1;
            })
          )
          .subscribe((p) => {
            step.percentage = p;
          });
      } else {
        this.current += 1;
      }
    }
  }

  onFileSelected(event: any) {
    const extencionesValidas = ['jpg', 'png', 'jpeg'];
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
      this.currentFileName = event.target.files[0].name;
      this.currentFileSize = this._utilsService.formatBytes(
        event.target.files[0].size
      );
      // Cambiar el nombre del archivo
      this.file = new File(
        [file],
        `registro.${String(event.target.files[0].name).split('.')[1]}`
      );
    }
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
        this.listCentrosCostos = value.centrosdecosto;
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
          // this.formCotizaciones.value.fkCliente
          this.listCentrosCostos.find(
            (value: any) => value.nit == this.formCotizaciones.value.fkCliente
          ).id
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
        // urlEvidencia: this.file,
        urlEvidencia: this.currentFileName
          ? `https://pqr-registro.s3.amazonaws.com/${uuid}_registro.${
              String(this.currentFileName).split('.')[1]
            }`
          : null,
        fkAreaResponsable: this.formCotizaciones.value.fkAreaResponsable.id,
        fkCliente: this.listCentrosCostos.find(
          (value: any) => value.nit == this.formCotizaciones.value.fkCliente
        ).id,
        fkMedioNotificacion: 25,
        fkCanalRegistro: this.canal.find((value) => value.codigo == 'PLA').id,
        fkEstado: 4,
        fkResponsable: null,
        isRespuesta: false,
        isRechazado: false,
        isCitado: false,
        isCerrado: false,
        isPorroga: false,
      })
      .then(async (value: any) => {
        if (this.file) {
          this.estadoPQR = true;
          this.enviado = false;
          this._httpService.apiUrl = environment.urlS3;
          await this.generarFile(this.file, uuid);
          this._httpService.apiUrl = environment.urlPQR;
          await this.putUrlEvidencia(
            `https://pqr-registro.s3.amazonaws.com/${uuid}_registro.${
              String(this.currentFileName).split('.')[1]
            }`,
            value.id
          );
        }

        this._httpService.apiUrl = environment.url;
        await this.sendEmailRegisterPQR(
          value.id,
          this.file
            ? `https://pqr-registro.s3.amazonaws.com/${uuid}_registro.${
                String(this.currentFileName).split('.')[1]
              }`
            : null
        );

        this._httpService.apiUrl = environment.urlPQR;
      })
      .catch((reason) => {
        this.estadoPQR = false;
        this.enviado = false;
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

  async putUrlEvidencia(url: string, pqr: number) {
    await this._httpImplService
      .actualizar(`registro/update/url-pqr?url=${url}&pqr=${pqr}`, {})
      .then(async (value: any) => {})
      .catch((reason) => {});
  }

  async sendEmailRegisterPQR(pqr: number, url: null | string) {
    await this._httpImplService
      .guardar('sendemail', {
        titulo: 'PQR N° ' + pqr,
        texto: 'Se ha generado una nueva PQR',
        nombre: 'PQR N° ' + pqr,
        asunto: 'Registro de PQR desde link público',
        email: this.formCotizaciones.value.correo,
        url: null,
      })
      .then(async (value: any) => {})
      .catch((reason) => {});
  }
}
