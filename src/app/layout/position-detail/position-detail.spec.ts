import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionDetail } from './position-detail';

describe('PositionDetail', () => {
  let component: PositionDetail;
  let fixture: ComponentFixture<PositionDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PositionDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
