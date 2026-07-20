import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPosition } from './add-position';

describe('AddPosition', () => {
  let component: AddPosition;
  let fixture: ComponentFixture<AddPosition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPosition],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPosition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
