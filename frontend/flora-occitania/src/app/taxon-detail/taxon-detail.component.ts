import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {FloraOccitaniaService, TaxonList} from "../services/flora-occitania.service"
import {TaxhubService} from "../services/taxhub.service"
import { NomenclatureService } from '../services/nomenclature.service';
import { AuthenticationService, User } from '../services/authentication.service';

@Component({
  selector: 'app-taxon-detail',
  templateUrl: './taxon-detail.component.html',
  styleUrls: ['./taxon-detail.component.css']
})
export class TaxonDetailComponent implements OnInit {

  taxon: any;
  nomVerns: any;
  nomenclatureValue: any;
  currentUser: User;

  constructor(
    public floraOccitaniaService: FloraOccitaniaService,
    public taxhubService: TaxhubService,
    private route: ActivatedRoute,
    public nomenclatureService: NomenclatureService,
    private location: Location,
    private authenticationService: AuthenticationService
  ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.getTaxon();
    this.nomenclatureValue = this.nomenclatureService.nomenclaturesValues;
  }

  getTaxon(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.taxhubService.getTaxonDetail(id).subscribe(
      data => {
        this.taxon = data;
      }
    );
    this.floraOccitaniaService.getTaxonDetail(id).subscribe(
      data => {
        this.nomVerns = data.items[0];
      }
    );
  }

}
