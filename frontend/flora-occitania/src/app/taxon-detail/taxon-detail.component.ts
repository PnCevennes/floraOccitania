import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {FloraOccitaniaService, TaxonList} from "../services/flora-occitania.service"
import {TaxhubService} from "../services/taxhub.service"


@Component({
  selector: 'app-taxon-detail',
  templateUrl: './taxon-detail.component.html',
  styleUrls: ['./taxon-detail.component.css']
})
export class TaxonDetailComponent implements OnInit {

  taxon:TaxonList

  constructor(
    private floraOccitaniaService:FloraOccitaniaService,
    private taxhubService:TaxhubService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.getTaxon();
    
  }

  getTaxon():void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.taxhubService.getTaxonDetail(id).subscribe(
      data => {
        this.taxon = data; 
      }
    )
  }
}
