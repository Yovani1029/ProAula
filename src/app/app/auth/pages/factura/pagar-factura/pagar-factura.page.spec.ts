import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagarFacturaPage } from './pagar-factura.page';

describe('PagarFacturaPage', () => {
  let component: PagarFacturaPage;
  let fixture: ComponentFixture<PagarFacturaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PagarFacturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
