import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../develar-commons/notifications.service';
import { devutils } from '../../../develar-commons/utils';
import { ConsultaHelper } from '../../../entities/consultas/consulta.helper';
import { AsesoramientoTecnico, Atendido, Consulta, MaterialSolicitado, Pase } from '../../../entities/consultas/consulta.model';
import { ConsultasService } from '../../../entities/consultas/consultas.service';
import { UserWeb } from '../../../entities/user-web/user-web.model';
import { UserService } from '../../../entities/user/user.service';
const ESTADO_ACTIVO = 'activo';
const SECTOR_INICIAL = 'comunicacion';
const ENEJECUCION = 'enejecucion';
const EMITIDO = 'emitido';
@Component({
  selector: 'app-consultas-edit',
  templateUrl: './consultas-edit.component.html',
  styleUrls: ['./consultas-edit.component.scss']
})
export class ConsultasEditComponent implements OnInit {

  public form: FormGroup;
  public tipoMaterialList = [];
  public sedesList = [];

  public meContent: string = '';
  public mePlaceholder: string = 'Ingrese aquí el objeto de la consulta';

  public isConsulta = false;
  public isAsesoramiento = false;
  public isMaterial = false;

  public consultaOptList = [];

  private consulta: Consulta;
  private solmaterial: MaterialSolicitado;
  private asesoramiento: AsesoramientoTecnico;
  private isEdit = false;
  private user: UserWeb;
  private consultaId: string;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _notificacionService: NotificationService,
    private _service: ConsultasService,
    private _userService: UserService
  ) {

    this.consultaOptList = ConsultaHelper.getOptionList('consultaType');

    this.form = this._fb.group({
      type: [null],
      description: [null],

      institucion: [null],
      solicitud: [null],
      contacto: [null],

      tmaterial: [null],
      identificador: [null],
      destino: [null],
    });


  }

  ngOnInit(): void {
    this.consultaId = this._route.snapshot.params.id

    if (this.consultaId) {

      this.isEdit = true;
    }

    this.initOnce();
  }

  private initOnce() {

    this.consulta = new Consulta();

    this._userService.userEmitter.subscribe(user => {
      if (user) {
        this.user = new UserWeb;
        Object.assign(this.user, user);
        if (!this.isEdit) {
          this.consulta = ConsultaHelper.initNewConsulta();
          this.initForEdit(this.form, this.consulta)

        } else {
          this._service.fetchConsultaById(this.consultaId)
            .then(item => {
              this.consulta = item;
              this.initForEdit(this.form, this.consulta)
            })
            .catch(error => {
              //c onsole.log('Error recuperando la consulta: %s', error);
            });
        }

      } else {
        // wait....
      }

    });


  }


  changeSelectionValue(type, val) {

    if (type === 'type') {
      this.isConsulta = val === 'consulta' ? true : false;
      this.isAsesoramiento = val === 'asesoramiento' ? true : false;
      this.isMaterial = val === 'solmaterial' ? true : false;
    }

  }

  descriptionUpdateContent(content) {
  }

  cancel() {
    this.navigateConsultas();

  }

  private navigateConsultas(): void {
    const navTo = this.isEdit ? '../..' : '..';
    this._router.navigate([navTo], { relativeTo: this._route });
  }

  upsertRecord(): void {
    this.initForSave(this.form, this.consulta);

  }

  private initForSave(form: FormGroup, consulta: Consulta) {
    const fvalue = this.form.value;

    consulta.type = fvalue.type;
    consulta.description = fvalue.description;

    if (this.isAsesoramiento) {
      this.asesoramiento.institucion = fvalue.institucion;
      this.asesoramiento.solicitud = fvalue.solicitud;
      this.asesoramiento.contacto = fvalue.contacto;
      consulta.asesoramiento = this.asesoramiento;

    } else {
      consulta.asesoramiento = null;
    }

    if (this.isMaterial) {
      this.solmaterial.tmaterial = fvalue.tmaterial;
      this.solmaterial.identificador = fvalue.identificador;
      this.solmaterial.destino = fvalue.destino;
      consulta.material = this.solmaterial;

    } else {
      consulta.material = null;
    }


    let consulta_new = new Consulta();
    Object.assign(consulta_new, consulta)
    const pase = new Pase();
    pase.ejecucion = this.isEdit ? ENEJECUCION : EMITIDO;
    pase.novedadTx = this.isEdit ? 'Edición por parte del usuario' : 'Inicio de la consulta';
    pase.sector = SECTOR_INICIAL;
    pase.paseTx = '';
    pase.estado = ESTADO_ACTIVO;
    pase.isCumplida = false;
    pase.fe_nov = devutils.txFromDate(new Date());
    pase.ho_nov = devutils.txFromHora(new Date());
    pase.fets_nov = new Date().getTime();
    pase.atendidox = new Atendido();
    pase.atendidox.userWebId = this.user._id;
    pase.atendidox.slug = this.user.nombre + ' ' + this.user.apellido;
    consulta_new.sector = SECTOR_INICIAL;
    consulta_new.ejecucion = pase.ejecucion;

    consulta.pases.push(pase);

    this._service.manageConsulta(consulta_new, this.user).subscribe(record => {
      if (record) {
        this._notificacionService.success("Grabación exitosa");
        this.navigateConsultas();
      } else {
        this._notificacionService.error("Se produjo un error al intentar actualizar el registro");

      }

    });

  }

  private initForEdit(form: FormGroup, consulta: Consulta): FormGroup {

    this.isMaterial = consulta.material ? true : false;
    this.isAsesoramiento = consulta.asesoramiento ? true : false;
    this.solmaterial = consulta.material || new MaterialSolicitado();
    this.asesoramiento = consulta.asesoramiento || new AsesoramientoTecnico();

    form.reset({
      type: consulta.type,
      description: consulta.description,

      institucion: this.asesoramiento.institucion,
      solicitud: this.asesoramiento.solicitud,
      contacto: this.asesoramiento.contacto,

      tmaterial: this.solmaterial.tmaterial,
      identificador: this.solmaterial.identificador,
      destino: this.solmaterial.destino,

    })

    return form;
  }

}
