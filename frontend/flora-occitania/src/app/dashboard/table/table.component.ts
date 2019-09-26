import { Component, OnInit } from '@angular/core';

import {FloraOccitaniaService, TaxonList} from "../../services/flora-occitania.service"
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  taxonlist:TaxonList[];

  constructor(
    private floraOccitaniaService:FloraOccitaniaService
  ) { }

  ngOnInit() {
    this.floraOccitaniaService.getConcernedTaxon().subscribe(
      list => {
        this.taxonlist = list.items; 
      }
    )
  }

}
