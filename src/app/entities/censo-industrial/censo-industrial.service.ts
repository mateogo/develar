import { Injectable } from '@angular/core';
import { DaoService } from '../../develar-commons/dao.service';

@Injectable({
  providedIn: 'root'
})
export class CensoIndustrialService {
  constructor(
    private dao: DaoService
  ) { }


}
