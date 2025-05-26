import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudesSoportePage } from './solicitudes-soporte.page';

describe('SolicitudesSoportePage', () => {
  let component: SolicitudesSoportePage;
  let fixture: ComponentFixture<SolicitudesSoportePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesSoportePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
