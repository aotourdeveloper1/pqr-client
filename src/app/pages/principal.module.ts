// MODULOS
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

// COMPONENTES
import { PrincipalComponent } from './principal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ConsultComponent } from './components/consult/consult.component';
import { RegisterPqrComponent } from './components/register/register-pqr.component';

// NZ-ZORRO
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';

const COMPONENTES: any[] = [
  NavbarComponent,
  PrincipalComponent,
  ConsultComponent,
  RegisterPqrComponent
]

const MODULOS: any[] = [
  NzStepsModule,
  NzButtonModule,
  NzToolTipModule,
  NzFormModule,
  NzInputModule,
  NzSelectModule,
  NzMessageModule,
  NzDatePickerModule,
  NzSpinModule,
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  SharedModule
]

@NgModule({
  declarations: [
    ...COMPONENTES
  ],
  imports: [
    ...MODULOS
  ],
  exports: [
    ...COMPONENTES
  ]
})
export class PrincipalModule { }
