import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { DataTablesModule } from 'angular-datatables';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './dashboard/table/table.component';
import { TaxonDetailComponent } from './taxon-detail/taxon-detail.component';
import { FormEthnobotaComponent } from './form/form-ethnobota/form-ethnobota.component';
import { MyCustomInterceptor } from './services/http.interceptor';
import { MultiselectNomenclatureComponent } from './form/generic-form/multiselect-nomenclature/multiselect-nomenclature.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    TaxonDetailComponent,
    FormEthnobotaComponent,
    MultiselectNomenclatureComponent
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
    // { provide: HTTP_INTERCEPTORS, useClass: MyCustomInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
