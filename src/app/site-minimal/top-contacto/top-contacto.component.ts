import { Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';

import { SiteMinimalController, SolicitudDeContacto } from '../minimal.controller';
import { RecordCard } from '../recordcard.model';


@Component({
  selector: 'top-contacto',
  templateUrl: './top-contacto.component.html',
  styleUrls: ['./top-contacto.component.scss']
})
export class TopContactoComponent implements OnInit {
	@Input() record: RecordCard;

	public mainimage: string = "";
	public title: string = "";
	public description: string = "";
	public nodes: Array<About> = [];

  public form: FormGroup;
  private contacto = new SolicitudDeContacto();


  constructor(
      private fb: FormBuilder,
      private minimalCtrl: SiteMinimalController
    ) { 
      this.form = this.fb.group({
        name:        [null, Validators.compose([Validators.required])],
        slug:        [null, Validators.compose([Validators.required])],
        email:       [null, Validators.compose([Validators.required, Validators.email])],
        termsofuse:  [null],
        description: [null],
      });
  }

  ngOnInit() {
  	console.log('contacto INIT BEGIN: [%s] [%s]', this.record.cardCategory, this.record.slug);

  	this.title = this.record.slug;
  	this.description = this.record.description;
  	this.mainimage = this.record.mainimage;

  	this.record.relatedcards.forEach(s => {
  		this.nodes.push({
        title: s.slug,
  			imageUrl: s.mainimage,
  			description: s.description,
  		} as About)
  	})
    this.formReset();
  }

  /******** FORM ACTIONS  ******/

  // form solicitud
  public formReset(){
    this.contacto = new SolicitudDeContacto();
    console.log('reset [%s]', this.contacto.termsofuse)
    this.form.reset({
        name:        this.contacto.name,
        slug:        this.contacto.slug,
        email:       this.contacto.email,
        termsofuse:  this.contacto.termsofuse,
        description: this.contacto.description
    })
  }


  /******** SAVING-CANCEL A C T I O N S  ******/
  public enviarSolicitud() {

    let fvalue = this.form.value;
    this.contacto.name = fvalue.name;
    this.contacto.email = fvalue.email;
    this.contacto.termsofuse = fvalue.termsofuse;
    this.contacto.slug = fvalue.slug;
    this.contacto.description = fvalue.description;

    console.log('onSubmit: envío solicitud:BEGINS tc: [%s]', this.contacto.termsofuse);
    console.dir(this.contacto);
    this.minimalCtrl.saveContactPerson(this.contacto)

    this.minimalCtrl.notifyUsers(this.contacto)


    this.minimalCtrl.openModalDialog(new NotifyDialog( this.contacto.name, this.contacto.email ));
    this.formReset();




    // this.model = initForSave(this.form, this.model, this.relatedcards, this.personList, this.resourceList, this.assetList, this.tagList, this.userService.currentUser, this.communityList);
    // return this.cardService.update(this.model).then((model) =>{
    //     this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
    //     return model;
    //   });

  }

  public termsOfConditions(){
    this.minimalCtrl.openModalDialog(new TermsOfCondition( )).subscribe(action => {
      if(action === 'accept'){
        console.log('termos of condition CLOSED: [%s]', action)

        //  this.form: array de controls ==> formGroup
        // this.form.controls['field'] ==> formControl

        this.form.controls['termsofuse'].setValue(true);
      }else{
        this.form.controls['termsofuse'].setValue(false);

      }

    });
  }

}

interface About {
	imageUrl: string;
	description: string;
  title: string;
}


class NotifyDialog {
  width:string =  '430px';
  height:string = '500px';
  hasBackdrop:boolean = true;
  itemplate: string = '';
  backdropClass:string = 'yellow-backdrop';

  data: any = {
                caption:'¡Gracias por vuestro interés!',
                title: 'Mensaje enviado correctamente',
                body: 'Serás contactado por nuestros representantes a la brevedad.',
                accept:{
                  action: 'accept',
                  label: 'Cerrar'
                }
              };

  constructor(txt?, mail?){
    if(txt){
      this.data.body = `<p>Estimado/a <strong>${txt}</strong>: Serás contactado por nuestros representantes a la brevedad. </p>
                       <p>Un mail de confirmación te será enviado a <strong> ${mail} </strong> por favor verifica que no entre como spam o prioridad baja.</p> <p> Gracias.</p>`
    }

  }
}

class TermsOfCondition {
  width:string =  '430px';
  height:string = '500px';
  hasBackdrop:boolean = true;
  itemplate: string = '';
  backdropClass:string = 'yellow-backdrop';

  data: any = {
                caption:'Condiciones de uso de la paltaforma',
                title: 'Privacidad y uso de los datos',
                body: `
                <p>Toda información contenida o enviada a esta plataforma es considerada confidencial</p>
                <p>El envío de este formulario supone la aceptación de que seas contactado por uno de nuestros representantes a través de la casilla de correo provista.</p>
                <p>No se te enviará publicidad de ningún tipo a tu casilla de correo desde esta plataforma</p>
                <p>Cualquier otro servicio previsto requiere tu registración voluntaria.</p>
                `,

                accept:{
                  action: 'accept',
                  label: 'Aceptar'
                },
                cancel:{
                  action: 'deny',
                  label: 'Rechazar'
                }
              };

  constructor(){

  }
}



//*ngFor="let col of TABLE_COLUMNS" [(ngModel)]='col' >{{col}}
