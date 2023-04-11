import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { DashboardService } from '@modules/dashboard/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import moment from 'moment';
import { validate } from 'uuid';
@Component({
  selector: 'sb-import-bill-bank-bene',
  templateUrl: './import-bill-bank-bene.component.html',
  styleUrls: ['./import-bill-bank-bene.component.scss']
})
export class ImportBillBankBeneComponent implements OnInit {
  @Input() currency: any = [];
  @Input() country = [];
  @Input() applicatFormValue: any = {}
  @Output('billBankEvent') billBankEvent = new EventEmitter();

  public billBankBenefiacry: FormGroup;
  public incotermsList: any = [];
  public submitted: boolean = false;
  public imagename: any;
  public modal_title = "";
  public modal_body_2 = '';
  public beneficiaryDetailList: any = [];
  public beneficiaryDetailListMaster: any = [];
  public getDocDescType: any = [];
  public msDesc: any;
  public docCodeListt: any = [];
  public selectedValue: any;
  public secondTable: any = [];
  public getDocType: any = [];
  public billOfEntryVoList: any = [];
  public beneficiaryList: any = [];
  public viewData: any;


  constructor(
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
    private dashboardService: DashboardService,
    public fh: FormHelperService,
    private modalService: NgbModal,
    private ref: ChangeDetectorRef,
  ) {

    this.billBankBenefiacry = this.formBuilder.group({
      importBillsSupDrwDtlsVo: this.formBuilder.group({
        name: new FormControl('', [Validators.required, Validators.pattern(fh.CUSTOMER_NAME_REG)]),
        beneNam: new FormControl('', [Validators.required]),
        cntryId: new FormControl('', [Validators.required]),
        addr2: new FormControl('', [Validators.required, Validators.pattern(fh.CUSTOMER_NAME_REG)]),
        addr1: new FormControl('', [Validators.required, Validators.pattern(fh.CUSTOMER_NAME_REG)]),
        cifId: new FormControl(39956420, [Validators.required]),
        bnfAccNo: new FormControl('', [Validators.required, Validators.pattern(fh.CUSTOMER_NAME_REG)]),
      }),

      importBillsDrweBnkDtlsVo: this.formBuilder.group({
        cifId: new FormControl(39956420, [Validators.required]),
        drweBnkNm: new FormControl('', [Validators.required, Validators.pattern(fh.CUSTOMER_NAME_REG)]),
        cntryId: new FormControl('', [Validators.required]),
        addr2: new FormControl('', [Validators.required, Validators.pattern(fh.CUSTOMER_NAME_REG)]),
        addr1: new FormControl('', [Validators.required, Validators.pattern(fh.CUSTOMER_NAME_REG)]),
        swiftCode: new FormControl('', [Validators.required, Validators.pattern(this.fh.SWIFT_CODE_REG)]),
        interSwiftCode: new FormControl('', [Validators.pattern(this.fh.SWIFT_CODE_REG)]),
      }),
      dscrpncyDtlsVo: this.formBuilder.group({
        isDiscrpntLC: new FormControl('', []),
        name: new FormControl('', []),
        cntryId: new FormControl('', []),
        addr2: new FormControl('', []),
        addr1: new FormControl('', []),
        cifId: new FormControl(39956420, [Validators.required]),
      }),

    });
  }
  public onAddRowClickThird(): void {
    if ((this.billOfEntryVoList == null || this.billOfEntryVoList == undefined)) {
      this.billOfEntryVoList = [];
    }
    this.billOfEntryVoList.push({
      accDtlsId: "",
      sNo: 1,
      shipBillNum: "",
      shipBillDate: "",
      portCode: "",
      grAmount: "",
      invoiceNo: "",
      invoiceDate: "",
      exchRate: "",
    });
  }
  get AppUserVal() {
    return this.billBankBenefiacry.value;
  }

  ngOnInit(): void {
  }
  public currentMode: any = "edit";

  get isEditable() {
    return this.currentMode == "view" ? true : false;
  }
  masterDocType(beneIndex: number) {
    if (this.beneficiaryDetailListMaster[beneIndex] &&
      this.beneficiaryDetailListMaster[beneIndex].getDocDescType) {
      return this.beneficiaryDetailListMaster[beneIndex].getDocDescType;
    }
    return [];
  }
  masterDocCd(beneIndex: number) {
    if (this.beneficiaryDetailListMaster[beneIndex] &&
      this.beneficiaryDetailListMaster[beneIndex].docCodeListt) {
      return this.beneficiaryDetailListMaster[beneIndex].docCodeListt;
    }
    return [];
  }

  getDocCodeList(doc: any, index: number, cb?: any) {
    this.comservice.docCodeListt(doc.docDesc, doc.docTp).subscribe(result => {
      if (this.beneficiaryDetailListMaster && !this.beneficiaryDetailListMaster[index]) {
        this.beneficiaryDetailListMaster[index] = {};
      }
      this.beneficiaryDetailListMaster[index]['docCodeListt'] = result;
      if (cb && typeof (cb) == "function") {
        cb();
      }
    })
  }
  docDescList(doc: any, index: number, cb?: any) {
    this.comservice.getDocDescList(doc.docTp)
      .subscribe(result => {
        if (this.beneficiaryDetailListMaster && !this.beneficiaryDetailListMaster[index]) {
          this.beneficiaryDetailListMaster[index] = {};
        }
        this.beneficiaryDetailListMaster[index]['getDocDescType'] = result;
        if (cb && typeof (cb) == "function") {
          cb();
        }
      })
  }
  onChecked(event: any) {
    if (event.target.checked == false) {
      this.billBankBenefiacry.patchValue({
        dscrpncyDtlsVo: {
          isDiscrpntLC: '',
          name: '',
          cntryId: '',
          addr2: '',
          addr1: '',

        }
      });
    }
  }
  @ViewChild("contentbodyred", { static: false }) contentbodyred: any;

  // modal_body_2 = '';
  modal_title1 = '';


  setFileForDocument($event: any, index: any) {
    const file = $event.target.files[0];
    if (file.type === 'application/pdf' && file.size < (1024 * 1024 * 5)) {
      this.beneficiaryDetailList[index].file = file;
    } else {
      this.modal_body_2 = 'Please select only PDF file and size less than 5 MB.';
      this.modalService.open(this.contentbodyred, { size: 'sm' });
      delete this.beneficiaryDetailList[index].file;
    }

  }

  getFileText(index: any) {
    if (this.beneficiaryDetailList) {
      var found = this.beneficiaryDetailList[index];
      if (found && found.file && found.file.name) {
        const frm = found.file.name;
        if (frm != '') {
          return frm.replace(/\\$/, '').split('\\').pop();;
        }
      }
    }
    return 'Choose File'
  }
  @Input() savedData: any;
  getImageText(txt: any, beneIndex: number) {
    var dt = "";
    try {
      if (this.savedData && this.savedData.officeUse && this.savedData.officeUse.offcReqDocList) {
        var found = this.savedData.officeUse.offcReqDocList[beneIndex]
        if (found) {
          dt = found.docAttchNm;
        }
      }
    } catch (err) { }
    try {
      var found = this.savedData.officeUse.offcReqDocList[beneIndex];
      if (found) {
        dt = found.attchNm;
      }

    } catch (err) { }
    return dt
  }
  getBeneficiaryDetails() {
    try {
      const dt = sessionStorage.getItem("customerId");
      const jsn: any = sessionStorage.getItem('user');
      const customerId = JSON.parse(jsn);
      if (customerId && customerId.ibData && customerId.ibData.UserID) {
        var UserId = customerId.ibData.UserID
      }
      if (customerId && customerId.ibData && customerId.ibData.UserID) {
        this.comservice.getBeneficiaryDetails(dt, 'IDB', UserId)
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
  beneficiarySelected() {
    const val = this.billBankBenefiacry.value;
    const found = this.beneficiaryList.find((o: any) => o.beneNam === val.importBillsSupDrwDtlsVo.beneNam);
    if (found && found.addr1) {
      const intermediaryBankCountryNam: any = this.country.find((o: any) => o.alfaCode === found.intermediaryBankCountryNam);
      const countryNam: any = this.country.find((o: any) => o.alfaCode === found.countryNam);

      this.billBankBenefiacry.patchValue({
        importBillsSupDrwDtlsVo: {
          addr1: found.addr1,
          addr2: found.addr2,
          beneAcct: found.beneAcct,
          name: found.beneNam,
          swiftCode: found.beneSwiftCod,
          cntryId: countryNam.countryId,
          bnfAccNo: found.beneAcct,
          bnkNm: found.beneBankNam
        },
        importBillsDrweBnkDtlsVo: {
          //cifId: "",
          //drweBnkNm: found.intermediaryBankNam,
          cntryId: countryNam.countryId,
          drweBnkNm: found.beneBankNam,
          addr2: found.intermediaryBankAddr1,
          addr1: found.intermediaryBankAddr2,
          swiftCode: found.beneSwiftCod,
          interSwiftCode: found.intermediaryBankSwiftCod,
        },
      });
      if (intermediaryBankCountryNam) {
        this.billBankBenefiacry.patchValue({
          importBillsDrweBnkDtlsVo: {
            cntryId: intermediaryBankCountryNam.countryId,
          },
        })
      }
    }
  }

  viewDoc(doc: any) {
    try {
      const pt = environment.app_url
      window.open(pt + "/docView/" + doc.attchPath, '_blank')
      return false;
    } catch (error) {
    }
  }
  get billbankValue() {
    return this.billBankBenefiacry.value;
  }
  public onAddRowDetailsRemitance(): void {

    this.beneficiaryDetailList.push({
      docTp: "",
      docDesc: "",
      docCd: "",
      noOfOrgnls: "",
      noOfCopies: "",
      docRefNo: "",
      docDt: "",
      atchmnt: "",
    });
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
    this.comservice.getDocType().subscribe(result => {
      this.getDocType = result;
    });

    this.dashboardService.gettableValue().subscribe(data => {
      this.secondTable = data.beneficiaryDetailList;
      setTimeout(() => {
        data.beneficiaryDetailList.forEach((element: any, index: any) => {
          this.beneficiaryDetailList.push(
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
      this.beneficiaryDetailList.forEach((element: any) => {

        this.beneficiaryDetailList.push({
          docTp: element.docTp,
          docDesc: element.docDesc,
          docCd: element.docCd,
          //docList: element.docList,
          noOfOrgnls: element.noOfOrgnls,
          noOfCopies: element.noOfCopies,
          docRefNo: element.docRefNo,
          docDt: moment(element.docDt).format('YYYY-MM-DDTHH:mm:ssZZ'),
          atchmnt: element.atchmnt
        });
      });
    })
    this.getBeneficiaryDetails();

  }
  deleteConDtlRemitance(index: any) {
    this.beneficiaryDetailList.splice(index, 1)
  }
  deleteAccountDetailThird(index: any) {
    this.billOfEntryVoList.splice(index, 1)
  }
  get billBeneficiaryDetailsVal() {
    return this.billBankBenefiacry.value;
  }
  formErr(controlName: any) {
    if (this.submitted) {
      return this.fh.formInputError(this.billBankBenefiacry, controlName);
    }
    return '';
  }

  onSubmitBankBene() {
    this.submitted = true;
    let isNoErrorConDate = true;
    if (this.applicatFormValue.billPayment != 'FOR_PAYMENT') {
      if (this.beneficiaryDetailList.length == 0) {
        isNoErrorConDate = false;
      }
      this.beneficiaryDetailList.forEach((row: any) => {
        if (row.docTp == '') {
          row.docTpReqq = true;
          isNoErrorConDate = false;
        } else {
          row.docTpReqq = false;
        }

        if (row.docDesc == '') {
          row.docDescReq = true;
          isNoErrorConDate = false;
        } else {
          row.docDescReq = false;
        }
        if (row.docCd == '') {
          row.docCdReqq = true;
          isNoErrorConDate = false;
        } else {
          row.docCdReqq = false;
        }
        if (row.noOfOrgnls == '') {
          row.noOfOrgnlsReqq = true;
          isNoErrorConDate = false;
        } else {
          row.noOfOrgnlsReqq = false;
        }
        if (row.docDt == '') {
          row.docDtReqq = true;
          isNoErrorConDate = false;
        } else {
          row.docDtReqq = false;
        }
        if (row.atchmnt == "" || (row.file && row.file.name == '')) {
          row.atchmntReqq = true;
          isNoErrorConDate = false;
        } else {
          row.atchmntReqq = false;
        }
        if (row.noOfCopies == '') {
          row.noOfCopiesReqq = true;
          isNoErrorConDate = false;
        } else {
          row.noOfCopiesReqq = false;
        }
        if (row.docRefNo == '') {
          row.docRefNoReqq = true;
          isNoErrorConDate = false;
        } else {
          row.docRefNoReqq = false;
        }
      });
    }


    let isNoErrorThird = true;
    if (this.applicatFormValue.billPayment != 'FOR_PAYMENT') {
      this.billOfEntryVoList.forEach((accountDetail: any) => {
        if (accountDetail.shipBillNum == '') {
          accountDetail.shipBillNumReq = true;
          isNoErrorThird = false;
        } else {
          accountDetail.shipBillNumReq = false;
        }

        if (accountDetail.shipBillDate == '') {
          accountDetail.shipBillDateReq = true;
          isNoErrorThird = false;
        } else {
          accountDetail.shipBillDateReq = false;
        }
        if (accountDetail.portCode == '') {
          accountDetail.portCodeReq = true;
          isNoErrorThird = false;
        } else {
          accountDetail.portCodeReq = false;
        }
        if (accountDetail.grAmount == '') {
          accountDetail.grAmountReq = true;
          isNoErrorThird = false;
        } else {
          accountDetail.grAmountReq = false;
        }
        if (accountDetail.invoiceNo == '') {
          accountDetail.invoiceNoReq = true;
          isNoErrorThird = false;
        } else {
          accountDetail.invoiceNoReq = false;
        }
        if (accountDetail.invoiceNo == '') {
          accountDetail.invoiceNoReq = true;
          isNoErrorThird = false;
        } else {
          accountDetail.invoiceNoReq = false;
        }
        if (accountDetail.invoiceDate == '') {
          accountDetail.invoiceDateReq = true;
          isNoErrorThird = false;
        } else {
          accountDetail.invoiceDateReq = false;
        }
        if (accountDetail.exchRate == '') {
          accountDetail.exchRateReq = true;
          isNoErrorThird = false;
        } else {
          accountDetail.exchRateReq = false;
        }
      });
    }

    if (this.billBankBenefiacry.valid && isNoErrorConDate && isNoErrorThird) {
      return true;
    }
    return false;
  }
}
