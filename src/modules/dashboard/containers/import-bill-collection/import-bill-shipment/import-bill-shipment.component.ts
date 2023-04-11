import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { validate } from 'uuid';
import { ImportBillApplicantComponent } from '../import-bill-applicant/import-bill-applicant.component';



@Component({
  selector: 'sb-import-bill-shipment',
  templateUrl: './import-bill-shipment.component.html',
  styleUrls: ['./import-bill-shipment.component.scss']
})
export class ImportBillShipmentComponent {
  @Input() childShipmentMessage!: string;
  @Input() country = [];
  @Input() currency = [];
  @Input() applicatFormValue: any = {};
  @Output('billshipmentEvent') billshipmentEvent = new EventEmitter();
  @ViewChild('billApplicant', { static: false }) billApplicant!: ImportBillApplicantComponent;
  @ViewChild("content", { static: false }) content: any;
  @ViewChild("contentbodyred", { static: false }) contentbodyred: any;
  public billShipmentForm: FormGroup;
  public modal_title = "Status"
  public modal_body = "Please correct form";
  public modal_body_2 = "";
  public amount: string;
  public conversationDetailForm1Total = 0;
  public submittedBillShipment: boolean = false;
  public incotermsList: any = [];
  public conversionList: any = [];
  public firstTab: boolean = false;
  constructor(
    public fh: FormHelperService,
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
    private modalService: NgbModal,
  ) {
    this.amount = '';
    this.billShipmentForm = this.formBuilder.group({
      draftTenor: new FormControl('', []),
      draftDays: new FormControl('', []),
      draftBy: new FormControl('', []),
      draftCustomerNm: new FormControl('', []),
      docDt: new FormControl('', [Validators.required]),
      importBillsShipDtlsVo: this.formBuilder.group({
        hsCode: new FormControl('', [Validators.required]),
        hsDesc: new FormControl('', [Validators.required]),
        descGdsRmrks: new FormControl('', [Validators.required]),
        proInvNo: new FormControl('', [Validators.required]),
        plRcpt: new FormControl('', []),
        pol: new FormControl('', [Validators.required,Validators.pattern(fh.ALPHA_AND_SPACE)]),
        pod: new FormControl('', [Validators.required,Validators.pattern(fh.ALPHA_AND_SPACE)]),
        plDlvry: new FormControl('', []),
        carrierNm: new FormControl('', [Validators.required]),
        inCoTerms: new FormControl('', [Validators.required]),
        ltstShpMntDt: new FormControl('', [Validators.required]),
        shpmntMrks: new FormControl('', []),
        transShpmntAllwd: new FormControl('', []),
        prtlShpmntAllwd: new FormControl('', []),
        shpmntInfo: new FormControl('', []),
        shpmntDtls: new FormControl('', []),
        goodsShpmntDt: new FormControl('', [Validators.required]),
      }),
    });
  }

  isValidDate(d: any) {
    return d instanceof Date && !isNaN(d.getTime());
  }
  isDateGreater() {
    const group: FormGroup = this.billShipmentForm;
    if (group) {
      function isValidDate(d: any) {
        return d instanceof Date && !isNaN(d.getTime());
      }
      const ltstShpMntDt = group.get('importBillsShipDtlsVo.ltstShpMntDt');
      const goodsShpmntDt = group.get('importBillsShipDtlsVo.goodsShpmntDt');
      if (isValidDate(new Date(ltstShpMntDt?.value)) && isValidDate(new Date(goodsShpmntDt?.value))) {
        if ((new Date(ltstShpMntDt?.value).getTime() <= new Date(goodsShpmntDt?.value).getTime())) {
          return true;
        }
      }
    }
    return false;
  }
  getShipmentError() {
    if (this.submittedBillShipment) {
      if (this.submittedBillShipment && this.applicatFormValue.billPayment != 'FOR_PAYMENT') {
        return this.isDateGreater();
      }
      return true;
    }
  }
  get AppUserVal() {
    return this.billShipmentForm.value;
  }
  deleteConversionDetail(index: any) {
    this.conversionList.splice(index, 1);
    this.getConversationDetailForm1Total();
  }
  getConversationDetailForm1Total() {
    let total = 0;
    if (this.conversionList && this.conversionList.length) {
      this.conversionList.forEach((element: any) => {
        total += (+element.loanAmount)
      });
    }
    this.conversationDetailForm1Total = total;
  }
  public onAddRowConvrsion(): void {
    if ((this.conversionList == null || this.conversionList == undefined)) {
      this.conversionList = [];
    }
    this.conversionList.push({
      expBRefNum: "",
      frwdCntrctDtlsId: 2677,
      srNo: null,
      expBDt: "",
      billAmount: "",
      margin: "",
      loanAmount: "",
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

  }
  changeSight(event: any) {
    if (event.target.value == 'SIGHT') {
      this.billShipmentForm.patchValue({
        draftDays: '',
        draftBy: '',
        draftCustomerNm: ''
      });
    }
  }

  loadPurposeDtls() {
    const val = this.billShipmentForm.value;
    if (val.importBillsShipDtlsVo.hsCode != '') {
      this.comservice.hsCodeDescription(val.importBillsShipDtlsVo.hsCode).subscribe(data => {
        if (data && data != null) {
          this.billShipmentForm.patchValue({
            importBillsShipDtlsVo: {
              hsDesc: data.hsDesc
            }
          })
        } else {
          this.billShipmentForm.patchValue({
            importBillsShipDtlsVo: {
              hsDesc: "",
              hsCode:""
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
  public currentMode: any = "edit";

  get isEditable() {
    return this.currentMode == "view" ? true : false;
  }
  onShipmentFormShipment() {
    this.submittedBillShipment = true;
    let isNoErrorConDate = false;

    this.conversionList.forEach((row: any) => {
      if (row.expBRefNum == '') {
        row.expBRefNumReqq = true;
        isNoErrorConDate = false;
      } else {
        row.expBRefNumReqq = false;
      }
      if (row.expBDt == '') {
        row.expBDtReq = true;
        isNoErrorConDate = false;
      } else {
        row.expBDtReq = false;
      }
      if (row.billAmount == '') {
        row.billAmountReqq = true;
        isNoErrorConDate = false;
      } else {
        row.billAmountReqq = false;
      }
      if (row.margin == '') {
        row.marginReqq = true;
        isNoErrorConDate = false;
      } else {
        row.marginReqq = false;
      }
      if (row.loanAmount == '') {
        row.loanAmountReqq = true;
        isNoErrorConDate = false;
      } else {
        row.loanAmountReqq = false;
      }

    });
    if (this.billShipmentForm.valid) {
      this.billshipmentEvent.emit(this.billShipmentForm.value)
    }
  }
  getErrorBillShipment(controlName: any) {

    if (this.submittedBillShipment) {
      return this.fh.formInputError(this.billShipmentForm, controlName);
    }
    return '';
  }
}
