import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services/app-common.service';

@Component({
  selector: 'sb-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit {
  amount: string
 
  policyform: FormGroup;
  submittedlcForm5: boolean=false;
  @Output('policyEvent') policyEvent = new EventEmitter();

  constructor(private ref: ChangeDetectorRef, public fh: FormHelperService,
    private formBuilder: FormBuilder, private comservice: AppCommonService) {
   
 

   this.amount = '';
   const email = '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$';
   const pan = '[a-zA-Z]{3}[ABCFGHLJPTFabcfghljptf]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}';
   const phone = '[6-9]\\d{9}'
   const sysdate =
     '^(0?[1-9]|[12][0-9]|3[01])-(jan|Jan|JAN|feb|Feb|FEB|mar|Mar|MAR|apr|Apr|APR|may|May|MAY|jun|Jun|JUN|jul|Jul|JUL|aug|Aug|AUG|sep|Sep|SEP|oct|Oct|OCT|nov|Nov|NOV|dec|Dec|DEC)-(19|20)dds([0-1][0-9]|[2][0-3]):([0-5][0-9])$';
   const dt = new Date();
   const customerName = '^[a-zA-Z]+$';
 
   this.policyform = this.formBuilder.group({
    formDt:new FormControl('', [Validators.required]),
    isAgree:new FormControl('', [Validators.required]),
    formPlace : new FormControl('', [Validators.required]),
    insCmpny: new FormControl('', []),
    policyNo: new FormControl('', []),
    policyAmnt: new FormControl('', []),
    coverDate: new FormControl('', []),
    endDate: new FormControl('', []),
    
   })
 

 }

onSubmitForm5() {

  this.submittedlcForm5 = true;
  if (this.policyform.valid) {
       this.policyEvent.emit(this.policyform.value)
  }else{
    return
  }
}
getlcErrorplcy(controlName: any) {
  if (this.submittedlcForm5) {
    return this.fh.formInputError(this.policyform, controlName);
  }
  return '';
}

  ngOnInit(): void {
  }

}
