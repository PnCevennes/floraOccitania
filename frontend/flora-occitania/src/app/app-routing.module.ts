import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TableComponent} from './dashboard/table/table.component';
import {TaxonDetailComponent} from './taxon-detail/taxon-detail.component';
import {FormEthnobotaComponent} from './form/form-ethnobota/form-ethnobota.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: TableComponent },
  { path: 'detail/:id', component: TaxonDetailComponent },
  { path: 'form/:id', component: FormEthnobotaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
