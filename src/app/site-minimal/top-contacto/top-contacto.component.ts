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
  public isAsuntoMail = false;
  public isLocacion = true;
	public title: string = "";
  public formTitle: string = "Contacto";
  public formSubTitle: string = 'envianos tus datos'
	public description: string = "";
	public nodes: Array<Notes> = [];

  public form: FormGroup;
  private contacto = new SolicitudDeContacto();


  constructor(
      private fb: FormBuilder,
      private minimalCtrl: SiteMinimalController
    ) { 
      this.form = this.fb.group({
        name:        [null, Validators.compose([Validators.required])],
        slug:        [null],
        locacion:        [null, Validators.compose([Validators.required])],
        email:       [null, Validators.compose([Validators.required, Validators.email])],
        termsofuse:  [null],
        description: [null],
      });
  }

  ngOnInit() {

  	this.title = this.record.slug;
  	this.description = this.record.description;

  	this.mainimage = this.record.mainimage;
    this.formTitle = this.record.slug;
    this.formSubTitle = this.record.subtitle;

  	this.record.relatedcards.forEach(s => {
  		this.nodes.push({
        title: s.slug,
  			imageUrl: s.mainimage,
        subtitle: s.subtitle,
  			description: s.description,
  		} as Notes)
  	})
    this.formReset();

  }

  /******** FORM ACTIONS  ******/

  // form solicitud
  public formReset(){
    this.contacto = new SolicitudDeContacto();
    this.form.reset({
        name:        this.contacto.name,
        slug:        this.contacto.slug,
        locacion:    this.contacto.locacion,
        email:       this.contacto.email,
        termsofuse:  this.contacto.termsofuse,
        description: this.contacto.description
    })
  }


  /******** SAVING-CANCEL A C T I O N S  ******/
  public enviarSolicitud() {
    let node: Notes = {} as Notes

    let fvalue = this.form.value;
    this.contacto.name = fvalue.name;
    this.contacto.email = fvalue.email;
    this.contacto.locacion = fvalue.locacion;
    this.contacto.termsofuse = fvalue.termsofuse;
    this.contacto.slug = fvalue.slug || this.minimalCtrl.defaultEmailSubject;
    this.contacto.description = fvalue.description || this.minimalCtrl.defaultEmailBody;

    this.minimalCtrl.saveContactPerson(this.contacto)

    this.minimalCtrl.notifyUsers(this.contacto)

    node = this.initMessageText(this.nodes);



    this.minimalCtrl.openModalDialog(new NotifyDialog(node,  this.contacto.name, this.contacto.email ));
    this.formReset();




    // this.model = initForSave(this.form, this.model, this.relatedcards, this.personList, this.resourceList, this.assetList, this.tagList, this.userService.currentUser, this.communityList);
    // return this.cardService.update(this.model).then((model) =>{
    //     this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
    //     return model;
    //   });

  }

  private initMessageText(nodes: Notes[]){
    if(this.nodes && this.nodes.length && this.nodes.length >= 2){
      return this.nodes[1]

    }else{
      return {
        title: '¡Gracias por vuestro interés!',
        subtitle: 'Mensaje enviado correctamente',
        description: 'Serás contactado por nuestros representantes a la brevedad.',
        imageUrl: ''
      }
    }
  }

  private initTermsOfCondition(nodes: Notes[]){
    if(this.nodes && this.nodes.length && this.nodes.length >= 1){
      return this.nodes[0]

    }else{
      return {
        title: 'Privacidad y uso de los datos',
        subtitle: 'Condiciones de uso de la paltaforma',
        description: `
                <p>Toda información contenida o enviada a esta plataforma es considerada confidencial</p>
                <p>El envío de este formulario supone la aceptación de que seas contactado por uno de nuestros representantes a través de la casilla de correo provista.</p>
                <p>No se te enviará publicidad de ningún tipo a tu casilla de correo desde esta plataforma</p>
                <p>Cualquier otro servicio previsto requiere tu registración voluntaria.</p>`,
        imageUrl: ''

      }
    }
  }

  public termsOfConditions(){
    let node = this.initTermsOfCondition(this.nodes);

    this.minimalCtrl.openModalDialog(new TermsOfCondition( node)).subscribe(action => {
      if(action === 'accept'){

        //  this.form: array de controls ==> formGroup
        // this.form.controls['field'] ==> formControl

        this.form.controls['termsofuse'].setValue(true);
      }else{
        this.form.controls['termsofuse'].setValue(false);

      }

    });
  }

}

interface Notes {
	imageUrl: string;
	description: string;
  title: string;
  subtitle: string;
}


class NotifyDialog {
  width:string =  '430px';
  height:string = '500px';
  hasBackdrop:boolean = true;
  itemplate: string = '';
  backdropClass:string = 'yellow-backdrop';

  data: any = {
                caption:'',
                title: '',
                body: '',
                accept:{
                  action: 'accept',
                  label: 'Cerrar'
                }
              };

  constructor(node, txt?, mail?){
    txt = txt || ' ';
    mail = mail || '';
    this.data.caption = node.subtitle;
    this.data.title = node.title;
    let txt1 =  `<p>Estimado/a <strong>${txt}</strong>:</p>`;
    let txt2 =  `<p>Un mail de confirmación te será enviado a <strong> ${mail} </strong>, por favor verifica que no entre como spam o prioridad baja.</p> <p> Gracias.</p>`;
    this.data.body = txt1 + node.description + txt2;
  }
}

class TermsOfCondition {
  width:string =  '430px';
  height:string = '500px';
  hasBackdrop:boolean = true;
  itemplate: string = '';
  backdropClass:string = 'yellow-backdrop';

  data: any = {
                caption:'',
                title: '',
                body: '',

                accept:{
                  action: 'accept',
                  label: 'Aceptar'
                },
                cancel:{
                  action: 'deny',
                  label: 'Rechazar'
                }
              };

  constructor(node){
    this.data.caption = node.subtitle;
    this.data.title = node.title;
    this.data.body = node.description;

  }
}



//*ngFor="let col of TABLE_COLUMNS" [(ngModel)]='col' >{{col}}
