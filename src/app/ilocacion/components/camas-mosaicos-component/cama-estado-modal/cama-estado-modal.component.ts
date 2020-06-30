import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { devutils }from '../../../../develar-commons/utils'
import { SolicitudInternacion, AsignarRecursoEvent } from '../../../../salud/internacion/internacion.model';
import { LocacionHospitalaria, Recurso} from '../../../../entities/locaciones/locacion.model';

const ASIGNAR = 'asignar';
const EVOLUCIONAR = 'evolucionar';
const LIBERAR = 'liberar';
const TRANSITIONS = [   'servicio:servicio',
                        'servicio:traslado',
                        'servicio:externacion',
                        'servicio:salida'
                    ];

@Component({
    selector:'app-cama-estado-modal',
    templateUrl: './cama-estado-modal.component.html',
    styleUrls : ['./cama-estado-modal.component.scss']
})
export class CamaEstadoModalComponent implements OnInit{
  public form : FormGroup;

  public slider: SliderModel;
  public fechaPrevistaOut: Date;

  private medicosOptList = MEDICOS;
  private sinternacion: SolicitudInternacion;

  public cama : CamaModel;

  public formRecursos: FormGroup;
  public asignarList: SolicitudInternacion[];
  public recursosList: Recurso[] = [];
  public servicio: string ;
  private result: AsignarRecursoEvent;


  public evolucionForm: FormGroup;
  public opcionesFiltradas: Observable<string[]>;

  private transition: number = 0;



    constructor(
        public dialogRef: MatDialogRef<CamaEstadoModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb : FormBuilder) {
        }

      ngOnInit(){
        this.sinternacion = this.data.sinternacion;
        this.initOnce()

        this.initPacienteForm();
        this.initEvolucionForm();
        this.initRecursosForm();
        this.initSlider();

      }
 
      updateDaysLeft($event){
        this.slider.daysLeft = $event.value;

        let hoy = new Date();
        let nuevaFecha = new Date(hoy);
        nuevaFecha.setDate(
          nuevaFecha.getDate() + this.slider.daysLeft
        );
        this.fechaPrevistaOut = nuevaFecha;
      }

      changeActualState(state){
        //c onsole.log('Cambio de estado: [%s]', state);
      }

      private initOnce(){
        let paciente = new PacienteModel();
        paciente.name = this.sinternacion.requeridox.slug;
        paciente.dni =  this.sinternacion.requeridox.ndoc;
        paciente.diagnostico = this.sinternacion.internacion.slug;

        this.cama = new CamaModel();
        this.cama.paciente = paciente;
        this.cama.camaId = this.sinternacion.internacion.camaSlug;
        this.cama.estado = 'ocupada'
        this.cama.fecha_in = devutils.dateFromTx(this.sinternacion.fecomp_txa);
        this.cama.fecha_prev_out = this.sinternacion.fecomp_txa;
      }

      private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.medicosOptList.filter(opcion => opcion.toLowerCase().includes(filterValue));
      }
    
      onNoClick(): void {
        this.dialogRef.close();
      }

      private initPacienteForm(){
        this.form = this.fb.group({
          name :         ['',Validators.required],
          dni :          ['',Validators.compose([Validators.pattern('[0-9]+'),Validators.minLength(8),Validators.maxLength(8)])],
          diagnostico :  [''],
          fecha_in:      [new Date(), Validators.required],
          fecha_out:     ['']
        })
      }

      private initEvolucionForm(){
        this.evolucionForm = this.fb.group({
          profesional:  [null, Validators.required],
          slug:         [null, Validators.required],
          description:  [null]
        });

        let profControl = this.evolucionForm.get('profesional');

        this.opcionesFiltradas = profControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
        )

        this.evolucionForm.reset({
          profesional:  this.sinternacion.internacion.profesional,
          slug:         this.sinternacion.internacion.slug,
          description:  this.sinternacion.internacion.description,
        })



      }

      private initSlider(){
        this.slider = {
          min: 0,
          max: 14,
          step: 1,
          daysLeft: undefined
        };
        this.fechaPrevistaOut = devutils.dateFromTx(this.cama.fecha_prev_out)        
        let hoy = new Date();

        let diferenciaDias = Math.ceil(
          (this.fechaPrevistaOut.getTime() - hoy.getTime()) / (1000 * 3600 * 24)
        );

        this.slider.daysLeft = diferenciaDias;
      }

      /************************/
      /******** FORM EVENTS***/
      /**********************/
      updateInternacion(){
        //c onsole.log('todo ALTA PACIENTE')
      }


      onPacienteSubmit(){
        //c onsole.log('OnSubmit')
        let data = this.form.getRawValue();
        //c onsole.dir(data);
        // this.cama.paciente = data;
        // this.cama.estado = 'ocupada';
      }


      private initRecursosForm(){

          this.formRecursos = this.fb.group({
            sinternacion: [null],
            servicio:     [null],
            transition:   [null],
            recurso:      [null, Validators.required],
          });

          this.recursosList = (this.data && this.data.recursos )|| [];
          this.servicio = this.sinternacion.internacion.servicio;

          this.formRecursos.reset({
            transition: this.transition,
            sinternacion:  this.sinternacion,
            recurso: this.recursosList[0],
            servicio:  this.servicio,
          })

      }

      onSubmitEvolucion(){
        this.result = new AsignarRecursoEvent();
        let fvalue = this.evolucionForm.value;

        let internacion = this.sinternacion.internacion;
        internacion.slug =        fvalue.slug        || internacion.slug;
        internacion.description = fvalue.description || internacion.description;
        internacion.profesional = fvalue.profesional || internacion.profesional;

        this.result.action = EVOLUCIONAR;
        this.result.sinternacion = this.sinternacion;
        this.result.servicio =     this.servicio;
        this.closeDialog()

      }
      

      onSubmitRecursos(){
        this.result = new AsignarRecursoEvent();
        let fvalue = this.formRecursos.value;

        let transition = fvalue.transition;

        this.result.action = ASIGNAR;

        this.result.transition =   TRANSITIONS[transition];
        this.result.sinternacion = fvalue.sinternacion;
        this.result.servicio =     fvalue.servicio;
        this.result.recurso =      fvalue.recurso;
        this.closeDialog()
      }

      closeDialog(){
            this.dialogRef.close(this.result);
      }

      changeSelectionValue(type, val){
        //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);
      }
      
      onCancel(){
        this.result = null;
        this.closeDialog()
      }

}
class SliderModel {
  min = 0;
  max = 0;
  step = 0;
  daysLeft = 0;
}

class PacienteModel {
  name: string;
  dni: string;
  diagnostico: string;

}
class CamaModel {
  paciente: PacienteModel;
  camaId: string;
  estado: string;
  fecha_in: Date;
  fecha_prev_out: string;
}


const MEDICOS = [
  'Avila, Mariana',
  'Calandra, Daniel',
  'Canale, Yanina',
  'Cavalitto, Daniel',
  'Capria, Melanie',
  'Degese, Leandro',
  'Derisio, Jésica',
  'Espia, Carlos',
  'Fontana, Silvina',
  'Gómez, Walter',
  'Granotti, Hilda',
  'Kadhur, Karina',
  'Lacoste, Julieta',
  'Ricci, Carolina',
  'Szewczuk, Gabriela',
  'Vallejos, Virginia',
  'Varela, Gabriela',
  'No informado'
];
