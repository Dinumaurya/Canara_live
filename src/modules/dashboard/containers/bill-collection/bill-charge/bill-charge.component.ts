import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { DashboardService } from '@modules/dashboard/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BillApplicantComponent } from '../bill-applicant/bill-applicant.component';

@Component({
  selector: 'sb-bill-charge',
  templateUrl: './bill-charge.component.html',
  styleUrls: ['./bill-charge.component.scss']
})
export class BillChargeComponent implements OnInit {
  @Input() childMessage!: string;
  @Input() applicantValue: any;
  @Input() informParent!: string;
  billChargeForm: FormGroup;
  accountDetailTabl1Total = 0;
  public conversationDetailForm1Total = 0;
  canarabankDetails: any = [];
  @ViewChild('billApplicantt', { static: false }) billApplicantt!: BillApplicantComponent;
  accountDetailsList: any = [];
  submittedNBillChargeFrom4: boolean = false;
  @Output('billChargeEvent') billChargeEvent = new EventEmitter();
  accountTypeList: any = [];
  currency: any = [];
  conversionList: any = [];
  conversionList2Table: any = []
  public conversionList2TableeTotal = 0
  otherbankDetails: any = [];

  constructor(private formBuilder: FormBuilder, private comservice: AppCommonService,
    private dashboardService: DashboardService, public fh: FormHelperService,
    private modalService: NgbModal,
    private ref: ChangeDetectorRef,
  ) {

    this.billChargeForm = this.formBuilder.group({
      isPreSpmtAvl: new FormControl('', []),
      isPckgCredit: new FormControl('', []),
      pcfcNum: new FormControl('', []),
      isNocPreSpmtAvl: new FormControl('', []),
      isCanaraBnk: new FormControl('', []),
      formCmmnAccVo: this.formBuilder.group({
        isDtlsofFrwdCntrct: new FormControl('', []),
      }),
      expBillOthrDtlsVo: this.formBuilder.group({
        bankName: new FormControl('', []),

        accNum: new FormControl('', []),
        swiftCode: new FormControl('', []),
        interSwiftCode: new FormControl('', []),
        isSwftCodeNotAvl: new FormControl('', []),
        bnkName: new FormControl('', []),
        fullAdd: new FormControl('', []),
        abaCode: new FormControl('', []),
        swiftBnkAbaCdDesc: new FormControl('', []),

      }),
    })
  }
  isNoBeneficiary() {
    const expBillOthrDtlsVo = this.billChargeForm.value.expBillOthrDtlsVo;
    if (expBillOthrDtlsVo.isSwftCodeNotAvl && this.submittedNBillChargeFrom4) {
      if (expBillOthrDtlsVo.bnkName == '') {
        return false;
      }
      if (expBillOthrDtlsVo.fullAdd == '') {
        return false;
      }
      if (expBillOthrDtlsVo.abaCode == '') {
        return false;
      }
      if (expBillOthrDtlsVo.swiftBnkAbaCdDesc == '') {
        return false;
      }
    }
    return true;
  }


  get appUserVal() {
    return this.billApplicantt.appUserVal();
  }
  ngOnInit(): void {

  }
  onChnageCanara(event: any) {
    if (event.target.value == 'OTHR_BNK') {
      this.canarabankDetails = [];
    } else if (event.target.value == 'CAN_BNK') {
      this.otherbankDetails = [];
    }
  }
  accountDetailTabl1TotalCal() {
    let total = 0;
    this.accountDetailsList.forEach((element: any) => {
      total += (+element.amnt)
    });
    this.accountDetailTabl1Total = total;
  }
  get billChargeValue() {
    return this.billChargeForm.value;
  }
  getAccTp() {
    this.comservice.accType().subscribe(data => {
      this.accountTypeList = data.subCommonMasterList;
    })
  }
  getCurrency() {
    this.comservice.getCurrency().subscribe(data => {
      this.currency = data;
      this.currency = this.currency.sort((a: any, b: any) => a.code.localeCompare(b.code))

    })
  }
  public ABA_CDlist = []
  ngAfterViewInit() {
    setTimeout(() => {

    }, 2000);

    this.getAccTp();
    this.getCurrency();
    this.getABA_CD();
  }
  getABA_CD() {
    this.comservice.getABA_CD().subscribe(data => {
      this.ABA_CDlist = data.subCommonMasterList;

    })
  }
  public onAddRowClick(): void {
    if ((this.accountDetailsList == null || this.accountDetailsList == undefined)) {
      this.accountDetailsList = [];
    }
    this.accountDetailsList.push({
      accDtlsId: "",
      srNo: 1,
      accNo: "",
      accTp: "",
      fcy: "",
      amnt: "",
    });
  }
  deleteAccountDetail(index: any) {
    this.accountDetailsList.splice(index, 1);
    this.accountDetailTabl1TotalCal();
  }
  public currentMode: any = "edit";

  get isEditable() {
    return this.currentMode == "view" ? true : false;
  }
  isCanaraBnkReq() {
    if (this.applicantValue.bills == 'ADV_PYMNT_RCVD'
      && !this.billChargeValue.isCanaraBnk) {
      return false;
    }
    return true;
  }
  onSubmitBankForm4() {
    this.submittedNBillChargeFrom4 = true;
    let isNoError = true;

    this.accountDetailsList.forEach((accountDetail: any) => {
      if (accountDetail.accNo == '') {
        accountDetail.accNoReq = true;
        isNoError = false;
      } else {
        accountDetail.accNoReq = false;
      }
      if (accountDetail.accNo !== '' && accountDetail.accNo.length > 13) {
        accountDetail.accNoMax = true;
        isNoError = false;
      }
      if (accountDetail.accTp == '') {
        accountDetail.accTpReq = true;
        isNoError = false;
      } else {
        accountDetail.accTpReq = false;
      }
      if (accountDetail.fcy == '') {
        accountDetail.fcyReq = true;
        isNoError = false;
      } else {
        accountDetail.fcyReq = false;
      }
      if (accountDetail.amnt == '') {
        accountDetail.amountReq = true;
        isNoError = false;
      } else {
        accountDetail.amountReq = false;
      }

    });
    let isNoErrorConDet = true;
    if (this.conversionList) {
      this.conversionList.forEach((row: any) => {
        if (row.frwdCntrctNo == '') {
          row.frwdCntrctNoReq = true;
          isNoErrorConDet = false;
        } else {
          row.frwdCntrctNoReq = false;
        }
        if (row.fcy == '') {
          row.fcyReq = true;
          isNoErrorConDet = false;
        } else {
          row.fcyReq = false;
        }
        if (row.orgnlAmnt == '') {
          row.orgnlAmntReq = true;
          isNoErrorConDet = false;
        } else {
          row.orgnlAmntReq = false;
        }
        if (row.utlizAmnt == '') {
          row.utlizAmntReq = true;
          isNoErrorConDet = false;
        } else {
          row.utlizAmntReq = false;
        }
        if (row.amntUtilizd == '') {
          row.amntUtilizdReq = true;
          isNoErrorConDet = false;
        } else {
          row.amntUtilizdReq = false;
        }
        if (row.frgnBnkChrgs == '') {
          row.frgnBnkChrgsReq = true;
          isNoErrorConDet = false;
        } else {
          row.frgnBnkChrgsReq = false;
        }

      });
    }


    let isNoErrorConDetForm3 = true;
    if (this.conversionList2Table) {
      this.conversionList2Table.forEach((row: any) => {
        if (row.pcfcCntractRefNo == '') {
          row.pcfcCntractRefNoReq = true;
          isNoErrorConDetForm3 = false;
        } else {
          row.pcfcCntractRefNoReq = false;
        }
        if (row.fcy == '') {
          row.fcyReq = true;
          isNoErrorConDetForm3 = false;
        } else {
          row.fcyReq = false;
        }
        if (row.loanAmount == '') {
          row.loanAmountReq = true;
          isNoErrorConDetForm3 = false;
        } else {
          row.loanAmountReq = false;
        }
        if (row.loanAdjst == '') {
          row.loanAdjstReq = true;
          isNoErrorConDetForm3 = false;
        } else {
          row.loanAdjstReq = false;
        }
        if (row.outstdngAmt == '') {
          row.outstdngAmtReq = true;
          isNoErrorConDetForm3 = false;
        } else {
          row.outstdngAmtReq = false;
        }
        if (row.amntToBeUtlzed == '') {
          row.amntToBeUtlzedReq = true;
          isNoErrorConDetForm3 = false;
        } else {
          row.amntToBeUtlzedReq = false;
        }

      });
    }


    let isNoErrorConCanCharge = true;
    if (this.canarabankDetails) {
      this.canarabankDetails.forEach((row: any) => {
        if (row.cntctRefNum == '') {
          row.cntctRefNumReq = true;
          isNoErrorConCanCharge = false;
        } else {
          row.cntctRefNumReq = false;
        }
        if (row.fcy == '') {
          row.fcyReq = true;
          isNoErrorConCanCharge = false;
        } else {
          row.fcyReq = false;
        }
        if (row.oriAmnt == '') {
          row.oriAmntReq = true;
          isNoErrorConCanCharge = false;
        } else {
          row.oriAmntReq = false;
        }
        if (row.utiAmnt == '') {
          row.utiAmntReq = true;
          isNoErrorConCanCharge = false;
        } else {
          row.utiAmntReq = false;
        }
      });
    }


    let isNoErrorConCanOther = true;
    if (this.otherbankDetails) {
      this.otherbankDetails.forEach((row: any) => {
        if (row.eFIRCRefNo == '') {
          row.eFIRCRefNoReq = true;
          isNoErrorConCanOther = false;
        } else {
          row.eFIRCRefNoReq = false;
        }
        if (row.fcy == '') {
          row.fcyReq = true;
          isNoErrorConCanOther = false;
        } else {
          row.fcyReq = false;
        }
        if (row.oriAmntOthr == '') {
          row.oriAmntOthrReq = true;
          isNoErrorConCanOther = false;
        } else {
          row.oriAmntOthrReq = false;
        }
        if (row.utiAmntOthr == '') {
          row.utiAmntOthrReq = true;
          isNoErrorConCanOther = false;
        } else {
          row.utiAmntOthrReq = false;
        }
      });
    }
    if (!this.isCanaraBnkReq()) {
      return false;
    }
    try {
      if (this.applicantValue.bills == 'DIRCT_EXPRT_DSCNT') {
        if (this.accountDetailsList && this.accountDetailsList.length === 0) {
          return false
        }
      }
      if (this.applicantValue.bills == 'ADV_PYMNT_RCVD'
        && this.billChargeValue.isCanaraBnk == 'CAN_BNK'
        && this.canarabankDetails.length === 0) {
        return false
      }
      if (this.applicantValue.bills == 'ADV_PYMNT_RCVD'
        && this.billChargeValue.isCanaraBnk == 'OTHR_BNK'
        && this.otherbankDetails.length === 0) {
        return false
      }
    } catch (error) {
      console.log("err", error);
      return true;
    }
    if (this.billChargeForm.valid &&
      isNoError &&
      isNoErrorConDet &&
      isNoErrorConDetForm3 &&
      isNoErrorConCanCharge &&
      isNoErrorConCanOther) {
      return true;
    }
  }
  deleteConversionDetail(index: any) {
    this.conversionList.splice(index, 1);
    this.getConversationDetailForm1Total();
  }
  PackingdeleteConversionDetail(index: any) {
    this.conversionList2Table.splice(index, 1);
    this.getConversationDetailForm2Total();
  }
  getConversationDetailForm1Total() {
    let total = 0;
    if (this.conversionList && this.conversionList.length) {
      this.conversionList.forEach((element: any) => {
        total += (+element.amntUtilizd)
      });
    }
    this.conversationDetailForm1Total = total;
  }


  getConversationDetailForm2Total() {
    let total = 0;
    if (this.conversionList2Table && this.conversionList2Table.length) {
      this.conversionList2Table.forEach((element: any) => {
        total += (+element.outstdngAmt)
      });
    }
    this.conversionList2TableeTotal = total;
  }
  getErrorBillCharge(controlName: any) {
    if (this.submittedNBillChargeFrom4) {
      return this.fh.formInputError(this.billChargeForm, controlName);
    }
    return '';
  }
  public onAddRowConvrsion(): void {
    if ((this.conversionList == null || this.conversionList == undefined)) {
      this.conversionList = [];
    }
    this.conversionList.push({
      frwdCntrctNo: "",
      frwdCntrctDtlsId: 2677,
      srNo: null,
      fcy: "",
      orgnlAmnt: "",
      utlizAmnt: "",
      amntUtilizd: "",
      frgnBnkChrgs: "",
    });
  }
  public PackingonAddRowConvrsion(): void {
    if ((this.conversionList2Table == null || this.conversionList2Table == undefined)) {
      this.conversionList2Table = [];
    }
    this.conversionList2Table.push({
      pcfcCntractRefNo: "",
      fcy: '',
      srNo: null,
      loanAmount: "",
      loanAdjst: "",
      outstdngAmt: "",
      amntToBeUtlzed: "",
    });
  }
  public onAddRowChargeCanara(): void {
    if ((this.canarabankDetails == null || this.canarabankDetails == undefined)) {
      this.canarabankDetails = [];
    }
    this.canarabankDetails.push({
      cntctRefNum: "",
      srNo: 1,
      fcy: "",
      oriAmnt: "",
      utiAmnt: "",
    });
  }
  deleteChargeCanara(index: any) {
    this.canarabankDetails.splice(index, 1);
    this.accountDetailTabl1TotalCal();
  }
  public onAddRowChargeOther(): void {
    if ((this.otherbankDetails == null || this.otherbankDetails == undefined)) {
      this.otherbankDetails = [];
    }
    this.otherbankDetails.push({
      eFIRCRefNo: "",
      srNo: 1,
      fcy: "",
      oriAmntOthr: "",
      utiAmntOthr: "",
    });
  }
  deleteChargeOther(index: any) {
    this.otherbankDetails.splice(index, 1);
    this.accountDetailTabl1TotalCal();
  }
}
