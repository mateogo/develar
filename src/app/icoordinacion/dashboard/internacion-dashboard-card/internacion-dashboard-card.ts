import { Component, Input } from '@angular/core'
import { SolInternacionTable } from '../../../salud/internacion/internacion.model';

@Component({
    selector: 'internacion-dashboard-card',
    templateUrl: './internacion-dashboard-card.html',
    styleUrls: ['./internacion-dashboard-card.scss']
})
export class InternacionDashboardCardComponent {

    @Input() internacion : SolInternacionTable;
    constructor(){
    }
}