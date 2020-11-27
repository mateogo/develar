import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CardGraph } from '../../../develar-commons/asset-helper';
import { NotificationService } from '../../../develar-commons/notifications.service';
import { Person } from '../../../entities/person/person';
import { PersonService } from '../../../entities/person/person.service';
import { UserWeb } from '../../../entities/user-web/user-web.model';
import { UserWebService } from '../../../entities/user-web/user-web.service';
import { UserService } from '../../../entities/user/user.service';

@Component({
  selector: 'app-documentacion-card-modal',
  templateUrl: './documentacion-card-modal.component.html',
  styleUrls: ['./documentacion-card-modal.component.scss']
})
export class DocumentacionCardModalComponent implements OnInit {

  showView: boolean = false;
  showEditor : boolean = false;
  form: FormGroup;
  url : string;
  asset : CardGraph;
  person : Person;
  constructor(public dialogRef: MatDialogRef<DocumentacionCardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _notificationService : NotificationService,
    private _personService : PersonService,
    private _userService : UserService) {

    this.asset = this.data.asset;
    
    if(this.data.isEdit){
      this.showEditor = true;
      this.showView = false;
      this.initGroup();
      
    }else{

      this.url = '../../../../../download/'+this.asset.entityId;
      this.showView = true;
    }
  }

  private initGroup(){
    this.form = this.fb.group({
      description: [this.asset ? this.asset.description : null, Validators.required],
    });
  }

  ngOnInit(): void {
    
   let user : UserWeb = new UserWeb();
   let userN = this._userService.currentUser;
   Object.assign(user, userN);
   this._personService.fetchPersonByUserWeb(user).subscribe(person => {
     this.person = person[0];
   });
  }


  onSubmit() {
      this.saveRecord();
  }

  //TENER EN CUENTA QUE CUANDO GRABE TIENE QUE EDITAR ESTO EN LA COLECCIÓN DE PERSONAS
  saveRecord(){
    
    this.asset = initForSave(this.form, this.asset);
    let as = this.person.assets.find( a => a.entityId === this.asset.entityId);
    this.person.assets.splice(this.person.assets.indexOf(as),1);
    this.person.assets.push(this.asset);
    this._personService.update(this.person).then( person => {
      this._notificationService.success("Grabación exitosa");
      this.dialogRef.close();
    })
  }

}

function initForSave(form: FormGroup, model: CardGraph): CardGraph {
	const fvalue = form.value;
  model.description = fvalue.description;

	return model;
};