import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() navbar: EventEmitter<string> = new EventEmitter<string>();
  eventoTabs: string = 'CONSUL';

  emitEvent(code: string) {
    this.navbar.emit(code);
    this.eventoTabs = code;
  }
}
