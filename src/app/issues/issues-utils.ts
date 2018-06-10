import { Issue } from './issues-model';


export class IssuesUtils {
	initNewIssue(spec?){
		let issue = new Issue(spec);
		return issue;

	}

}
