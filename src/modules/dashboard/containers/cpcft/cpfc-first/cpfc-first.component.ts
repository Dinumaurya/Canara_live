import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { DashboardService } from '@modules/dashboard/services';

@Component({
  selector: 'sb-cpfc-first',
  templateUrl: './cpfc-first.component.html',
  styleUrls: ['./cpfc-first.component.scss']
})
export class CpfcFirstComponent implements OnInit {
  public cpcftForm:FormGroup;
  amount: string;
  submittedInvdertBill: boolean=false;
  @Output('billCpfcEvent') billCpfcEvent = new EventEmitter();
  savedData: any;
  @Input() currency: any = [];

  
  constructor(private ref: ChangeDetectorRef, public fh: FormHelperService,
    private formBuilder: FormBuilder, private comservice: AppCommonService,
    private dashboardService: DashboardService) {
    this.amount = '';

    var address3
    const email = '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$';
    const pan = '[a-zA-Z]{3}[ABCFGHLJPTFabcfghljptf]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}';
    const phone = '[6-9]\\d{9}'
    const sysdate =
      '^(0?[1-9]|[12][0-9]|3[01])-(jan|Jan|JAN|feb|Feb|FEB|mar|Mar|MAR|apr|Apr|APR|may|May|MAY|jun|Jun|JUN|jul|Jul|JUL|aug|Aug|AUG|sep|Sep|SEP|oct|Oct|OCT|nov|Nov|NOV|dec|Dec|DEC)-(19|20)dds([0-1][0-9]|[2][0-3]):([0-5][0-9])$';
    const dt = new Date();
    const customerName = '^[a-zA-Z]+$';

    this.cpcftForm = this.formBuilder.group({
      eefcAccNo:new FormControl('', [Validators.required]),
      sysRefNo:new FormControl('', [Validators.required]),
      nmOfBen: new FormControl('', [Validators.required]),
      custNm: new FormControl('', [Validators.required,Validators.pattern(this.fh.CUSTOMER_NAME_REG)]),
      rmtrNM: new FormControl('', [Validators.required]),
      expRemm: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      rmntncDt: new FormControl('', [Validators.required]),
      bnkCntry: new FormControl('', [Validators.required]),
      swiftCode: new FormControl('', [Validators.required]),
      amntWords: new FormControl('', [Validators.required]),
      instruction: new FormControl('', [Validators.required]),
      currency: new FormControl('', [Validators.required]),
      crditAccNo: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
  }
  getErrorInvertBill(controlName: any) {
    if (this.submittedInvdertBill) {
      return this.fh.formInputError(this.cpcftForm, controlName);
    }
    return '';
  }
  onSubmitAppCpfc() {

    this.submittedInvdertBill = true;

    if (this.cpcftForm.valid) {
      this.billCpfcEvent.emit(this.cpcftForm.value)
    }
  }
}

