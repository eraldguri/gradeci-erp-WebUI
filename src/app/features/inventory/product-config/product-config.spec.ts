import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductConfig } from './product-config';

describe('ProductConfig', () => {
  let component: ProductConfig;
  let fixture: ComponentFixture<ProductConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
