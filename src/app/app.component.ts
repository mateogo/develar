import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './entities/user/user.service';

@Component({
  selector: 'app',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['../assets/sass/style.scss']
})
export class AppComponent {
	
	constructor(
    private userService: UserService,
    private router: Router) {
	}

	ngOnInit(){

		if(!this.userService || !this.userService.currentUser){
			this.router.navigate(['/develar/ingresar'])
		}
	}

}



		// this.route.queryParamMap.subscribe(params =>{
		// 	console.log('subscribe: params[%s]', params.keys.length);

		//   let token = this.route.snapshot.paramMap.get('gclid')
		//   console.log('gclid: []', token);
		//   console.log('router state snapshot: [%s]',this.router.routerState.snapshot.url)
		//   console.log('route        snapshot: [%s]',this.route.snapshot.url)
		//   console.log('route        snapshot: [%s]',this.route.queryParamMap);

		//   let parmObj = {...params.keys, ...params};
		//   console.dir(parmObj);

		// 	params.keys.forEach(t =>{
		// 		console.log('params [%s] [%s]',t, params[t])
		// 	})

		// });


  //   this.route.url.subscribe(url=> {
  //   	console.log('route.url.SUBSCRIBE [%s]',url.keys.length)
  //    	console.log(' url:keys: [%s]'  ,url.keys.toString());

  //   });

		// console.log('next SYNC *********')


//     component: ResultListComponent,
//     matcher: (url: UrlSegment[]) => {
//       console.log(url);
//       return url.length === 1 && url[0].path.indexOf('search?query=') > -1 ? ({consumed: url}) : null;
//     }
// },
// {
//     path: 'search',
//     component: SearchComponent,
// // 