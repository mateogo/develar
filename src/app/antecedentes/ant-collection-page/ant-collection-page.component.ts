import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Antecedente, AntecedenteTable } from '../model/antecedente';
import { ModelHelper } from '../model/antecedentes-helper';

import { DaoService } from '../../develar-commons/dao.service';

//import { CollectionPageActions } from '@example-app/books/actions';
//import * as fromBooks from '@example-app/books/reducers';

@Component({
  selector: 'ant-collection-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  /**
   * Container components are permitted to have just enough styles
   * to bring the view together. If the number of styles grow,
   * consider breaking them out into presentational
   * components.
   */
  templateUrl: './ant-collection-page.component.html',
  styleUrls: ['./ant-collection-page.component.scss']

})
export class AntCollectionPageComponent implements OnInit {
  antecedentes$: BehaviorSubject<Antecedente[]> = new BehaviorSubject([]);
  tableActions = ModelHelper.tableActions;

  constructor(
  	private daoService:DaoService
  	//private store: Store<fromBooks.State>
  	) {
    //this.antecedentes$ = store.pipe(select(fromBooks.getBookCollection));
  }

  ngOnInit() {
    //this.store.dispatch(new CollectionPageActions.LoadCollection());
    this.daoService.fetchAll<Antecedente>('antecedente').subscribe(records => {
    	console.log('fetchAll [%s]',records.length);
    	this.antecedentes$.next(records);
    })  
  }
}
