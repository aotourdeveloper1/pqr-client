import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Constanst } from '../../constanst/constanst';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() message: string = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odio, hic?';
  @Input() estado: string = 'info';
  @Input() estadoModalView: boolean = false;

  estadoValido: string;

  @Output() estadoModal: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    this.estadoValido = Constanst.SUCCESS;

  }

  emittirModal(event: boolean): void {
    this.estadoModalView = event;
    this.estadoModal.emit(event)
  }

}
