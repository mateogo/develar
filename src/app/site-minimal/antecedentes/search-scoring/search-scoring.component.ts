import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'scoring',
  templateUrl: './search-scoring.component.html',
  styleUrls: ['./search-scoring.component.scss']
})
export class SearchScoringComponent implements OnInit {
	@Input() scoring = {puntos: 20, inhab: 0};

  constructor() { }

  ngOnInit() {
  }

}
