import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPosition } from './edit-position';

describe('EditPosition', () => {
  let component: EditPosition;
  let fixture: ComponentFixture<EditPosition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPosition],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPosition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
