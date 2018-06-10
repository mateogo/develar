import { IssuesModule } from './issues.module';

describe('IssuesModule', () => {
  let issuesModule: IssuesModule;

  beforeEach(() => {
    issuesModule = new IssuesModule();
  });

  it('should create an instance', () => {
    expect(issuesModule).toBeTruthy();
  });
});
