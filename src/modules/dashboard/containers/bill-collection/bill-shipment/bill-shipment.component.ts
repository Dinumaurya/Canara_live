import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { BillApplicantComponent } from '../bill-applicant/bill-applicant.component';

@Component({
  selector: 'sb-bill-shipment',
  templateUrl: './bill-shipment.component.html',
  styleUrls: ['./bill-shipment.component.scss']
})
export class BillShipmentComponent implements OnInit {
  @Output('billshipmentEvent') billshipmentEvent = new EventEmitter();
  @ViewChild('billApplicant', { static: false }) billApplicant!: BillApplicantComponent;
  @Input() applicantValue: any;
  @Input() childShipmentMessage!: string;
  @Input() country = [];
  @Input() currency = [];
  @ViewChild("content", { static: false }) content: any;
  @ViewChild("contentbodyred", { static: false }) contentbodyred: any;
  amount: string;
  public conversationDetailForm1Total = 0;
  public billShipmentForm: FormGroup;
  public submittedBillShipment: boolean = false;
  public incotermsList: any = [];
  public conversionList: any = [];
  public modal_title = "Status"
  public modal_body = "Please correct form";
  public modal_body_2 = "";
  public firstTab: boolean = false;
  constructor(
    public fh: FormHelperService,
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
    private modalService: NgbModal,
  ) {
    this.amount = '';
    this.billShipmentForm = this.formBuilder.group({
      draftTenor: new FormControl('', [Validators.required]),
      draftDays: new FormControl('', []),
      draftBy: new FormControl('', []),
      draftCustomerNm: new FormControl('', []),
      docDt: new FormControl('', [Validators.required]),
      exportBillsShipDtlsVo: this.formBuilder.group({
        hsCode: new FormControl('', [Validators.required]),
        hsDesc: new FormControl('', [Validators.required]),
        descGdsRmrks: new FormControl('', [Validators.required]),
        proInvNo: new FormControl('', [Validators.required]),
        plRcpt: new FormControl('', []),
        pol: new FormControl('', [Validators.required, Validators.pattern(fh.ALPHA_AND_SPACE)]),
        pod: new FormControl('', [Validators.required, Validators.pattern(fh.ALPHA_AND_SPACE)]),
        plDlvry: new FormControl('', []),
        carrierNm: new FormControl('', []),
        inCoTerms: new FormControl('', [Validators.required]),
       /*  inCoTerms1: new FormControl('', []), */
        ltstShpmntDt: new FormControl('', [Validators.required]),
       /*  ltstShpmntDt1: new FormControl('', []), */
        shpmntMrks: new FormControl('', []),
        transShpmntAllwd: new FormControl('', []),
        prtlShpmntAllwd: new FormControl('', []),
      }),
    });
  }
  ngOnInit(): void {

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
  get appUserVal() {
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
    this.comservice.getIncoterms()
      .subscribe(data => {
        if (data && data.subCommonMasterList) {
          this.incotermsList = data.subCommonMasterList;;
        }
      })

  }

  loadPurposeDtls() {
    const val = this.billShipmentForm.value;
    if (val.exportBillsShipDtlsVo.hsCode != '') {
      this.comservice.hsCodeDescription(val.exportBillsShipDtlsVo.hsCode).subscribe(data => {
        if (data && data != null) {
          this.billShipmentForm.patchValue({
            exportBillsShipDtlsVo: {
              hsDesc: data.hsDesc
            }
          })
        } else {
          this.billShipmentForm.patchValue({
            exportBillsShipDtlsVo: {
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
  isDraftByReq() {
    return this.appUserVal &&
      this.appUserVal.draftTenor == 'USANCE' &&
      this.appUserVal.draftBy == '';
  }
  isDraftDaysReq() {
    return this.appUserVal &&
      this.appUserVal.draftTenor == 'USANCE' &&
      this.appUserVal.draftDays == '';
  }
  isDraftCustomerNmReq() {
    return this.appUserVal &&
      this.appUserVal.draftTenor == 'USANCE' &&
      this.appUserVal.draftCustomerNm == '';
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
  isConversionRequired() {
    if (this.applicantValue.bills === 'BIL_PURCHS_COLCTN'
      || this.applicantValue.bills === 'SUB_SEQ_DSCNT'
      || this.applicantValue.bills === 'DIRCT_EXPRT_DSCNT') {
      if (this.conversionList.length == 0) {
        return true;
      }
    }
    return false;
  }
  onShipmentFormShipment() {
    this.submittedBillShipment = true;
    let isNoErrorConDate = true;
    if (this.isConversionRequired()) {
      isNoErrorConDate = false;
    }
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
    if (this.isDraftByReq()) {
      return false;
    }
    if (this.isDraftDaysReq()) {
      return false;
    }
    if (this.isDraftCustomerNmReq()) {
      return false;
    }
    if (this.applicantValue.bills !== 'SUB_SEQ_DSCNT') {
      if (this.billShipmentForm.valid && isNoErrorConDate) {
        return true;
      }
    }
     else {
      if (isNoErrorConDate) {
        return true;
      }
    }
    return false;
  }
  getErrorBillShipment(controlName: any) {
    if (this.submittedBillShipment) {
      return this.fh.formInputError(this.billShipmentForm, controlName);
    }
    return '';
  }
}
