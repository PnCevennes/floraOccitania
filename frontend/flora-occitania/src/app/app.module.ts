import { BrowserModule } from '@angular/platform-browser';
import { NgModule , APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HttpClient, HttpRequest, HttpHandler, HttpEvent , HttpClientModule , HttpInterceptor,  HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { forkJoin } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';

import { CookieService } from 'ng2-cookies';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './dashboard/table/table.component';
import { TaxonDetailComponent } from './taxon-detail/taxon-detail.component';
import { FormEthnobotaComponent } from './form/form-ethnobota/form-ethnobota.component';
import { MyCustomInterceptor } from './services/http.interceptor';
import { MultiselectComponent } from './form/generic-form/multiselect/multiselect.component';

import {NomenclatureService} from './services/nomenclature.service';
import {FloraOccitaniaService} from './services/flora-occitania.service';
import { DisplayForeignkeyArrayComponent } from './taxon-detail/display-foreignkey-array/display-foreignkey-array.component';
import { LoginComponent } from './login/login.component';

export function initApp(
  nomeclatureService: NomenclatureService,
  floraOccitaniaService: FloraOccitaniaService
) {
  return (): Promise<any> => {
    return forkJoin(
        nomeclatureService.initNomenclature(),
        floraOccitaniaService.initSources()
      ).toPromise()
      .then((resp) => {
        console.log('Response 1 - ', resp);
      });
  };
}
@Injectable()
export class AddCredentialsInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
        withCredentials: true
    });
    return next.handle(request);
  }
}


@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    TaxonDetailComponent,
    FormEthnobotaComponent,
    MultiselectComponent,
    DisplayForeignkeyArrayComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ],
  providers: [

    CookieService,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      multi: true,
      deps: [NomenclatureService, FloraOccitaniaService]
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: AddCredentialsInterceptor,
      multi: true,
      }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

