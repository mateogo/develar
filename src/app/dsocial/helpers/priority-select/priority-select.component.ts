import { Component, OnInit,Output, Input, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { Person } from '../../../entities/person/person';

import { TurnosModel, PriorityToken } from '../../turnos/turnos.model';

import { DsocialController } from '../../dsocial.controller';

import { SectorAtencion } from '../../dsocial.model';

import { devutils }from '../../../develar-commons/utils'

function initForSave(form: FormGroup, priority: PriorityToken): PriorityToken {
    const fvalue = form.value;
    priority.prioridad = fvalue.prioridad;
    return priority;
};

@Component({
  selector: 'priority-select',
  templateUrl: './priority-select.component.html',
  styleUrls: ['./priority-select.component.scss']
})
export class PrioritySelectComponent implements OnInit {
	@Input() person: Person;
	@Input() sector: string;

	@Output() action$ = new EventEmitter<PriorityToken>();

    pageTitle: string = 'Confirme el turno';
    public form: FormGroup;

    private priority: PriorityToken;

    public prioridadOptList = [];



    constructor(
        private fb: FormBuilder,
        private router: Router,
       	private dsCtrl: DsocialController,
    ) { }

    ngOnInit() {
        this.priority = new PriorityToken();

        this.form = this.fb.group({
            prioridad: [null, Validators.compose([Validators.required])],
        });

        this.prioridadOptList = TurnosModel.getOptionlist('prioridad')
        this.resetForm(this.priority);
    }

    onSubmit() {
        this.priority = initForSave(this.form, this.priority);
        this.priority.action = 'update';
        this.emitEvent(this.priority);
    }

    atencionInmediata(){
        this.priority.action = 'inmediata';
        this.emitEvent(this.priority);
    }

    auditEntregas(){
        this.priority.action = 'auditoria';
        this.emitEvent(this.priority);
    }

    cancel() {
        this.priority.action = 'cancel';
        this.emitEvent(this.priority);
    }

    emitEvent(priority: PriorityToken){
        this.action$.next(priority);
    }


    resetForm(priority: PriorityToken) {
        this.form.reset({
            prioridad: priority.prioridad,
        });
    }


    changeSelectionValue(type, val) {
    }


    hasError = (controlName: string, errorName: string) =>{
        return this.form.controls[controlName].hasError(errorName);
    }

}
