import { Component, OnInit, Input } from '@angular/core';

import { RecordCard, SubCard, CardGraphAsset } from '../../recordcard.model';
import { GraphUtils } from '../../recordcard-helper';

const NOLISTAR = ['mainimage'];
const ENTITY_TYPE = 'resource';

@Component({
  selector: 'show-resources',
  templateUrl: './show-resources.component.html',
  styleUrls: ['./show-resources.component.scss']
})
export class ShowResourcesComponent implements OnInit {
	@Input() models:CardGraphAsset[];
	public title = 'Enlaces y referencias';
	public subtitle = '';


  constructor() { }

  ngOnInit() {
  }

  getPredicateLabel(item){
  	return GraphUtils.getPredicateLabel(ENTITY_TYPE, item);
  }

}
