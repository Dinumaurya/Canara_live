import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { DashboardService } from '@modules/dashboard/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'sb-export-charg',
  templateUrl: './export-charg.component.html',
  styleUrls: ['./export-charg.component.scss']
})
export class ExportChargComponent implements OnInit {
  exportChargeForm: FormGroup;
  exportsubmittedFrom4: boolean = false;
  conversionList: any = [];
  public conversationDetailForm1Total = 0;
  public conversationDetailForm1RcAmt = 0;
  @Input() currency: any = [];
  @Input() country: any = [];
  @Input() exportBillFormValue: any = [];
  @Output('exportChargeEvent') exportChargeEvent = new EventEmitter();
  beneficiaryList: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
    public fh: FormHelperService,
  ) {
    this.exportChargeForm = this.formBuilder.group({
      formCmmnAccVo: this.formBuilder.group({
        isFrwdCntrct: new FormControl('', []),
      }),
      pcfcBankDtlsVo: this.formBuilder.group({
        bankDtlsCifId: new FormControl(39956420, []),
        name: new FormControl('', []),
        bnfAccNo: new FormControl('', []),
        interSwiftCode: new FormControl('', []),
        isSwiftCodeNotAvl: new FormControl('', []),
        swiftCode: new FormControl('', []),
        cntryId: new FormControl('', []),
        addr2: new FormControl('', []),
        addr1: new FormControl('', []),
        swiftBnkNm: new FormControl('', []),
        swiftBnkAddr1: new FormControl('', []),
        swiftBnkAddr2: new FormControl('', []),
        swiftBnkAbacd: new FormControl('', []),
        swiftBnkAbaCdDesc: new FormControl('', []),
      }),

    });
  }

  ngOnInit(): void {
  }
  deleteConversionDetail(index: any) {
    this.conversionList.splice(index, 1);
    this.getConversationDetailForm1Total();
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
  isFormRequired() {
    if (this.isPcfcDomestic) {
      const exportChargeForm = this.exportChargeForm.value;
      if (exportChargeForm.pcfcBankDtlsVo.name == "") {
        return false;
      }
      if (exportChargeForm.pcfcBankDtlsVo.swiftCode == "") {
        return false;
      }
      if (exportChargeForm.pcfcBankDtlsVo.cntryId == "") {
        return false;
      }
      if (exportChargeForm.pcfcBankDtlsVo.addr1 == "") {
        return false;
      }
      if (exportChargeForm.pcfcBankDtlsVo.addr2 == "") {
        return false;
      }
    }
    return true;
  }
  get isPcfcDomestic() {
    if (this.exportBillFormValue.pcfcDtlsVo.pcfcDomesticImport == "PCFC_DOMESTIC") {
      return true;
    }
    return false;
  }
  isNoBeneficiary() {
    const pcfcBankDtlsVo = this.exportChargeForm.value.pcfcBankDtlsVo;
    if (pcfcBankDtlsVo.isSwiftCodeNotAvl && this.exportsubmittedFrom4) {
      if (pcfcBankDtlsVo.swiftBnkNm == '') {
        return false;
      }
      if (pcfcBankDtlsVo.swiftBnkAddr1 === '') {
        return false;
      }
      if (pcfcBankDtlsVo.swiftBnkAddr2 === '') {
        return false;
      }
      if (pcfcBankDtlsVo.swiftBnkAbacd === '') {
        return false;
      }
      if (pcfcBankDtlsVo.swiftBnkAbaCdDesc === '') {
        return false;
      }
    }
    return true;
  }
  public ABA_CDlist = []

  getABA_CD() {
    this.comservice.getABA_CD().subscribe(data => {
      this.ABA_CDlist = data.subCommonMasterList;
    })
  }
  getexportChargeError(controlName: any) {
    if (this.exportsubmittedFrom4) {
      return this.fh.formInputError(this.exportChargeForm, controlName);
    }
    return '';
  }
  get advBeneficiaryDetailsVal() {
    return this.exportChargeForm.value;
  }

  ngAfterViewInit() {
    this.getBeneficiaryDetails();
    this.getABA_CD();
    // this.loadDefaultBeneficiary();
  }

  beneficiarySelected() {
    const val = this.exportChargeForm.value;
    console.log(val);

    const found = this.beneficiaryList.find((o: any) => o.beneId === val.pcfcBankDtlsVo.name);
    console.log(found);

    if (found && found.addr1) {
      const collectionBankCountryNam: any = this.country.find((o: any) => o.alfaCode === found.collectionBankCountryNam);
      const countryNam: any = this.country.find((o: any) => o.alfaCode === found.countryNam);
      this.exportChargeForm.patchValue({
        pcfcBankDtlsVo: {
          beneNam: found.beneNam,
          addr2: found.addr2,
          addr1: found.addr1,
          cntryId: typeof (countryNam) != 'undefined' ? countryNam.countryId : "",
          bnfAccNo: found.beneAcct,
          swiftCode: found.swiftCode,
          interSwiftCode: found.interSwiftCode,
        },
      })
    }
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
        this.comservice.getBeneficiaryDetails(dt, 'FTB', UserId)
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
  public currentMode: any = "edit";
  get isEditable() {
    return this.currentMode == "view" ? true : false;
  }
  onChecked(event: any) {
    if (event.target.checked == false) {
      this.exportChargeForm.reset({
        pcfcBankDtlsVo: {
          swiftBnkNm: '',
          swiftBnkAddr1: '',
          swiftBnkAddr2: '',
          swiftBnkAbacd: '',
          swiftBnkAbaCdDesc: ''
        }
      });
    }
  }
  changeToFrwrd(event: any) {
    if (event.target.checked == false) {
      this.conversionList = [];
      this.conversationDetailForm1Total = 0;
    }

  }
  onSubmitBankForm4() {
    this.exportsubmittedFrom4 = true;
    let isNoErrorConDet = true;
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
    if (this.conversionList.length == 0) {
      isNoErrorConDet = false;
    }

    if (this.exportChargeForm.valid && !isNoErrorConDet) {
      this.exportChargeEvent.emit(this.exportChargeForm.value)
    }

    return false;
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
}
