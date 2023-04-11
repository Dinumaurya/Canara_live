import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';


@Component({
  selector: 'sb-import-bill-policy',
  templateUrl: './import-bill-policy.component.html',
  styleUrls: ['./import-bill-policy.component.scss']
})
export class ImportBillPolicyComponent {
  billPolicyDetails: FormGroup;
  billsubmittedFrom5: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public formHelper: FormHelperService
  ) {
    this.billPolicyDetails = this.formBuilder.group({
      formPlace: new FormControl('', [Validators.required]),
      formDt: new FormControl('', [Validators.required]),
    });

  }
  getBillPolicyError(controlName: any) {
    if (this.billsubmittedFrom5) {
      return this.formHelper.formInputError(this.billPolicyDetails, controlName);
    }
    return '';
  }
}
