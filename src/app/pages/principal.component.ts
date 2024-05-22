import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent {
  @Output() navbar: EventEmitter<string> = new EventEmitter<string>();
  eventoTabs: any = 'CONSUL';
  window: any = window.innerWidth < 768;

  emitEvent(code: string) {
    this.navbar.emit(code);
    this.eventoTabs = code;
  }

  septsSeleccionado: number | string = 0;

  actions(event: string) {
    this.eventoTabs = event;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Actualiza el valor del ancho del navegador cuando cambia
    this.window = event.target.innerWidth;
    console.log('Ancho del navegador:', this.window);
  }

  recibirEvento(event: number) {
    console.log(event);
    this.septsSeleccionado = event;
  }
}
