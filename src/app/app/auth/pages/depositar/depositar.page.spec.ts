import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepositarPage } from './depositar.page';

describe('DepositarPage', () => {
  let component: DepositarPage;
  let fixture: ComponentFixture<DepositarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
