import { BrowserModule } from '@angular/platform-browser';
import { NgModule , APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { DataTablesModule } from 'angular-datatables';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './dashboard/table/table.component';
import { TaxonDetailComponent } from './taxon-detail/taxon-detail.component';
import { FormEthnobotaComponent } from './form/form-ethnobota/form-ethnobota.component';
import { MyCustomInterceptor } from './services/http.interceptor';
import { MultiselectNomenclatureComponent } from './form/generic-form/multiselect-nomenclature/multiselect-nomenclature.component';

import {NomenclatureService} from './services/nomenclature.service';
import { DisplayNomenclatureValueComponent } from './taxon-detail/display-nomenclature-value/display-nomenclature-value.component';

export function initApp(nomeclatureService: NomenclatureService) {
  return (): Promise<any> => {
    return nomeclatureService.initNomenclature()
      .toPromise()
      .then((resp) => {
        console.log('Response 1 - ', resp);
      });
  };
}


@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    TaxonDetailComponent,
    FormEthnobotaComponent,
    MultiselectNomenclatureComponent,
    DisplayNomenclatureValueComponent
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
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      multi: true,
      deps: [NomenclatureService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

