import { Component, Input, Injector, forwardRef, Output, EventEmitter } from '@angular/core';
import { NG_ASYNC_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormHelperService } from '../../_helpers';
import { ControlValueAccessorConnector } from './baseControlValueAccessor';

@Component({
  selector: 'app-base-input',
  templateUrl: 'base.input.component.html',

  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BaseInputComponent),
    multi: true
  },
  {
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => BaseInputComponent),
    multi: true
  }]
})
export class BaseInputComponent extends ControlValueAccessorConnector {
  @Input() type: string = "text";
  @Input() label: string = "Label";
  @Input() placeholder: string = "Label";
  @Input() formSubmitted: boolean = false;
  @Input() inputType: string = "text";
  @Input() selectList: Array<any> = [];
  @Input() isDisabled: boolean = false;
  @Input() focusoutname: string = "focusedout";
  @Output() eventemitter: EventEmitter<any> = new EventEmitter();
  public formHelper: FormHelperService;
  constructor(injector: Injector) {
    super(injector);
    this.formHelper = this.injector.get(FormHelperService);
  }
  controlError() {
    if (this.formSubmitted) {
      return this.formHelper.controlError(this.control);
    }
    return "";
  }
  get isInvalid() {
    return this.formSubmitted && this.control.invalid;
  }
  get isText() {
    return this.inputType == 'text';
  }
  get isSelect() {
    return this.inputType == 'select';
  }
  get isNumeric() {
    return this.inputType == 'numeric';
  }
  emitEvent($event: any) {
    this.eventemitter.emit($event)
  }
}
