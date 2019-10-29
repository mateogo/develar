import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonAssetsPanelComponent } from './person-assets-panel.component';

describe('PersonAssetsPanelComponent', () => {
  let component: PersonAssetsPanelComponent;
  let fixture: ComponentFixture<PersonAssetsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonAssetsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonAssetsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
