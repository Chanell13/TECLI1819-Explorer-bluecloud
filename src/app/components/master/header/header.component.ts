import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { TranslateService } from '@ngx-translate/core';
import { Actor } from '../../../models/actor.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Alert } from 'selenium-webdriver';
import { Search } from 'src/app/models/search';
import { TripService } from 'src/app/services/trip.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends TranslatableComponent implements OnInit {

  currentActor: Actor;
  private userLoggedIn: boolean;
  private activeRole = 'anonymous';
  private busqueda: Search = { text: null };

  constructor(private translateService: TranslateService,
    private messageService: MessageService,
    private authservice: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private tripservice: TripService
  ) {
    super(translateService);
  }

  changeLanguage(language: string) {
    super.changeLanguage(language);
  }

  // Cuando el servicio de login me diga que un usuario se ha logueado se ejecutará este trozo de código ya que estamos escuchando
  ngOnInit() {
    this.currentActor = this.authservice.getCurrentActor();
    if(this.currentActor != null){
      this.activeRole = this.currentActor.role.toString();
    }else {
      this.activeRole = 'anonymous';
    }

    
    this.authservice.userLoggedIn.subscribe((loggedIn: boolean) => {
      // Si el usuario está logueado
      if (loggedIn) {
        // Le preguntamos al servicio de autenticación por el usuario que se acaba de loguear en la aplicación
        this.currentActor = this.authservice.getCurrentActor();
        // Obtenemos el rol activo, que es el valor que tendremos que comprobar        
        this.activeRole = localStorage.getItem('activeRole');
        // En este caso no hay usuario logueado 
      } else {
        this.activeRole = 'anonymous';
        this.currentActor = null;
      }
    });
  }

  // Cuando el actor hace click en logout tengo que llamar al servicio y actualizar el header para mostrar que se ha salido del sistema
  logout() {
    this.authservice.logout()
      .then(_ => {
        // Cuando todo ha ido correcto, el actor actual pasa a ser anónimo        
        //localStorage.setItem('activeRole', 'anonymous');
        localStorage.setItem('currentActor', '');
        this.currentActor = null;
        this.router.navigate(['login']);
        this.messageService.notifyMessage('messages.auth.logout', 'alert alert-success');
      })
      .catch(error => {
        this.messageService.notifyMessage('errorMessages.auth.logout.failed', 'alert alert-danger');
        console.log(error);
      });
  }

  onSearch() {
    // this.router.navigate(["SearchTripComponent"]);
  }
}
