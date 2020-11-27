import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardGraph } from '../../../develar-commons/asset-helper';

@Component({
  selector: 'documentacion-panel',
  templateUrl: './documentacion-card-panel.component.html',
  styleUrls: ['./documentacion-card-panel.component.scss']
})
export class DocumentacionCardPanelComponent implements OnInit {

  @Input() assets : CardGraph[];
  @Output() onDeleteCard = new EventEmitter<CardGraph>();
  constructor() { }

  ngOnInit(): void {
  }

  deleteCard(card : CardGraph) {
    this.onDeleteCard.emit(card);
  }

}
