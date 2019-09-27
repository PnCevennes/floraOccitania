import { BrowserModule } from '@angular/platform-browser';
import { NgModule , APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { forkJoin } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';

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


@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    TaxonDetailComponent,
    FormEthnobotaComponent,
    MultiselectComponent,
    DisplayForeignkeyArrayComponent
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
      deps: [NomenclatureService, FloraOccitaniaService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

