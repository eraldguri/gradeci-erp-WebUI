// components/phone-number-selector/phone-number-selector.ts
import { Component, computed, effect, inject, Input } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { parsePhoneNumberWithError } from 'libphonenumber-js';

@Component({
  selector: 'app-phone-number-selector',
  imports: [ReactiveFormsModule],
  templateUrl: './phone-number-selector.html',
  styleUrl: './phone-number-selector.scss',
})
export class PhoneNumberSelector {
  @Input() phoneNumber!: string;

  private countryService = inject(CountryService);
  private fb = inject(FormBuilder);

  countries = this.countryService.countries;
  errorMessage = this.countryService.error;

  isLoading = computed(() => this.countries().length === 0 && !this.errorMessage());

  countryOptions = computed(() => {
    return this.countries().map(country => ({
      code: country.code,
      flag: country.flag,
      phoneCode: country.phoneCode,
      display: `${country.flag} + ${country.phoneCode}`
    }));
  });

  phoneForm = this.fb.group({
    countryCode: [''],
    phoneNumber: ['']
  });

  constructor() {
    effect(() => {
      if (this.countries().length > 0 && this.phoneNumber) {
        this.parseAndSetPhone(this.phoneNumber);
      }
    });
  }

  private parseAndSetPhone(fullNumber: string): void {
    try {
      const cleanNumber = fullNumber.startsWith('+') ? fullNumber : `+${fullNumber}`;
      const parsed = parsePhoneNumberWithError(cleanNumber);
      const dialCode = `+${parsed.countryCallingCode}`;
      this.phoneForm.patchValue({
        countryCode: dialCode,
        phoneNumber: parsed.nationalNumber
      });
    } catch (e) {
      this.phoneForm.get('phoneNumber')?.setValue(fullNumber);
    }
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9+]/g, '');
    input.value = value;
    this.phoneForm.get('phoneNumber')?.setValue(value);
  }

  onCountrySelect(event: Event): void {
	const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;
    this.phoneForm.get('countryCode')?.setValue(selectedValue);
  }
}