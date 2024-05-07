import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'cui-support-chat',
  templateUrl: './support-chat.component.html',
  styleUrls: ['./support-chat.component.scss'],
})
export class SupportChatComponent implements OnInit {

  formulario: FormGroup;

  userMessage: any[] = []

  mostrar: boolean = false;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.formulario = this.formBuilder.group(
      {
        message: ['', [Validators.required]]
      }
    )
  }

  ngOnInit() {

  }

  enviarMensaje() {
    const fechaUser: Date = new Date();
    if (this.formulario.invalid) {
      return;
    }
    this.userMessage.push(
      {
        maquina: 'Lorem, ipsum, dolor sit amet consectetur adipisicing elit. Quod, fugiat?',
        fechaMaquina:  `${new Date().getHours()} : ${new Date().getMinutes()}`,
        user: this.formulario.value.message,
        fechaUser: `${fechaUser.getHours()} : ${fechaUser.getMinutes()}`
      }
    )

    this.formulario.reset();
  }

}