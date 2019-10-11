import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-foreignkey-array',
  templateUrl: './display-foreignkey-array.component.html',
  styleUrls: ['./display-foreignkey-array.component.css']
})
export class DisplayForeignkeyArrayComponent implements OnInit {
  @Input() valuesRef: Array<any>;
  @Input() valuesIds: Array<any>;
  @Input() keyLabel: Array<string>;
  @Input() keyValue: string;

  toDisplay: Array<any> = [];
  constructor() { }

  ngOnInit() {
    if (this.valuesIds) {
      this.toDisplay = this.valuesRef.filter(
        val => {
          return this.valuesIds.includes(val[this.keyValue]);
        }
      );

      this.toDisplay.forEach((value, i, array) => {
        const displayValue = [];
        Object.keys(value).map( key => {
          if (this.keyLabel.includes(key)) {
            displayValue[this.keyLabel.indexOf(key)] = value[key];
          }
        });
        displayValue.filter(v => {if (v) { return v; }});

        this.toDisplay[i]['displayValue'] = displayValue.join(' - ');
      });

      this.toDisplay.sort((a, b) => {
        return a.displayValue.localeCompare(b.displayValue);
      });
    }
  }

}
