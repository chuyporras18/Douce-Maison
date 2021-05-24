import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TodasReservacionesDetallesPage } from './todas-reservaciones-detalles.page';

describe('TodasReservacionesDetallesPage', () => {
  let component: TodasReservacionesDetallesPage;
  let fixture: ComponentFixture<TodasReservacionesDetallesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TodasReservacionesDetallesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TodasReservacionesDetallesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
