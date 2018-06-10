import { Injectable } from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { BehaviorSubject ,  Subject ,  Observable, of} from 'rxjs';

import { IssuesModule } from './issues.module';

import { SharedService } from '../develar-commons/shared-service';
import { DaoService } from '../develar-commons/dao.service';
import { UserService } from '../entities/user/user.service';


import { Issue } from './issues-model';

@Injectable()
export class IssuesController {

  private readonly recordtype = 'issue'

  private issue: Issue;
  private issueId;
  private emitIssue = new Subject<Issue>();



  constructor(
		private daoService: DaoService,
    private sharedSrv:   SharedService,
    private snackBar:    MatSnackBar,
		private userService: UserService,

  	) { }




/**********************
*   =====  API =====
**********************/

/* === Factory ======== */
	initNewIssue(spec?): Issue{
		let issue = new Issue(spec);

		return issue;
	}


}
