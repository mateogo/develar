import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-recursos-modal',
  templateUrl: './recursos-modal.component.html',
  styleUrls: ['./recursos-modal.component.scss']
})
export class RecursosModalComponent implements OnInit {

  asignacionRecursosForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.asignacionRecursosForm = this.formBuilder.group({
      paciente: ['', Validators.required],
      recurso: ['', Validators.required]
    });
  }

}
