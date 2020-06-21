import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpResponse, HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, startWith} from 'rxjs/operators'

@Injectable()
export class InterceptHttpService {

  constructor(
  	) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
		console.log('Interceptor in ACTION');
		console.dir(req)
		return next.handle(req);

		// //const cachedResponse = this.cache.get(req);

		// if(req.headers.get('x-refresh')){
		// 	const result$ = sendRequest(req, next, this.cache);
		// 	//return cachedResponse ? result$.pipe( startWith(cachedResponse)) : result$
		// 	return result$
		// }

		// return sendRequest(req, next, this.cache);

  }
}

function isCachable(req){
	return true;
}

/**
 * Get server response observable by sending request to `next()`.
 * Will add the response to the cache on the way out.
 */
function sendRequest(
  req: HttpRequest<any>,
  next: HttpHandler,
  cache: RequestCache): Observable<HttpEvent<any>> {

  // No headers allowed in npm search request
  //const noHeaderReq = req.clone({ headers: new HttpHeaders() });
  return next.handle(req);

  // return next.handle(noHeaderReq).pipe(
  //   tap(event => {
  //     // There may be other events besides the response.
  //     if (event instanceof HttpResponse) {
  //       cache.put(req, event); // Update the cache.
  //     }
  //   })
  // );
}
