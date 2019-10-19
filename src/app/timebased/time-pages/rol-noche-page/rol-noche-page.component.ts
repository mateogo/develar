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
    console.log('ROL-NOCH-PAGE')
    let id = this.route.snapshot.paramMap.get('id')

    console.log('Rol Nocturnidad INIT [%s]', id)

    this.updateTableList();

    this.model$.next(this.model);
  }

  
  updateRolnocturnidadList(event: UpdateRolEvent){
    console.log('RolNoche Page BUBLED updateRolNocturnidad [%s]', event.items && event.items.length);
    console.log('updatePAGE: [%s]', event.token === this.rolnocturnidadList[0])

    this.tbCtrl.refreshTableData();
  }

  updateTableList(){
    let query = {};
    this.tbCtrl.fetchRolnocturnidadDataSource(query).subscribe(list => {
      console.log('udate Table list [%s]', list && list.length);
      this.rolnocturnidadList = list || [];
    })
  }


  actionTriggered(e){
    console.log('actionTrieggered [%s]', e)
    if(e === "editone"){
      this.editOneKit()
      
    } else if(e === "deleteone"){
      this.deleteOneKit()

    }
  }

  editOneKit(){
    // let kit:RolNocturnidad[] = this.tbCtrl.fetchSelectedProductKitList();
    // console.log('EditONE: kit list [%s]', kit , kit&&kit.length)
    // if(kit && kit.length){
    //   this.model = kit[0];
    //   this.model$.next(this.model);
    // }
  }  

  deleteOneKit(){
  //   let kit:RolNocturnidad[] = this.tbCtrl.fetchSelectedProductKitList();
  //   console.log('DeleteONE: kit list [%s]', kit , kit&&kit.length)
  //   if(kit && kit.length){
  //     this.tbCtrl.deleteKit(kit[0]._id);
  //     setTimeout(()=>{
  //       this.updateTableList();
  //     },1000);
  //   }
  }  

}
