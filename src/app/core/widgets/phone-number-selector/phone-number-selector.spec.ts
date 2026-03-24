import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneNumberSelector } from './phone-number-selector';

describe('PhoneNumberSelector', () => {
  let component: PhoneNumberSelector;
  let fixture: ComponentFixture<PhoneNumberSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneNumberSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneNumberSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
