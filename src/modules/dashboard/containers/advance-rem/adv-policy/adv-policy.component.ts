import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '@modules/dashboard/services';
import { validate } from 'uuid';

@Component({
  selector: 'sb-adv-policy',
  templateUrl: './adv-policy.component.html',
  styleUrls: ['./adv-policy.component.scss']
})
export class AdvPolicyComponent implements OnInit {
  advPolicyDetails: FormGroup;
  submittedPolicyForm5: any = false;
  @Output('policyEvent') policyEvent = new EventEmitter();
  val: any;
  constructor(
    private formBuilder: FormBuilder,
    public fh: FormHelperService
  ) {

    this.advPolicyDetails = this.formBuilder.group({
      formDt: new FormControl('', [Validators.required]),
      formPlace: new FormControl('', [Validators.required]),
      licNo: new FormControl('', []),
      declrCumUnd: new FormControl('', [Validators.required]),
    });

  }

  ngOnInit(): void {
  }
  get policyformVal() {
    return this.advPolicyDetails.value;
  }
  getPolicyError(controlName: any) {
    if (this.submittedPolicyForm5) {
      return this.fh.formInputError(this.advPolicyDetails, controlName);
    }
    return '';
  }
  onSubmitpolicyForm5() {

    this.submittedPolicyForm5 = true;
    if (this.advPolicyDetails.valid) {
      this.policyEvent.emit(this.advPolicyDetails.value)
    } else {
      return
    }
  }

  radioChange(e: any) {
    if (e.target.value == '0') {
      this.advPolicyDetails.patchValue({
        licNo: '',
      });

    }
  }
  get advPolicyFormVal() {
    return this.advPolicyDetails.value;
  }
  get isImportLicenceNoErr() {
    if (this.advPolicyFormVal && this.advPolicyFormVal.declrCumUnd == "1") {
      if (this.advPolicyFormVal.licNo != "" && this.submittedPolicyForm5) {
        return true;
      }
      return false;
    }
    return true;
  }
}
