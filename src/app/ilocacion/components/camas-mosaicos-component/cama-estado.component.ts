import { Component, Input, OnInit, SimpleChange } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { CamaEstadoModalComponent } from './cama-estado-modal/cama-estado-modal.component';


@Component({
    selector: 'app-cama-estado',
    styleUrls: ['cama-estado.component.scss'],
    templateUrl : './cama-estado.component.html'
})
export class CamaEstadoComponent implements OnInit{
    
    @Input() cama;

    constructor(public dialog: MatDialog){
    }

    ngOnInit(){
        
    }

    ngOnChanges(change : SimpleChange){
        
        }

    // deprecated: este componente se solo para camas libres
    showData(){
        const dialogRef = this.dialog.open(CamaEstadoModalComponent, {
            width: '750px',
            data: {cama : this.cama}
          });
      
          dialogRef.afterClosed().subscribe(result => {
          });
    }
}