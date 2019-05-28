import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TripListComponent } from './trip-list.component';
import { AppComponent } from 'src/app/app.component';
import { ActorListComponent } from '../../actor/actor-list/actor-list.component';
import { TripDisplayComponent } from '../trip-display/trip-display.component';
import { RegisterComponent } from '../../security/register/register.component';
import { LoginComponent } from '../../security/login/login.component';
import { HeaderComponent } from '../../master/header/header.component';
import { MessageComponent } from '../../master/message/message.component';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { FooterComponent } from '../../master/footer/footer.component';
import { HomeComponent } from '../../shared/home/home.component';
import { TripEditComponent } from '../trip-edit/trip-edit.component';
import { LocalizedDataPipe } from '../../shared/localized-data.pipe';
import { DashboardComponent } from '../../dashboard/dashboard/dashboard.component';
import { ApplicationListComponent } from '../../application/application-list/application-list/application-list.component';
import { ApplicationDisplayComponent } from '../../application/application-display/application-display/application-display.component';
import { TermAndConditionsComponent } from '../../master/terms-and-conditions/term-and-conditions/term-and-conditions.component';
import { NotFoundComponent } from '../../shared/not-found/not-found.component';
import { DeniedAccessPageComponent } from '../../shared/denied-access-page/denied-access-page.component';
import { routes } from 'src/app/app.routes';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig, HttpLoaderFactory } from 'src/app/app.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { APP_BASE_HREF } from '@angular/common';
import { AngularFireAuth } from 'angularfire2/auth';
import { MessageService } from 'src/app/services/message.service';
import { TripService } from 'src/app/services/trip.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProfileComponent } from '../../actor/profile/profile.component';
import { TripCreateComponent } from '../trip-create/trip-create.component';
import { ApplicationCreateComponent } from '../../application/application-create/application-create.component';
import { AgmCoreModule} from '@agm/core';
import { ActorService } from 'src/app/services/actor.service';
import { CookieService } from 'ngx-cookie-service';
import { SearchTripComponent } from '../../search-trip/search-trip.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { CheckoutComponent } from '../../checkout/checkout.component';
import { RegisterManagerComponent } from '../../security/register-manager/register-manager.component';
import { ApplicationUpdateComponent } from '../../application/application-update/application-update.component';

@Injectable()
// Necesito esta clase para simular que tengo un usuario haciendo click en un objeto con un id concreto (test del id)
export class ActivatedRouteStub {
  private subject = new BehaviorSubject(this.testParams);
  params = this.subject.asObservable();

  private _testParams: {};
  get testParams() { return this._testParams; }
  set testParams (params: {}) {
    this._testParams = params;
    this.subject.next(params);
  }
  // ActivatedRoute.snapshot.param
  // Este método snapshot devuelve un conjunto de parámetros simulados
  get snapshot () {
    return { params: this.testParams };
  }
}

describe('TripListComponent', () => {
  // Componente que vamos a probar
  let component: TripListComponent;
  // Envuelve el componente anterior que voy a probar (TripListComponent) con una serie de objetos alrededor para que el componente funcione
  let fixture: ComponentFixture<TripListComponent>;
  let tripService: TripService; // Necesario para el test del código asíncrono ya que la instrucción que llama al getTrips
  // devuelve una promesa a la que Jasmine tendrá que esperar. Necesitamos por tanto esta referencia al servicio que quiero espiar

  // "Antes de" asíncrono
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ActorListComponent,
        TripListComponent,
        RegisterComponent,
        LoginComponent,
        HeaderComponent,
        MessageComponent,
        TranslatableComponent,
        FooterComponent,
        HomeComponent,
        TripDisplayComponent,
        TripEditComponent,
        LocalizedDataPipe,
        DashboardComponent,
        ApplicationListComponent,
        ApplicationDisplayComponent,
        TermAndConditionsComponent,
        NotFoundComponent,
        DeniedAccessPageComponent,
        ProfileComponent,
        TripCreateComponent,
        ApplicationCreateComponent,
        SearchTripComponent,
        CheckoutComponent,
        RegisterManagerComponent,
        ApplicationUpdateComponent
      ],
      imports: [
        routes,
        HttpModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgxPayPalModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyC4ay9WI4sdQEmDnjdnjAKx56_l_vVEqsw',
          libraries: ['places']
          }),
        AngularFireModule.initializeApp(firebaseConfig),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [{provide: APP_BASE_HREF, useValue : '/' },
      AngularFireAuth, MessageService, AngularFireAuth,  ActorService, CookieService]
    })
    .compileComponents();
  }));

  // "Antes de" no asíncrono que se usa cuando no tenemos funciones asíncronas involucradas
  beforeEach(() => {
    fixture = TestBed.createComponent(TripListComponent);
    component = fixture.componentInstance;
    tripService = TestBed.get(TripService); // Necesario para los test asíncronos con llamadas al servicio
    component.ngOnInit();
    // "detectChanges" sirve para que Jasmine detecte si algo cambia en la página, si no lo ponemos, siempre veremos los valores iniciales
    // Sin este método, cuando pregunte por un elemento del componente, nada más crearse y antes de llamar al servicio siempre estará vacío
    // Al hacer la llamada a esta función "detectChanges" ya podré obtener los valores después de cargarse
    fixture.detectChanges();
  });

  // 1º spect: Comprueba si se crea correctamente el componente, es decir, que no sea false
  it('should be create', () => {
    expect(component).toBeTruthy();
  });

  // 2º spect: Comprueba que la lista de viajes tiene exactamente los 19 viajes que tenemos en el Json Server
  it('List trip must have nine trips', async (done) => {
    component.ngOnInit();
    fixture.detectChanges();
    spyOn(tripService, 'getTrips').and.returnValue(Promise.resolve(true));

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.data.length).toEqual(9);
      done();
    }).catch (error => console.log('error en el test:' + error));
  });

  // 3º spect: Comprueba que el precio de todos y cada uno de los viajes de la lista es mayor que un limite mínimo
  it('Price of all the trips in the list must be greather than the minimum limit', async (done) => {
    component.ngOnInit();
    fixture.detectChanges();
    spyOn(tripService, 'getTrips').and.returnValue(Promise.resolve(true));

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.data.forEach((trip) => {
        expect(trip.price).toBeGreaterThan(199);
        done();
      }));
  });
});
});
