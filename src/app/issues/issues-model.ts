
export class Issue {
	issueId: string = "";
	title: string = "";
	description: string = "";
	issueDate: number = 0;
	issueDateTx: string = "";
	reportedBy: string = "";
	userId: string = "";
	constructor(spec?){

		if(spec){
			if(spec){
				this.title = spec.title;
			}
			//Object.assign(this, spec);
		}
	}
}



export class IssuesModel {
}
