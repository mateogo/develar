import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CardGraph, predicateType, graphUtilities, predicateLabels } from '../../asset-helper';
import { Asset } from '../../develar-entities';

@Component({
  selector: 'asset-predicate',
  templateUrl: './asset-predicate.component.html',
  styleUrls: ['./asset-predicate.component.scss']
})
export class AssetPredicateComponent implements OnInit {
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
  	this.predicateOptions = graphUtilities.getPredicateOptions(this.entityType)
    this.currencyList =  graphUtilities.getCurrencies();
  }

  editToken(){
  	this.openEditor = !this.openEditor;
  }

  getPredicateLabel(item){
  	return graphUtilities.getPredicateLabel(this.entityType, item);
  }

  updatePersonEntity(entity){
    this.token.displayAs = entity.displayName;
    this.token.entityId = entity._id;
    this.token.slug = graphUtilities.getProfesionesLabel(entity.tprofesion);
    this.token.description = entity.especialidad;

    return ;

  }
  
  updateProductEntity(entity){
    this.token.displayAs = entity.name;
    this.token.entityId = entity._id;
  }

  updateResourceEntity(){
    if(!this.token.displayAs){
      this.token.displayAs = this.token.entityId
    }
  }

  updateAssetEntity(asset: Asset){
    this.token.displayAs = asset.assetId;
    this.token.slug     = asset.slug;
    this.token.entityId = asset._id;
    this.token.description     = asset.description;
  }

  updateImageEntity(asset: Asset){
    this.token.displayAs = asset.assetId;
    this.token.slug     = asset.slug;
    this.token.entityId = asset._id;
    this.token.description     = asset.description;
  }


  removeToken(token: CardGraph){
    this.deleteToken.emit(token);
  }
  
  changeMoneda(mon){

  }

}
