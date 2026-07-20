import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePosition } from './delete-position';

describe('DeletePosition', () => {
  let component: DeletePosition;
  let fixture: ComponentFixture<DeletePosition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePosition],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletePosition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
