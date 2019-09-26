import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl} from "@angular/forms";

import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import {FloraOccitaniaService, TaxonList} from "../../services/flora-occitania.service";
import {TaxhubService} from "../../services/taxhub.service";


@Component({
  selector: 'app-form-ethnobota',
  templateUrl: './form-ethnobota.component.html',
  styleUrls: ['./form-ethnobota.component.css']
})
export class FormEthnobotaComponent implements OnInit {

  taxon: any;
  sources: Array<any>;

  nomVernForm = this.formBuilder.group({
    commentaire_general: [''],
    nomVerns: this.formBuilder.array([])
  });

  constructor(
    private floraOccitaniaService: FloraOccitaniaService,
    private taxhubService: TaxhubService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.getTaxon();
    this.floraOccitaniaService.getSources().subscribe(
      data => {
        this.sources = data.items;
      }
    );
  }


  getTaxon(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.floraOccitaniaService.getTaxonDetail(id).subscribe(
      data => {
        this.taxon = data.items[0];
        const control = <FormArray> this.nomVernForm.controls.nomVerns;
        this.nomVernForm.controls.commentaire_general.setValue(
          this.taxon["commentaire_general"]
        );
        if ('noms_occitan' in this.taxon){
          this.taxon["noms_occitan"].forEach(x => {
            const ctl = this.getNewNomVern();
            ctl.patchValue(x);
            control.push(ctl);
          });
        }
      }
    )
  }

  getNewNomVern(): FormGroup{
    return this.formBuilder.group({
      nom_vernaculaire: ['', Validators.required],
      commentaire_nom: [''],
      cd_ref: [''],
      localisations: new FormControl([]),
      usages: new FormControl([]),
      parties_utilisees: new FormControl([]),
      commentaire_usage: [''],
      id_source: [''],
      source_pages: ['']
    });
  }

  addNewNomVern():void{
    if (this.taxon) {
      let control = <FormArray>this.nomVernForm.controls.nomVerns;
      let newNomVern = this.getNewNomVern();
      newNomVern.controls.cd_ref.setValue(this.taxon.cd_ref);
      control.push(newNomVern);
    } else {
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
      this.nomVernForm.value
     ).subscribe(
       data => {
          this.router.navigate([`/detail/${this.taxon.id_nom}`]);
          console.log(data);
       }
     );
  }
}
