import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
    selector:'app-cama-estado-modal',
    templateUrl: './cama-estado-modal.component.html',
    styleUrls : ['./cama-estado-modal.component.scss']
})
export class CamaEstadoModalComponent implements OnInit{

    slider;
    fechaPrevistaOut;

    cama : any;
    pacienteForm : FormGroup;

    formControlDr = new FormControl();
    evolucionForm: FormGroup;

    opciones = ['Dra. Bogarín Ángeles', 'Dr. Favaloro René', 'Dra. Farfán Lucía'];
    opcionesFiltradas: Observable<string[]>;


    constructor(
        public dialogRef: MatDialogRef<CamaEstadoModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb : FormBuilder) {

         this.cama = this.data.cama;
         this.initPacienteForm();
         this.initEvolucionForm();
         this.initSlider();
        }

      ngOnInit(){
        this.opcionesFiltradas = this.formControlDr.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          )
      }

      private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.opciones.filter(opcion => opcion.toLowerCase().includes(filterValue));
      }
    
      onNoClick(): void {
        this.dialogRef.close();
      }

      initPacienteForm(){
        this.pacienteForm = this.fb.group({
          name : ['',Validators.required],
          dni : ['',Validators.compose([Validators.pattern('[0-9]+'),Validators.minLength(8),Validators.maxLength(8)])],
          diagnostico : [''],
          fecha_in : [new Date(), Validators.required],
          fecha_out :['']
        })
      }

      initEvolucionForm(){
        this.evolucionForm = this.fb.group({
          doctor: ['', Validators.required]
        });
      }

      initSlider(){
        this.slider = {
          min: 0,
          max: 14,
          step: 1,
          daysLeft: undefined
        };

        const arrFecha = this.cama.fecha_prev_out.split('/');
        const diaPrevisto = arrFecha[0];
        const mesPrevisto = arrFecha[1];
        const anioPrevisto = arrFecha[2];
        
        const fechaPrevista = new Date(anioPrevisto, mesPrevisto, diaPrevisto);
        
        this.fechaPrevistaOut = fechaPrevista;
        
        const hoy = new Date();

        const diferenciaDias = Math.ceil(
          (fechaPrevista.getTime() - hoy.getTime()) / (1000 * 3600 * 24)
        );

        this.slider.daysLeft = diferenciaDias;
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

      altaPaciente(){

      }

      liberarAhora(){
        //Este apartado es para liberación automática
        this.cama.estado = 'LIBRE';
        delete this.cama.paciente;
        this.cama.fecha_in = null;
      }

      onPacienteSubmit(){
        let data = this.pacienteForm.getRawValue();

        this.cama.paciente = data;
        this.cama.estado = 'ocupada';
      }

      onEvolucionSubmit(){
        //TODO
      }

      volver(){
        this.dialogRef.close();
      }

}