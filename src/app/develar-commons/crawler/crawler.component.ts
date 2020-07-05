import { Component, OnInit, Inject, Input, Output, EventEmitter} from '@angular/core';
import { Injectable }        from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams }    from '@angular/common/http';

import { Observable, Subject, of }    from 'rxjs';
import { catchError }     from 'rxjs/operators';


import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


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
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleObsError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      //console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

	private handleError(error: any): Promise<any> {
		console.error('[%s]: Ocurrió un error : [%s]',whoami, error);
		return Promise.reject(error.message || error);
	}

  constructor(
  	private http: HttpClient) { }

  crawlUrlxText(query: string): Promise<CrawlData> {
    let url = `${this.apiUrl}?q=${query}`;

    return this.http.get(url)
        .toPromise()
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

        }
      })

    this.crawlerAction.emit(this.subject);

  }



  fetchUrlData(){
  	this.daoService.crawlUrlxText(this.targetURL).then(data =>{
  		this.openDialog(data);

  	})
  	.catch((err) =>{
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
      content.action = result;
      this.subject.next(content);
    });
  }
}
