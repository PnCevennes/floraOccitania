import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl} from "@angular/forms";

import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import {FloraOccitaniaService, TaxonList} from "../../services/flora-occitania.service"
import {TaxhubService} from "../../services/taxhub.service"
import {NomenclatureService} from "../../services/nomenclature.service"


@Component({
  selector: 'app-form-ethnobota',
  templateUrl: './form-ethnobota.component.html',
  styleUrls: ['./form-ethnobota.component.css']
})
export class FormEthnobotaComponent implements OnInit {

  taxon:any;
  nomenclature_localisation:Array<any>;
  nomenclature_usages:Array<any>;
  nomenclature_partie_pl:Array<any>;
  test =  new FormControl([])

  nomVernForm = this.formBuilder.group({
    nomVerns: this.formBuilder.array([])
  });

  constructor(
    private floraOccitaniaService:FloraOccitaniaService,
    private taxhubService:TaxhubService,
    private nomenclatureService:NomenclatureService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.getTaxon();
    this.getNomenclature();
  }

  getNomenclature():void{
    this.nomenclatureService.getNomenclature('FO_LOCALISATION').subscribe(
      data =>{
        this.nomenclature_localisation = data.values;
      }
    );
    this.nomenclatureService.getNomenclature('FO_USAGE').subscribe(
      data =>{
        this.nomenclature_usages = data.values;
      }
    );

    this.nomenclatureService.getNomenclature('FO_PARTIE_PLANTE').subscribe(
      data =>{
        this.nomenclature_partie_pl = data.values;
      }
    )
  }

  getTaxon():void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.floraOccitaniaService.getTaxonDetail(id).subscribe(
      data => {
        this.taxon = data.items[0];
        let control = <FormArray>this.nomVernForm.controls.nomVerns;
        if ('noms_occitan' in this.taxon){
          this.taxon['noms_occitan'].forEach(x => {
            let ctl = this.getNewNomVern();
            ctl.patchValue(x);
            control.push(ctl)
          })
        }
      }
    )
  }

  getNewNomVern():FormGroup{
    return this.formBuilder.group({
      nom_vernaculaire: [''],
      commentaire: [''],
      cd_ref: [''],
      localisations: new FormControl([]),
      usages: new FormControl([]),
      parties_utilisees: new FormControl([])
    })
  }

  addNewNomVern():void{
    if (this.taxon) {
      let control = <FormArray>this.nomVernForm.controls.nomVerns;
      control.push(
        this.formBuilder.group({
          nom_vernaculaire: [''],
          commentaire: [''],
          cd_ref: [this.taxon.cd_ref],
          localisations: new FormControl([]),
          usages: new FormControl([]),
          parties_utilisees: new FormControl([])
        })
      )
    }
    else {
      console.log("Taxon non connu");
    }
  }

  deleteNomVern(index):void{
    let control = <FormArray>this.nomVernForm.controls.nomVerns;
    control.removeAt(index)
  }

  submit(){
    // Send new nom_verns
    this.floraOccitaniaService.postNomVern(
      this.taxon.cd_ref,
      this.nomVernForm.value.nomVerns
     ).subscribe(
       data=>{
          this.router.navigate([`/detail/${this.taxon.id_nom}`]);
          console.log(data);
       }
     );
  }
}
