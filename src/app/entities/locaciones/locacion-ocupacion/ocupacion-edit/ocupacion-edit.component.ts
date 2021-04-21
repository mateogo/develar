import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { devutils } from '../../../../develar-commons/utils';

import { OcupacionHospitalaria, OcupacionXServicio, Servicio, LocacionHospitalaria, LocacionHospTable, LocacionHospBrowse, LocacionEvent} from '../../locacion.model';
import { LocacionCreateComponent } from '../../locacion-data/locacion-create/locacion-create.component';

import { LocacionHelper } from '../../locacion.helper';
import { LocacionService } from '../../locacion.service';

@Component({
  selector: 'ocupacion-edit',
  templateUrl: './ocupacion-edit.component.html',
  styleUrls: ['./ocupacion-edit.component.scss']
})
export class OcupacionEditComponent implements OnInit {
  private parteId: string;
  private isAlta = true;

  public showEditor = false;
	private query: LocacionHospBrowse;

  public formGroup: FormGroup;
  private parteOcupacion: OcupacionHospitalaria;

  private capacidades = LocacionHelper.getOptionlist('capacidades');
  private capacidadesAgrup = LocacionHelper.getOptionlist('capacidadesagrupadas');
  private capacidadesReporte = LocacionHelper.getOptionlist('capacidadesreporte');
  private hospitalarias = LocacionHelper.getOptionlist('hospitalaria');
  
  public actionsList = [];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _fb: FormBuilder,
    private locSrv: LocacionService,

  ) { }

  ngOnInit(): void {
    this.initOnce()

  }

  onSubmit() {
    this.initForSave();
    this.saveParteDeOcupacion();
    this.navigateBack()
  }

  cancelEdit(){
    this.navigateBack()
  }

  get serviciosFA() {
    return this.formGroup.get('servicios') as FormArray;
  }
  
  removeControl(): void {
    let index = this.serviciosFA.length - 1;
    this.serviciosFA.removeAt(index);
  }

  addNewControl(){

  }



  private initOnce(){
    this.buildFormGroup();
    this.parteOcupacion = this.newOcupacionHospitalaria();

    this.parteId = this.route.snapshot.paramMap.get('id')
    this.isAlta = this.parteId ? false : true;
    if(this.isAlta){
      this.loadLocaciones();

    }else {
      this.locSrv.fetchOcupacionById(this.parteId).then(parte => {
        if(parte){
          this.parteOcupacion = parte;
          this.initForEdit(this.parteOcupacion);
          this.showEditor = true;
      
        }else{
          this.isAlta = true;
          this.loadLocaciones();
        }

      })
    }
  }

  private newOcupacionHospitalaria(): OcupacionHospitalaria {
    let today  = new Date();
    let oh = new OcupacionHospitalaria();
    oh.fecha_tx = devutils.txFromDate(today);
    oh.fecha_ts = devutils.dateNumFromTx(oh.fecha_tx);
    oh.ts_alta = today.getTime();
    oh.ts_umodif = oh.ts_alta;
    return oh;
  }

  private loadLocaciones(){
    let query = this.locSrv.locacionesSelector;
    this.locSrv.fetchLocacionesByQuery(query).subscribe(locaciones =>{
      this.buildOcupacionXServicio(locaciones);
    });
  }

  private buildOcupacionXServicio(locaciones: LocacionHospitalaria[]){
    let _locaciones = locaciones.filter(loc => this.hospitalarias.indexOf(loc.type) !== -1) // filtra locaciones hospitalarias, excluye CAPS
    let ocupacionServicios: OcupacionXServicio[] = [];
 
    _locaciones.forEach(loc => {
      let baseData = new OcupacionXServicio(loc)
      let servicios = loc.servicios;
      this.addOcupacionServicios (ocupacionServicios, baseData, servicios);
    })
    this.parteOcupacion.servicios = ocupacionServicios;
    this.initForEdit(this.parteOcupacion);
    this.showEditor = true;


  }

  private addOcupacionServicios(ocupacionServicios: OcupacionXServicio[], baseData: OcupacionXServicio, servicios: Servicio[]){
    if(!(servicios && servicios.length)) return;

    this.capacidadesReporte.map(capacidad => {
      let ocupacion = {...baseData};
      ocupacion.srvtype = capacidad.val;
      ocupacion.srvcode = capacidad.code;
      ocupacion.srvQDisp = servicios.reduce((acum, serv) => {
        let targetObj = this.capacidades.find(t => t.val === serv.srvtype)
        let target = "intermedios";
        if(targetObj){
          target = targetObj.target || target;
        }else {
          console.log('ERROR: Servicio  no encontrado: [%s]', serv.srvtype)
        }
        return target === capacidad.val ? acum + serv.srvQDisp : acum;
      }, 0)

      ocupacion.srvQReal = servicios.reduce((acum, serv) => {
        let targetObj = this.capacidades.find(t => t.val === serv.srvtype)
        let target = "intermedios";
        if(targetObj){
          target = targetObj.target || target;
        }else {
          console.log('ERROR: Servicio  no encontrado: [%s]', serv.srvtype)
        }
        return target === capacidad.val ? acum + serv.srvQAdic : acum;
      }, 0)

      ocupacionServicios.push(ocupacion);  
    })
  }

  private buildFormGroup(){
    this.formGroup = this._fb.group({
      fecha_tx :   [ null, Validators.required ],
      slug :       [ null ],
      servicios :  this._fb.array([])
    })
  }

  private initForEdit(entity: OcupacionHospitalaria){
    this.formGroup.reset({
      fecha_tx: entity.fecha_tx,
      slug: entity.slug
    })
    this.addControls(entity);
    
  }

  private addControls(entity: OcupacionHospitalaria): void {
    let servicios = entity.servicios || [];
    let serviciosFormArray = servicios.map(srv => this._fb.group(srv))
    this.formGroup.setControl('servicios', this._fb.array(serviciosFormArray));
  }

 
  private initForSave(){
    let fvalue = this.formGroup.value;
    this.parteOcupacion.slug = fvalue.slug;
    this.parteOcupacion.fecha_tx = fvalue.fecha_tx;
    this.parteOcupacion.fecha_ts = devutils.dateNumFromTx(fvalue.fecha_tx);
    this.parteOcupacion.servicios = fvalue.servicios;


  }

  private saveParteDeOcupacion(){
    this.locSrv.manageOcupacionRecord(this.parteOcupacion).subscribe(parte => {
      if(parte){
        this.parteOcupacion = parte;
        this.locSrv.openSnackBar('Grabación realizada con éxito', 'ACEPTAR')
      }else{
        this.locSrv.openSnackBar('No se pudo realizar la trasacción', 'ACEPTAR')

      }
    })
  }

  private navigateBack(){
    this.router.navigate(['/salud/entidades/locaciones/ocupacion'])
  }


}
