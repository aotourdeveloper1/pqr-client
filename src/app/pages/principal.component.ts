import { Component } from '@angular/core';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent {
  eventoTabs: string = 'CONSUL';
  septsSeleccionado: number | string = 0;

  actions(event: string) {
    this.eventoTabs = event;
  }

  recibirEvento(event: number) {
    console.log(event)
    this.septsSeleccionado = event;
  }
}
