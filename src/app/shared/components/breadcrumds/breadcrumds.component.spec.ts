import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumdsComponent } from './breadcrumds.component';

describe('BreadcrumdsComponent', () => {
  let component: BreadcrumdsComponent;
  let fixture: ComponentFixture<BreadcrumdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreadcrumdsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreadcrumdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
