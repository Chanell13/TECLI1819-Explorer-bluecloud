import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TripDisplayComponent } from './trip-display.component';
import { AppComponent } from 'src/app/app.component';
import { ActorListComponent } from '../../actor/actor-list/actor-list.component';
import { TripListComponent } from '../trip-list/trip-list.component';
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
import { CookieService } from 'ngx-cookie-service';
import { ActorService } from 'src/app/services/actor.service';
import { AgmCoreModule} from '@agm/core';
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

describe('TripDisplayComponent', () => {
  let component: TripDisplayComponent;
  let fixture: ComponentFixture<TripDisplayComponent>;
  let mockActivatedRoute; // Creamos una instancia de la clase ActivatedRouteStub (necesario para el test del id)
  let tripService: TripService; // Necesario para el test del código asíncrono (precio) ya que la instrucción que llama al getTrips
  // devuelve una promesa a la que Jasmine tendrá que esperar. Necesitamos por tanto esta referencia al servicio que quiero espiar

  beforeEach(async(() => {
    mockActivatedRoute = new ActivatedRouteStub();

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
      providers: [{provide: APP_BASE_HREF, useValue : '/' }, {provide: ActivatedRoute, useValue: mockActivatedRoute},
      AngularFireAuth, MessageService, AngularFireAuth, ActorService, CookieService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripDisplayComponent);
    component = fixture.componentInstance;
    mockActivatedRoute.testParams = { id: '02' }; // Necesario para el test del id
    tripService = TestBed.get(TripService); // Necesario para el test del precio
    component.ngOnInit();
    fixture.detectChanges();
  });

  // 1º spect: Comprueba si se crea correctamente el componente, es decir, que no sea false
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // 2º spect: Comprueba que se haya hecho bien el ngOnInit del componente, de manera que la variable trip tiene algún viaje asignado
  it('trip must have been initialized', () => {
    expect(component.trip).toBeDefined();
  });

  // 3º spect: Comprobación sobre un id concreto que introducimos nosotros sacado de Json Server
  it('should have correct id', () => {
    expect(component.id).toEqual('02');
  });

  // 4º spect: Comprobación de que el precio sea menor a un límite establecido
  it('Price should be less than the maximum limit', async (done) => {
    // Inicialmente el precio es correcto que no esté definido, ya que no ha dado tiempo de que se cargue el objeto
    expect(component.trip.price).toBeUndefined();
    component.ngOnInit();
    fixture.detectChanges();
    // Después de llamar al detectChanges, fixture ya tendría que tener el precio
    spyOn(tripService, 'getTrips').and.returnValue(Promise.resolve(true));

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      console.log('El precio es: ' + component.trip.price);
      expect(component.trip.price).toBeLessThan(2800);
      done();
  }).catch (error => console.log('error en el test:' + error));
});


});
