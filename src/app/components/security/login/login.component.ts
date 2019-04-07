import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';

// import { AuthService } from '../../../services/auth.service';
// Al cargar este servicio la ventana de login deja de funcionar.
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent extends TranslatableComponent {
  private email: string;

  constructor (private translateService: TranslateService){
    super (translateService);
  }

/*  constructor(private authService: AuthService,
      private translateService: TranslateService,
      private messageService: MessageService) {
      super (translateService);
    }

   onLogin (form: NgForm) {
      // Recogemos las variables email y password del formulario
      const email = form.value.email;
      const password = form.value.password;
      // Operación asíncrona en donde tengo que esperar que Firebase compruebe que el usuario existe en la BBDD y me devuelva una promesa
      this.authService.login(email, password).then(_ => {
      // Reseteamos el formulario
      form.reset();
      this.email = email;
      // Si firebase me devuelve algún código de error lo capturamos
   }).catch((error) =>  {
      console.log(error);
      this.messageService.notifyMessage('errorMessages.' + error.code.replace(/\//gi, '.').replace(/\-/gi, '.'), 'Error on Login');
   });
}

onLogout () {
  this.authService.logout()
  .then(_ => {
    this.email = null;
  }).catch(error => {
    console.log(error);
  });
} */
}
