import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ocupacion-page',
  templateUrl: './ocupacion-page.component.html',
  styleUrls: ['./ocupacion-page.component.scss']
})
export class OcupacionPageComponent implements OnInit {
  public showTable = true;


  constructor(
      private router: Router,
      private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  altaNuevoParte(){
    console.log('Alta nuevo parte de ocupación')
    this.router.navigate(['../', 'parteocupacion'], {relativeTo: this.route})
  }


}
