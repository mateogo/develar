import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CensoIndustrialService } from '../censo-industrial.service';


@Component({
  selector: 'app-censo-industrial-create',
  templateUrl: './censo-industrial-create.component.html',
  styleUrls: ['./censo-industrial-create.component.scss']
})
export class CensoIndustrialCreateComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private censoService: CensoIndustrialService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
    });
  }

  ngOnInit(): void {
  }

  public navigateBrowse(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  public createCenso(): void {
    console.log(this.form.value);
  }
}
