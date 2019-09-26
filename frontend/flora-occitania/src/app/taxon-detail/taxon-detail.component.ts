import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {FloraOccitaniaService, TaxonList} from "../services/flora-occitania.service"
import {TaxhubService} from "../services/taxhub.service"
import { NomenclatureService } from '../services/nomenclature.service';


@Component({
  selector: 'app-taxon-detail',
  templateUrl: './taxon-detail.component.html',
  styleUrls: ['./taxon-detail.component.css']
})
export class TaxonDetailComponent implements OnInit {

  taxon:TaxonList;
  nomVerns:any;
  nomenclatureValue = {
    'FO_LOCALISATION': [],
    'FO_USAGE': [],
    'FO_PARTIE_PLANTE': []
  };

  constructor(
    private floraOccitaniaService:FloraOccitaniaService,
    private taxhubService:TaxhubService,
    private route: ActivatedRoute,
    private nomenclatureService: NomenclatureService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getTaxon();
    this.getNomenclature();
  }

  getTaxon():void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.taxhubService.getTaxonDetail(id).subscribe(
      data => {
        this.taxon = data;
      }
    )
    this.floraOccitaniaService.getTaxonDetail(id).subscribe(
      data => {
        this.nomVerns = data.items[0];
      }
    )
  }

  getNomenclature():void{
    Object.keys(this.nomenclatureValue).forEach(codeNomenclature => {
      this.nomenclatureService.getNomenclature(codeNomenclature).subscribe(
        data => {
          this.nomenclatureValue[codeNomenclature] = data.values;
        }
      );
    });
  }
}
