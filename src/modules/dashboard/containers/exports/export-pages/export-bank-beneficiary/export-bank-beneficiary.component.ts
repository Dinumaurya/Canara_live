import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { faMountain } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '@modules/dashboard/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExportShipmentComponent } from '../export-shipment/export-shipment.component';
import moment from 'moment';

@Component({
  selector: 'sb-export-bank-beneficiary',
  templateUrl: './export-bank-beneficiary.component.html',
  styleUrls: ['./export-bank-beneficiary.component.scss']
})
export class ExportBankBeneficiaryComponent implements OnInit {
  @Output('bankbeneficiaryEvent') bankbeneficiaryEvent = new EventEmitter();
  @Input() currentMsgFromChild1ToChild2!: any[];
  exportBeneficiaryForm: FormGroup;
  submittedexportFrom3: boolean = false;
  @Input() childShipmentMessage!: string;

  @Input() currency: any = [];
  @Input() exportchildMessage: any;

  @Input() country = [];
  accountTypeList: any = [];
  public accountDetailTabl1Total = 0;
  public accountDetailTabl1TotalFirst = 0;
  public accountDetailTabl1TotalThired = 0;


  pkgltrCrdDtlsVoList: any = [];
  incotermsList: any = [];
  pkgprchOrdDtlsVoList: any = [];
  pkgpcfcLcVoList: any = [];
  beneficiaryList: any = [];

  constructor(private formBuilder: FormBuilder, private comservice: AppCommonService,
    private dashboardService: DashboardService, public fh: FormHelperService,
    private modalService: NgbModal,
    private ref: ChangeDetectorRef,
  ) {

    this.exportBeneficiaryForm = this.formBuilder.group({

      ltrCrdtDtlschk: new FormControl('', []),
      prchOrdDtlschk: new FormControl('', []),
      pcfcBuyersDtlsVo: this.formBuilder.group({
        buyersNm: new FormControl('', []),
        cntryId: new FormControl('', [Validators.required]),
        addr2: new FormControl('', [Validators.required]),
        addr1: new FormControl('', [Validators.required]),
        cifId: new FormControl(39956420, [Validators.required]),
      }),
      pcfcDtlsVo: this.formBuilder.group({
        totalLtrCrdAmnt: new FormControl('', []),
        totalPrchOrdAmnt: new FormControl('', []),
        totalLoanAmnt: new FormControl('', []),
      }),
    });

  }
  ngOnInit(): void {
    // this.loadDefaultBeneficiary();
    console.log(this.exportchildMessage);

  }
  ngAfterViewInit() {
    this.comservice.getIncoterms().subscribe(data => {
      if (data && data.subCommonMasterList) {
        this.incotermsList = data.subCommonMasterList;;
      } else {
        this.incotermsList = [{ "commonMstSubId": 96, "code": "EXW", "value": "EXW", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 8 }, { "commonMstSubId": 94, "code": "CIF", "value": "CIF", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 2 }, { "commonMstSubId": 97, "code": "FOB", "value": "FOB", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 11 }, { "commonMstSubId": 98, "code": "DAP", "value": "DAP", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 5 }, { "commonMstSubId": 95, "code": "CFR", "value": "CFR", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 1 }, { "commonMstSubId": 1046, "code": "CPT", "value": "CPT", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 4 }, { "commonMstSubId": 1049, "code": "DAT", "value": "DAT", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 7 }, { "commonMstSubId": 1045, "code": "CIP", "value": "CIP", "crUser": "BackEnd", "crDate": "2018-08-15T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 3 }, { "commonMstSubId": 1047, "code": "FAS", "value": "FAS", "crUser": "BackEnd", "crDate": "2018-08-19T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 9 }, { "commonMstSubId": 1048, "code": "FCA", "value": "FCA", "crUser": "BackEnd", "crDate": "2018-08-20T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 10 }, { "commonMstSubId": 1050, "code": "DDP", "value": "DDP", "crUser": "BackEnd", "crDate": "2018-08-23T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 6 }];
      }

    }, (err) => {
      this.incotermsList = [{ "commonMstSubId": 96, "code": "EXW", "value": "EXW", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 8 }, { "commonMstSubId": 94, "code": "CIF", "value": "CIF", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 2 }, { "commonMstSubId": 97, "code": "FOB", "value": "FOB", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 11 }, { "commonMstSubId": 98, "code": "DAP", "value": "DAP", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 5 }, { "commonMstSubId": 95, "code": "CFR", "value": "CFR", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 1 }, { "commonMstSubId": 1046, "code": "CPT", "value": "CPT", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 4 }, { "commonMstSubId": 1049, "code": "DAT", "value": "DAT", "crUser": "BackEnd", "crDate": "2018-08-13T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 7 }, { "commonMstSubId": 1045, "code": "CIP", "value": "CIP", "crUser": "BackEnd", "crDate": "2018-08-15T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 3 }, { "commonMstSubId": 1047, "code": "FAS", "value": "FAS", "crUser": "BackEnd", "crDate": "2018-08-19T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 9 }, { "commonMstSubId": 1048, "code": "FCA", "value": "FCA", "crUser": "BackEnd", "crDate": "2018-08-20T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 10 }, { "commonMstSubId": 1050, "code": "DDP", "value": "DDP", "crUser": "BackEnd", "crDate": "2018-08-23T08:36:41.099+0000", "mdUser": null, "mdDate": null, "srNo": 6 }];
    })
    this.getBeneficiaryDetails();
  }
  getBeneficiaryDetails() {
    try {
      // const dt = this.exportBeneficiaryForm.value.pcfcCustDtlsVo.custId
      const dt = sessionStorage.getItem("customerId");

      const jsn: any = sessionStorage.getItem('user');
      const customerId = JSON.parse(jsn);
      if (customerId && customerId.ibData && customerId.ibData.UserID) {
        var UserId = customerId.ibData.UserID
      }
      if (customerId && customerId.ibData && customerId.ibData.UserID) {
        this.comservice.getBeneficiaryDetails(dt, 'EDB', UserId)
          .subscribe(data => {
            if (data.beneDetails) {
              this.beneficiaryList = data.beneDetails;
              console.log(this.beneficiaryList);
            }
          },
            (err) => {
              // this.spinner.hide();
              // this.loadDefaultBeneficiary();
            }
          )
      } else {
        //this.spinner.hide();
        // this.loadDefaultBeneficiary();
      }
    } catch (error) {
      // console.log(error);
    }

  }
  getBeneError(controlName: any) {
    if (this.submittedexportFrom3) {
      return this.fh.formInputError(this.exportBeneficiaryForm, controlName);
    }
    return '';
  }
  changeLetter(event: any) {
    if (event.target.checked == false) {
      this.pkgltrCrdDtlsVoList = [];
      this.accountDetailTabl1Total = 0;
    }
  }
  changePackage(event: any) {
    if (event.target.checked == false) {
      this.pkgprchOrdDtlsVoList = [];
      this.accountDetailTabl1TotalFirst = 0;
    }
  }
  public onAddRowClick(): void {
    if ((this.pkgprchOrdDtlsVoList == null || this.pkgprchOrdDtlsVoList == undefined)) {
      this.pkgprchOrdDtlsVoList = [];
    }
    this.pkgprchOrdDtlsVoList.push({
      accDtlsId: "",
      srNo: 1,
      prchOrdDtlsRefNo: "",
      purOrdDate: "",
      fcy: "",
      amnt: "",
      amntToBeUtlzed: "",
      balavlb: "",
      inCoTerms: "",
      country: ""
    });
  }
  public currentMode: any = "edit";

  get isEditable() {
    return this.currentMode == "view" ? true : false;
  }

  public onAddRowClickThird(): void {
    if ((this.pkgpcfcLcVoList == null || this.pkgpcfcLcVoList == undefined)) {
      this.pkgpcfcLcVoList = [];
    }
    this.pkgpcfcLcVoList.push({
      accDtlsId: "",
      srNo: 1,
      pcfcLcRefNo: "",
      date: "",
      loanAmnt: "",
      orderNo: "",
      sactnAmtOrdr: "",
      tenorDays: "",
      dueDate: "",
    });
  }
  public onAddRowClickFirst(): void {
    if ((this.pkgltrCrdDtlsVoList == null || this.pkgltrCrdDtlsVoList == undefined)) {
      this.pkgltrCrdDtlsVoList = [];
    }
    this.pkgltrCrdDtlsVoList.push({
      accDtlsId: "",
      srNo: 1,
      refNo: "",
      date: "",
      expdt: "",
      fcy: "",
      amnt: "",
      amtUtlz: "",
      balAvl: "",
      country: ""
    });
  }
  // srNo: 1,
  // ltrCrdtDtlsRefNo: "",
  // ltrCrdDtlsVoDate: "",
  // ltrCrdDtlsVoExpdate: "",
  // fcy: "",
  // amnt: "",
  // amntToBeUtlzed: "",
  // ltrCrdDtlsVoAvlBal: "",
  // ltrCrdDtlsVoCountry: ""
  accountDetailTabl1TotalCalFirst() {
    let total = 0;
    this.pkgltrCrdDtlsVoList.forEach((element: any) => {
      total += (+element.amnt)
    });
    this.accountDetailTabl1TotalFirst = total;
    console.log(this.accountDetailTabl1TotalFirst);

  }
  accountDetailTabl1TotalCal() {
    let total = 0;
    this.pkgprchOrdDtlsVoList.forEach((element: any) => {
      total += (+element.amnt)
    });
    this.accountDetailTabl1Total = total;
    console.log(this.accountDetailTabl1Total);

  }
  accountDetailTabl1TotalCalThird() {
    let total = 0;
    this.pkgpcfcLcVoList.forEach((element: any) => {
      total += (+element.loanAmnt)
    });
    this.accountDetailTabl1TotalThired = total;

  }
  deleteAccountDetail(index: any) {
    this.pkgprchOrdDtlsVoList.splice(index, 1);
    this.accountDetailTabl1TotalCal();
  }
  deleteAccountDetailFirst(index: any) {
    this.pkgltrCrdDtlsVoList.splice(index, 1);
    this.accountDetailTabl1TotalCalFirst();
  }
  deleteAccountDetailThird(index: any) {
    this.pkgpcfcLcVoList.splice(index, 1);
    this.accountDetailTabl1TotalCalThird();
  }
  getAccTp() {
    this.comservice.accType().subscribe(data => {
      this.accountTypeList = data.subCommonMasterList;
    })
  }
  get exportBeneficiaryFormval() {
    return this.exportBeneficiaryForm.value;
  }
  isNoBeneficiary() {
    const pcfcBankDtlsVo = this.exportBeneficiaryForm.value;
    // console.log(pcfcBankDtlsVo);
    if (pcfcBankDtlsVo.ltrCrdtDtlschk && this.submittedexportFrom3) {
      if (pcfcBankDtlsVo.refNo == '') {
        return false;
      }
      if (pcfcBankDtlsVo.date == '') {
        return false;
      }
      if (pcfcBankDtlsVo.expdt == '') {
        return false;
      }
      if (pcfcBankDtlsVo.fcy == '') {
        return false;
      }
      if (pcfcBankDtlsVo.amnt == '') {
        return false;
      }
      if (pcfcBankDtlsVo.amtUtlz == '') {
        return false;
      }
      if (pcfcBankDtlsVo.balAvl == '') {
        return false;
      }
      if (pcfcBankDtlsVo.country == '') {
        return false;
      }
    }
    return true;
  }
  /**
   * Loads Default Beneficiary incase of local or if no ib data
   * @returns any
   */
  // loadDefaultBeneficiary() {
  //   this.comservice.getBeneDetails().subscribe(data => {
  //     this.beneficiaryList = data;
  //     console.log(this.beneficiaryList);

  //   })
  // }

  beneficiarySelected() {
    const val = this.exportBeneficiaryForm.value;
    const found = this.beneficiaryList.find((o: any) => o.beneNam === val.pcfcBuyersDtlsVo.buyersNm);
    console.log(found);

    if (found && found.addr1) {
      this.exportBeneficiaryForm.patchValue({
        pcfcBuyersDtlsVo: {
          buyersNm: found.beneNam,
          cntryId: found.countryName,
          addr2: found.addr2,
          addr1: found.addr1
        },
      })
    }
  }

  // getPurchesOrderTab(control: any) {
  //   console.log(this.currentMsgFromChild1ToChild2);

  //   console.log(this.exportBeneficiaryFormval.value);
  //   if (this.exportBeneficiaryFormval.value.whrLcIsRcvByCN == 'NO') {
  //     const val = this.exportBeneficiaryFormval[control];
  //     if (val == '' || val == null) {
  //       return this.submittedexportFrom3 && true;
  //     }
  //     return false;
  //   }

  // }
  onSubmitBankForm3() {
    this.submittedexportFrom3 = true;
    let isNoError = true;
    this.pkgprchOrdDtlsVoList.forEach((accountDetail: any) => {
      if (accountDetail.refNo == '') {
        accountDetail.refNoReq = true;
        isNoError = false;
      } else {
        accountDetail.refNoReq = false;
      }

      if (accountDetail.purOrdDate == '') {
        accountDetail.purOrdDateReq = true;
        isNoError = false;
      } else {
        accountDetail.purOrdDateReq = false;
      }
      if (accountDetail.fcy == '') {
        accountDetail.fcyReq = true;
        isNoError = false;
      } else {
        accountDetail.fcyReq = false;
      }
      if (accountDetail.amnt == '') {
        accountDetail.amntReq = true;
        isNoError = false;
      } else {
        accountDetail.amntReq = false;
      }
      if (accountDetail.amtUtlz == '') {
        accountDetail.amtUtlzReq = true;
        isNoError = false;
      } else {
        accountDetail.amtUtlzReq = false;
      }
      if (accountDetail.balAvl == '') {
        accountDetail.balAvlReq = true;
        isNoError = false;
      } else {
        accountDetail.balAvlReq = false;
      }
      if (accountDetail.inCoTerms == '') {
        accountDetail.inCoTermsReq = true;
        isNoError = false;
      } else {
        accountDetail.inCoTermsReq = false;
      }
      if (accountDetail.country == '') {
        accountDetail.countryReq = true;
        isNoError = false;
      } else {
        accountDetail.countryReq = false;
      }
    });

    let isNoErrorFirst = true;
    this.pkgltrCrdDtlsVoList.forEach((accountDetail: any) => {
      if (accountDetail.refNo == '') {
        accountDetail.refNoReq = true;
        isNoErrorFirst = false;
      } else {
        accountDetail.refNoReq = false;
      }
      if (accountDetail.date == '') {
        accountDetail.dateReq = true;
        isNoErrorFirst = false;
      } else {
        accountDetail.dateReq = false;
      }
      if (accountDetail.expdt == '') {
        accountDetail.expdtReq = true;
        isNoErrorFirst = false;
      } else {
        accountDetail.expdtReq = false;
      }
      if (accountDetail.fcy == '') {
        accountDetail.fcyReq = true;
        isNoErrorFirst = false;
      } else {
        accountDetail.fcyReq = false;
      }
      if (accountDetail.amnt == '') {
        accountDetail.amntReq = true;
        isNoErrorFirst = false;
      } else {
        accountDetail.amntReq = false;
      }
      if (accountDetail.amtUtlz == '') {
        accountDetail.amtUtlzReq = true;
        isNoErrorFirst = false;
      } else {
        accountDetail.amtUtlzReq = false;
      }
      if (accountDetail.balAvl == '') {
        accountDetail.balAvlReq = true;
        isNoErrorFirst = false;
      } else {
        accountDetail.balAvlReq = false;
      }
      if (accountDetail.country == '') {
        accountDetail.countryReq = true;
        isNoErrorFirst = false;
      } else {
        accountDetail.countryReq = false;
      }

    });

    let isNoErrorThird = true;

    this.pkgpcfcLcVoList.forEach((accountDetail: any) => {
      if (accountDetail.pcfcLcRefNo == '') {
        accountDetail.pcfcLcRefNoReq = true;
        isNoErrorThird = false;
      } else {
        accountDetail.pcfcLcRefNoReq = false;
      }

      if (accountDetail.date == '') {
        accountDetail.dateReq = true;
        isNoErrorThird = false;
      } else {
        accountDetail.dateReq = false;
      }
      if (accountDetail.loanAmnt == '') {
        accountDetail.loanAmntReq = true;
        isNoErrorThird = false;
      } else {
        accountDetail.loanAmntReq = false;
      }
      if (accountDetail.orderNo == '') {
        accountDetail.orderNoReq = true;
        isNoErrorThird = false;
      } else {
        accountDetail.orderNoReq = false;
      }
      if (accountDetail.sactnAmtOrdr == '') {
        accountDetail.sactnAmtOrdrReq = true;
        isNoErrorThird = false;
      } else {
        accountDetail.sactnAmtOrdrReq = false;
      }
      if (accountDetail.tenorDays == '') {
        accountDetail.tenorDaysbalavlbReq = true;
        isNoErrorThird = false;
      } else {
        accountDetail.tenorDaysReq = false;
      }
      if (accountDetail.dueDate == '') {
        accountDetail.dueDateReq = true;
        isNoErrorThird = false;
      } else {
        accountDetail.dueDateReq = false;
      }

    });
    if (this.exportBeneficiaryForm.valid && !isNoError && !isNoErrorFirst && !isNoErrorThird) {
      this.bankbeneficiaryEvent.emit(this.exportBeneficiaryForm.value)
    }
    // !this.getPurchesOrderTab('prchOrdDtlschk')
    return false;
  }

}

