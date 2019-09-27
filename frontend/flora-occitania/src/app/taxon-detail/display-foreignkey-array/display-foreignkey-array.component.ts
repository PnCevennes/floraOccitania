import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-foreignkey-array',
  templateUrl: './display-foreignkey-array.component.html',
  styleUrls: ['./display-foreignkey-array.component.css']
})
export class DisplayForeignkeyArrayComponent implements OnInit {
  @Input() valuesRef: Array<any>;
  @Input() valuesIds: Array<int>;
  @Input() keyLabel: string;
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
    }
  }

}
