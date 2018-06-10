import { Component, Input } from '@angular/core';
import { Item } from './item';

@Component({
  moduleId: module.id,
  selector: 'a2-breadcrumb',
  templateUrl: 'breadcrumb.component.html',
  styleUrls: ['breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  @Input() menu: Item[] = [];
  @Input() separator: string = '/';
  @Input() style: string = 'default';//custom1 | custom2

  getClasses() {
    return {
      'custom-1': this.style === 'custom1',
      'custom-2': this.style === 'custom2'
    };
  }
}