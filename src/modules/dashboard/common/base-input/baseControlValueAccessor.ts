import { AbstractControl, ControlContainer, ControlValueAccessor, FormControl, FormControlDirective, ValidationErrors, Validators } from '@angular/forms';
import { Injectable, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
@Injectable()
export abstract class ControlValueAccessorConnector implements OnInit, ControlValueAccessor {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective!: FormControlDirective;

  @Input()
  formControl!: FormControl;

  @Input()
  formControlName!: string;

  get control() {
    return this.formControl || (this.controlContainer && this.controlContainer.control && this.controlContainer.control.get(this.formControlName));
  }

  constructor(public injector: Injector) {
  }

  get controlContainer() {
    return this.injector.get(ControlContainer);
  }

  registerOnTouched(fn: any): void {
    if (this.formControlDirective && this.formControlDirective.valueAccessor != undefined) {
      this.formControlDirective.valueAccessor.registerOnTouched(fn);
    }
  }

  registerOnChange(fn: any): void {
    if (this.formControlDirective && this.formControlDirective.valueAccessor != undefined) {
      this.formControlDirective.valueAccessor.registerOnChange(fn);
    }
  }

  writeValue(obj: any): void {
    if (this.formControlDirective && this.formControlDirective.valueAccessor != undefined) {
      this.formControlDirective.valueAccessor.writeValue(obj);
    }

  }

  setDisabledState(isDisabled: boolean): void {
    if (!!this.formControlDirective &&
      this.formControlDirective != null &&
      this.formControlDirective.valueAccessor != null &&
      this.formControlDirective.valueAccessor.setDisabledState != null) {
      this.formControlDirective.valueAccessor.setDisabledState(isDisabled);
    }
  }
  ngOnInit() {

  }
  /**
   * Set the function to be called
   * to validate if input has errors.
   */
  validate(control: FormControl): any {
    return of(this._validateInternal(control));

  }
  _validateInternal(control: AbstractControl): ValidationErrors | null {
    return control.errors;
  }
}
