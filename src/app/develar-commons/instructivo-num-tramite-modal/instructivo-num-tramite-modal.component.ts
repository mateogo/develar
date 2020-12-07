import { Component } from "@angular/core";
import { MatDialogRef } from '@angular/material/dialog';


@Component({
    selector: 'instructivo-num-tramite-modal',
    templateUrl: './instructivo-num-tramite-modal.component.html',
    styleUrls : ['./instructivo-num-tramite-modal.component.scss']
})
export class InstructivoNumTramiteModalComponent {

    constructor(public dialogRef: MatDialogRef<InstructivoNumTramiteModalComponent>){}

    close() : void {
        this.dialogRef.close();
    }
}