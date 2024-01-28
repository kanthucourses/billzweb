import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletemodelpopupComponent } from './deletemodelpopup.component';

describe('DeletemodelpopupComponent', () => {
  let component: DeletemodelpopupComponent;
  let fixture: ComponentFixture<DeletemodelpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletemodelpopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletemodelpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
