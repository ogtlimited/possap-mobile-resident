import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RadiosComponent } from './radios.component';

describe('RadiosComponent', () => {
  let component: RadiosComponent;
  let fixture: ComponentFixture<RadiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RadiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
