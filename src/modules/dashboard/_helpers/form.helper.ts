import { Injectable } from "@angular/core";
import { FormBuilder, Validators, ValidatorFn, FormControl, FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';
interface GetControlObj {
    value?: any;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    email?: boolean;
    pattern?: string;
    phone?: boolean
}
@Injectable({
    providedIn: "root"
})
export class FormHelperService {
    public EMAIL_REG = '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$';
    public PAN_REG = '[a-zA-Z]{3}[ABCFGHLJPTFabcfghljptf]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}';
    public SWIFT_CODE_REG = "^[a-zA-Z]{6}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?$";
    public CUSTOMER_NAME_REG = "^[a-zA-Z0-9-//?.,'\(\) ]*$"
    public ALPHA_NUMBER_NO_SPACE_U_hy = "^[A-Za-z0-9_-]*$";
    public ALPHA_NUMBER_NO_SPACE = "^[A-Za-z0-9]*$";
    public ALPHA_NUMBER_SPACE = "^[A-Za-z0-9 ]*$";
    public ALPHA_AND_SPACE = "^[A-Za-z ]*$";
    public ALPHA_NUMERIC = "^[a-zA-Z0-9 ]+$";

    constructor(public formBuilder: FormBuilder) { }
    /**
     * This func will return formControl with required True and min and max length set
     * @param Obj minimum length of the textbox validation
     * @returns FormControl
     */
    getFormControls(Obj: GetControlObj): FormControl {
        const validity: any = [];
        if (Obj.required) {
            validity.push(Validators.required);
        }
        if (Obj.minLength) {
            validity.push(Validators.minLength(Obj.minLength));
        }
        if (Obj.maxLength) {
            validity.push(Validators.minLength(Obj.maxLength));
        }
        if (Obj.email) {
            validity.push(Validators.email);
        }
        if (Obj.pattern) {
            validity.push(Validators.pattern(Obj.pattern));
        }
        if (Obj.phone) {
            validity.push(this.phoneNumber);
        }
        return this.formBuilder.control(Obj.value, validity);
    }

    phoneNumber(countryPhoneCode = '*'): ValidatorFn {
        return Validators.pattern('([+]' + countryPhoneCode + ')?([0-9]{9,12})$');
    }
    swiftCode(countryPhoneCode = '*'): ValidatorFn {
        return Validators.pattern('([+]' + countryPhoneCode + ')?([0-9]{9,12})$');
    }
    controlError(control: AbstractControl) {

        if (control) {
            const errors = control.errors;
            for (const errorName in errors) {
                if (errors[errorName]) {
                    const error = ''
                    switch (errorName) {
                        case 'required':
                            return 'This field is required';
                        case 'minlength':
                            // @ts-ignore
                            return `Minimum ${control.errors.minlength.requiredLength} characters allowed.`;
                        case 'maxlength':
                            // @ts-ignore
                            return `Maximum  ${control.errors.maxlength.requiredLength} characters allowed.`;
                        case 'email':
                            return 'Please enter valid email address';
                        case 'checkbox':
                            return 'Rate Cover checkbox is required';
                        case 'pattern':
                            // @ts-ignore
                            if (control.errors.pattern.requiredPattern === "^[0-9]{10,12}$") {
                                return 'Please enter a valid phone number';
                                // @ts-ignore
                            } else if (control.errors.pattern.requiredPattern === "^[A-Za-z]{4}0[A-Z0-9a-z]{6}$") {
                                return 'Please enter a valid IFSC code';
                            } else if (control.errors && control.errors.pattern.requiredPattern === "^[a-zA-Z]{3}[ABCFGHLJPTFabcfghljptf]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$") {
                                return 'Please enter a valid PAN Number';
                            } else if (control.errors && control.errors.pattern.requiredPattern === "^[6-9]\\d{9}$") {
                                return 'Please enter a valid Phone Number';
                            } else if (control.errors && control.errors.pattern.requiredPattern === this.SWIFT_CODE_REG) {
                                return 'Please enter a valid Swift Code';
                            } else if (control.errors && control.errors.pattern.requiredPattern === this.ALPHA_NUMBER_NO_SPACE) {
                                return 'Only Alphabets and Numbers are alowed';
                            }
                            else if (control.errors && control.errors.pattern.requiredPattern === this.CUSTOMER_NAME_REG) {
                                return 'No special characters are allowed';
                            }
                            else if (control.errors && control.errors.pattern.requiredPattern === this.ALPHA_AND_SPACE) {
                                return 'Numeric and Special Characters are Not allowed';
                            }
                            else if (control.errors && control.errors.pattern.requiredPattern === this.ALPHA_NUMERIC) {
                                return 'No Special  Characters are Not allowed';
                            }
                            else {
                                return 'Please enter a valid data';
                            }

                        default:
                            // @ts-ignore
                            return form.controls[control].errors[errorName];
                    }
                } else {
                    return '';
                }
            }
            return '';
        }
        return '';
    }
    formInputError(form: FormGroup, control: string) {
        const controlInstance: any = form.get(control)
        if (controlInstance) {
            const errors = controlInstance.errors;
            for (const errorName in errors) {
                if (errors[errorName]) {
                    const error = ''
                    switch (errorName) {
                        case 'required':
                            return 'This field is required';
                        case 'minlength':
                            // @ts-ignore
                            return `Minimum ${controlInstance.errors.minlength.requiredLength} characters allowed.`;
                        case 'maxlength':
                            // @ts-ignore
                            return `Maximum  ${controlInstance.errors.maxlength.requiredLength} characters allowed.`;
                        case 'email':
                            return 'Please enter valid email address';
                        case 'checkbox':
                            return 'Rate Cover checkbox is required';
                        case 'pattern':
                            // @ts-ignore
                            if (controlInstance.errors.pattern.requiredPattern === "^[0-9]{10,12}$") {
                                return 'Please enter a valid phone number';
                                // @ts-ignore
                            } else if (controlInstance.errors.pattern.requiredPattern === "^[A-Za-z]{4}0[A-Z0-9a-z]{6}$") {
                                return 'Please enter a valid IFSC code';
                            } else if (controlInstance.errors.pattern.requiredPattern === "^[a-zA-Z]{3}[ABCFGHLJPTFabcfghljptf]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$") {
                                return 'Please enter a valid PAN Number';
                            } else if (controlInstance.errors.pattern.requiredPattern === "^[6-9]\\d{9}$") {
                                return 'Please enter a valid Phone Number';
                            } else if (controlInstance.errors.pattern.requiredPattern === this.SWIFT_CODE_REG) {
                                return 'Please enter a valid Swift Code';
                            } else if (controlInstance.errors.pattern.requiredPattern === this.ALPHA_NUMBER_NO_SPACE) {
                                return 'Only Alphabets and Numbers are alowed';
                            }
                            else if (controlInstance.errors.pattern.requiredPattern === this.CUSTOMER_NAME_REG) {
                                return 'No special characters are allowed';
                            }
                            else if (controlInstance.errors.pattern.requiredPattern === this.ALPHA_AND_SPACE) {
                                return 'Numeric and Special Characters are Not allowed';
                            }
                            else {
                                return 'Please enter a valid data';
                            }

                        default:
                            // @ts-ignore
                            return form.controls[control].errors[errorName];
                    }
                } else {
                    return '';
                }
            }
            return '';
        }
        return '';
    }
    email() {
        return '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$';
    }

    sysdate() {
        return '^(0?[1-9]|[12][0-9]|3[01])-(jan|Jan|JAN|feb|Feb|FEB|mar|Mar|MAR|apr|Apr|APR|may|May|MAY|jun|Jun|JUN|jul|Jul|JUL|aug|Aug|AUG|sep|Sep|SEP|oct|Oct|OCT|nov|Nov|NOV|dec|Dec|DEC)-(19|20)\d\d\s([0-1][0-9]|[2][0-3]):([0-5][0-9])$';
    }
    carNumberPlateRegex() {
        return '^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$';
    }
    getFormGroup(controlConfig: any) {
        return this.formBuilder.group(controlConfig);
    }
    getControls(form: any, name: any) {
        return form.get(name);
    }
    formLevelValidation(form: FormGroup): ValidationErrors | null {
        if (form.controls.password.value !== form.controls.confirmpassword.value) {
            return { nomatch: true };
        }
        return null;
    }
    customUsername(control: AbstractControl): ValidationErrors | null {
        if (control.value && control.value.length > 3) {
            return { maxLength: true };
        }
        return null;
    }
    notNullUndefinedBlank(data: any) {
        if (data != null && data != "" && typeof (data) != "undefined") {
            return true;
        }
        return false;
    }
    convertNumberToWords(s: any) {
        var th = ['', 'thousand', 'million', 'billion', 'trillion'];
        var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        s = s.toString();
        s = s.replace(/[\, ]/g, '');
        if (s != parseFloat(s)) return '';
        var x = s.indexOf('.');
        if (x == -1) x = s.length;
        if (x > 15) return 'too big';
        var n = s.split('');
        var str = '';
        var sk = 0;
        for (var i = 0; i < x; i++) {
            if ((x - i) % 3 == 2) {
                if (n[i] == '1') {
                    str += tn[Number(n[i + 1])] + ' ';
                    i++;
                    sk = 1;
                }
                else if (n[i] != 0) {
                    str += tw[n[i] - 2] + ' ';
                    sk = 1;
                }
            }
            else if (n[i] != 0) {
                str += dg[n[i]] + ' ';
                if ((x - i) % 3 == 0) str += 'hundred ';
                sk = 1;
            }


            if ((x - i) % 3 == 1) {
                if (sk) str += th[(x - i - 1) / 3] + ' ';
                sk = 0;
            }
        }
        if (x != s.length) {
            var y = s.length;
            str += 'point ';
            for (var j = x + 1; j < y; j++) str += dg[n[j]] + ' ';
        }
        return str.replace(/\s+/g, ' ');

    }
}
