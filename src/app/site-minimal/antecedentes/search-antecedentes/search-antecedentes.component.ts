import { Component, OnInit, Input } from '@angular/core';
import {Observable, Subject } from 'rxjs';

import { Antecedente, ImputacionInfracciones, antecedenteDefaultFactory } from '../../../antecedentes/model/antecedente';
import { ModelHelper } from '../../../antecedentes/model/antecedentes-helper';
import { devutils } from '../../../develar-commons/utils';

import { DaoService } from '../../../develar-commons/dao.service';

@Component({
  selector: 'antecedentes-ciudadano',
  templateUrl: './search-antecedentes.component.html',
  styleUrls: ['./search-antecedentes.component.scss']
})
export class SearchAntecedentesComponent implements OnInit {
	@Input() antecedentes: Antecedente[];

  constructor(
      private daoService: DaoService

  	) { }

  ngOnInit() {



  }

}
