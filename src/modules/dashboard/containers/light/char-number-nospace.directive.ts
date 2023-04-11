import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[sbCharNumberNoSpace]'
})
export class CharNumberNoSpaceDirective {

  constructor(private elRef: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initalValue = this.elRef.nativeElement.value;
    this.elRef.nativeElement.value = initalValue.replace(/[^0-9a-zA-X]/g, '');
    if (initalValue !== this.elRef.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
