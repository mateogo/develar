import { Component, Input } from '@angular/core';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class A2CardComponent {
  @Input() title: string = '';
  @Input() bgColor: string = '';
  @Input() customBgColor: string = '';
  @Input() color: string = '';
  @Input() customColor: string = '';
  @Input() bgImage: string = '';
  @Input() outline: boolean = false;
  @Input() indents: any = '1.57143rem';
  @Input() align: string = 'left';
}