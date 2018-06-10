import { Component, OnInit, Input } from '@angular/core';

import { RecordCard, SubCard, CardGraphAsset } from '../../recordcard.model';
import { GraphUtils } from '../../recordcard-helper';

const NOLISTAR = ['mainimage'];
const ENTITY_TYPE = 'asset';

@Component({
  selector: 'show-assets',
  templateUrl: './show-assets.component.html',
  styleUrls: ['./show-assets.component.scss']
})
export class ShowAssetsComponent implements OnInit {
	@Input() models:CardGraphAsset[];
	public title = 'Recursos relacionados';
	public subtitle = '';


  constructor() { }

  ngOnInit() {
  }

  getPredicateLabel(item){
  	return GraphUtils.getPredicateLabel(ENTITY_TYPE, item);
  }

}
