import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import Stepper from 'bs-stepper';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../common';
import moment from 'moment';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from "../../../../environments/environment";
@Component({
  selector: 'sb-forward-cntct',
  templateUrl: './forward-cntct.component.html',
  styleUrls: ['./forward-cntct.component.scss']
})
export class ForwardCntctComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper1', { static: false }) stepper1: any;
  @ViewChild("content", { static: false }) content: any;
  @ViewChild("contentbodyred", { static: false }) contentbodyred: any;

  public submitCustTab = false;
  public submitShipTab = false;
  public submitChargeTab = false;
  public submitConvrnTab = false;
  public submitSave = false;

  public savedData: any = {};

  public stepper: any;
  contractRdio = null;
  deliveryRdio = null;
  public fwdCntDtlsVo: FormGroup;
  public shipmentDetails: FormGroup;
  public chargeDetails: FormGroup;
  public conversionDetails: FormGroup;
  public officeform: FormGroup;

  public canTableList: any = [];
  public rateTableList: any = [];
  public rateTableTotal = 0;

  public country = [];
  public currency = [];
  public accounttype = [];
  public docDeliveryList = [];
  public dlvryOfFundsList = [];

  public forwardMandatoryDocList: any = []

  public isRtCvrdwithTrdr: boolean = true;
  public amount: any;
  public amountval: any = ""
  public accountNumberList: any = [];
  public viewData: any;

  public remarkDetails: any = [];
  public currentMode: any = "edit";

  public isApproved = false;
  submittedForm5 = true;
  draftdata: any;
  updatedata: any;
  modal_body = "Please correct form";
  modal_title = "Status";


  public approveremarks: any = '';
  public rejectremarks: any = '';
  public approveModalRef: any;
  public rejectModalRef: any;

  public isRejected = false;

  constructor(
    private ref: ChangeDetectorRef,
    public toastService: ToastService,
    public fh: FormHelperService,
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
    private spinner: NgxSpinnerService,
    private modalConfig: NgbModalConfig,
    private modalService: NgbModal,
    public router: Router,
    private activatedRoute: ActivatedRoute) {
    this.modalConfig.backdrop = 'static';
    this.modalConfig.keyboard = false;
    this.amount = '';
    const mobileNo = '/^((\\+91-?)|0)?[0-9]{10}$/';
    const email = '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$';
    const pan = '[a-zA-Z]{3}[ABCFGHLJPTFabcfghljptf]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}';
    const phone = '[6-9]\\d{9}'
    const sysdate =
      '^(0?[1-9]|[12][0-9]|3[01])-(jan|Jan|JAN|feb|Feb|FEB|mar|Mar|MAR|apr|Apr|APR|may|May|MAY|jun|Jun|JUN|jul|Jul|JUL|aug|Aug|AUG|sep|Sep|SEP|oct|Oct|OCT|nov|Nov|NOV|dec|Dec|DEC)-(19|20)dds([0-1][0-9]|[2][0-3]):([0-5][0-9])$';
    const dt = new Date();
    const customerName = '^[a-zA-Z]+$';
    this.fwdCntDtlsVo = this.formBuilder.group({
      fwdCntId: new FormControl('', []),
      taskId: new FormControl('', []),
      sysRefNo: new FormControl('', []),
      transRefNo: new FormControl('', []),
      sysRefDt: new FormControl(dt, [Validators.required]), //, Validators.pattern(sysdate)

      brnchNmMng: new FormControl('', [Validators.required]),
      dpCodeMng: new FormControl('', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]),
      expimpRdio: new FormControl('', [Validators.required]),
      contractRdio: new FormControl('', []),
      deliveryRdio: new FormControl('', []),

      docDelivery: new FormControl('', []),
      dlvryOfFunds: new FormControl('', []),
      cbs: new FormControl('', []),
      cntDate: new FormControl(dt, []),
      depAcc: new FormControl('', []),

      fwdCntCustDtlsVo: this.formBuilder.group({
        custId: new FormControl('', [Validators.required, Validators.maxLength(11)]),
        accNo: new FormControl('', [Validators.required, Validators.maxLength(14)]),
        custNm: new FormControl('', [Validators.required,Validators.pattern(this.fh.CUSTOMER_NAME_REG)]),
        brnchNm: new FormControl('', [Validators.required]),
        dpCode: new FormControl('', [Validators.required, Validators.maxLength(5)]),
        telNo: new FormControl('', [Validators.maxLength(13)]),
        mobNo: new FormControl('', [Validators.required, Validators.maxLength(13)]),
        eMail: new FormControl('', [Validators.required, Validators.email]),
        altEmail: new FormControl('', Validators.pattern(email)),
        address1: new FormControl('', [Validators.required, Validators.required]),
        address2: new FormControl('', []),
        address3: new FormControl('', []),
        ieCode: new FormControl('', []),
        panNo: new FormControl('', [Validators.required, Validators.pattern(pan)]),
        formCustDtlsId: new FormControl('', []),
        cntryId: new FormControl('', [Validators.required]),
        stateId: new FormControl('', []),
        pinCode: new FormControl('', []),
      }),
    }),
      this.shipmentDetails = this.formBuilder.group({
        currency: new FormControl('', []),
        amount: new FormControl('', []),
        agnstCurr: new FormControl('', []),
        agnstAmt: new FormControl('', []),
        valDate: new FormControl(dt, []),
        fdStDate: new FormControl(dt, []),
        fdEdDate: new FormControl(dt, []),
        docStDate: new FormControl(dt, []),
        docEdDate: new FormControl(dt, []),
        draftDays: new FormControl('', []),
      }),

      this.chargeDetails = this.formBuilder.group({
        takeConvsnRtOnBhlf: new FormControl('', [Validators.required]),
      }),

      this.conversionDetails = this.formBuilder.group({
        formDt: new FormControl('', [Validators.required]),
        formPlace: new FormControl('', [Validators.required]),
      }),

      this.officeform = this.formBuilder.group({
        isRtCvrdwithTrdr: [null, Validators.required],
      })
  }

  redirectHome() {
    this.router.navigate(['/dashboard/outward/forwardCntct'])
  }

  get fwdCntDtlsVal() {
    return this.fwdCntDtlsVo.value;
  }

  get shipmentDetailsVal() {
    return this.shipmentDetails.value;
  }
  get chargeDetailsVal() {
    return this.chargeDetails.value;
  }
  get conversionDetailsVal() {
    return this.conversionDetails.value;
  }

  ngAfterViewInit() {
    let mode: any = ''
    this.activatedRoute.paramMap.subscribe(params => {
      mode = params.get("mode");
    });
    const stepper1 = this.stepper1.nativeElement;
    this.stepper = new Stepper(stepper1, {
      linear: false,
      animation: true,
    });
    this.comservice.accountType().subscribe(data => {
      if (data) {
        this.accounttype = data;
      }
    })
    this.getCountry();
    this.getCurrency();
    this.getDocDeliveryList();
    this.getDlvryOfFundsList();
    this.getForwardMandatoryDoc();

    if (this.comservice.getAuthKey()) {
      this.fwdCntDtlsVo.patchValue({
        fwdCntCustDtlsVo: {
          // custId: atob(this.comservice.getAuthKey()),
          dpCode: this.comservice.getBranchCode()
        }
      });
      this.accountNumberList = this.comservice.getAccountNo()
    }
    setTimeout(() => {
      this.getChange({});
      this.ref.detectChanges();
    }, 1000);
    this.loadView();
  }
  ngOnInit() {

  }

  toStep(no: any) {
    this.stepper.to(no);
  }

  getError(controlName: any) {
    if (this.submitCustTab) {
      return this.fh.formInputError(this.fwdCntDtlsVo, controlName);
    }
    return '';
  }

  getChargeError(controlName: any) {
    if (this.submitChargeTab) {
      return this.fh.formInputError(this.chargeDetails, controlName);
    }
    return '';
  }

  getConversionError(controlName: any) {
    if (this.submitConvrnTab) {
      return this.fh.formInputError(this.conversionDetails, controlName);
    }
    return '';
  }

  getCountry() {
    this.comservice.getCountry().subscribe(data => {
      this.country = data;
    })
  }
  getCurrency() {
    this.comservice.getCurrency().subscribe(data => {
      this.currency = data;
      this.currency = this.currency.sort((a: any, b: any) => a.code.localeCompare(b.code))

    })
  }

  getDocDeliveryList() {
    this.comservice.getDocDeliveryList().subscribe(data => {
      this.docDeliveryList = data.subCommonMasterList;
      // this.docDeliveryList = this.docDeliveryList.sort((a: any, b: any) => a.code.localeCompare(b.code))

    })
  }
  getDlvryOfFundsList() {
    this.comservice.getDlvryOfFundsList().subscribe(data => {
      this.dlvryOfFundsList = data.subCommonMasterList;
      // this.dlvryOfFundsList = this.dlvryOfFundsList.sort((a: any, b: any) => a.code.localeCompare(b.code))

    })
  }

  next() {
    this.stepper.next();
  }

  get isSaved() {
    return this.fwdCntDtlsVal.sysRefNo != '' ? true : false;
  }

  fwdExeClick(event: any) {

    if (event.target.checked == true) {
      this.deliveryRdio = null;
      this.contractRdio = null;
      this.fwdCntDtlsVal.deliveryRdio.prop('checked', false);
      this.fwdCntDtlsVal.contractRdio.prop('checked', false);
      this.canTableList = [];
      // this.conversationDetailTotal = 0;
    }
    //  this.AppUserVal.contractRdio = null;
  }

  public onAddCanTable(): void {
    if ((this.canTableList == null || this.canTableList == undefined)) {
      this.canTableList = [];
    }
    this.canTableList.push({
      srNo: 1,
      cbsNo: "",
      botCCY: "",
      orgAmt: "",
      amntutlz: "",
      cancelAmt: "",
      soldCCY: "",
    });
  }

  public onDeleteCanTable(index: any) {
    this.canTableList.splice(index, 1);
    // this.canTableListTotalCal();
  }

  public onAddRateTable(): void {
    if ((this.rateTableList == null || this.rateTableList == undefined)) {
      this.rateTableList = [];
    }
    this.rateTableList.push({
      srNo: 1,
      frmFcy: '',
      toFcy: '',
      amnt: '',
      rate: '',
      retAdno: '',
    });
  }

  public onDeleteRateTable(index: any) {
    this.rateTableList.splice(index, 1);
    this.getRateTableTotal();
  }

  getRateTableTotal() {
    let total = 0;
    this.rateTableList.forEach((element: any) => {
      total += (+element.amnt)
    });
    this.rateTableTotal = total;
  }

  onSubmitCustTab() {
    this.submitCustTab = true;
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.fwdCntDtlsVo.valid) {
        this.next();
      }
    }
  }

  onSubmitShipTab() {
    this.submitShipTab = true;
    let isNoError = true;
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.shipmentDetails.valid) {
        this.next();
      }
    }

    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.shipmentDetails.valid && isNoError) {
        this.next();

      }
    }
  }
  onSubmitChargeTab() {
    this.submitChargeTab = true;
    let isNoError = true;

    this.canTableList.forEach((accountDetail: any) => {
      if (accountDetail.cbsNo == '') {
        accountDetail.cbsNoReq = true;
        isNoError = false;
      } else {
        accountDetail.accNoReq = false;
      }
      if (accountDetail.botCCY == '') {
        accountDetail.botCCYReq = true;
        isNoError = false;
      } else {
        accountDetail.botCCYReq = false;
      }
      if (accountDetail.orgAmt == '') {
        accountDetail.orgAmtReq = true;
        isNoError = false;
      } else {
        accountDetail.orgAmtReq = false;
      }
      if (accountDetail.amntutlz == '') {
        accountDetail.amntutlzReq = true;
        isNoError = false;
      } else {
        accountDetail.amntutlzReq = false;
      }
      if (accountDetail.cancelAmt == '') {
        accountDetail.cancelAmtReq = true;
        isNoError = false;
      } else {
        accountDetail.cancelAmtReq = false;
      }
      if (accountDetail.soldCCY == '') {
        accountDetail.soldCCYReq = true;
        isNoError = false;
      } else {
        accountDetail.soldCCYReq = false;
      }

    });
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.chargeDetails.valid && isNoError) {
        this.next();
      }
    }
  }

  onSubmitConvrnTab() {
    this.submitConvrnTab = true;
    // let isNoError = true;
    // if (this.conversionDetailsVal.formDt == '') {
    //   this.conversionDetailsVal.formDtReq = true;
    //   isNoError = false;
    // } else {
    //   this.conversionDetailsVal.soldCCYReq = false;
    // }
    // if (this.conversionDetailsVal.formPlace == '') {
    //   this.conversionDetailsVal.formPlaceReq = true;
    //   isNoError = false;
    // } else {
    //   this.conversionDetailsVal.formPlaceReq = false;
    // }


    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.conversionDetails.valid) {
        this.next();
      }
    }
  }

  showDanger(dangerTpl: any) {
    this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 5000 });
  }

  inputChange(event: any) {
    this.amount = event.target.value;
    this.amountval = this.convertNumberToWords(this.amount)
  }

  convertNumberToWords(s: any) {
    var th = ['', 'thousand', 'million', 'billion', 'trillion'];
    var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s)) return '';
    var x = s.indexOf('.');
    if (x == -1) x = s.length;
    if (x > 15) return 'too big';
    var n = s.split('');
    var str = '';
    var sk = 0;
    for (var i = 0; i < x; i++) {
      if ((x - i) % 3 == 2) {
        if (n[i] == '1') {
          str += tn[Number(n[i + 1])] + ' ';
          i++;
          sk = 1;
        }
        else if (n[i] != 0) {
          str += tw[n[i] - 2] + ' ';
          sk = 1;
        }
      }
      else if (n[i] != 0) {
        str += dg[n[i]] + ' ';
        if ((x - i) % 3 == 0) str += 'hundred ';
        sk = 1;
      }


      if ((x - i) % 3 == 1) {
        if (sk) str += th[(x - i - 1) / 3] + ' ';
        sk = 0;
      }
    }
    if (x != s.length) {
      var y = s.length;
      str += 'point ';
      for (var j = x + 1; j < y; j++) str += dg[n[j]] + ' ';
    }
    return str.replace(/\s+/g, ' ');

  }

  onSubmitSave() {
    this.submitSave = true;
    let isNoErrorOfcDate = true;
    let isNoErrorCon = true;
    if (!this.isRtCvrdwithTrdr) {
      this.rateTableList.forEach((rtCvrDtlsVo: any) => {
        if (rtCvrDtlsVo.frmFcy == '') {
          rtCvrDtlsVo.frmFcyReq = true;
          isNoErrorCon = false;
        } else {
          rtCvrDtlsVo.frmFcyReq = false;
        }
        if (rtCvrDtlsVo.toFcy == '') {
          rtCvrDtlsVo.toFcyReq = true;
          isNoErrorCon = false;
        } else {
          rtCvrDtlsVo.toFcyReq = false;
        }
        if (rtCvrDtlsVo.amnt == '') {
          rtCvrDtlsVo.amntReq = true;
          isNoErrorCon = false;
        } else {
          rtCvrDtlsVo.amntReq = false;
        }
        if (rtCvrDtlsVo.rate == '') {
          rtCvrDtlsVo.rateReq = true;
          isNoErrorCon = false;
        } else {
          rtCvrDtlsVo.rateReq = false;
        }
      });
    }

    const promiseArray: any = [];
    this.forwardMandatoryDocList.forEach((data: any) => {
      if (data.isChckd) {
        var formData: any = new FormData();
        formData.append('file', data.file);
        formData.append('code', data.attchCd);
        promiseArray.push(new Promise((resolve, reject) => {
          this.comservice.saveFile(formData)
            .subscribe((data) => {
              resolve(data)
            }, (err) => {
              reject(err)
            })
        }))
      }
    });

    Promise.all(promiseArray).then((values: any) => {
      var forwardMandatoryDocList: any = []
      if (values && values[0]) {
        try {
          values.forEach((dt: any, index: any) => {
            var found = this.forwardMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
            if (found) {
              forwardMandatoryDocList.push({
                "docAttchNm": dt.docAttchNm,
                "attchCd": found.attchCd,
                "isChckd": 1
              });
            }
          })
        } catch (err) {
          console.log(err)
        }
      }
      let sampleData: any = this.outwardObjData(forwardMandatoryDocList);
      try {
        sampleData['bnfDtls']['name'] = sampleData.bnfDtls.beneNam;
      } catch (error) {

      }
      if (sampleData.sysRefNo === "" && sampleData.transRefNo === "") {
        this.comservice.saveFwrdCntrctForm(sampleData).subscribe(data => {
          this.savedData = data;
          if (data && data.sysRefNo != '') {
            this.fwdCntDtlsVo.patchValue({
              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              fwdCntId: data.fwdCntId,
              taskId: data.taskId,
            });
            if (data && data.historyVoList) {
              this.remarkDetails = data.historyVoList;
            }
          }
          setTimeout(() => {
            this.spinner.hide();
            this.disableAllForm();
            this.currentMode = "view";
            this.modal_body = 'Data Saved successfully';
            this.ref.detectChanges();
            this.modalService.open(this.content, { size: 'sm' });

          }, 2000);
        }, (err) => {
          this.spinner.hide();
          setTimeout(() => {
            this.showDanger('Getting error')
          }, 2000);
        })
      } else {
        this.comservice.updateFwrdCntrctForm(sampleData).subscribe(data => {
          this.savedData = data;
          if (data && data.historyVoList) {
            if (this.currentMode && this.currentMode != "edit") {
              this.remarkDetails = data.historyVoList;
            }
          }
          setTimeout(() => {
            this.spinner.hide();
            this.disableAllForm();
            this.currentMode = "view";
            this.modal_body = 'Data Saved successfully';
            this.ref.detectChanges();
            this.modalService.open(this.content, { size: 'sm' });

          }, 2000);
        }, (err) => {
          this.spinner.hide();
          setTimeout(() => {
            this.modal_body = 'Getting error';
            this.ref.detectChanges();
            this.modalService.open(this.content, { size: 'sm' });
          }, 2000);
        })
      }
    });
  }

  disableAllForm() {
    this.fwdCntDtlsVo.disable()
    this.shipmentDetails.disable()
    this.chargeDetails.disable()
    this.conversionDetails.disable()
    this.officeform.disable()
  }

  getChange(dataProp: any) {
    // this.spinner.show();
    // this.getBeneficiaryDetails();
    try {
      //if (this.AppUserVal.outRmtncCustDtlsVo.custId! = "") {
      //call api and patch value
      const dt = {
        "input": {
          "SessionContext": {
            "BankCode": "15",
            "Channel": "BRN",
            "TransactionBranch": "402",
            "UserId": "SYSTEM"
          },
          "CustId": this.fwdCntDtlsVo.value.fwdCntCustDtlsVo.custId
        }
      }
      this.comservice.getApplicantDetails(this.comservice.getAuthKey())
        .subscribe(data2 => {
          let data = data2;
          if(typeof(data2.body) == "string"){
            data = { body: JSON.parse(data2.body) };
          }
        /*   if (data && data.body && data.body.Response && data.body.Response.CustomerInfoResponse) { */
        if (data && data.body && data.body && data.body.CustomerInfoResponse)
        {
           /*    const rsp = data.body; */
           const rsp = data.body;
            const rcData = rsp.CustomerInfoResponse;
            const client = rsp.client;
            const Cust=rcData.CustomerFullName.slice(0,35);
            console.log(Cust);
            this.fwdCntDtlsVo.patchValue({
              fwdCntCustDtlsVo: {
                //accNo: rcData.AccountNo,
                custId: client,
                custNm:Cust,
                /* custNm: typeof (rcData.CustomerFullName) != 'object' ? rcData.CustomerFullName : '', */
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
            });

            // this.conversionDetails.patchValue({
            //   dclrNm: typeof (rcData.CustomerFullName) != 'object' ? rcData.CustomerFullName : ''
            // })
          } else {
            // this.spinner.hide();
            //this.spinner.hide();
            this.showDanger('No such data')
          }

        }, (err) => {
          // this.spinner.hide();
          //this.spinner.hide();
          this.showDanger('Something went wrong')
        })
    } catch (error) {
      //console.log(error);
    }
  }
  outwardObjData(forwardMandatoryDocList: any) {

    const officeUse: any = this.officeform.value

    const canTableList: any = [];
    if (this.canTableList && this.canTableList.length) {
      this.canTableList.forEach((element: any) => {
        canTableList.push({
          cbsNo: element.frwdCntrctNo,
          srNo: 1,
          botCCY: element.fcy,
          orgAmt: element.orgnlAmnt,
          amntutlz: element.utlizAmnt,
          cancelAmt: element.amntUtilizd,
          soldCCY: element.frgnBnkChrgs,

        })
      });
    }

    const rateTableList: any = [];
    if (this.rateTableList && this.rateTableList.length) {
      this.rateTableList.forEach((element: any) => {
        rateTableList.push({
          toFcy: element.toFcy,
          srNo: 1,
          frmFcy: element.frmFcy,
          amnt: element.amnt,
          rate: element.rate,
          retAdno: element.retAdno
        })
      });
    }

    if (this.isRtCvrdwithTrdr) {
      this.rateTableList.splice();
    }

    let sampleData = {
      "fwdCntId": "",
      "encFwdCntId": "",
      "encTaskId": "",
      "fwdCntStatus": "",
      "taskId": "",
      "sysRefNo": "",
      "transRefNo": "",
      "sysRefDt": "",
      "appRefDt": "",
      "currency": this.shipmentDetailsVal.currency,
      "amount": +this.shipmentDetailsVal.amount,
      "amntWords": this.amountval,
      "fwdCntCustDtls": this.fwdCntDtlsVal.fwdCntCustDtlsVo,
      "formCmmnAcc": {
        "formCmmnAccId": null,
        "formAccDtlsList": [],
        "totAccAmnt": ".0",
        "isFrwdCntrct": 0,
        "formFrwdCntrctDtlsList": null,
        "totFrwdCntrct": null,
        "isRtCvrWithTrDr": this.isRtCvrdwithTrdr === false ? 1 : 0,
        "formRtCvrDtlsList": this.rateTableList,
        "totRtCvrAmnt": this.rateTableTotal
      },
      "officeUse": {
        "officeAttchList": forwardMandatoryDocList,
        // "officeUseId": null,
        // "officeAttchList": [
        //     {
        //         "attchId": 5626,
        //         "encAttchId": null,
        //         "rowIndx": null,
        //         "attchCd": "STAMPED_FORWARD",
        //         "attchNm": "STAMPED FORWARD CONTRACT",
        //         "attchValue": "20210303_1205197454820073_STAMPED_FORWARD.docx",
        //         "attchPath": "null/20210303_1205197454820073_STAMPED_FORWARD.docx",
        //         "isChckd": 1,
        //         "atchmnt": null,
        //         "scanAttchNm": null,
        //         "docAttchNm": null
        //     }
        // ],
      },
      "fwdCntDtls": {
        "brnchNmMng": this.fwdCntDtlsVal.brnchNmMng,
        "dpCodeMng": this.fwdCntDtlsVal.dpCodeMng,
        "expimpRdio": this.fwdCntDtlsVal.expimpRdio,
        "contractRdio": this.fwdCntDtlsVal.contractRdio,
        "deliveryRdio": this.fwdCntDtlsVal.deliveryRdio,
        "cbs": this.fwdCntDtlsVal.cbs,
        "cntDate": this.fwdCntDtlsVal.cntDate,
        "depAcc": this.fwdCntDtlsVal.depAcc,
        "agnstCurr": this.shipmentDetailsVal.agnstCurr,
        "agnstAmt": this.shipmentDetailsVal.agnstAmt,
        "draftDays": this.shipmentDetailsVal.draftDays,
        "valDate": this.shipmentDetailsVal.valDate != "" ? moment(this.shipmentDetailsVal.valDate).format('YYYY-MM-DDTHH:mm:ssZZ') : "",
        "fdStDate": this.shipmentDetailsVal.fdStDate != "" ? moment(this.shipmentDetailsVal.fdStDate).format('YYYY-MM-DDTHH:mm:ssZZ') : "",
        "fdEdDate": this.shipmentDetailsVal.fdEdDate != "" ? moment(this.shipmentDetailsVal.fdEdDate).format('YYYY-MM-DDTHH:mm:ssZZ') : "",
        "docStDate": this.shipmentDetailsVal.docStDate != "" ? moment(this.shipmentDetailsVal.docStDate).format('YYYY-MM-DDTHH:mm:ssZZ') : "",
        "docEdDate": this.shipmentDetailsVal.docEdDate != "" ? moment(this.shipmentDetailsVal.docEdDate).format('YYYY-MM-DDTHH:mm:ssZZ') : "",

        "takeConvsnRtOnBhlf": this.chargeDetailsVal.takeConvsnRtOnBhlf === true ? 1 : 0,
        "isFrwdCntrct": 0,
        "totalRtCvrOffAmnt": "",
        "docDelivery": this.fwdCntDtlsVal.docDelivery,
        "dlvryOfFunds": this.fwdCntDtlsVal.dlvryOfFunds,
        "formDt": this.conversionDetailsVal.formDt,
        "formPlace": this.conversionDetailsVal.formPlace,
        "signature": null,
        "auditDetails": null,
        "fwdcntdtlsId": null
      },
      "fwdCntMantryDoc": null,
      "fwdCntCancelList": this.canTableList,
      "historyList": [
        // {
        //     "deptId": null,
        //     "processTypeId": null,
        //     "processStatusId": null,
        //     "taskId": null,
        //     "remarks": null,
        //     "pendingDays": 0,
        //     "statChngdBy": null,
        //     "statChngdUser": "HOME BRANCH",
        //     "processStatus": "Pending",
        //     "statChngdDt": "03-Mar-2021 16:30",
        //     "contNo": null,
        //     "usrId": null,
        //     "auditDetails": null,
        //     "processHistoryId": null
        // }
      ],
      "aprvRmrks": null,
      "priority": "LOW",
      // "fwdCntStatusId": 3,
      "error": null,
      "custNm": null,
      "wrkInPrgs": false,
      "contrefno": null,
      "isEditable": false,
      "isWrkInPrgs": false
    }
    if (this.savedData && this.savedData.sysRefNo != '' && this.savedData.sysRefNo != undefined) {
      sampleData.sysRefNo = this.savedData.sysRefNo;
      sampleData.transRefNo = this.savedData.transRefNo;
      // sampleData.isEditable = this.savedData.isEditable ;
      sampleData.fwdCntId = this.savedData.fwdCntId;
      sampleData.taskId = this.savedData.taskId;
    }
    try {
      if (sampleData.fwdCntCustDtls.dpCode.toString().length == 3) {
        sampleData.fwdCntCustDtls.dpCode = "0" + sampleData.fwdCntCustDtls.dpCode
      }
      if (sampleData.fwdCntCustDtls.dpCode.toString().length == 2) {
        sampleData.fwdCntCustDtls.dpCode = "00" + sampleData.fwdCntCustDtls.dpCode
      }
    } catch (err) {
      console.log(err);
    }

    return sampleData;
  }

  loadView() {
    let snapshotParam = this.activatedRoute.snapshot.paramMap.get("fwdCntId");
    this.activatedRoute.paramMap.subscribe(params => {
      const fwdCntId = params.get("fwdCntId");
      const taskId = params.get("taskId");
      const mode = params.get("mode");
      this.currentMode = params.get("mode");

      let method = this.comservice.getFwrdCntrctView(taskId, fwdCntId);
      if (mode == 'edit') {
        method = this.comservice.getFwrdCntrctEdit(taskId, fwdCntId);
      }
      if (fwdCntId && fwdCntId != "") {
        method.subscribe((data: any) => {
          // save logic earlier
          this.savedData = data;
          if (data && data.sysRefNo != '' && data.sysRefNo != null) {

            if (data && data.historyVoList) {
              if (mode !== 'edit') {
                this.remarkDetails = data.historyVoList;
              }
            }
            //save logic earlier ends
            try {
              this.viewData = data
              var auditDetails = this.viewData["auditDetails"];
              var formCmmnAccc = this.viewData["formCmmnAcc"];
              var formRtCvrDtlsList: any = []
              formRtCvrDtlsList = formCmmnAccc["formRtCvrDtlsList"]
              this.rateTableList = formRtCvrDtlsList
              var fwdCntCancelList: any = []
              fwdCntCancelList = this.viewData["fwdCntCancelList"]
              this.canTableList = fwdCntCancelList
              var fwdCntDtls = this.viewData["fwdCntDtls"];
              this.amountval = this.viewData.amntWords
            } catch (err) {
              //  console.log(err);
            }

            if (fwdCntId != null) {
              try {
                this.fwdCntDtlsVo.patchValue({
                  sysRefDt: new Date(this.viewData.sysRefDt),
                  appRefDt: new Date(this.viewData.appRefDt)
                });
              } catch (error) {

              }
              try {
                this.fwdCntDtlsVo.patchValue({
                  fwdCntId: fwdCntId,
                  taskId: this.viewData.taskId,
                  sysRefNo: this.viewData.sysRefNo,
                  transRefNo: this.viewData.transRefNo,
                  //sysRefDt: new Date(this.viewData.sysRefDt),
                  // appRefDt: new Date(this.viewData.appRefDt),
                  fwdCntCustDtlsVo: this.viewData.fwdCntCustDtls,
                  brnchNmMng: fwdCntDtls.brnchNmMng,
                  dpCodeMng: fwdCntDtls.dpCodeMng,
                  expimpRdio: fwdCntDtls.expimpRdio,
                  contractRdio: fwdCntDtls.contractRdio,
                  deliveryRdio: fwdCntDtls.deliveryRdio,
                  depAcc: fwdCntDtls.depAcc,
                  cntDate: fwdCntDtls.cntDate,
                  cbs: fwdCntDtls.cbs,
                  docDelivery: fwdCntDtls.docDelivery,
                  dlvryOfFunds: fwdCntDtls.dlvryOfFunds,
                });

                this.shipmentDetails.patchValue({
                  currency: this.viewData.currency,
                  amount: this.viewData.amount,
                  valDate: fwdCntDtls.valDate,
                  fdStDate: fwdCntDtls.fdStDate,
                  fdEdDate: fwdCntDtls.fdEdDate,
                  agnstAmt: fwdCntDtls.agnstAmt,
                  agnstCurr: fwdCntDtls.agnstCurr,
                  docEdDate: fwdCntDtls.docEdDate,
                  docStDate: fwdCntDtls.docStDate,
                  draftDays: fwdCntDtls.draftDays,
                }),

                  this.chargeDetails.patchValue({
                    takeConvsnRtOnBhlf: fwdCntDtls.takeConvsnRtOnBhlf,
                  }),
                  this.conversionDetails.patchValue({
                    formDt: fwdCntDtls.formDt,
                    formPlace: fwdCntDtls.formPlace,
                  }),
                  this.officeform.patchValue({

                  })
                this.isRtCvrdwithTrdr = formCmmnAccc.isRtCvrWithTrDr === 1 ? false : true;
                if (formCmmnAccc.formRtCvrDtlsList && formCmmnAccc.formRtCvrDtlsList.length) {
                  this.rateTableList = formCmmnAccc.formRtCvrDtlsList;
                  this.rateTableTotal = formCmmnAccc.totRtCvrAmnt;
                }

                if (this.viewData.fwdCntId !== 3) {
                  this.isApproved = true;
                }
                if (!this.viewData.isEditable) {
                  this.disableAllForm();
                }
              } catch (err) {
                // console.log(err);
              }

            }
          }

        })
      }
    }, error => {
      console.log(error);
    });
  }

  get isEditable() {
    return this.currentMode == "view" ? true : false;
  }

  get canUpdate() {
    if (this.savedData && this.savedData.fwdCntStatusId && this.savedData.fwdCntStatusId != "") {
      if ([3, 4, 7].indexOf(this.savedData.fwdCntStatusId) != -1) {
        if (this.currentMode && this.currentMode == "edit") {
          return true;
        }
      }
    }

    return false;
  }

  get canAppRej() {
    if (this.savedData && this.savedData.fwdCntStatusId && this.savedData.fwdCntStatusId != "") {
      if ([3].indexOf(this.savedData.fwdCntStatusId) != -1 && (this.savedData.aprvRmrks === '' || this.savedData.aprvRmrks === null)) {
        return true;
      }
    }
    return false;
  }

  get isDraft() {
    if (this.savedData && this.savedData.fwdCntStatusId && this.savedData.fwdCntStatusId != "") {
      if ([4].indexOf(this.savedData.fwdCntStatusId) != -1) {
        return true;
      }
    }
    if (this.savedData && typeof (this.savedData.transRefNo) == "undefined") {
      return true;
    }
    return false;
  }

  showSuccess(msg: any) {
    this.toastService.show(msg, { classname: 'bg-success text-light', delay: 5000 });
  }

  openApproveModal(content: any) {
    this.approveModalRef = this.modalService.open(content);
  }
  approveForm() {
    if (this.approveremarks != '') {
      this.approveModalRef.close();
      this.spinner.show();
      this.savedData.aprvRmrks = this.approveremarks;
      this.comservice.approveFwrdCntrctForm(this.savedData)
        .subscribe((data) => {
          this.savedData = data;
          if (data && data.historyVoList) {
            this.remarkDetails = data.historyVoList;
          }
          this.isApproved = true;
          this.spinner.hide();
          this.showSuccess('Approve Successfully');
        }, () => {
          this.spinner.hide();
          this.showSuccess('Approve Failed');
        })
    }

  }
  openRejectModal(content: any) {
    this.rejectModalRef = this.modalService.open(content);
  }
  rejectForm() {
    if (this.rejectremarks != '') {
      this.rejectModalRef.close();
      this.spinner.show();
      this.savedData.aprvRmrks = this.rejectremarks;
      this.comservice.rejectFwrdCntrctForm(this.savedData)
        .subscribe((data) => {
          this.savedData = data;
          if (data && data.historyVoList) {
            this.remarkDetails = data.historyVoList;
          }
          this.isApproved = true;
          this.showSuccess('Reject Successfully');
          this.spinner.hide();
        }, () => {
          this.showSuccess('Rejection Failed');
          this.spinner.hide();
        })
    }
  }

  public modal_body_2: any = '';
  public fileList: any = [];
  setFileForDocument($event: any, index: any) {
    const file = $event.target.files[0];
    if (file.type === 'application/pdf' && file.size < (1024 * 1024 * 5)) {
      this.forwardMandatoryDocList[index].file = $event.target.files[0];
    } else {
      this.modal_body_2 = 'Please select only PDF file and size less than 5 MB.';
      this.modalService.open(this.contentbodyred, { size: 'sm' });
      delete  this.forwardMandatoryDocList[index].file ;
    }
  }

  goTo(no: any) {
    this.stepper.to(no);
  }

  isDraftValid() {
    // check if first form is valid
    if (!this.fwdCntDtlsVo.valid) {
      this.submitSave = true;
      this.goTo(1);
      return 0
    }
    return 1
  }

  saveDraft() {
    if (this.isDraftValid() == 0) {
      return 0
    }
    this.spinner.show();
    // Upload File and set in the data to send 
    const promiseArray: any = [];
    this.forwardMandatoryDocList.forEach((data: any) => {
      if (data.isChckd) {
        var formData: any = new FormData();
        formData.append('file', data.file);
        formData.append('code', data.attchCd);
        promiseArray.push(new Promise((resolve, reject) => {
          this.comservice.saveFile(formData)
            .subscribe((data) => {
              resolve(data)
            }, (err) => {
              reject(err)
            })
        }))
      }
    });

    Promise.all(promiseArray).then((values: any) => {
      var forwardMandatoryDocList: any = []
      if (values && values[0]) {
        try {
          values.forEach((dt: any, index: any) => {
            var found = this.forwardMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
            if (found) {
              forwardMandatoryDocList.push({
                "docAttchNm": dt.docAttchNm,
                "attchCd": found.attchCd,
                "isChckd": 1
              });
            }
          })
        } catch (err) {
          console.log(err)
        }
      }
      let sampleData: any = this.outwardObjData(forwardMandatoryDocList);
      try {
        sampleData['bnfDtls']['name'] = sampleData.bnfDtls.beneNam;
      } catch (error) {

      }
      if (sampleData.sysRefNo === "" && sampleData.transRefNo === "") {
        this.comservice.draftFwrdCntrctForm(sampleData).subscribe(data => {
          this.savedData = data;
          if (data && data.sysRefNo != '') {
            this.fwdCntDtlsVo.patchValue({
              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              fwdCntId: data.fwdCntId,
              taskId: data.taskId,
            });
            if (data && data.historyVoList) {
              this.remarkDetails = data.historyVoList;
            }
          }
          setTimeout(() => {
            this.spinner.hide();
            this.disableAllForm();
            this.currentMode = "view";
            this.modal_body = 'Data Saved successfully';
            this.ref.detectChanges();
            this.modalService.open(this.content, { size: 'sm' });

          }, 2000);
        }, (err) => {
          this.spinner.hide();
          setTimeout(() => {
            this.showDanger('Getting error')
          }, 2000);
        })
      } else {
        this.comservice.updateDraftFwrdCntrctForm(sampleData).subscribe(data => {
          this.savedData = data;
          if (data && data.historyVoList) {
            if (this.currentMode && this.currentMode != "edit") {
              this.remarkDetails = data.historyVoList;
            }
          }
          setTimeout(() => {
            this.spinner.hide();
            this.disableAllForm();
            this.currentMode = "view";
            this.modal_body = 'Data Saved successfully';
            this.ref.detectChanges();
            this.modalService.open(this.content, { size: 'sm' });

          }, 2000);
        }, (err) => {
          this.spinner.hide();
          setTimeout(() => {
            this.modal_body = 'Getting error';
            this.ref.detectChanges();
            this.modalService.open(this.content, { size: 'sm' });
          }, 2000);
        })
      }
    });
  }

  getForwardMandatoryDoc() {
    this.comservice.getForwardMandatoryDoc().subscribe(data => {
      setTimeout(() => {
        data.subCommonMasterList.forEach((element: any, index: any) => {
          this.forwardMandatoryDocList.push(
            {
              attchId: null,
              encAttchId: index,
              rowIndx: index,
              attchValue: null,
              attchCd: element.code,
              attchNm: element.value,
              attchPath: '',
              atchmnt: '',
              scanAttchNm: '',
              isChckd: false,
            },
          )
          this.ref.detectChanges();
        });
      }, 1000)

    })
  }

  checkedFileList($event: any, index: any, outwardDoc: any) {
    if (!$event) {
      this.forwardMandatoryDocList[index].file = "";
      this.forwardMandatoryDocList[index].isChckd = false;
      if (this.savedData && this.savedData.officeUse) {
        this.savedData.officeUse.officeAttchList.forEach((element: any, index: any) => {
          if (element && element.attchCd === outwardDoc.attchCd) {
            element.docAttchNm = "";
            element.attchPath = "";
            element.attchValue = "";
          }
        });
      }
      this.forwardMandatoryDocList[index].docAttchNm = "";

    } else {
      this.forwardMandatoryDocList[index].isChckd = true;
    }
  }

  isThisFieldRequired(outwardDoc: any, $event: any) {
    if (outwardDoc && outwardDoc.attchCd) {
      var found = this.forwardMandatoryDocList.find((o: any) => o.attchCd === outwardDoc.attchCd);
      if (outwardDoc.attchCd == 'SIGN_CPY_APP') {
        if ((!found || !found.file || !found.file.name) && (found.docAttchNm == "" || typeof (found.docAttchNm) == 'undefined')) {
          return true;
        }
        if (found && found.docAttchNm != "") {
          return false;
        }
      }
      else {
        if (found.isChckd == true) {
          if ((!found || !found.file || !found.file.name) && (found.docAttchNm == "" || typeof (found.docAttchNm) == 'undefined')) {
            return true;
          }
          if (found && found.docAttchNm != "") {
            return false;
          }
        }
      }
    }
    return false;
  }

  getImageText(txt: any) {
    var dt = "";
    try {
      if (this.savedData && this.savedData.officeUse && this.savedData.officeUse.officeAttchList) {
        var found = this.savedData.officeUse.officeAttchList.find((o: any) => o.docAttchNm.indexOf(txt) !== -1);
        if (found) {
          dt = found.docAttchNm;
        }
      }
    } catch (err) { }
    try {
      var found = this.savedData.officeUse.officeAttchList.find((o: any) => o.attchValue.indexOf(txt) !== -1);
      if (found) {
        dt = found.attchValue;
      }

    } catch (err) { }
    return dt
  }

  viewDoc(outwardDoc: any) {
    var found = this.savedData.officeUse.officeAttchList.find((o: any) => outwardDoc.attchCd === o.attchCd);
    const dt = {
      filePath: found.attchPath,
      fileNm: found.attchValue,
    }
    try {
      const pt = environment.app_url
      window.open(pt + "/docView/" + found.attchPath, '_blank')
      return false;
    } catch (error) {
      // console.log(error)
    }

  }

  getFileText($event: any) {
    if (this.forwardMandatoryDocList) {
      var found = this.forwardMandatoryDocList.find((o: any) => o.attchCd === $event);
      if (found && found.file && found.file.name) {
        const frm = found.file.name;
        if (frm != '') {
          return frm.replace(/\\$/, '').split('\\').pop();;
        }
      }
    }
    return 'Choose File'
  }

}
