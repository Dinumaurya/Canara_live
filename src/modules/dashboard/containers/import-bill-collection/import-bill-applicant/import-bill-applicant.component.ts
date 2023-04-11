import { ChangeDetectorRef, Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services/app-common.service';
import moment from 'moment';

@Component({
  selector: 'sb-import-bill-applicant',
  templateUrl: './import-bill-applicant.component.html',
  styleUrls: ['./import-bill-applicant.component.scss']
})
export class ImportBillApplicantComponent implements AfterViewInit {
  @Output() informParent = new EventEmitter();
  @Input() currency: any = [];
  @Input() country = [];
  public accountNumberList: any = [];
  public amount: string;
  public importBillApplicantDetail: FormGroup;
  public submittedBillApplicant: boolean = false;
  public amntWords: any;
  public partial: boolean = false;
  public radioAction: any;
  public hideValue: boolean = false;
  public hideBrdSecond: boolean = false;
  constructor(
    private ref: ChangeDetectorRef,
    public fh: FormHelperService,
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
  ) {
    this.amount = '';
    const dt = new Date();
    this.importBillApplicantDetail = this.formBuilder.group({
      cbsCntrctRefNo: new FormControl('', [Validators.pattern(this.fh.ALPHA_NUMBER_NO_SPACE)]),
      sysRefNo: new FormControl('', []),
      transRefNo: new FormControl('', []),
      sysRefDt: new FormControl(dt, [Validators.required]),
      billPayment: new FormControl('FOR_LODGING', [Validators.required]),
      bills: new FormControl("", []),
      cbsCntrctLcNum: new FormControl('', [Validators.pattern("/^[A-Za-z0-9_-]*$/")]),
      lcDate: new FormControl('', []),
      whrLcIsRcvByCN: new FormControl('', []),
      letterOfCredit: new FormControl('', []),
      amount: new FormControl('', [Validators.required]),
      currency: new FormControl('', [Validators.required]),
      amntWords: new FormControl('', [Validators.required]),
      

      importBillsCustDtls: this.formBuilder.group({
        custId: new FormControl('', [Validators.required]),
        cntryId: new FormControl('', [Validators.required]),
        accNo: new FormControl('', [Validators.required, Validators.maxLength(16)]),
        custNm: new FormControl('', [Validators.required, Validators.pattern(this.fh.CUSTOMER_NAME_REG)]),
        brnchNm: new FormControl('', [Validators.required]),
        dpCode: new FormControl('', [Validators.required, Validators.maxLength(5)]),
        telNo: new FormControl('', [Validators.maxLength(13)]),
        mobNo: new FormControl('', [Validators.required, Validators.maxLength(13)]),
        eMail: new FormControl('', [Validators.required, Validators.pattern(this.fh.EMAIL_REG)]),
        altEmail: new FormControl('', Validators.pattern(this.fh.EMAIL_REG)),
        address1: new FormControl('', [Validators.required, Validators.maxLength(35)]),
        address2: new FormControl('', [Validators.maxLength(35)]),
        address3: new FormControl('', [Validators.maxLength(35)]),
        ieCode: new FormControl('', [Validators.required]),
        panNo: new FormControl('', [Validators.required, Validators.pattern(this.fh.PAN_REG)]),
      }),

    }, { validators: [this.atLeastOnePhoneRequired, this.cbsCntrctLcNumRequired] });
  }

  get isBillOrPaymentSelected() {
    if (this.submittedBillApplicant && this.importBillApplicantDetail.value.billPayment == 'FOR_LODGING'
      && this.importBillApplicantDetail.value.bills == '') {
      return true;
    }
    return false;
  }
  getErrcbsCntrctRefNo() {
    if (this.submittedBillApplicant) {
      return this.importBillApplicantDetail.errors && this.importBillApplicantDetail.errors.cbsCntrctRefNorequired;
    }
    return '';
  }
  getErrCbsCntrctNoRequired() {
    if (this.submittedBillApplicant) {
      return this.importBillApplicantDetail.errors && this.importBillApplicantDetail.errors.cbsCntrctLcNumrequired;
    }
    return '';
  }

  atLeastOnePhoneRequired(group: FormGroup): { [s: string]: boolean } | null {
    if (group) {
      if (group.controls['billPayment'].value != "" &&
        group.controls['billPayment'].value == 'FOR_PAYMENT' &&
        group.controls['cbsCntrctRefNo'].value != '') {
        return null;
      }
      if (group.controls['billPayment'].value == 'FOR_PAYMENT') {
        return { 'cbsCntrctRefNorequired': true };
      }
    }
    return null;
  }
  cbsCntrctLcNumRequired(group: FormGroup): { [s: string]: boolean } | null {
    if (group) {
      if (group.controls['billPayment'].value == "FOR_LODGING" &&
        group.controls['bills'].value == 'IMPRT_COLCTN_BILL' &&
        group.controls['cbsCntrctLcNum'].value == '') {
        return { 'cbsCntrctLcNumrequired': true };
      }
    }
    return null;
  }
  inputChange(event: any) {
    this.amount = event.target.value;
    this.amntWords = this.convertNumberToWords(this.amount)
    this.importBillApplicantDetail.controls['amntWords'].setValue(this.amntWords);
  }
  billPaymentChange() {
    this.importBillApplicantDetail.patchValue({
      bills: ""
    })
  }

  billChange() {
    this.importBillApplicantDetail.patchValue({
      billPayment: "FOR_LODGING"
    })
  }
  changeLetter(event: any) {
    if (event.target.value == 'NO') {
      this.importBillApplicantDetail.patchValue({
        lcNum: '',
        lcDate: moment('').format('YYYY-MM-DDTHH:mm:ssZZ')
      });
    } else if (event.target.value == 'YES') {
      this.importBillApplicantDetail.patchValue({
        pcfcDtlsVo: {
          lcDate: '',
        }
      });
    }
  }
  convertNumberToWords(amount: any) {
    return this.fh.convertNumberToWords(amount);
  }
  partialChange() {
    this.billChange();
    if (this.importBillApplicantDetail.value.bills == 'DIRCT_EXPRT_BIL') {
      this.partial = true;
    } else {
      this.partial = false;

    }
  }
  onChangePayment(event: any) {
    if (event.target.value == 'FOR_LODGING') {
      this.importBillApplicantDetail.patchValue({
        cbsCntrctRefNo: '',
        cbsCntrctLcNum: '',
        lcDate: ''
      });
    } else if (event.target.value == 'FOR_PAYMENT') {
      this.importBillApplicantDetail.patchValue({
        letterOfCredit: '',
      });
    }
  }
  get appUserVal() {
    return this.importBillApplicantDetail.value;
  }
  formError(controlName: any) {
    if (this.submittedBillApplicant) {
      return this.fh.formInputError(this.importBillApplicantDetail, controlName);
    }
    return '';
  }

  ngAfterViewInit() {
    if (this.comservice.getAuthKey()) {
      this.importBillApplicantDetail.patchValue({
        importBillsCustDtls: {
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
      /*   if (data && data.body && data.body.Response && data.body.Response.CustomerInfoResponse) { */
      if (data && data.body && data.body && data.body.CustomerInfoResponse)
      {
            const rsp = data.body;
          const rcData = rsp.CustomerInfoResponse;
          const client = rsp.client;
          const Cust=rcData.CustomerFullName.slice(0,35);
          console.log(Cust);
          this.importBillApplicantDetail.patchValue({
            importBillsCustDtls: {
              custId: client,
              custNm:Cust,
             /*  custNm: typeof (rcData.CustomerFullName) != 'object' ? rcData.CustomerFullName : '', */
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
  takeAction(event: any) {
    if (event.target.value == 'SUB_SEQ_DSCNT') {
      this.hideValue = true;
      this.partial = true;
    } else {
      this.hideValue = false;
      this.partial = false;
    }
    if (event.target.value == 'DIRCT_EXPRT_DSCNT') {
      this.hideBrdSecond = true;
    } else {
      this.hideBrdSecond = false;
    }
    this.informParent.emit(event.target.value);
    this.radioAction = event.target.value;
    if (this.radioAction == 'EXPRT_COLCTN_BIL' || 'DIRCT_EXPRT_BIL' || 'BIL_PURCHS_COLCTN' || 'DIRCT_EXPRT_DSCNT' || 'SUB_SEQ_DSCNT') {
      return this.radioAction = true;
    }
    return this.radioAction = false;
  }
}
