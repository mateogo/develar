import { Component, OnInit, Inject, Input, Output, EventEmitter} from '@angular/core';
import { Injectable }        from '@angular/core';
import { Headers, Http }     from '@angular/http';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';


import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import 'rxjs/add/operator/toPromise';
const whoami = "CrawlerComponent & Service";

class CrawlData {
	title: string;
	body: string;
  action: string;
  btn: object;
}


@Injectable()
export class CrawlerService {

	private apiUrl = 'api/crawl';
	private headers = new Headers({'Content-Type': 'application/json'});

	private handleError(error: any): Promise<any> {
		console.error('[%s]: Ocurrió un error : [%s]',whoami, error);
		return Promise.reject(error.message || error);
	}

  constructor(
  	private http: Http) { }

  crawlUrlxText(query: string): Promise<CrawlData> {
    let url = `${this.apiUrl}?q=${query}`;
    console.log('[%s]: Ready to GET:[%s] ', whoami, query);

    return this.http.get(url)
        .toPromise()
        .then(response => response.json() as CrawlData)
        .catch(this.handleError);
  }

}



@Component({
  selector: 'dialog-result',
  templateUrl: './dialog.template.html',
})
export class CrawlerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CrawlerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
}




@Component({
  selector: 'app-crawler',
  templateUrl: './crawler.component.html',
  styleUrls: ['./crawler.component.scss'],
  providers: [
		CrawlerService
	]
})
export class CrawlerComponent implements OnInit {
	@Input()
    get target(){
      return this.targetURL;
    }
    set target(url){
      if(url !== this.targetURL){
        this.targetURL = url;
        this.fetchUrlData();
      }
    }
  @Input() action:Object = {action: 'aceptar', actionLabel: 'Agregar Ficha'};
  @Output() crawlerAction = new EventEmitter<Subject<CrawlData>>()


  targetURL: string = 'http://www.lanacion.com.ar';

	dialogRef: MatDialogRef<CrawlerDialogComponent>;
  subject = new Subject<CrawlData>();


  constructor(
  	private daoService: CrawlerService,
    public dialogService: MatDialog, 
  	) {}

  ngOnInit() {

    this.subject.subscribe({
      next: (data)=> {
          console.log('subject subscribe:[%s]',data.title);
        }
      })

    this.crawlerAction.emit(this.subject);

  }



  fetchUrlData(){
  	this.daoService.crawlUrlxText(this.targetURL).then(data =>{
  		console.log('[%s] fetchUrlData SUCCESS [%s]', whoami, data.title);
  		this.openDialog(data);

  	})
  	.catch((err) =>{
  		console.log('[%s] fetchUrlData ERROR [%s]', whoami, err.message);
  	})

  }

  openDialog(content: CrawlData) {
    let config = {
      width: '900px',
      height: '600px',
      hasBackdrop: true,
      backdropClass: 'yellow-backdrop',
      data: content
    };
    config.data.btn = this.action;

    let dialogRef = this.dialogService.open(CrawlerDialogComponent, config);
    //dialogRef.updateSize('430px', '220px');
    dialogRef.afterClosed().subscribe(result => {
      console.log('afterClose subscription [%s]', result);
      content.action = result;
      this.subject.next(content);
      //this.selectedOption = result;
    });
  }
}
