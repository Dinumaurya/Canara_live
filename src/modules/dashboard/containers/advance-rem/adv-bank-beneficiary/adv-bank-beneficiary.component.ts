import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { DashboardService } from '@modules/dashboard/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { helpers } from 'chart.js';

@Component({
    selector: 'sb-adv-bank-beneficiary',
    templateUrl: './adv-bank-beneficiary.component.html',
    styleUrls: ['./adv-bank-beneficiary.component.scss'],
})
export class AdvBankBeneficiaryComponent implements OnInit, AfterViewInit {
  constructor(
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
    private dashboardService: DashboardService,
    public fh: FormHelperService,
    private modalService: NgbModal,
    private ref: ChangeDetectorRef,
  ) {
    this.advBeneficiaryForm = this.formBuilder.group({
      advRemDrweBnkDtlsVo: this.formBuilder.group({
        // drweAccNo: new FormControl('', [Validators.required, Validators.maxLength(34),Validators.pattern(fh.CUSTOMER_NAME_REG)]),
        // interSwiftCode: new FormControl('', [Validators.pattern(this.fh.SWIFT_CODE_REG)]),
        isSwiftCodeNotAvl: new FormControl('', []),
        // swiftCode: new FormControl('', [Validators.required, Validators.pattern(this.fh.SWIFT_CODE_REG)]),
        // cntryId: new FormControl('', [Validators.required]),
        // addr2: new FormControl('', [Validators.required,Validators.pattern(fh.CUSTOMER_NAME_REG)]),
        // addr1: new FormControl('', [Validators.required,Validators.pattern(fh.CUSTOMER_NAME_REG)]),
        // drweBnkNm: new FormControl('', [Validators.required,Validators.pattern(fh.CUSTOMER_NAME_REG)]),
        // cifId: new FormControl(39956420, [Validators.required]),
        swiftBnkNm: new FormControl('', []),
        swiftBnkAddr1: new FormControl('', []),
        swiftBnkAbacd: new FormControl('', []),
        swiftBnkAbaCdDesc: new FormControl('', []),
      }),
    });
  }
  get isEditable() {
    return this.currentMode == "view" ? true : false;
  }

  get advBeneficiaryDetailsVal() {
    return this.advBeneficiaryForm.value;
  }
  @ViewChild("contentbodyred", { static: false }) contentbodyred: any;
  @Output('advBenificiaryEvent') advBenificiaryEvent = new EventEmitter();
  @Input() country = [];
  public advBeneficiaryForm: FormGroup;
  public bankBeneDetailsList: any = [];
  public accountDetailTabl1Total = 0;
  public submittedAdvBeneFrom3: boolean = false;
  public accountTypeList: any = [];
  public beneficiaryDetailList: any = [];
  public secondTable: any = [];
  public imagename: any;
  public accountDetailsList: any = [];
  public currency: any = [];
  public accountNumberList: any = [];
  public beneficiaryList: any;
  public selectedValue: any;
  public getDocDescType: any = [];
  public modal_body_2 = '';
  public currentMode: any = "edit";
  public ABA_CDlist = []
  modal_title = "";

  getAccTp() {
    this.comservice.accType().subscribe(data => {
      this.accountTypeList = data.subCommonMasterList;
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
  loadDefaultBeneficiary() {
    this.comservice.getBeneDetails().subscribe(data => {
      this.beneficiaryList = data;
    })
  }
  getBeneficiaryDetails() {
    try {
      const jsn: any = sessionStorage.getItem('user');
      const customerId = JSON.parse(jsn);
      const dt = customerId.ibData.AuthKey;
      if (customerId && customerId.ibData && customerId.ibData.UserID) {
        var UserId = customerId.ibData.UserID
      }
      if (customerId && customerId.ibData && customerId.ibData.UserID) {
        this.comservice.getBeneficiaryDetails(dt, 'FTB', UserId)
          .subscribe(data => {
            if (data.beneDetails) {
              this.beneficiaryList = data.beneDetails;
            }
          },
            (err) => {
              this.loadDefaultBeneficiary();
            }
          )
      } else {
        this.loadDefaultBeneficiary();
      }
    } catch (error) {
      this.loadDefaultBeneficiary();
    }

  }
  resetChecked() {
    this.advBeneficiaryForm.reset({
      advRemDrweBnkDtlsVo: {
        swiftBnkNm: '',
        swiftBnkAddr1: '',
        swiftBnkAbacd: '',
        swiftBnkAbaCdDesc: ''
      }
    });
  }
  onChecked(event: any) {
    if (event.target.checked == false) {
      this.resetChecked();
    }
  }
  ngAfterViewInit() {
    if (this.comservice.getAuthKey()) {
      this.advBeneficiaryForm.patchValue({
        advRemCustDtlsVo: {
            // custId:  (this.comservice.getAuthKey()),
          dpCode: this.comservice.getBranchCode()
        }
      });
      this.accountNumberList = this.comservice.getAccountNo()
    }  
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
    })
    this.getAccTp();
    this.getCurrency();
    this.getABA_CD();

  }
  getCurrency() {
    this.comservice.getCurrency().subscribe(data => {
      this.currency = data;
      this.currency = this.currency.sort((a: any, b: any) => a.code.localeCompare(b.code))
    })
  }

  getABA_CD() {
    this.comservice.getABA_CD().subscribe(data => {
      this.ABA_CDlist = data.subCommonMasterList;
    })
  }
  checkedFileList($event: any, index: any) {
    if (!$event) {
      this.beneficiaryDetailList[index].file = "";
    }
  }
  accountDetailTabl1TotalCal() {
    let total = 0;
    this.accountDetailsList.forEach((element: any) => {
      total += (+element.amnt)
    });
    this.accountDetailTabl1Total = total;
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
    })
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

  deleteConDtlRemitance(index: any) {
    this.beneficiaryDetailList.splice(index, 1)
  }
  ngOnInit(): void {
  }

  getBeneError(controlName: any) {
    if (this.submittedAdvBeneFrom3) {
      return this.fh.formInputError(this.advBeneficiaryForm, controlName);
    }
    return '';
  }
  onSubmitBankForm3() {
    this.submittedAdvBeneFrom3 = true;
    let isNoError = true;
    if (this.accountDetailsList == 0) {
      isNoError = false;
    }
    this.accountDetailsList.forEach((accountDetail: any) => {
      if (accountDetail.accNo == '') {
        accountDetail.accNoReq = true;
        isNoError = false;
      } else {
        accountDetail.accNoReq = false;
      }
      if (accountDetail.accNo !== '' && accountDetail.accNo.length > 16) {
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
    if (this.advBeneficiaryForm.valid && isNoError) {
      return true;
    }
    return false;
  }
  isNoBeneficiary() {
    const bfDetails = this.advBeneficiaryForm.value.advRemDrweBnkDtlsVo;
    if (bfDetails.isSwiftCodeNotAvl && this.submittedAdvBeneFrom3) {
      if (bfDetails.swiftBnkNm == '') {
        return false;
      }
      if (bfDetails.swiftBnkAddr1 == '') {
        return false;
      }
      if (bfDetails.swiftBnkAbacd == '') {
        return false;
      }
    }
    return true;
  }
}
