import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';

@Component({
  selector: 'sb-bill-policy',
  templateUrl: './bill-policy.component.html',
  styleUrls: ['./bill-policy.component.scss']
})
export class BillPolicyComponent implements OnInit {

  billPolicyDetails: FormGroup;
  @Input() applicantValue: any;
  billsubmittedFrom5: boolean = false;
  @Output('billPolicyEvent') billPolicyEvent = new EventEmitter();

  constructor(private formBuilder: FormBuilder, 
     public fh: FormHelperService,) {
    this.billPolicyDetails = this.formBuilder.group({
      dclTxt: new FormControl('', []),
      formPlace: new FormControl('', [Validators.required]),
      formDt: new FormControl('', [Validators.required]),
    });
  }
  getBillPolicyError(controlName: any) {
    if (this.billsubmittedFrom5) {
      return this.fh.formInputError(this.billPolicyDetails, controlName);
    }
    return '';
  }
  onSubmitBillPolicyForm5() {
    this.billsubmittedFrom5 = true;
    if (this.billPolicyDetails.valid) {
      if (!this.isDeclarationReq()) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
  ngOnInit(): void {
  }
  isDeclarationReq() {
    return this.applicantValue.bills == 'ADV_PYMNT_RCVD' &&
      this.billPolicyDetails.value.dclTxt == ""
  }

}
