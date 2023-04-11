import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { DashboardService } from '@modules/dashboard/services';

@Component({
  selector: 'sb-export-policy',
  templateUrl: './export-policy.component.html',
  styleUrls: ['./export-policy.component.scss']
})
export class ExportPolicyComponent implements OnInit {
  exportPolicyDetails: FormGroup;
  exportsubmittedFrom5: boolean=false;
   @Output('exportPolicyEvent') exportPolicyEvent = new EventEmitter();

  constructor( private formBuilder: FormBuilder, private comservice: AppCommonService,
    private dashboardService:DashboardService, public fh: FormHelperService,) { 

    this.exportPolicyDetails = this.formBuilder.group({
  
      
    pcfcDtlsVo : this.formBuilder.group({
      takeConvsnRtOnBhlf : new FormControl('', [Validators.required ]),
      declTenor : new FormControl('', [ Validators.required]),
      polNo: new FormControl('', [ Validators.required]),
      dtd: new FormControl('', [ Validators.required]),
      formDt : new FormControl('', [Validators.required ]),
      formPlace : new FormControl('', [ Validators.required]),
    }),
  });

   }
   getPolicyError(controlName: any) {
    if (this.exportsubmittedFrom5) {
      return this.fh.formInputError(this.exportPolicyDetails, controlName);
    }
    return '';
  }
  onSubmitpolicyForm5() {

    this.exportsubmittedFrom5 = true;
    if (this.exportPolicyDetails.valid) {
          this.exportPolicyEvent.emit(this.exportPolicyDetails.value)
    }else{
      return
    }
  }
  ngOnInit(): void {
  }
  get policyformVal() {
    return this.exportPolicyDetails.value;
  }
}
