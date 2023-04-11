import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
@Component({
  selector: 'sb-export-applicant',
  templateUrl: './export-applicant.component.html',
  styleUrls: ['./export-applicant.component.scss']
})
export class ExportApplicantComponent implements OnInit,AfterViewInit {
  @Input() country = [];
  @Input() currency = [];
  @Output('appEvent') appEvent = new EventEmitter();
  public accountNumberList: any = [];
  public amntWords: any;
  public exportApplicantForm: FormGroup;
  public amount: string;
  public exportSubmittedForm1: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
    public fh: FormHelperService,
    private ref: ChangeDetectorRef
  ) {
    this.amount = '';
    const email = '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$';
    const pan = '[a-zA-Z]{3}[ABCFGHLJPTFabcfghljptf]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}';

    this.exportApplicantForm = this.formBuilder.group({
      sysRefNo: new FormControl('', []),
      transRefNo: new FormControl('', []),
      sysRefDt: new FormControl('', []),
      amount: new FormControl('', [Validators.required]),
      currency: new FormControl('', [Validators.required]),
      amntWords: new FormControl('', [Validators.required]),
      pcfcDtlsVo: this.formBuilder.group({
        pcfcDomesticImport: new FormControl('', [Validators.required]),
        brnchNmMng: new FormControl('', [Validators.required]),
        dpCodeMng: new FormControl('', [Validators.required, Validators.maxLength(5)]),
        colltnChrg: new FormControl('', [Validators.required]),
      }),
      pcfcCustDtlsVo: this.formBuilder.group({
        custId: new FormControl('', [Validators.required]),
        accNo: new FormControl('', [Validators.required]),
        custNm: new FormControl('', [Validators.required, Validators.pattern(this.fh.CUSTOMER_NAME_REG)]),
        brnchNm: new FormControl('', [Validators.required]),
        dpCode: new FormControl('', [Validators.required, Validators.maxLength(5)]),
        telNo: new FormControl('', [Validators.maxLength(13)]),
        mobNo: new FormControl('', [Validators.required]),
        eMail: new FormControl('', [Validators.required, Validators.pattern(email)]),
        altEmail: new FormControl('', [Validators.pattern(email)]),
        address1: new FormControl('', [Validators.required]),
        address2: new FormControl('', [Validators.maxLength(35)]),
        address3: new FormControl('', [Validators.maxLength(35)]),
        ieCode: new FormControl('', [Validators.required,]),
        panNo: new FormControl('', [Validators.required, Validators.pattern(pan)]),
        cntryId: new FormControl('', [Validators.required,]),
      }),
    });
  }
  getErrorAppForm(controlName: any) {
    if (this.exportSubmittedForm1) {
      return this.fh.formInputError(this.exportApplicantForm, controlName);
    }
    return '';
  }
  ngOnInit(): void {
  }
  inputChange(event: any) {
    this.amount = event.target.value;
    this.amntWords = this.convertNumberToWords(this.amount)
    this.exportApplicantForm.controls['amntWords'].setValue(this.amntWords);

  }
  ngAfterViewInit() {
    if (this.comservice.getAuthKey()) {
      this.exportApplicantForm.patchValue({
        pcfcCustDtlsVo: {
            // custId: atob(this.comservice.getAuthKey()),
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
  getChange(dataProp: any) {
    this.comservice.getApplicantDetails(this.comservice.getAuthKey())
         .subscribe(data2 => {
        let data = data2;
        if(typeof(data2.body) == "string"){
          data = { body: JSON.parse(data2.body) };
        }
     /*    if (data && data.body && data.body.Response && data.body.Response.CustomerInfoResponse) { */
     if (data && data.body && data.body && data.body.CustomerInfoResponse)
     {
            const rsp = data.body;
          const rcData = rsp.CustomerInfoResponse;
          const client = rsp.client;
          const Cust=rcData.CustomerFullName.slice(0,35);
          console.log(Cust);
          this.exportApplicantForm.patchValue({
            pcfcCustDtlsVo: {
              custId: client,
              custNm:Cust,
              /* custNm: typeof (rcData.CustomerFullName) != 'object' ? rcData.CustomerFullName : '', */
              mobNo: typeof (rcData.Phone) != 'object' ? rcData.Phone : '',
              eMail: typeof (rcData.EmailId) != 'object' ? rcData.EmailId : '',
              //altEmail: rcData.AltEmailId,
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
  onSubmitApp() {
    this.exportSubmittedForm1 = true;
    if (this.exportApplicantForm.valid) {
      this.appEvent.emit(this.exportApplicantForm.value)
    }
  }
  convertNumberToWords(amount: any) {
    return this.fh.convertNumberToWords(amount);
  }
}
