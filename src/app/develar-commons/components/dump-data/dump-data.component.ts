import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'dump-data',
  templateUrl: './dump-data.component.html',
  styleUrls: ['./dump-data.component.scss']
})
export class DumpDataComponent implements OnInit {
	@Input() data$: Observable<any>;
	@Input() title = 'DD: DumpData'
	@Input() showTests = false;

  constructor() { }

  ngOnInit() {
  	if(!this.data$) this.showTests = false;
  	
  }

}
