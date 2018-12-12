import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

// import * as fromBooks from '@example-app/books/reducers';
// import { SelectedBookPageActions } from '@example-app/books/actions';
import { Antecedente } from '../model/antecedente';


@Component({
  selector: 'antecedente-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './ant-detail-page.component.html',
  styleUrls: ['./ant-detail-page.component.scss']
})
export class AntDetailPageComponent {
	public antecedente$: Observable<Antecedente>;
	public isSelectedAntecedenteInCollection: Observable<boolean>;

  constructor(
  	//private store: Store

  	) { }

  ngOnInit() {
  }

}
