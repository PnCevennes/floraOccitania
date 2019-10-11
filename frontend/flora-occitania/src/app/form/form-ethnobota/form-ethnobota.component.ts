import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import {FloraOccitaniaService, TaxonList} from '../../services/flora-occitania.service';
import {NomenclatureService} from '../../services/nomenclature.service';
import {TaxhubService} from '../../services/taxhub.service';

@Component({
  selector: 'app-form-ethnobota',
  templateUrl: './form-ethnobota.component.html',
  styleUrls: ['./form-ethnobota.component.css']
})
export class FormEthnobotaComponent implements OnInit {

  taxon: any;
  sources: Array<any>;
  // Nom des popriétés à exclure lors de la duplucation de formulaire
  excludeValues: Array<string> = ['nom_vernaculaire', 'commentaire_nom'];
  nomVernForm = this.formBuilder.group({
    commentaire_general: [''],
    nomVerns: this.formBuilder.array([])
  });

  constructor(
    public floraOccitaniaService: FloraOccitaniaService,
    public nomenclatureService: NomenclatureService,
    public taxhubService: TaxhubService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.getTaxon();
  }

  getNomVernForm(): FormArray {
    return  this.nomVernForm.controls.nomVerns as FormArray;
  }

  getTaxon(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.floraOccitaniaService.getTaxonDetail(id).subscribe(
      data => {
        this.taxon = data.items[0];
        const control = this.getNomVernForm();
        this.nomVernForm.controls.commentaire_general.setValue(
          this.taxon.commentaire_general
        );
        if ('noms_occitan' in this.taxon){
          this.taxon.noms_occitan.forEach(x => {
            const ctl = this.getNewNomVern();
            ctl.patchValue(x);
            control.push(ctl);
          });
        }
      }
    );
  }

  getNewNomVern(): FormGroup {
    return this.formBuilder.group({
      nom_vernaculaire: ['', Validators.required],
      commentaire_nom: [''],
      cd_ref: [''],
      localisations: new FormControl([]),
      usages: new FormControl([]),
      parties_utilisees: new FormControl([]),
      commentaire_usage: [''],
      id_sources: new FormControl([])
    });
  }

  addNewNomVern(): void {
    if (this.taxon) {
      const control = this.getNomVernForm();
      let newNomVern = this.getNewNomVern();
      newNomVern = this.populateNomVernForm(
        newNomVern,
        {cd_ref: this.taxon.cd_ref}
      );
      control.push(newNomVern);
    } else {
      console.log('Taxon non connu');
    }
  }

  populateNomVernForm(form: FormGroup, values: {}): FormGroup {
    Object.entries(values).forEach(
      ([key, val]) => {
        form.controls[key].setValue(val);
      }
    );
    return form;
  }

  deleteNomVern(index): void {
    const control = this.getNomVernForm();
    control.removeAt(index);
  }

  duplicateNomVern(index): void {
    const control = this.getNomVernForm();

    const toClone = control.at(index) as FormGroup;
    let newNomVern = this.getNewNomVern();

    let values = {};

    Object.keys(toClone.controls).forEach(key => {
      if ( ! this.excludeValues.includes(key) ) {
        values[key] = toClone.controls[key].value;
      }
    });

    newNomVern = this.populateNomVernForm(
      newNomVern,
      values
    );
    control.push(newNomVern);
  }

  submit(): void {
    // Send new nom_verns
    this.floraOccitaniaService.postNomVern(
      this.taxon.cd_ref,
      this.nomVernForm.value
     ).subscribe(
       data => {
          this.router.navigate([`/detail/${this.taxon.id_nom}`]);
       }
     );
  }
}
