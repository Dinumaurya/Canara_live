import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services/app-common.service';
import { DashboardService } from '@modules/dashboard/services';

@Component({
  selector: 'sb-guar-applicant',
  templateUrl: './guar-applicant.component.html',
  styleUrls: ['./guar-applicant.component.scss']
})
export class GuarApplicantComponent implements OnInit   {
  amount: string;
  GuarApplicantForm: FormGroup;
  submittedguarForm1: boolean = false;
  @Input() country = [];
  @Input() currency = [];
  accountNumberList: any = [];
  public guaranteeTransBnkVo: any = []
  @Output('charappEventgeEvent') appEvent = new EventEmitter();
  amntWords: any;
  trans: boolean = false;
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

    this.GuarApplicantForm = this.formBuilder.group({
      sysRefNo: new FormControl('', []),
      transRefNo: new FormControl('', []),
      sysRefDt: new FormControl(dt, [Validators.required]), //, Validators.pattern(sysdate)
      amount: new FormControl('', [Validators.required]),
      currency: new FormControl('', [Validators.required]),
      amntWords :  new FormControl('', [Validators.required]),
      guaranteeCustDtlsVo: this.formBuilder.group({
        custId: new FormControl('', [Validators.required, Validators.maxLength(11)]),
        accNo: new FormControl('', [Validators.required, Validators.maxLength(16)]),
        custNm: new FormControl('', [Validators.required,Validators.pattern(this.fh.CUSTOMER_NAME_REG)]),
        brnchNm: new FormControl('', [Validators.required]),
        dpCode: new FormControl('', [Validators.required, Validators.maxLength(5)]),
        telNo: new FormControl('', [Validators.maxLength(15)]),
        mobNo: new FormControl('', [Validators.required, Validators.maxLength(15)]),
        eMail: new FormControl('', [Validators.required, Validators.pattern(email)]),
        altEmail: new FormControl('', Validators.pattern(email)),
        address1: new FormControl('', [Validators.required, Validators.maxLength(35)]),
        address2: new FormControl('', [Validators.maxLength(35)]),
        address3: new FormControl('', [Validators.maxLength(35)]),
        ieCode: new FormControl('', [Validators.required]),
        panNo: new FormControl('', [Validators.required, Validators.pattern(pan)]),

      }),
      guaranteeTransBnkVo: this.formBuilder.group({
        swiftCode: new FormControl('', [Validators.required]),
        cntryId: new FormControl('', [Validators.required]),
        bnkNm: new FormControl('', [Validators.required]),
        cifId:  new FormControl(39956420, [Validators.required]),
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
    // bnkNm:this.trans.bnkNm
    // cifId :
    // cntryId:
    // swiftCode:
    this.dashboardService.setTrans({
      trans: this.trans
    });


  }
  ngAfterViewInit() {
    if (this.comservice.getAuthKey()) {
      this.GuarApplicantForm.patchValue({
        guaranteeCustDtlsVo: {
          // custId: atob(this.comservice.getAuthKey()),
          dpCode: this.comservice.getBranchCode()
        }
      });
      this.accountNumberList = this.comservice.getAccountNo()
    } else {
      this.GuarApplicantForm.patchValue({
        guaranteeCustDtlsVo: {
          custId: 9876543216543,
          dpCode: 5678
        }
      });
      this.accountNumberList = [9876543298765, 9878876543276]

    }
    setTimeout(() => {
      this.ref.detectChanges();
      this.getChange({})
    }, 1000);
  }
  getError(controlName: any) {
    if (this.submittedguarForm1) {
      return this.fh.formInputError(this.GuarApplicantForm, controlName);
    }
    return '';
  }
  inputChange(event: any) {
    this.amount = event.target.value;

    this.amntWords = this.convertNumberToWords(this.amount)
    // this.GuarApplicantForm.controls['amntWords'].value = this.amount;
    this.GuarApplicantForm.controls['amntWords'].setValue(this.amntWords);
    
  }
  onSubmitApp() {
   
    
    this.submittedguarForm1 = true;
    const sameAsBnk = this.GuarApplicantForm.value.lcTransThrgh
    this.dashboardService.setSameAsBnk({
      sameAsBnk: sameAsBnk
    });
    // bnkNm:this.trans.bnkNm
    // cifId :
    // cntryId:
    // swiftCode:
    this.guaranteeTransBnkVo = this.GuarApplicantForm.value.guaranteeTransBnkVo
    // this.dashboardService.setguaranteeTransBnkVo({
    //   bnkNm: this.GuarApplicantForm.value.guaranteeTransBnkVo.bnkNm,
    //   cifId: this.GuarApplicantForm.value.guaranteeTransBnkVo.cifId,
    //   cntryId: this.GuarApplicantForm.value.guaranteeTransBnkVo.cntryId,
    //   swiftCode: this.GuarApplicantForm.value.guaranteeTransBnkVo.swiftCode,
    //   fullAddr: this.GuarApplicantForm.value.guaranteeTransBnkVo.fullAddr,
    //   fullAddr1: this.GuarApplicantForm.value.guaranteeTransBnkVo.fullAddr1,
    //   fullAddr2: this.GuarApplicantForm.value.guaranteeTransBnkVo.fullAddr2
    // });

    if (this.GuarApplicantForm.valid) {
      this.appEvent.emit(this.GuarApplicantForm.value)
    }
  }
  isLrsCheckboxRequired() {
    // if (this.AppUserVal.frngExchng == 'FIX_AMNT_FCY') {
    //   this.trans = true;

    // const purpose = this.GuarApplicantForm.value.lCBnfDtlsVo.cifId;
    // if (purpose == '' || purpose == null) {
    //   return true;
    // } else {
    //   if (purpose == 'FCY_EQ_FIX_RS_AMNT') {
    //     const rltnShipOfBnf = this.GuarApplicantForm.value.outRmtncDtlsVo.rltnShipOfBnf
    //     if (rltnShipOfBnf == '' || rltnShipOfBnf == null) {
    //       return true;
    //     }
    //   }
    // }
    // }
  }
  getChange(dataProp: any) {
    // if (this.GuarApplicantForm.value.guaranteeCustDtlsVo.custId! = "") {
    //call api and patch value
    
    const dt = {
      "input": {
        "SessionContext": {
          "BankCode": "15",
          "Channel": "BRN",
          "TransactionBranch": "402",
          "UserId": "SYSTEM"
        },
        "CustId": this.GuarApplicantForm.value.guaranteeCustDtlsVo.custId
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
          const client = rsp.client;
          const rcData = rsp.CustomerInfoResponse;
          const Cust=rcData.CustomerFullName.slice(0,35);
          console.log(Cust);
          this.GuarApplicantForm.patchValue({
            guaranteeCustDtlsVo: {
              //accNo: rcData.AccountNo,
              /* custNm: typeof (rcData.CustomerFullName) != 'object' ? rcData.CustomerFullName : '', */
              custId: client,
              custNm:Cust,
              //brnchNm: rcData.CustomerFullName,
              //dpCode: rcData.CustomerFullName,
              // telNo: rcData.CustomerFullName,
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

        } else {
          // this.showDanger('No such data')
        }

      }, (err) => {
        this.GuarApplicantForm.patchValue({
          guaranteeCustDtlsVo: {
            //accNo: rcData.AccountNo,
            custNm: 'test',

            //brnchNm: rcData.CustomerFullName,
            //dpCode: rcData.CustomerFullName,
            // telNo: rcData.CustomerFullName,
            mobNo: 9800000000,
            eMail: 'test@test.com',
            //altEmail: rcData.AltEmailId,
            address1: 'mumbai',
            address2: 'mumbai2',
            address3: 'mumbai3',
            panNo: 'kjhgf6543r',
            ieCode: '6543287654325',
          },
        })
        // this.spinner.hide();
        // this.showDanger('Something went wrong')
      })
    // }
  }
  get AppUserVal() {
    return this.GuarApplicantForm.value;
  }

  convertNumberToWords(amount: any) {
    return this.fh.convertNumberToWords(amount);
  }

}
