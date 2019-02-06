import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CardGraph, predicateType, graphUtilities } from '../cardgraph.helper';
import { Asset } from '../../develar-commons/develar-entities';
@Component({
  selector: 'card-graph',
  templateUrl: './cardgraph.component.html',
  styleUrls: ['./cardgraph.component.scss']
})
export class CardgraphComponent implements OnInit {
	@Input() entityType: string;
	@Input()
		get graphToken(){
			return this.token;
		}
		set graphToken(token: CardGraph){
			this.token = token;
		}

  @Output() deleteToken: EventEmitter<CardGraph> = new EventEmitter<CardGraph>();

	public token: CardGraph = {
		displayAs:   "Capital Beto",
		slug:        "Es el autor del principito",
		predicate:   "autor",
    avatar:      "assets/content/avatar-1.jpg",
    description: "",
    entityId:    "10101",
    entity:      "person"
	}
	public openEditor = false;
	private predicateOptions: Array<any>;
  private currencyList:Array<any> = [];

  constructor() { }

  ngOnInit() {
  	//console.log('CardgraphCOmponent INIT: [%s]', this.entityType)
  	this.predicateOptions = graphUtilities.getPredicateOptions(this.entityType)
    this.currencyList =  graphUtilities.getCurrencies();
  }

  editToken(){
  	console.log('ready to Edit');
  	this.openEditor = !this.openEditor;
  }

  getPredicateLabel(item){
  	return graphUtilities.getPredicateLabel(this.entityType, item);
  }

  updatePersonEntity(entity){
    console.log('updateEntity BUBLED: [%s] [%s]', entity._id, entity.displayName);
    this.token.displayAs = entity.displayName;
    this.token.entityId = entity._id;
    this.token.slug = graphUtilities.getProfesionesLabel(entity.tprofesion);
    this.token.description = entity.especialidad;

    return ;

  }
  
  updateProductEntity(entity){
    console.log('updateEntity BUBLED:  [%s][%s] [%s]',entity.entity,  entity._id, entity.displayName);
    this.token.displayAs = entity.name;
    this.token.entityId = entity._id;
  }

  updateResourceEntity(){
    console.log('update Resource Entity [%s]', this.token.displayAs);
    if(!this.token.displayAs){
      this.token.displayAs = this.token.entityId
    }
  }

  updateAssetEntity(asset: Asset){
    console.log('Asset promoted: [%s]', asset.slug)
    this.token.displayAs = asset.assetId;
    this.token.slug     = asset.slug;
    this.token.entityId = asset._id;
    this.token.description     = asset.description;
  }

  updateImageEntity(asset: Asset){
    console.log('Image promoted: [%s]', asset.slug)
    this.token.displayAs = asset.assetId;
    this.token.slug     = asset.slug;
    this.token.entityId = asset._id;
    this.token.description     = asset.description;
  }


  removeToken(token: CardGraph){
    console.log('delete token: [%s]', token.displayAs);
    this.deleteToken.emit(token);
  }
  
  changeMoneda(mon){
    console.log('change Moneda: [%s]', mon);
  }

}
