import { Component, Input, OnInit } from '@angular/core'
import { SolInternacionTable } from '../../../salud/internacion/internacion.model';

@Component({
    selector: 'internacion-dashboard-card',
    templateUrl: './internacion-dashboard-card.html',
    styleUrls: ['./internacion-dashboard-card.scss']
})
export class InternacionDashboardCardComponent implements OnInit{

    @Input() internacion : SolInternacionTable;

    constructor(){

    }

    ngOnInit(){
        console.log("Caracteristicas --> %o",this.internacion)
    }
}