import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { DashboardService } from '@modules/dashboard/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImportBillApplicantComponent } from '../import-bill-applicant/import-bill-applicant.component';

@Component({
  selector: 'sb-import-bill-charge',
  templateUrl: './import-bill-charge.component.html',
  styleUrls: ['./import-bill-charge.component.scss']
})
export class ImportBillChargeComponent implements OnInit {
  @Input() childMessage!: string;
  @Input() informParent!: string;
  @Input() billApplicant !: any;
  @Output('billChargeEvent') billChargeEvent = new EventEmitter();
  public billChargeForm: FormGroup;
  public accountDetailTabl1Total = 0;
  public conversationDetailForm1Total = 0;
  public accDtlsVoList: any = [];
  public submitted: boolean = false;
  public accountTypeList: any = [];
  public currency: any = [];
  public billOfEntryVoList: any = [];
  public otherbankDetails: any = [];
  public formFrwdCntrctDtlsList: any = [];
  public utilizeTotal = 0;
  public ABA_CDlist = []
  constructor(
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
    public fh: FormHelperService,
  ) {
    this.billChargeForm = this.formBuilder.group({
      isBillEntry: new FormControl('', [Validators.required]),
      billRemarks: new FormControl('', []),
      formCmmnAccVo: this.formBuilder.group({
        isDtlsofFrwdCntrct: new FormControl(false, []),
      })
    })
  }
  /**
   * 
   * @param event 
   */
  onChnageCanara(event: any) {
    if (event.target.value == 'YES') {
      this.billOfEntryVoList = [];
      this.conversationDetailForm1Total = 0;
    }
  }
  isNoBeneficiary() {
    const expBillOthrDtlsVo = this.billChargeForm.value.expBillOthrDtlsVo;
    if (expBillOthrDtlsVo.isSwftCodeNotAvl && this.submitted) {
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
    if (this.billApplicant) {
      return this.billApplicant;
    }
    return {};
  }
  ngOnInit(): void {

  }
  accountDetailTabl1TotalCal() {
    let total = 0;
    this.accDtlsVoList.forEach((element: any) => {
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
    if ((this.accDtlsVoList == null || this.accDtlsVoList == undefined)) {
      this.accDtlsVoList = [];
    }
    this.accDtlsVoList.push({
      accDtlsId: "",
      srNo: 1,
      accNo: "",
      accTp: "",
      fcy: "",
      amnt: "",
    });
  }
  deleteAccountDetail(index: any) {
    this.accDtlsVoList.splice(index, 1);
    this.accountDetailTabl1TotalCal();
  }
  public currentMode: any = "edit";

  get isEditable() {
    return this.currentMode == "view" ? true : false;
  }
  onSubmitBankForm4() {
    this.submitted = true;
    let isNoError = true;
    if (this.accDtlsVoList.length === 0) {
      isNoError = false;
    }
    this.accDtlsVoList.forEach((accountDetail: any) => {
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
    if (this.billChargeValue.isBillEntry == 'YES') {
      if (this.billOfEntryVoList.length === 0) {
        isNoErrorConDet = false;
      }
      if (this.billOfEntryVoList && this.billOfEntryVoList.length > 0) {
        this.billOfEntryVoList.forEach((row: any) => {
          if (row.boeNo == '') {
            row.boeNoReq = true;
            isNoErrorConDet = false;
          } else {
            row.boeNoReq = false;
          }
          if (row.boeDate == '') {
            row.boeDateReq = true;
            isNoErrorConDet = false;
          } else {
            row.boeDateReq = false;
          }
          if (row.portCode == '') {
            row.portCodeReq = true;
            isNoErrorConDet = false;
          } else {
            row.portCodeReq = false;
          }
          if (row.boeAmnt == '') {
            row.boeAmntReq = true;
            isNoErrorConDet = false;
          } else {
            row.boeAmntReq = false;
          }
          if (row.invNo == '') {
            row.invNoReq = true;
            isNoErrorConDet = false;
          } else {
            row.invNoReq = false;
          }
          if (row.invDt == '') {
            row.invDtReq = true;
            isNoErrorConDet = false;
          } else {
            row.invDtReq = false;
          }
        });
      }
    } else {
      if (this.billChargeForm.value.billRemarks == "") {
        isNoErrorConDet = false;
      }
    }
    let isFrwdCntrctDtls = true;
    if (this.billChargeValue.formCmmnAccVo.isDtlsofFrwdCntrct) {
      if (this.formFrwdCntrctDtlsList.length === 0) {
        isFrwdCntrctDtls = false;
      }
      this.formFrwdCntrctDtlsList.forEach((row: any) => {
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

    if (this.amountGreaterThanApp()
      && this.billChargeForm.valid
      && isNoError
      && isNoErrorConDet && isFrwdCntrctDtls) {
      return true;
    }
    return false;
  }

  get isRemarksReq() {
    if (this.billChargeValue.isBillEntry == 'NO') {
      if (this.billChargeForm.value.billRemarks == "") {
        return false;
      }
    }
    return true;
  }
  get isBillEntryReq() {
    if (this.billChargeValue.isBillEntry == 'YES') {
      if (this.billOfEntryVoList && this.billOfEntryVoList.length == 0) {
        return false;
      }
    }
    return true;
  }
  deleteConversionDetail(index: any) {
    this.billOfEntryVoList.splice(index, 1);
    this.getConversationDetailForm1Total();
  }
  amountGreaterThanApp() {
    if ((this.accountDetailTabl1Total == +(this.appUserVal.amount)) && this.submitted) {
      return true;;
    }
    if (this.submitted) {
      return false;
    }
    return true;
  }

  getConversationDetailForm1Total() {
    let total = 0;
    if (this.billOfEntryVoList && this.billOfEntryVoList.length) {
      this.billOfEntryVoList.forEach((element: any) => {
        total += (+element.boeAmnt)
      });
    }
    this.conversationDetailForm1Total = total;
  }

  getUtilizeTotal() {
    let total = 0;
    if (this.formFrwdCntrctDtlsList && this.formFrwdCntrctDtlsList.length) {
      this.formFrwdCntrctDtlsList.forEach((element: any) => {
        total += (+element.amntUtilizd)
      });
    }
    this.utilizeTotal = total;
  }

  getErrorBillCharge(controlName: any) {
    if (this.submitted) {
      return this.fh.formInputError(this.billChargeForm, controlName);
    }
    return '';
  }
  public onAddRowConvrsion(): void {
    if ((this.billOfEntryVoList == null || this.billOfEntryVoList == undefined)) {
      this.billOfEntryVoList = [];
    }
    this.billOfEntryVoList.push({
      boeNo: "",
      frwdCntrctDtlsId: 2677,
      srNo: null,
      boeDate: "",
      portCode: "",
      boeAmnt: "",
      invNo: "",
      invDt: "",
    });
  }
  public onAddRowUtilize(): void {
    if ((this.formFrwdCntrctDtlsList == null || this.formFrwdCntrctDtlsList == undefined)) {
      this.formFrwdCntrctDtlsList = [];
    }
    this.formFrwdCntrctDtlsList.push({
      boeNo: "",
      frwdCntrctDtlsId: 2677,
      srNo: null,
      boeDate: "",
      portCode: "",
      boeAmnt: "",
      invNo: "",
      invDt: "",
    });
  }
  deleteUtilize(index: any) {
    this.formFrwdCntrctDtlsList.splice(index, 1);
    this.getConversationDetailForm1Total();
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
