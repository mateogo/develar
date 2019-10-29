import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';
import { Subject } from 'rxjs';

import { RolNocturnidad, RolNocturnidadItem, UpdateRolEvent }    from '../../timebased.model';

import { TimebasedController } from '../../timebased-controller';

const LIST = '../';
const EDIT = '../';

@Component({
  selector: 'rol-noche-page',
  templateUrl: './rol-noche-page.component.html',
  styleUrls: ['./rol-noche-page.component.scss']
})
export class RolNochePageComponent implements OnInit {

	pageTitle: string = 'Gestión de eventos nocturnos';

	public model: RolNocturnidad = new RolNocturnidad();
  public model$ = new Subject<RolNocturnidad>();

  public rolnocturnidadList: RolNocturnidad[] = [];

  private modelId: string;

  constructor(
    private tbCtrl: TimebasedController,
    private router: Router,
    private route: ActivatedRoute,
  	) { 
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id')

    this.updateTableList();

    this.model$.next(this.model);
  }

  
  updateRolnocturnidadList(event: UpdateRolEvent){
    this.tbCtrl.refreshTableData();
  }

  updateTableList(){
    let query = {};
    this.tbCtrl.fetchRolnocturnidadDataSource(query).subscribe(list => {
      this.rolnocturnidadList = list || [];
    })
  }


  actionTriggered(e){
    if(e === "editone"){
      this.editOneKit()
      
    } else if(e === "deleteone"){
      this.deleteOneKit()

    }
  }

  editOneKit(){
  }  

  deleteOneKit(){
  }  

}
