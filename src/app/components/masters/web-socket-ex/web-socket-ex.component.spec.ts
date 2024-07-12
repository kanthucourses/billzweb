import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebSocketExComponent } from './web-socket-ex.component';

describe('WebSocketExComponent', () => {
  let component: WebSocketExComponent;
  let fixture: ComponentFixture<WebSocketExComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebSocketExComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebSocketExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
