/// <reference path="../../../../../node_modules/@types/googlemaps/index.d.ts" />


import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Actor } from 'src/app/models/actor.model';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { AuthService } from 'src/app/services/auth.service';
import { ActorService } from 'src/app/services/actor.service';
import { ValidateURLOptional } from '../../shared/optionalUrl.validator';
import { existingPhoneNumValidator } from '../../shared/existingPhone.validator';
import { MouseEvent, MapsAPILoader } from '@agm/core';
import { marker} from '../../../models/marker.model';
import { Picture } from 'src/app/models/picture.model';
import { CanComponentDeactivate } from 'src/app/services/can-deactivate.service';
import { Observable } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends TranslatableComponent implements OnInit, CanComponentDeactivate {

  // Creamos un atributo que va a ser el propio formulario (un grupo de campos formulario)
  profileForm: FormGroup;
  formModel: Actor;
  actor: Actor;
  // Array que indica las opciones que tendrá el combo del lenguaje dentro del formulario de edición de perfil
  langs = ['en', 'es'];
  photoChanged: Boolean;
  // Este atributo es la propia imagen
  picture: string;
  // Nivel de zoom de Google maps
  zoom = 10;
  // Posición inicial en el mapa
  lat = 37.3753501;
  lng = -6.0250983;
  markers: marker[] = [];
  autocomplete: any;

  // can deactivate
  // Booleano que determina cuando el componente ha sido actualizado
  private updated: boolean;
  // Booleano que determina cuando hemos cancelado los cambios
  private cancelChanges = false;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  // Para poder construir el formulario necesitamos el FormBuilder
  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private actorService: ActorService,
    private translateService: TranslateService,
    private mapsAPILoader: MapsAPILoader,
    private NgZone: NgZone) {
    super(translateService);
    this.updated = false;
  }

  // Cuando se esté inicializando el componente, lo primero que vamos a hacer es crear el formulario
  ngOnInit() {
     // photoChanged es un boleano que nos sirve para saber si el usuario ha cambiado la foto que estaba o no
  this.photoChanged = false;
    this.createForm();

    this.mapsAPILoader.load().then(() => {

      this.autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      this.autocomplete.addListener('place_changed', () => {
        this.NgZone.run(() => {
          const place = this.autocomplete.getPlace();

          this.profileForm.value.address = place.formatted_address;

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 16;

          this.markers = [];
          this.markers.push({
            lat: this.lat,
            lng: this.lng,
            draggable: true
          });
        });
      });
    }).catch(err => console.log(err));
  }

  // Método donde creamos el formulario, es decir donde definimos los campos de los que consta el formulario creando un grupo con "group"
  // El formulario se crea inicialmente vacío hasta que cargamos el actor y se indica los validadores
  createForm() {
    this.profileForm = this.fb.group({
      id: [''],
      name: ['', Validators.required], // valor requerido
      surname: ['', Validators.required], // valor requerido
      email: [''],
      password: [''],
      // usamos el patrón para solamente aceptar dígitos numéricos
      // además de eso tengo otro validador asíncrono para mirar en base de datos que no tenga otro usuario con el mismo teléfono
      phone: ['', [Validators.pattern('[0-9]+')], [existingPhoneNumValidator(this.actorService, this.authService)]],
      address: ['', Validators.maxLength(50)], // máximo 50 caracteres
      preferredLanguage: [''],
      photo: [''], // El campo photo ahora será un selector de fichero (botón examinar)
      // ValidateURLOptional],  Aquí utilizaremos un validador definido por nosotros (custom) - deprecated
      picture: [''],
      role: ['']
    });

    // El formulario por defecto no tiene que aparecer vacío, tiene que aparecer con los datos del usuario logueado
    // Recuperamos el actor logueado actualmente con el método getCurrentActor, y me quedo con su id
    // Ese id se lo paso al método getActor, que me devolverá los datos de un actor dado su id
    // Como es un método de servicio que llama a backend tendremos que esperar a que la promesa se resuelva
    // Cuando me llegue el actor, (si no es nulo), cargo en los campos definidos anteriormente en el formulario, los valores exactos
    // Con setValue establezco como valor del campo id del formulario, el id que nos ha devuelto el servidor backend
    // Esto solamente sirve para cargar los datos en el formulario, según como se defina el html, estos campos serán visibles o no
    const currentActor = this.authService.getCurrentActor();
    if (currentActor) {
      const idActor = this.authService.getCurrentActor().id;
      this.actorService.getActor(idActor).then((actor) => {
        this.actor = actor;
        console.log('createForm');
        console.log(JSON.stringify(actor));
        if (actor) {
          this.profileForm.controls['id'].setValue(actor.id);
          this.profileForm.controls['name'].setValue(actor.name);
          this.profileForm.controls['surname'].setValue(actor.surname);
          this.profileForm.controls['email'].setValue(actor.email);
          this.profileForm.controls['password'].setValue(actor.password);
          this.profileForm.controls['phone'].setValue(actor.phone);
          this.profileForm.controls['preferredLanguage'].setValue(actor.preferredLanguage);
          this.profileForm.controls['role'].setValue(actor.role);
          this.profileForm.controls['address'].setValue(actor.address);
          // Si el actor tiene una imagen, esa tengo que cargarla al inicial el formulario
          // Buffer es el array de bits de la imagen que se guarda en JSON Server
          console.log('photo: ', actor.photoObject);
          if (actor.photoObject != undefined) { // Para que no salte el error cuando no está creada la estructura
            this.picture = actor.photoObject.Buffer;
            // Cargamos en un textarea que inicialmente está oculto, el array de bits de la imagen
            document.getElementById('showresult').textContent = actor.photoObject.Buffer;
            this.formModel = this.profileForm.value;
            this.formModel.photoObject = new Picture ();
            this.formModel.photoObject.Buffer = document.getElementById('showresult').textContent;
            this.formModel.photoObject.contentType = 'image/png'; // Por ahora solo aceptamos imagenes de tipo .png

          }

          // Maps
          if (this.actor.address == null) {
            this.setCurrentPosition();
          } else {
            const coords = this.actor.address.split(';');
            console.log('Split: ' + coords);
            if (coords != null && coords.length === 2) {
              this.markers.push({
                lat: +coords[0],
                lng: +coords[1],
                draggable: true
              });
            }
          }
        }
      });
    }
  }


  // Este método se ejecutará en dos casos:
  // 1º Cuando le damos al botón salvar del formulario de edición
  // 2º Cuando le damos al botón "aceptar" de la ventana emergente del can deactivate
  onSubmit() {
    console.log('Estoy dentro de onSubmit');

    /*const result = [];
    Object.keys(this.profileForm.controls).forEach(key => {
  
      const controlErrors: ValidationErrors = this.profileForm.get(key).errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('control: ', key);
          console.log('error: ', keyError);
          console.log('value: ', controlErrors[keyError]);
        });
      }
    });*/

    // se recuperan los valores que el usuario haya podido modificar
    // Si photoChanged = true, el usuario ha cambiado la foto, en ese caso actualizamos la variable formModel del formulario
    if (this.photoChanged) {
      console.log('actualizamos la foto');
      this.formModel = this.profileForm.value;
      this.formModel.photoObject = new Picture ();
      this.formModel.photoObject.Buffer = document.getElementById('showresult').textContent;
      this.formModel.photoObject.contentType = 'image/png'; // Por ahora solo aceptamos imagenes de tipo .png
    }

    if (!this.cancelChanges) {
      console.log('Acepto los cambios y me voy a home');
      // Llamo al método updateProfile que vuelca al Json Server los valores que ha modificado el usuario
      this.formModel = this.profileForm.value;
      this.formModel.photoObject = new Picture ();
      this.formModel.photoObject.Buffer = document.getElementById('showresult').textContent;
      this.formModel.photoObject.contentType = 'image/png'; // Por ahora solo aceptamos imagenes de tipo .png
      this.actorService.updateProfile(this.formModel).then((val) => {
      console.log(val);
      this.cancelChanges = true;
      // Si todo va bien vuelvo a la página que hayamos definido
      this.router.navigate(['/home']);
    }).catch((err) => {
      console.error(err);
    });
    } else {
      this.cancelChanges = false;
    }
  }


  // Este evento es el que se dispara cuando el usuario haga click en el botón "examinar" del html para buscar una foto
  onFileChange(event) {
    const reader = new FileReader();
    const showout = document.getElementById('showresult');
    let res;
    // Bandera que sirve para indicarnos que el usuario ha cambiado la foto
    this.photoChanged = true;
    console.log('Estoy dentro de onFileChange');

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      reader.addEventListener('loadend', function () {
        res = reader.result;
        showout.textContent = this.result.toString();
      });
      reader.readAsDataURL(file);
    }
  }


// Método genérico que cada componente lo tiene que customizar
canDeactivate (): Observable <boolean> | Promise <boolean> | boolean {
  console.log('Estoy dentro de canDeactivate');
  // Por defecto devolvemos siempre falso
  let result = false;
  // Mensaje internacionalizado con una ventana emergente
  const message = this.translateService.instant('messages.discard.changes');
  // Si el componente aún no ha sido actualizado, y el formulario está sucio (se ha modificado)
  if (!this.updated && this.profileForm.dirty) {
    // Muestro la ventana emergente
    result = confirm(message);
    if (!result) {
      // Si result = false significa que el usuario ha pinchado en cancelar dentro de la ventana emergente
      console.log('Cancelar');
     this.cancelChanges = true;
    }
  }
  return result;
}


// Este método se ejecuta al pinchar en el botón cancelar del html y lo que hacemos es evaluar el resultado del canDeactivate anterior
goBack(): void {
  var result = this.canDeactivate();
  console.log(result);
  if (result) {
    console.log('Has pinchado en Aceptar la cancelación');
    this.router.navigate(['/home']);
  } else {
    console.log('Has pinchado en cancelar');
  }
}


// Método que se ejecuta cuando se pincha en algún punto del mapa
  mapClicked($event: MouseEvent) {
    this.markers = [];
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });

    this.profileForm.value.address = $event.coords.lat + ';' + $event.coords.lng;
    this.profileForm.controls['address'].setValue(this.profileForm.value.address);
  }

// Método para establecer la posición en el mapa
  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      console.log('Geolocation');
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }
}
