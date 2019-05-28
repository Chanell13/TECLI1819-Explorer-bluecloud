import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationListComponent } from './application-list.component';
import { AppComponent } from 'src/app/app.component';
import { ActorListComponent } from 'src/app/components/actor/actor-list/actor-list.component';
import { TripListComponent } from 'src/app/components/trip/trip-list/trip-list.component';
import { RegisterComponent } from 'src/app/components/security/register/register.component';
import { LoginComponent } from 'src/app/components/security/login/login.component';
import { HeaderComponent } from 'src/app/components/master/header/header.component';
import { MessageComponent } from 'src/app/components/master/message/message.component';
import { TranslatableComponent } from 'src/app/components/shared/translatable/translatable.component';
import { FooterComponent } from 'src/app/components/master/footer/footer.component';
import { HomeComponent } from 'src/app/components/shared/home/home.component';
import { TripDisplayComponent } from 'src/app/components/trip/trip-display/trip-display.component';
import { TripEditComponent } from 'src/app/components/trip/trip-edit/trip-edit.component';
import { LocalizedDataPipe } from 'src/app/components/shared/localized-data.pipe';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard/dashboard.component';
import { ApplicationDisplayComponent } from '../../application-display/application-display/application-display.component';
import { TermAndConditionsComponent } from 'src/app/components/master/terms-and-conditions/term-and-conditions/term-and-conditions.component';
import { NotFoundComponent } from 'src/app/components/shared/not-found/not-found.component';
import { DeniedAccessPageComponent } from 'src/app/components/shared/denied-access-page/denied-access-page.component';
import { routes } from 'src/app/app.routes';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig, HttpLoaderFactory } from 'src/app/app.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { MessageService } from 'src/app/services/message.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApplicationService } from 'src/app/services/application.service';
import { ProfileComponent } from 'src/app/components/actor/profile/profile.component';
import { TripCreateComponent } from 'src/app/components/trip/trip-create/trip-create.component';
import { ApplicationCreateComponent } from '../../application-create/application-create.component';
import { AgmCoreModule} from '@agm/core';
import { CookieService } from 'ngx-cookie-service';
import { ActorService } from 'src/app/services/actor.service';
import { SearchTripComponent } from 'src/app/components/search-trip/search-trip.component';
import { CheckoutComponent } from 'src/app/components/checkout/checkout.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { RegisterManagerComponent } from 'src/app/components/security/register-manager/register-manager.component';
import { ApplicationUpdateComponent } from '../../application-update/application-update.component';

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

describe('ApplicationListComponent', () => {
  let component: ApplicationListComponent;
  let fixture: ComponentFixture<ApplicationListComponent>;
  let mockActivatedRoute;
  let applicationService: ApplicationService;

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
        AngularFireAuth, MessageService, AngularFireAuth,  ActorService, CookieService]
      })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationListComponent);
    component = fixture.componentInstance;
    applicationService = TestBed.get(ApplicationService);
    component.ngOnInit();
    fixture.detectChanges();
  });

  // 1º spect: Comprueba si se crea correctamente el componente, es decir, que no sea false
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // 2º spect: Comprueba que la lista de aplicaciones si no se añade el espia y los observadores, no habrá sido inicializada
  it('list of applications must not have been initialized', () => {
    expect(component.data).toBeUndefined();
  });

  // 3º spect: Comprueba que la lista de aplicaciones una vez espiada, Jasmine ya la reconoce como inicializada
  it('list of applications must have been initialized', async (done) => {
    expect(component.data).toBeUndefined();
    component.ngOnInit();
    fixture.detectChanges();
    spyOn(applicationService, 'getApplications').and.returnValue(Promise.resolve(true));

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.data).toBeDefined();
      done();
    }).catch (error => console.log('error en el test:' + error));
    });

});
