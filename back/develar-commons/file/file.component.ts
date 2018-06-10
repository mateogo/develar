import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'file',
  templateUrl: 'file.component.html',
  styleUrls: ['file.component.scss']
})
export class FileComponent {
  @Input() title: string = 'no-name';
  @Input() type: string = '*';
  @Input() image: string = '';
  @Input() size: string = 'normal';
  @Input() delete: boolean = false;
  @Input() spinner: boolean = false;
  @Input() link: any = false;
}