import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { DashboardService } from '@modules/dashboard/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import moment from 'moment';
@Component({
  selector: 'sb-adv-shipment-detail',
  templateUrl: './adv-shipment-detail.component.html',
  styleUrls: ['./adv-shipment-detail.component.scss']
})
export class AdvShipmentDetailComponent implements OnInit {
  @ViewChild("content", { static: false }) content: any;
  @ViewChild("contentbodyred", { static: false }) contentbodyred: any;
  @Output('advShipmentEvent') advShipmentEvent = new EventEmitter();
  @Input() country = [];
  @Input() currency = [];
  @Input() beneficiaryList: any = [];
  public msDesc: any;
  public docCodeListt: any = [];
  public imagename: any;
  public incotermsList: any = [];
  public getDocType: any = [];
  public advShipmentDetails: FormGroup;
  public submittedAdvAppForm2: any;
  public beneficiaryDetailList: any = [];
  public beneficiaryDetailListMaster: any = [];
  public secondTable: any;
  public selectedValue: any;
  public getDocDescType: any = [];
  public modal_title = "Status"
  public modal_body = "Please correct form";
  public modal_body_2 = "";

  constructor(
    public fh: FormHelperService,
    private comservice: AppCommonService,
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dashboardService: DashboardService) {
    this.advShipmentDetails = this.formBuilder.group({
      advRemShipDtlsVo: this.formBuilder.group({
        proInvDt: new FormControl('', [Validators.required]),
        descGdsRmrks: new FormControl('', [Validators.required]),
        pol: new FormControl('', [Validators.required, Validators.pattern(fh.ALPHA_AND_SPACE)]),
        pod: new FormControl('', [Validators.required, Validators.pattern(fh.ALPHA_AND_SPACE)]),
        ltstShpMntDt: new FormControl('', [Validators.required]),
        hsDesc: new FormControl('', [Validators.required]),
        hsCode: new FormControl('', [Validators.required]),
        proInvNo: new FormControl('', [Validators.required]),
        inCoTerms: new FormControl('', [Validators.required]),
        invAmount: new FormControl('', [Validators.required]),
      }),
      advRemSupDrwDtlsVo: this.formBuilder.group({
        cifId: new FormControl(39956420, [Validators.required]),
        name: new FormControl('', [Validators.required]),
        nameTemp: new FormControl('', []),
        addr1: new FormControl('', [Validators.required, Validators.pattern(fh.CUSTOMER_NAME_REG)]),
        addr2: new FormControl('', [Validators.pattern(fh.CUSTOMER_NAME_REG)]),
        cntryId: new FormControl('', [Validators.required]),
        bnfAccNo: new FormControl('', [Validators.required,]),
        supDrweDtlsId: new FormControl(null, []),
        auditDetails: new FormControl(null, []),
      }),
      advRemDrweBnkDtlsVo: this.formBuilder.group({
        swiftCode: new FormControl('', [Validators.required, Validators.pattern(this.fh.SWIFT_CODE_REG)]),
        cntryId: new FormControl('', [Validators.required]),
        addr2: new FormControl('', [Validators.required, Validators.pattern(fh.CUSTOMER_NAME_REG)]),
        addr1: new FormControl('', [Validators.required, Validators.pattern(fh.CUSTOMER_NAME_REG)]),
        drweBnkNm: new FormControl('', [Validators.required, Validators.pattern(fh.CUSTOMER_NAME_REG)]),
        cifId: new FormControl(39956420, [Validators.required]),
        drweAccNo: new FormControl('', [Validators.required, Validators.maxLength(34), Validators.pattern(fh.CUSTOMER_NAME_REG)]),
        interSwiftCode: new FormControl('', [Validators.pattern(this.fh.SWIFT_CODE_REG)]),
      })
    })
  }


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
  checkedFileList($event: any, index: any) {
    if (!$event) {
      this.beneficiaryDetailList[index].file = "";
    }
  }

  ngOnInit(): void {
    this.getLcMandatoryDoc();
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
  getAdvErrorship(controlName: any) {
    if (this.submittedAdvAppForm2) {
      return this.fh.formInputError(this.advShipmentDetails, controlName);
    }
    return '';
  }
  getLcMandatoryDoc() {
    this.beneficiaryDetailList.forEach((element: any, index: any) => {
      this.beneficiaryDetailList.push({
        rowIndx: index,
        attchId: index,
        encAttchId: index,
        attchCd: element.atchmnt,
        attchNm: element.attchNm,
        isChckd: 1,

      });
    });
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
          noOfOrgnls: element.noOfOrgnls,
          noOfCopies: element.noOfCopies,
          docRefNo: element.docRefNo,
          docDt: moment(element.docDt).format('YYYY-MM-DDTHH:mm:ssZZ'),
          atchmnt: element.atchmnt
        });
      });
    })
  }
  deleteConDtlRemitance(index: any) {
    this.beneficiaryDetailList.splice(index, 1)
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
  loadPurposeDtls() {
    const val = this.advShipmentDetails.value;
    if (val.advRemShipDtlsVo.hsCode != '') {
      this.comservice.hsCodeDescription(val.advRemShipDtlsVo.hsCode).subscribe(data => {
        if (data && data != null) {
          this.advShipmentDetails.patchValue({
            advRemShipDtlsVo: {
              hsDesc: data.hsDesc
            }
          })
        } else {
          this.advShipmentDetails.patchValue({
            advRemShipDtlsVo: {
              hsDesc: "",
              hsCode: ""
            }
          })
          this.modal_body_2 = 'H.S. Code is invalid kindly refer the "View H.S. Code" link next to description';
          this.modalService.open(this.contentbodyred, { size: 'sm' });
        }
      })
    }
  }
  hsCodeDoc(link: any) {
    try {
      const pt = environment.app_url
      window.open(pt + "/docDownload/" + link, '_blank');
    } catch (error) {
    }
  }
  onSubmitAddShipmanet() {
    this.submittedAdvAppForm2 = true;
    let isNoErrorConDate = true;
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
      if (!this.fh.notNullUndefinedBlank(row.attchNm) && ((typeof (row.atchmnt) == "undefined" || row.atchmnt == "") || (typeof (row.file) == "undefined" || (row.file && row.file.name == '')))) {
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
    if (this.advShipmentDetails.valid && isNoErrorConDate) {
      return true;
    }
    return false;
  }
  beneficiarySelected() {
    const val = this.advShipmentDetails.value;
    const found = this.beneficiaryList.find((o: any) => o.beneNam === val.advRemSupDrwDtlsVo.name);
    if (found && found.addr1) {
      const intermediaryBankCountryNam: any = this.country.find((o: any) => o.alfaCode === found.intermediaryBankCountryNam);

      this.advShipmentDetails.patchValue({
        advRemSupDrwDtlsVo: {
          addr1: found.addr1,
          addr2: found.addr2,
          name: found.beneNam,
          swiftCode: found.beneSwiftCod,
          cntryId: found.countryNam,
          bnfAccNo: found.beneAcct,
          bnkNm: found.beneBankNam
        },
        advRemDrweBnkDtlsVo: {
          swiftCode: found.intermediaryBankSwiftCod,
          // cntryId: intermediaryBankCountryNam.countryId,
          addr2: found.intermediaryBankAddr1,
          addr1: found.intermediaryBankAddr2,
          drweBnkNm: found.intermediaryBankNam,
          drweAccNo: found.beneAcct,
          // interSwiftCode: found.intermediaryBankClearingCod,
        }
      });
      if (intermediaryBankCountryNam) {
        this.advShipmentDetails.patchValue({
          advRemDrweBnkDtlsVo: {
            cntryId: intermediaryBankCountryNam.countryId,
          },
        })
      }
    }
  }
}
