import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-industrias',
  templateUrl: './dashboard-industrias.component.html',
  styleUrls: ['./dashboard-industrias.component.scss']
})
export class DashboardIndustriasComponent implements OnInit {
  public industriasDashboardTitle = 'Industrias';
  public industriasDashboardSubtitle = 'Mis industrias asociadas';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  public gotoIndustriasPage(): void {
    this.router.navigate(['industrias'], { relativeTo: this.route });
  }
}
