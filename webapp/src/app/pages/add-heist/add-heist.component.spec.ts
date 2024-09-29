import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHeistComponent } from './add-heist.component';

describe('AddHeistComponent', () => {
  let component: AddHeistComponent;
  let fixture: ComponentFixture<AddHeistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHeistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddHeistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
