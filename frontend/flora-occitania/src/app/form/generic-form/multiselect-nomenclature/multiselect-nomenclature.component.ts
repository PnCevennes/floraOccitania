import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import {debounceTime, distinctUntilChanged} from "rxjs/operators";

import { NomenclatureService } from 'src/app/services/nomenclature.service';

@Component({
  selector: 'app-multiselect-nomenclature',
  templateUrl: './multiselect-nomenclature.component.html',
  styleUrls: ['./multiselect-nomenclature.component.css']
})
export class MultiselectNomenclatureComponent implements OnInit {
  public selectedItems = [];
  public searchControl = new FormControl();
  public formControlValue = [];
  public savedValues = [];
  public values = [];
  
  @Input() parentFormControl: FormControl;
  //** Valeurs à afficher dans la liste déroulante. Doit être un tableau de dictionnaire */
  @Input() codeNomenclature:string;
  /**
   * Clé du dictionnaire de valeur que le composant doit prendre pour l'affichage de la liste déroulante
   */
  @Input() keyLabel: string;
  /** Clé du dictionnaire que le composant doit passer au formControl */
  @Input() keyValue: string;
  /**              Est-ce que le composant doit afficher l'item "tous" dans les options du select ?  */
  @Input() displayAll: boolean;
  // enable the search bar when dropdown
  @Input() searchBar: boolean;
  // disable the input
  @Input() disabled: boolean;
  // label displayed above the input
  @Input() fieldLabel: any;

  // time before the output are triggered
  @Input() debounceTime: number;
  @Output() onSearch = new EventEmitter();
  @Output() onChange = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  constructor(private nomenclatureService:NomenclatureService) {}

  // Component to generate a custom multiselect input with a search bar (which can be disabled)
  // you can pass whatever callback to the onSearch output, to trigger database research or simple search on an array

  ngOnInit() {
    this.debounceTime = this.debounceTime || 100;
    this.disabled = this.disabled || false;
    this.searchBar = this.searchBar || false;
    this.displayAll = this.displayAll || false;


    this.nomenclatureService.getNomenclature(this.codeNomenclature).subscribe(
      data =>{
        this.values = data.values;// set the value
        if (this.values && this.parentFormControl.value) {
          this.values.forEach(value => {
            if (this.parentFormControl.value.indexOf(value[this.keyValue]) !== -1) {
              this.selectedItems.push(value);
            }
          });
        }
  
        // remove doublon in the dropdown lists
        this.removeDoublon();
      }
    );

    this.parentFormControl.valueChanges.subscribe(value => {
      // filter the list of options to not display twice an item
      if (value === null) {
        this.selectedItems = [];
        this.formControlValue = [];
        this.values = this.savedValues;
      } else {
        if (this.selectedItems.length === 0) {
          value.forEach(item => {
            this.selectedItems.push(item);
            this.formControlValue.push(item);
          });
        }
      }
    });
  }

  addItem(item) {
    // remove element from the items list to avoid doublon
    this.values = this.values.filter(curItem => {
      return curItem[this.keyLabel] !== item[this.keyLabel];
    });

    // set the item for the formControl
    let updateItem = item[this.keyValue];

    this.selectedItems.push(item);
    this.formControlValue.push(updateItem);
    // set the item for the formControl
    this.parentFormControl.patchValue(this.formControlValue);

    this.searchControl.reset();
    this.onChange.emit(item);
  }

  removeItem($event, item) {
    // remove element from the items list to avoid doublon
    this.values = this.values.filter(curItem => {
      return curItem[this.keyLabel] !== item[this.keyLabel];
    });
    // disable event propagation
    $event.stopPropagation();
    // push the element in the items list
    this.values.push(item);

    this.selectedItems = this.selectedItems.filter(curItem => {
      return curItem[this.keyLabel] !== item[this.keyLabel];
    });

    this.formControlValue = this.formControlValue.filter(el => {
      return el !== item[this.keyValue];
    });

    this.parentFormControl.patchValue(this.formControlValue);

    this.onDelete.emit(item);
  }

  removeDoublon() {
    if (this.values && this.parentFormControl.value) {
      this.values = this.values.filter(v => {
        let isInArray = false;

        this.parentFormControl.value.forEach(element => {
          if (v[this.keyValue] === element) {
            isInArray = true;
          }
        }); 
        return !isInArray;
      });
    }
  }

}
