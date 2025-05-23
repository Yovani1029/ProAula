import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarFacturaPage } from './registrar-factura.page';

describe('RegistrarFacturaPage', () => {
  let component: RegistrarFacturaPage;
  let fixture: ComponentFixture<RegistrarFacturaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarFacturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
