import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services/app-common.service';
import { DashboardService } from '@modules/dashboard/services';

@Component({
  selector: 'sb-adv-applicant-detail',
  templateUrl: './adv-applicant-detail.component.html',
  styleUrls: ['./adv-applicant-detail.component.scss']
})
export class AdvApplicantDetailComponent implements OnInit {
  submittedAdvAppForm1: any = false;
  advApplicantForm: FormGroup;
  @Output('advAppEvent') advAppEvent = new EventEmitter();
  accountNumberList: any = [];
  amount: string;
  amntWords: any;
  @Input() country = [];

  @Input() currency = [];

  constructor(
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
    private dashboardService: DashboardService,
    public fh: FormHelperService,
    private ref: ChangeDetectorRef) {
    this.amount = '';
    this.advApplicantForm = this.formBuilder.group({
      sysRefNo: new FormControl('', []),
      transRefNo: new FormControl('', []),
      sysRefDt: new FormControl('', []), //, Validators.pattern(sysdate)
      amount: new FormControl('', [Validators.required]),
      currency: new FormControl('', [Validators.required]),
      amntWords: new FormControl('', []),
      partFullPayment: new FormControl('', [Validators.required]),
      advRemCustDtlsVo: this.formBuilder.group({
        custId: new FormControl('', [Validators.required, Validators.maxLength(13)]),
        accNo: new FormControl('', [Validators.required, Validators.maxLength(16)]),
        custNm: new FormControl('', [Validators.required,Validators.pattern(this.fh.CUSTOMER_NAME_REG),Validators.maxLength(35)]),
        brnchNm: new FormControl('', [Validators.required]),
        dpCode: new FormControl('', [Validators.required, Validators.maxLength(5)]),
        telNo: new FormControl('', [Validators.maxLength(13)]),
        mobNo: new FormControl('', [Validators.required, Validators.maxLength(13)]),
        eMail: new FormControl('', [Validators.required, Validators.pattern(this.fh.EMAIL_REG)]),
        altEmail: new FormControl('', [Validators.pattern(this.fh.EMAIL_REG)]),
        address1: new FormControl('', [Validators.required, Validators.maxLength(35)]),
        address2: new FormControl('', [Validators.maxLength(35)]),
        address3: new FormControl('', [Validators.maxLength(35)]),
        ieCode: new FormControl('', [Validators.required,]),
        panNo: new FormControl('', [Validators.required, Validators.pattern(this.fh.PAN_REG)]),
        cntryId: new FormControl('', [Validators.required,]),
      }),
    });
  }
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.comservice.getAuthKey()) {
      this.advApplicantForm.patchValue({
        advRemCustDtlsVo: {
          // custId: this.comservice.getAuthKey(),
          dpCode: this.comservice.getBranchCode()
        }
      });
      this.accountNumberList = this.comservice.getAccountNo()
    }

    setTimeout(() => {
      this.ref.detectChanges();
      this.getChange({})
    }, 1000);
  }
  getAdvanceError(controlName: any) {
    if (this.submittedAdvAppForm1) {
      return this.fh.formInputError(this.advApplicantForm, controlName);
    }
    return '';
  }
  getChange(dataProp: any) {
    this.comservice.getApplicantDetails(this.comservice.getAuthKey())
      .subscribe(data2 => {
        let data = data2;
        if (typeof (data2.body) == "string") {
          data = { body: JSON.parse(data2.body) };
        }
       /*  if (data && data.body && data.body.Response && data.body.Response.CustomerInfoResponse) */ 
       if (data && data.body && data.body && data.body.CustomerInfoResponse)
       {
            const rsp = data.body;
          const rcData = rsp.CustomerInfoResponse;
          const client = rsp.client;
          const Cust=rcData.CustomerFullName.slice(0,35);
          console.log(Cust);
          this.advApplicantForm.patchValue({
            advRemCustDtlsVo: {
              custId: client,
              custNm:Cust,
             /*  custNm: typeof (rcData.CustomerFullName) != 'object' ? rcData.CustomerFullName : '', */
              mobNo: typeof (rcData.Phone) != 'object' ? rcData.Phone : '',
              eMail: typeof (rcData.EmailId) != 'object' ? rcData.EmailId : '',
              address1: typeof (rcData.Address1) != 'object' ? rcData.Address1 : '',
              address2: typeof (rcData.Address2) != 'object' ? rcData.Address2 : '',
              address3: typeof (rcData.Address3) != 'object' ? rcData.Address3 : '',
              panNo: typeof (rcData.PANCardNo) != 'object' ? rcData.PANCardNo : '',
              ieCode: typeof (rcData.IECCode) != 'object' ? rcData.IECCode : '',
            },
          })
        }
      }, (err) => {
      })
  }
  inputChange(event: any) {
    this.amount = event.target.value;
    this.amntWords = this.convertNumberToWords(this.amount)
    this.advApplicantForm.controls['amntWords'].setValue(this.amntWords);
  }
  onSubmitApp() {
    this.submittedAdvAppForm1 = true;
    const sameAsBnk = this.advApplicantForm.value.lcTransThrgh
    this.dashboardService.setSameAsBnk({
      sameAsBnk: sameAsBnk
    });
    if (this.advApplicantForm.valid) {
      this.advAppEvent.emit(this.advApplicantForm.value)
    }
  }
  convertNumberToWords(amount: any) {
    return this.fh.convertNumberToWords(amount);
  }
}
