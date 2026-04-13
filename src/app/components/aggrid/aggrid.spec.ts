import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aggrid } from './aggrid';

describe('Aggrid', () => {
  let component: Aggrid;
  let fixture: ComponentFixture<Aggrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aggrid],
    }).compileComponents();

    fixture = TestBed.createComponent(Aggrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
