import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumdsComponent } from './components/breadcrumds/breadcrumds.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HttpImplentacionService } from './services/impl/http-implentacion.service';
import { UtilsService } from './utils/utils.service';
import { HttpService } from './services/http.service';
import { ModalComponent } from './components/modal/modal.component';
import { SupportChatComponent } from './components/SupportChat/support-chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { MinusculasPipe } from './pipes/minusculas.pipe';
import { ModalComponentA } from './modal/modal.component';

const COMPONENTES: any[] = [
  BreadcrumdsComponent,
  FooterComponent,
  SidebarComponent,
  ModalComponent,
  SupportChatComponent,
  CapitalizePipe,
  MinusculasPipe,
]

@NgModule({
  declarations: [
    // Componentes, directivas, pipes, etc.
    ...COMPONENTES,
    ModalComponent,
    ModalComponentA
  ],
  imports: [
    // Otros módulos que puedas necesitar
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    // Componentes, directivas o pipes del módulo actual deben estar disponibles para otros módulos que importen el módulo actual. Este bloque no se utiliza para exportar servicios.
    ...COMPONENTES,
    ModalComponentA
  ],
  providers: [
    // Registrar servicios a nivel de módulo. Estos servicios estarán disponibles para todos los componentes, directivas u otros servicios dentro del mismo módulo.
    HttpImplentacionService,
    HttpService,
    UtilsService
  ]
})
export class SharedModule { }
