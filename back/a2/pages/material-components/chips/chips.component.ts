import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';
import { MatChipInputEvent } from '@angular/material';

const COMMA = 188;
const ENTER = 13;

@Component({
  moduleId: module.id,
  selector: 'page-chips',
  templateUrl: 'chips.component.html',
  styleUrls: ['chips.component.scss']
})
export class PageChipsComponent implements OnInit {
  pageTitle: string = 'Chips';
  color: string;

  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];
  availableColors = [
    { name: 'Default', color: 'default' },
    { name: 'Primary', color: 'primary' },
    { name: 'Accent', color: 'accent' },
    { name: 'Warning', color: 'warn' }
  ];

  fruits = [
    { name: 'Lemon' },
    { name: 'Lime' },
    { name: 'Apple' },
  ];

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our person
    if ((value || '').trim()) {
      this.fruits.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    let index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }

  }

  ngOnInit() {}
}
