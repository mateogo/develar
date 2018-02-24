import { Component, OnInit, Input, Output, OnChanges, HostListener, EventEmitter } from '@angular/core';
import { CardGraphProduct, predicateType, graphUtilities } from '../../cardgraph.helper';

import { WorkGroupController } from '../workgroup.controller';

/*****
<product-graph *ngFor="let entity of entities" 
      [entityType]='entityType'
      (deleteToken)='deleteToken($event)'
      [graphToken]='entity'>
        
@Input: entityType = 'product'
@Input: graphToken: CardGraphProduct

@Output: deleteToken: EventEmitter<CardGraphProduct>
*****/

@Component({
  selector: 'product-graph',
  templateUrl: './productgraph.component.html',
  styleUrls: ['./productgraph.component.scss']
})
export class ProductgraphComponent implements OnInit, OnChanges {
	@Input() entityType: string;
	@Input()
		get graphToken(): CardGraphProduct{
			return this.token;
		}
		set graphToken(token: CardGraphProduct){
			this.token = token;
		}

  @Output() deleteToken: EventEmitter<CardGraphProduct> = new EventEmitter<CardGraphProduct>();
  @Output() clearToken: EventEmitter<CardGraphProduct> = new EventEmitter<CardGraphProduct>();

	public token: CardGraphProduct ;
	public openEditor = false;
	private predicateOptions: Array<any>;
  private currencyList:Array<any> = [];
  private fumeList:Array<any> = [];


  constructor(private workgroupCtrl: WorkGroupController) { }

  ngOnInit() {
  	this.predicateOptions = graphUtilities.getPredicateOptions(this.entityType)
    this.currencyList =  graphUtilities.getCurrencies();
    this.fumeList =  graphUtilities.getFumelist();
  }

  ngOnChanges(){
    //console.log('******************  ngOnChanges;')
  }


  @HostListener('mouseleave') onMouseLeave() {
      this.workgroupCtrl.dirty = true;
  }



  editToken(){
  	this.openEditor = !this.openEditor;
    if(!this.openEditor){
      this.workgroupCtrl.getProductList();
    }
  }

  getPredicateLabel(item){
  	return graphUtilities.getPredicateLabel(this.entityType, item);
  }

  updateProductEntity(entity){
    if(entity){
      this.token.displayAs = this.token.displayAs || entity.name;
      this.token.entityId = entity._id || "";
      this.token.ume = entity.pume;
    }
  }

  removeToken(token: CardGraphProduct){
    this.deleteToken.emit(token);
  }

  removeEditor(token: CardGraphProduct){
    this.clearToken.emit(token);
  }
  
  changeMoneda(mon){
    //console.log('change Moneda: [%s]', mon);
  }

  changeFume(fume){    
  }

  validDate(datex){
    this.token.fenec = graphUtilities.dateFromTx(datex);
    this.token.fenectx = graphUtilities.txFromDate(this.token.fenec);
  }

}
