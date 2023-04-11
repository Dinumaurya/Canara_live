import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services/app-common.service';
import { DashboardService } from '@modules/dashboard/services';

@Component({
  selector: 'sb-lc-applicant-detail',
  templateUrl: './lc-applicant-detail.component.html',
  styleUrls: ['./lc-applicant-detail.component.scss']
})
export class LcApplicantDetailComponent implements OnInit, AfterViewInit {
  amount: string;
  lcappUserDetails: FormGroup;
  submittedlcForm1: boolean = false;
  @Input() country = [];
  @Input() currency = [];
  accountNumberList: any = [];
  public lcTransBnk: any = []
  @Output('charappEventgeEvent') appEvent = new EventEmitter();
  amntWords: any;
  trans: boolean = false;
  constructor(
    private ref: ChangeDetectorRef,
    public fh: FormHelperService,
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
    private dashboardService: DashboardService) {
    this.amount = '';
    const dt = new Date();

    this.lcappUserDetails = this.formBuilder.group({
      sysRefNo: new FormControl('', []),
      transRefNo: new FormControl('', []),
      sysRefDt: new FormControl(dt, [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      lcTransThrgh: new FormControl('', [Validators.required]),
      currency: new FormControl('', [Validators.required]),
      amntWords: new FormControl('', [Validators.required]),
      lcCustDtls: this.formBuilder.group({
        custId: new FormControl('', [Validators.required, Validators.maxLength(11)]),
        accNo: new FormControl('', [Validators.required, Validators.maxLength(16)]),
        custNm: new FormControl('', [Validators.required, Validators.pattern(this.fh.CUSTOMER_NAME_REG)]),
        brnchNm: new FormControl('', [Validators.required]),
        dpCode: new FormControl('', [Validators.required, Validators.maxLength(5)]),
        telNo: new FormControl('', [Validators.maxLength(15)]),
        mobNo: new FormControl('', [Validators.required, Validators.maxLength(15)]),
        eMail: new FormControl('', [Validators.required, Validators.pattern(this.fh.EMAIL_REG)]),
        altEmail: new FormControl('', Validators.pattern(this.fh.EMAIL_REG)),
        address1: new FormControl('', [Validators.required, Validators.maxLength(35)]),
        address2: new FormControl('', [Validators.maxLength(35)]),
        address3: new FormControl('', [Validators.maxLength(35)]),
        ieCode: new FormControl('', [Validators.required]),
        panNo: new FormControl('', [Validators.required, Validators.pattern(this.fh.PAN_REG)]),

      }),
      lcTransBnk: this.formBuilder.group({
        swiftCode: new FormControl('', [Validators.required, Validators.pattern(this.fh.SWIFT_CODE_REG)]),
        cntryId: new FormControl('', [Validators.required]),
        bnkNm: new FormControl('', [Validators.required]),
        cifId: new FormControl(39956420, [Validators.required]),
        fullAddr: new FormControl('', [Validators.required]),
        fullAddr1: new FormControl('', []),
        fullAddr2: new FormControl('', [])
      }),
    });
  }
  ngOnInit(): void {

  }
  onCheckbboxSelect(Event: any) {
    if (this.AppUserVal.lcTransThrgh == 'FIX_AMNT_FCY') {
      this.trans = true;
    } else {
      if (this.AppUserVal.lcTransThrgh == 'FCY_EQ_FIX_RS_AMNT') {
        this.trans = false;
      }
    }
    this.dashboardService.setTrans({
      trans: this.trans
    });
  }
  ngAfterViewInit() {
    if (this.comservice.getAuthKey()) {
      this.lcappUserDetails.patchValue({
        lcCustDtls: {
            // custId: (this.comservice.getAuthKey()),
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
  getError(controlName: any) {
    if (this.submittedlcForm1) {
      return this.fh.formInputError(this.lcappUserDetails, controlName);
    }
    return '';
  }
  inputChange(event: any) {
    this.amount = event.target.value;
    this.amntWords = this.convertNumberToWords(this.amount)
    this.lcappUserDetails.controls['amntWords'].setValue(this.amntWords);
  }
  onSubmitApp() {
    this.submittedlcForm1 = true;
    const sameAsBnk = this.lcappUserDetails.value.lcTransThrgh
    this.dashboardService.setSameAsBnk({
      sameAsBnk: sameAsBnk
    });
    this.lcTransBnk = this.lcappUserDetails.value.lcTransBnk
    this.dashboardService.setlcTransBnkVo({
      bnkNm: this.lcappUserDetails.value.lcTransBnk.bnkNm,
      cifId: this.lcappUserDetails.value.lcTransBnk.cifId,
      cntryId: this.lcappUserDetails.value.lcTransBnk.cntryId,
      swiftCode: this.lcappUserDetails.value.lcTransBnk.swiftCode,
      fullAddr: this.lcappUserDetails.value.lcTransBnk.fullAddr,
      fullAddr1: this.lcappUserDetails.value.lcTransBnk.fullAddr1,
      fullAddr2: this.lcappUserDetails.value.lcTransBnk.fullAddr2
    });

    if (this.lcappUserDetails.valid) {
      this.appEvent.emit(this.lcappUserDetails.value)
    }
  }
  getChange(dataProp: any) {
    const dt = {
      "input": {
        "SessionContext": {
          "BankCode": "15",
          "Channel": "BRN",
          "TransactionBranch": "402",
          "UserId": "SYSTEM"
        },
        "CustId": this.lcappUserDetails.value.lcCustDtls.custId
      }
    }
    this.comservice.getApplicantDetails(this.comservice.getAuthKey())
      .subscribe(data2 => {
        let data = data2;
        if(typeof(data2.body) == "string"){
          data = { body: JSON.parse(data2.body) };
        }
       /*  if (data && data.body && data.body.Response && data.body.Response.CustomerInfoResponse) { */
       if (data && data.body && data.body && data.body.CustomerInfoResponse)
       {
            const rsp = data.body;
          const rcData = rsp.CustomerInfoResponse;
          const client = rsp.client;
          const Cust=rcData.CustomerFullName.slice(0,35);
          console.log(Cust);
          this.lcappUserDetails.patchValue({
            lcCustDtls: {
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
  get AppUserVal() {
    return this.lcappUserDetails.value;
  }
  convertNumberToWords(amount: any) {
    return this.fh.convertNumberToWords(amount);
  }
}
