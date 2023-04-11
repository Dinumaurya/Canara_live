import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild
 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { DashboardService } from '@modules/dashboard/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { BillApplicantComponent } from '../bill-applicant/bill-applicant.component';
import moment from 'moment';

@Component({
  selector: 'sb-bill-bank-beneficiary',
  templateUrl: './bill-bank-beneficiary.component.html',
  styleUrls: ['./bill-bank-beneficiary.component.scss']
})
export class BillBankBeneficiaryComponent implements OnInit {
  @Output('billBankEvent') billBankEvent = new EventEmitter();
  billBankBenefiacry: FormGroup;
  @ViewChild('billApplicant', { static: false }) billApplicant!: BillApplicantComponent;
  @Input() applicantValue: any=[];
  incotermsList: any = [];
  isSubmitted: boolean = false;
  @Input() currency: any = [];
  @Input() country = [];
  imagename: any;
  @ViewChild("content", { static: false }) content: any;
 
  beneficiaryDetailList: any = [];
  getDocDescType: any = [];
  msDesc: any;
  docCodeListt: any = [];
  selectedValue: any;
  secondTable: any = [];
  getDocType: any = [];
  billOfEntryVoList: any = [];
  beneficiaryList: any = [];

  constructor(private formBuilder: FormBuilder, private comservice: AppCommonService,
    private dashboardService: DashboardService, public fh: FormHelperService,
    private modalService: NgbModal,
    private ref: ChangeDetectorRef,
  ) {

    this.billBankBenefiacry = this.formBuilder.group({

      billRemarks: new FormControl('', []),
      isBillEntry: new FormControl('', [Validators.required]),
      exportBillsSupDrwDtlsVo: this.formBuilder.group({
        name: new FormControl('', [Validators.required]),
        cntryId: new FormControl('', [Validators.required]),
        addr2: new FormControl('', []),
        addr1: new FormControl('', [Validators.required]),
        cifId: new FormControl(39956420, [Validators.required]),
      }),
      exportBillsDrweBnkDtlsVo: this.formBuilder.group({
        cifId: new FormControl(39956420, [Validators.required]),
        drweBnkNm: new FormControl('', [Validators.required]),
        cntryId: new FormControl('', [Validators.required]),
        addr2: new FormControl('', [Validators.required]),
        addr1: new FormControl('', [Validators.required]),
        swiftCode: new FormControl('', [Validators.required]),
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
  changeshipBill(event: any) {
    if (event.target.value == 'YES') {
      this.billOfEntryVoList = [];
    } else if (event.target.value == 'NO') {

      this.billBankBenefiacry.patchValue({
        billRemarks: '',
      });
    }
  }
  public currentMode: any = "edit";

  get isEditable() {
    return this.currentMode == "view" ? true : false;
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
  keyPressAlphaNumeric($event:any) {

    var inp = String.fromCharCode($event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      $event.preventDefault();
      return false;
    }
  }
  getBeneficiaryDetails(){
    try {
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
  beneficiarySelected() {
    const val = this.billBankBenefiacry.value;
    const found = this.beneficiaryList.find((o: any) => o.beneId === val.exportBillsSupDrwDtlsVo.name);
    if (found && found.addr1) {
      const collectionBankCountryNam: any = this.country.find((o: any) => o.alfaCode === found.collectionBankCountryNam);
      const countryNam: any = this.country.find((o: any) => o.alfaCode === found.countryNam);
      this.billBankBenefiacry.patchValue({
        exportBillsSupDrwDtlsVo: {
          addr1: found.addr1,
          addr2: found.addr2,
          beneNam: found.beneNam,
          swiftCode: found.beneSwiftCod,
          cntryId: typeof (countryNam) != 'undefined' ? countryNam.countryId : "",
          bnfAccNo: found.beneAcct,
          bnkNm: found.beneBankNam,
        },
        exportBillsDrweBnkDtlsVo: {
          drweBnkNm: found.collectionBankNam,
          cntryId: typeof (collectionBankCountryNam) != 'undefined' ? collectionBankCountryNam.countryId : "",
          addr2: found.collectionBankAddr2,
          addr1: found.collectionBankAddr1,
          swiftCode: found.collectionBankSwift,
        }
      })
    }
  }

  @ViewChild("contentbodyred", { static: false }) contentbodyred: any;

  modal_body_2 = '';
  modal_title = '';
  setFileForDocument($event: any, index: any) {
    const file = $event.target.files[0];
    this.imagename = file.name
    if (file.type === 'application/pdf' && file.size < (1024 * 1024 * 5)) {
      this.beneficiaryDetailList[index].file = $event.target.files[0];
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
  public beneficiaryDetailListMaster: any = [];
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
      }
    }, (err) => {
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
  getErrorBillBankBene(controlName: any) {
    if (this.isSubmitted) {
      return this.fh.formInputError(this.billBankBenefiacry, controlName);
    }
    return '';
  }

  onSubmitBankBene() {
    this.isSubmitted = true;
    let isNoErrorConDate = true;
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

    let isNoErrorThird = true;
    if (this.AppUserVal.isBillEntry == 'YES') {
      if (this.billOfEntryVoList.length == 0) {
        isNoErrorThird = false;
      }
    }
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
    if (this.billBankBenefiacry.valid && isNoErrorConDate && isNoErrorThird && this.beneficiaryDetailList.length > 0) {
      this.billBankEvent.emit(this.billBankBenefiacry.value)
      return true;
    }
    return false;
  }
}
