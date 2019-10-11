import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'form-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.css']
})
export class MultiselectComponent implements OnInit {
  public selectedItems = [];
  public searchControl = new FormControl();
  public formControlValue = [];
  public savedValues = [];
  @Input() parentFormControl: FormControl;
  // ** Valeurs à afficher dans la liste déroulante. Doit être un tableau de dictionnaire */
  @Input() values: Array<any>;
  /**
   * Clé du dictionnaire de valeur que le composant doit prendre pour l'affichage de la liste déroulante
   */
  @Input() keyLabel: Array<string>;
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


  constructor() {}

  // Component to generate a custom multiselect input with a search bar (which can be disabled)
  // you can pass whatever callback to the onSearch output, to trigger database research or simple search on an array

  ngOnInit() {
    this.debounceTime = this.debounceTime || 100;
    this.disabled = this.disabled || false;
    this.searchBar = this.searchBar || false;
    this.displayAll = this.displayAll || false;


    this.values.forEach((value, i, array)  => {
      const displayValue = [];
      Object.keys(value).map( key => {
        if (this.keyLabel.includes(key)) {
          displayValue[this.keyLabel.indexOf(key)] = value[key];
        }
      });
      displayValue.filter(v => {if (v) { return v; }});

      this.values[i]['displayValue'] = displayValue.join('-');
    });


    // sort by value
    // TODO enable customisation by user
    this.values.sort((a, b) => {
      return a.displayValue.localeCompare(b.displayValue);
    });

    if (this.values && this.parentFormControl.value) {
      this.values.forEach(value => {
        if (this.parentFormControl.value.indexOf(value[this.keyValue]) !== -1) {
          this.selectedItems.push(value);
          this.formControlValue.push(value[this.keyValue]);
        }
      });
    }

    // remove doublon in the dropdown lists
    this.removeDoublon();

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
      return curItem['displayValue'] !== item['displayValue'];
    });

    // set the item for the formControl
    const updateItem = item[this.keyValue];

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
      return curItem['displayValue'] !== item['displayValue'];
    });
    // disable event propagation
    $event.stopPropagation();
    // push the element in the items list
    this.values.push(item);

    this.selectedItems = this.selectedItems.filter(curItem => {
      return curItem['displayValue'] !== item['displayValue'];
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
