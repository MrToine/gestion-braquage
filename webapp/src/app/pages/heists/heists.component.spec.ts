import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeistsComponent } from './heists.component';

describe('HeistsComponent', () => {
  let component: HeistsComponent;
  let fixture: ComponentFixture<HeistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeistsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
