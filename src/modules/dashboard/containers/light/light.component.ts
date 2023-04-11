import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import Stepper from 'bs-stepper';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbCalendar, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap"
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from './toast.service';
import moment from 'moment';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'sb-light',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './light.component.html',
  styleUrls: ['light.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class LightComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper1', { static: false }) stepper1: any;
  public submitted = false;
  public accountDetailsList: any = [];
  public accountTypeList: any = [];
  public accountDetailTabl1Total = 0;
  public conversionList: any = [];
  public conversionRateList: any = [];
  public beneficiaryList: any = [];
  public conversionDetailsRemitance: any = [];
  public stepper: any;
  public officeform: FormGroup;
  public appUserDetails: FormGroup;
  public accountDetails: FormGroup;
  public beneficiaryDetails: FormGroup;
  public conversionDetails: FormGroup;
  public submittedCon = false;
  public submittedOfc = false;
  public submittedForm1 = false;
  public submittedForm2 = false;
  public submittedForm3 = false;
  public submittedForm4 = false;
  public submittedForm5 = false;
  public country = [];
  public currency = [];
  public accounttype = [];
  public purposecode: any = [];
  public selected = false;
  public checkedInfo: any;
  public table: any;
  public isRtCvrdwithTrdr: boolean = true;
  public isDtlsofFrwdCntrct: boolean = true;
  public amount: any;
  public conversationDetailForm1Total = 0;
  public conversationDetailForm1RcAmt = 0;
  public conversationDetailTotal = 0;
  public amountval: any = ""
  public relationShipList = []
  public accountNumberList: any = [];
  public rtCvrDtlsVoListArray: any = [];
  public viewData: any;
  model!: NgbDateStruct;

  public officeMisList: any = {
    RBI_PRBS_CD: {
      misValue: ''
    },
    BSR_CD: {
      misValue: ''
    },
    SECTOR: {
      misValue: ''
    },
    SSISUBSEC: {
      misValue: ''
    },
    BASE_2: {
      misValue: ''
    },
    STATUSIB: {
      misValue: ''
    },
    SCHEMES: {
      misValue: ''
    },
    PRI_NPRI: {
      misValue: ''
    },
    GUA_COVER: {
      misValue: ''
    },
    SPL_BENEF: {
      misValue: ''
    }
  };
  BeneDetails: any;
  listAPi: any;
  draftdata: any;
  public hideOfcUseTabFeilds: boolean = false;
  updatedata: any;
  modal_title = "Status"
  modal_body = "Please correct form";
  @ViewChild("content", { static: false }) content: any;
  @ViewChild("contentbodyred", { static: false }) contentbodyred: any;
  minDate: { year: number, month: number, day: number };
  constructor(
    private ref: ChangeDetectorRef,
    public toastService: ToastService,
    public fh: FormHelperService,
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
    private spinner: NgxSpinnerService,
    private modalConfig: NgbModalConfig,
    private modalService: NgbModal,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private calendar: NgbCalendar) {
    this.modalConfig.backdrop = 'static';
    this.modalConfig.keyboard = false;
    this.amount = '';
    const dt = new Date();
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };

    this.appUserDetails = this.formBuilder.group({
      outRmtncId: new FormControl('', []),
      taskId: new FormControl('', []),
      sysRefNo: new FormControl('', []),
      transRefNo: new FormControl('', []),
      sysRefDt: new FormControl(dt, [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      remittaceScheme: new FormControl('', [Validators.required]),
      frngExchng: new FormControl('', [Validators.required]),
      currency: new FormControl('', []),
      othrCurrncy: new FormControl('', []),
      isEditable: new FormControl('', []),
      outRmtncCustDtlsVo: this.formBuilder.group({
        custId: new FormControl('', [Validators.required, Validators.maxLength(13)]),
        accNo: new FormControl('', [Validators.required, Validators.maxLength(16)]),
        custNm: new FormControl('', [Validators.required, Validators.pattern(this.fh.CUSTOMER_NAME_REG)]),
        brnchNm: new FormControl('', []),
        dpCode: new FormControl('', [Validators.required, Validators.maxLength(5)]),
        telNo: new FormControl('', [Validators.maxLength(15)]),
        mobNo: new FormControl('', [Validators.required, Validators.maxLength(15)]),
        eMail: new FormControl('', [Validators.required, Validators.email]),
        altEmail: new FormControl('', Validators.pattern(this.fh.EMAIL_REG)),
        address1: new FormControl('', [Validators.required, Validators.required]),
        address2: new FormControl('', []),
        address3: new FormControl('', []),
        ieCode: new FormControl('', []),
        panNo: new FormControl('', [Validators.required, Validators.pattern(this.fh.PAN_REG)]),
        formCustDtlsId: new FormControl('', []),
        cntryId: new FormControl('', [Validators.required]),
        stateId: new FormControl('', []),
        pinCode: new FormControl('', []),
      }),
    }, { validator: this.atLeastOnePhoneRequired });
    this.accountDetails = this.formBuilder.group({
      outRmtncDtlsVo: this.formBuilder.group({
        uinNo: new FormControl('', [Validators.maxLength(15)]),
        isListedCmpny: new FormControl('', []),
        nmOfCmpny: new FormControl('', [Validators.maxLength(35)]),
        invsmntTpList: new FormArray([new FormControl('', []), new FormControl('', []), new FormControl('', []), new FormControl('', []), new FormControl('', [])]),
        propState: new FormControl('', []),
        propCntry: new FormControl('', []),
        purpose: new FormControl('', []),
        rltnShipOfBnf: new FormControl('', []),
        studentNm: new FormControl('', []),
        studentId: new FormControl('', []),
        cntryOfStdyAbrd: new FormControl('', []),
        srcOfFund: new FormControl('', [Validators.required]),
        addtnlInfo: new FormControl('', [Validators.required]),
        addtnlInfo1: new FormControl('', []),
        addtnlInfo2: new FormControl('', []),
        addtnlInfo3: new FormControl('', []),
        autoLq: new FormControl('', []),
      })
    })
    this.beneficiaryDetails = this.formBuilder.group({
      mdOfPymnt: new FormControl('', [Validators.required]),
      bnfDtlsVo: this.formBuilder.group({
        //beneId: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        addr1: new FormControl('', [Validators.required, Validators.pattern(this.fh.CUSTOMER_NAME_REG)]),
        beneNam: new FormControl('', [Validators.pattern(this.fh.CUSTOMER_NAME_REG)]),
        addr2: new FormControl('', [Validators.required, Validators.pattern(this.fh.CUSTOMER_NAME_REG)]),
        cntryId: new FormControl('', [Validators.required]),
        bnfAccNo: new FormControl('', [Validators.required, Validators.pattern(this.fh.CUSTOMER_NAME_REG)]),
        bnkNm: new FormControl('', [Validators.required, Validators.pattern(this.fh.CUSTOMER_NAME_REG)]),
        swiftCode: new FormControl('', [Validators.pattern(this.fh.SWIFT_CODE_REG)]),
        isSwiftCodeNotAvl: new FormControl(false, []),
        swiftBnkNm: new FormControl('', [Validators.pattern(this.fh.CUSTOMER_NAME_REG)]),
        swiftBnkAddr1: new FormControl('', [Validators.pattern(this.fh.CUSTOMER_NAME_REG)]),
        swiftBnkAddr2: new FormControl('', []),
        swiftBnkAbacd: new FormControl('', []),
        swiftBnkAbaCdDesc: new FormControl('', [Validators.pattern(this.fh.ALPHA_NUMBER_SPACE)]),
        bnfDtlsId: new FormControl('', []),
        interSwiftCode: new FormControl('', [Validators.pattern(this.fh.SWIFT_CODE_REG)]),
      })
    }, {
      validators: [
        this.swiftCodeOtherHandling,
        this.swiftCodeSwiftBnk,
        this.swiftCodeSwiftBnkAddr1,
        this.swiftCodeSwiftBnkAbacdRequired,
        this.swiftCodeSwiftBnkAbaCdDesc]
    })
    this.conversionDetails = this.formBuilder.group({
      formDt: new FormControl((new Date()), [Validators.required]),
      formPlace: new FormControl('', [Validators.required]),
      dclrNm: new FormControl('', []),
      finYr: new FormControl((new Date()).getFullYear(), []),
      usdFrm: new FormControl("", []),
      usdTo: new FormControl("", []),
      formCmmnAccVo: this.formBuilder.group({
        autoLq: new FormControl(null, []),
        isDtlsofFrwdCntrct: new FormControl('', []),
        isRtCvrdwithTrdr: [null],
      })
    })
    this.officeform = this.formBuilder.group({
      officeUseVo: this.formBuilder.group({
        accNo: new FormControl('', [Validators.minLength(12), Validators.maxLength(14)]),
        misDtlsList: new FormControl(''),
        nosCharge: new FormControl('', []),
        cncssionChrg: new FormControl('', []),
        isFccAccStlment: new FormControl('', []),
        fccAccNo: new FormControl('', []),
        cncssionPrcntg: new FormControl('', []),
        cncssionFixdAmnt: new FormControl('', []),
        swiftPrcntg: new FormControl('', []),
        swiftFixdAmnt: new FormControl('', []),
        atchmntSanctn: new FormControl('', []),
      }),
      NostroMasterVo: this.formBuilder.group({
        nostroId: new FormControl(''),
        bankName: new FormControl('', []),
        swiftCode: new FormControl('', []),
        signedCity: new FormControl('', []),
        signedAccNo: new FormControl('', []),
        cbsGlCode: new FormControl('', []),
      }),
      signedCopy: new FormControl('', []),
      signedCopyFile: new FormControl('', [])
    });
  }
  swiftCodeOtherHandling(group: FormGroup): { [s: string]: boolean } | null {
    if (group) {
      const frm = group.value;
      if (frm.bnfDtlsVo['isSwiftCodeNotAvl'] == false || frm.bnfDtlsVo['isSwiftCodeNotAvl'] == null) {
        if (frm.bnfDtlsVo['swiftCode'] == "" || frm.bnfDtlsVo['swiftCode'] == null) {
          return { 'swiftCodeRequired': true };
        }
      }
    }
    return null;
  }
  swiftCodeSwiftBnk(group: FormGroup): { [s: string]: boolean } | null {
    if (group) {
      const frm = group.value;
      if (frm.bnfDtlsVo['isSwiftCodeNotAvl'] == true) {
        if (frm.bnfDtlsVo['swiftBnkNm'] == "" || frm.bnfDtlsVo['swiftBnkNm'] == null) {
          return { 'swiftBnkNmRequired': true };
        }
      }
    }
    return null;
  }
  swiftCodeSwiftBnkAddr1(group: FormGroup): { [s: string]: boolean } | null {
    if (group) {
      const frm = group.value;
      if (frm.bnfDtlsVo['isSwiftCodeNotAvl'] == true) {
        if (frm.bnfDtlsVo['swiftBnkAddr1'] == "" || frm.bnfDtlsVo['swiftBnkAddr1'] == null) {
          return { 'swiftBnkAddr1Required': true };
        }
      }
    }
    return null;
  }
  swiftCodeSwiftBnkAbacdRequired(group: FormGroup): { [s: string]: boolean } | null {
    if (group) {
      const frm = group.value;
      if (frm.bnfDtlsVo['isSwiftCodeNotAvl'] == true) {
        if (frm.bnfDtlsVo['swiftBnkAbacd'] == "" || frm.bnfDtlsVo['swiftBnkAbacd'] == null) {
          return { 'swiftBnkAbacdRequired': true };
        }
      }
    }
    return null;
  }
  swiftCodeSwiftBnkAbaCdDesc(group: FormGroup): { [s: string]: boolean } | null {
    if (group) {
      const frm = group.value;
      if (frm.bnfDtlsVo['isSwiftCodeNotAvl'] == true) {
        if (frm.bnfDtlsVo['swiftBnkAbaCdDesc'] == "" || frm.bnfDtlsVo['swiftBnkAbaCdDesc'] == null) {
          return { 'swiftBnkAbaCdDescRequired': true };
        }
      }
    }
    return null;
  }
  get swiftCodeRequired() {
    if (this.submittedForm3) {
      return this.beneficiaryDetails.errors && this.beneficiaryDetails.errors.swiftCodeRequired;
    }
    return "";
  }
  get swiftBnkNmRequired() {
    if (this.submittedForm3) {
      return this.beneficiaryDetails.errors
        && this.beneficiaryDetails.errors.swiftBnkNmRequired;
    }
    return "";
  }
  get swiftBnkAddr1Required() {
    if (this.submittedForm3) {
      return this.beneficiaryDetails.errors
        && this.beneficiaryDetails.errors.swiftBnkAddr1Required;
    }
    return "";
  }
  get swiftBnkAbacdRequired() {
    if (this.submittedForm3) {
      return this.beneficiaryDetails.errors
        && this.beneficiaryDetails.errors.swiftBnkAbacdRequired;
    }
    return "";
  }
  get swiftBnkAbaCdDescRequired() {
    if (this.submittedForm3) {
      return this.beneficiaryDetails.errors
        && this.beneficiaryDetails.errors.swiftBnkAbaCdDescRequired;
    }
    return "";
  }

  atLeastOnePhoneRequired(group: FormGroup): { [s: string]: boolean } | null {
    if (group) {
      if (group.controls['currency'].value || group.controls['othrCurrncy'].value) {
        return null;
      }
    }
    return { 'currencyrequired': true };
  }
  selectToday() {
    this.model = this.calendar.getToday();
  }
  redirectHome() {
    this.router.navigate(['/dashboard/outward/remittance/landing'])
  }
  deleteConversionRateDetail(index: any) {
    this.rtCvrDtlsVoListArray.splice(index, 1);
    this.getConversationDetailTotal()
  }
  getFileText($event: any) {
    if (this.outwardMandatoryDocList) {
      var found = this.outwardMandatoryDocList.find((o: any) => o.attchCd === $event);
      if (found && found.file && found.file.name) {
        const frm = found.file.name;
        if (frm != '') {
          return frm.replace(/\\$/, '').split('\\').pop();;
        }
      }
    }
    return 'Choose File'
  }
  getFileText2() {
    const frm = this.officeform.get('officeUseVo.atchmntSanctn');
    if (frm?.value != '') {
      return frm?.value.replace(/\\$/, '').split('\\').pop();;
    }
    return 'Choose File'
  }
  disFccAccNo() {
    const frm: any = this.officeform.get('officeUseVo.fccAccNo');
    const val = this.officeformVal.officeUseVo.isFccAccStlment == 'NO' ? true : false;
    if (val) {
      frm.disable();
    } else {
      frm.enable();
    }
  }
  getImageText(txt: any) {
    var dt = "";
    try {
      if (this.savedData && this.savedData.officeUse && this.savedData.officeUse.officeAttchList) {
        var found = this.savedData.officeUse.officeAttchList.find((o: any) => o.docAttchNm.indexOf(txt) !== -1);
        if (found) {
          dt = found.docAttchNm;
        }
      }
    } catch (err) { }
    try {
      var found = this.savedData.officeUse.officeAttchList.find((o: any) => o.attchValue.indexOf(txt) !== -1);
      if (found) {
        dt = found.attchValue;
      }

    } catch (err) { }
    return dt
  }
  disableStaffList() {
    const frm1: any = this.officeform.get('officeUseVo.cncssionPrcntg');
    const frm2: any = this.officeform.get('officeUseVo.cncssionFixdAmnt');
    const frm3: any = this.officeform.get('officeUseVo.swiftPrcntg');
    const frm4: any = this.officeform.get('officeUseVo.swiftFixdAmnt');
    const frm5: any = this.officeform.get('officeUseVo.atchmntSanctn');

    let val = false;
    const charges = this.officeformVal.officeUseVo.cncssionChrg;
    if (charges == 'YES') {
      val = false;
    }
    if (charges == 'NO') {
      val = true;
    }
    if (charges == 'STAFF') {
      val = true;
    }

    if (val) {
      frm1.disable();
      frm2.disable();
      frm3.disable();
      frm4.disable();
      frm5.disable();
    } else {
      frm1.enable();
      frm2.enable();
      frm3.enable();
      frm4.enable();
      frm5.enable();
    }
  }
  loadPurposeDtls() {
    const val = this.accountDetails.value;
    // const found = this.purposecode.find((o: any) => o.purposeId === (+val.outRmtncDtlsVo.purposeCd));
    if (val.outRmtncDtlsVo.purposeCd != '') {
      this.comservice.purposeCodeDesciption(val.outRmtncDtlsVo.purposeCd).subscribe(data => {
        this.accountDetails.patchValue({
          outRmtncDtlsVo: {
            puposedesc: data.description
          }
        })
      })
    } else {
      this.modal_body_2 = 'Please check your HS code or contact branch.';
      this.modalService.open(this.contentbodyred, { size: 'sm' });
    }
  }
  hsCodeDoc(link: any) {
    try {
      const pt = environment.app_url
      window.open(pt + "/docDownload/" + link, '_blank');
    } catch (error) {
    }
  }
  get accountValue() {
    return this.accountDetails.value.outRmtncDtlsVo;
  }
  getinvsmntTpListErr() {
    var emp = this.accountValue.invsmntTpList
    if (emp.join(',').replace(/,/g, '').replace(/false/g, '').length === 0 && this.submittedForm2) {
      return true;
    }
    return false;
  }
  getrelationShipList() {
    const val = this.accountValue.rltnShipOfBnf;
    if (val == '' || val == null) {
      return this.submittedForm2 && true;
    }
    return false;
  }
  getrelationEDUCATION(control: any) {
    const val = this.accountValue[control];
    if (val == '' || val == null) {
      return this.submittedForm2 && true;
    }
    return false;
  }
  fillOtherAdditionalInfo() {
    if (this.accountValue.purpose == 'EDUCATION') {
      if (this.accountValue['studentNm'] != null) {
        this.accountDetails.patchValue({
          outRmtncDtlsVo: {
            addtnlInfo: 'STUDENT NAME ' + this.accountValue['studentNm'],
            addtnlInfo2: this.accountValue['cntryOfStdyAbrd']
          }
        })
      }
      if (this.accountValue['studentId'] != null) {
        this.accountDetails.patchValue({
          outRmtncDtlsVo: {
            addtnlInfo1: 'STUDENT ID ' + this.accountValue['studentId'],
            addtnlInfo2: this.accountValue['cntryOfStdyAbrd']
          }
        })
      }
    } else {
      this.accountDetails.patchValue({
        outRmtncDtlsVo: {
          addtnlInfo: '',
          addtnlInfo1: '',
          addtnlInfo2: ''
        }
      })
    }
  }
  accountDetailTabl1TotalCal() {
    let total = 0;
    this.accountDetailsList.forEach((element: any) => {
      total += (+element.amnt)
    });
    this.accountDetailTabl1Total = total;
  }
  next() {
    this.stepper.next();
  }
  goTo(no: any) {
    this.stepper.to(no);
  }
  toggleVisibility(e: any) {
    // this.marked= e.target.checked;
  }
  get AppUserVal() {
    return this.appUserDetails.value;
  }
  get isSaved() {
    return this.AppUserVal.sysRefNo != '' ? true : false;
  }
  get isEditable() {
    return this.currentMode == "view" ? true : false;
  }

  get canUpdate() {
    if (this.savedData && this.savedData.outWardStatusId && this.savedData.outWardStatusId != "") {
      if ([3, 4, 7].indexOf(this.savedData.outWardStatusId) != -1) {
        if (this.currentMode && this.currentMode == "edit") {
          return true;
        }
      }
    }

    return false;
  }

  get canAppRej() {
    if (this.savedData && this.savedData.outWardStatusId && this.savedData.outWardStatusId != "") {
      if ([3].indexOf(this.savedData.outWardStatusId) != -1 && (this.savedData.aprvRmrks === '' || this.savedData.aprvRmrks === null)) {
        return true;
      }
    }
    return false;
  }

  get isDraft() {
    if (this.savedData && this.savedData.outWardStatusId && this.savedData.outWardStatusId != "") {
      if ([4].indexOf(this.savedData.outWardStatusId) != -1) {
        return true;
      }
    }
    if (this.savedData && typeof (this.savedData.transRefNo) == "undefined") {
      return true;
    }
    return false;
  }
  public remarkDetails: any = [];
  public approveremarks: any = '';
  public rejectremarks: any = '';
  public approveModalRef: any;
  public rejectModalRef: any;
  public isApproved = false;
  public isRejected = false;
  openApproveModal(content: any) {
    this.approveModalRef = this.modalService.open(content);
  }
  approveForm() {
    if (this.approveremarks != '') {
      this.approveModalRef.close();
      this.spinner.show();
      this.savedData.aprvRmrks = this.approveremarks;
      this.comservice.approveForm(this.savedData)
        .subscribe((data) => {
          this.savedData = data;
          if (data && data.historyVoList) {
            this.remarkDetails = data.historyVoList;
          }
          this.isApproved = true;
          this.spinner.hide();
          this.showSuccess('Approve Successfully');
        }, () => {
          this.spinner.hide();
          this.showSuccess('Approve Failed');
        })
    }

  }
  openRejectModal(content: any) {
    this.rejectModalRef = this.modalService.open(content);
  }
  rejectForm() {
    if (this.rejectremarks != '') {
      this.rejectModalRef.close();
      this.spinner.show();
      this.savedData.aprvRmrks = this.rejectremarks;
      this.comservice.rejectForm(this.savedData)
        .subscribe((data) => {
          this.savedData = data;
          if (data && data.historyVoList) {
            this.remarkDetails = data.historyVoList;
          }
          this.isApproved = true;
          this.showSuccess('Reject Successfully');
          this.spinner.hide();
        }, () => {
          this.showSuccess('Rejection Failed');
          this.spinner.hide();
        })
    }
  }
  istotalGreaterThanFc() {
    if (((+this.conversationDetailForm1Total) + (+this.conversationDetailTotal)) > this.appUserDetails.value.amount) {
      return true;
    }
    return false;
  }
  getChange(dataProp: any) {
    // this.spinner.show();
    this.getBeneficiaryDetails();
    try {
      //if (this.AppUserVal.outRmtncCustDtlsVo.custId! = "") {
      //call api and patch value
      const dt = {
        "input": {
          "SessionContext": {
            "BankCode": "15",
            "Channel": "BRN",
            "TransactionBranch": "402",
            "UserId": "SYSTEM"
          },
          "CustId": this.appUserDetails.value.outRmtncCustDtlsVo.custId
        }
      }
      this.comservice.getApplicantDetails(this.appUserDetails.value.outRmtncCustDtlsVo.custId).subscribe(data => {
        //this.spinner.hide();
        if (data && data.body && data.body.Response && data.body.Response.CustomerInfoResponse) {
            const rsp = data.body;
          const rcData = rsp.CustomerInfoResponse;
          const Cust=rcData.CustomerFullName.slice(0,35);
          console.log(Cust);
          this.appUserDetails.patchValue({
            outRmtncCustDtlsVo: {
              custNm:Cust,
              //accNo: rcData.AccountNo,
            /*   custNm: typeof (rcData.CustomerFullName) != 'object' ? rcData.CustomerFullName : '', */
              //brnchNm: rcData.CustomerFullName,
              //dpCode: rcData.CustomerFullName,
              // telNo: rcData.CustomerFullName,
              mobNo: typeof (rcData.Phone) != 'object' ? rcData.Phone : '',
              eMail: typeof (rcData.EmailId) != 'object' ? rcData.EmailId : '',
              //altEmail: rcData.AltEmailId,
              address1: typeof (rcData.Address1) != 'object' ? rcData.Address1 : '',
              address2: typeof (rcData.Address2) != 'object' ? rcData.Address2 : '',
              address3: typeof (rcData.Address3) != 'object' ? rcData.Address3 : '',
              panNo: typeof (rcData.PANCardNo) != 'object' ? rcData.PANCardNo : '',
              ieCode: typeof (rcData.IECCode) != 'object' ? rcData.IECCode : '',
            },
          });

          this.conversionDetails.patchValue({
            dclrNm: typeof (rcData.CustomerFullName) != 'object' ? rcData.CustomerFullName : ''
          })
        } else {
          // this.spinner.hide();
          //this.spinner.hide();
          this.showDanger('No such data')
        }

      }, (err) => {
        // this.spinner.hide();
        //this.spinner.hide();
        this.showDanger('Something went wrong')
      })
    } catch (error) {
      //console.log(error);
    }
  }
  getCountry() {
    this.comservice.getCountry().subscribe(data => {
      this.country = data;
    })
  }
  getCurrency() {
    this.comservice.getCurrency().subscribe(data => {
      this.currency = data;
      this.currency = this.currency.sort((a: any, b: any) => a.code.localeCompare(b.code))

    })
  }
  getBeneficiaryDetails() {
    try {
      const dt = this.appUserDetails.value.outRmtncCustDtlsVo.custId
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
      }
    } catch (error) {
      // console.log(error);
    }

  }
  /**
   * Loads Default Beneficiary incase of local or if no ib data
   * @returns any
   */
  loadDefaultBeneficiary() {
    this.comservice.getBeneDetails().subscribe(data => {
      this.beneficiaryList = data;
      // this.spinner.hide();
    })
  }

  public totalConversionDetails = 0;
  totalConversionDetailsChange() {
    let total = 0;
    this.conversionDetailsRemitance.forEach((element: any) => {
      total += (+element.amnt)
    });
    this.totalConversionDetails = total;
  }
  beneficiarySelected() {
    const val = this.beneficiaryDetails.value;
    const found = this.beneficiaryList.find((o: any) => o.beneId === val.bnfDtlsVo.name);
    if (found && found.addr1) {
      this.beneficiaryDetails.patchValue({
        bnfDtlsVo: {
          addr1: found.addr1,
          addr2: found.addr2,
          beneNam: found.beneNam,
          swiftCode: found.beneSwiftCod,
          cntryId: found.countryNam,
          bnfAccNo: found.beneAcct,
          bnkNm: found.beneBankNam,
        }
      })
    }
  }
  getConversationDetailTotal() {
    let total = 0;
    this.rtCvrDtlsVoListArray.forEach((element: any) => {
      total += (+element.amnt)
    });
    this.conversationDetailTotal = total;
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
  getConversationDetailForm1RcAmt() {
    let total = 0;
    this.conversionList.forEach((element: any) => {
      total += (+element.amntUtilizd)
    });
    this.conversationDetailForm1RcAmt = total;
  }

  delete_row() {
    const table: any = document.querySelector('table');
    // Delete second row
    table.deleteRow(1);
  }

  delete_rows() {
    const table: any = document.querySelector('table');
    // Delete second row
    table.deleteRow(1);
  }
  inputChange(event: any) {
    this.amount = event.target.value;

    this.amountval = this.convertNumberToWords(this.amount)
  }

  ngOnInit() {
    this.hideOfcUseTabFeilds = false;
    this.comservice.purposeCode().subscribe(result => {
      this.purposecode = result;
      //console.log(this.purposecode);

    })
  }

  public onAddRowClick(): void {
    if ((this.accountDetailsList == null || this.accountDetailsList == undefined)) {
      this.accountDetailsList = [];
    }
    this.accountDetailsList.push({
      srNo: 1,
      accNo: "",
      accTp: "",
      fcy: "",
      amnt: "",
    });
  }
  public onAddRowConvrsion(): void {
    if ((this.conversionList == null || this.conversionList == undefined)) {
      this.conversionList = [];
    }
    this.conversionList.push({
      frwdCntrctNo: "",
      fcy: "",
      orgnlAmnt: "",
      utlizAmnt: "",
      amntUtilizd: "",
      frgnBnkChrgs: "",
    });

  }
  onAddRowConvrsionRate() {
    if ((this.rtCvrDtlsVoListArray == null || this.rtCvrDtlsVoListArray == undefined)) {
      this.rtCvrDtlsVoListArray = [];
    }
    this.rtCvrDtlsVoListArray.push({
      frmFcy: '',
      toFcy: '',
      amnt: '',
      rate: '',
      retAdno: '',
    });
  }
  public onAddRowDetailsRemitance(): void {
    if ((this.conversionDetailsRemitance == null || this.conversionDetailsRemitance == undefined)) {
      this.conversionDetailsRemitance = [];
    }
    this.conversionDetailsRemitance.push({
      rmtncDt: '',
      currency: '',
      amnt: '',
      address: '',
    });
  }

  deleteAccountDetail(index: any) {
    this.accountDetailsList.splice(index, 1);
    this.accountDetailTabl1TotalCal();
  }

  deleteConversionDetail(index: any) {
    this.conversionList.splice(index, 1);
    this.getConversationDetailForm1Total();
  }

  deleteConDtlRemitance(index: any) {
    this.conversionDetailsRemitance.splice(index, 1)
  }

  get isFormChargesRequired() {
    if (this.submittedForm5
      && this.getErrorOfc('officeUseVo.swiftFixdAmnt') == ''
      && this.getErrorOfc('officeUseVo.swiftPrcntg') == ''
      && this.getErrorOfc('officeUseVo.cncssionFixdAmnt') == ''
      && this.getErrorOfc('officeUseVo.cncssionPrcntg') == ''
      && this.getErrorOfc('officeUseVo.atchmntSanctn') == ''
    ) {
      return true;
    }
    return false;
  }
  getError(controlName: any) {
    if (this.submitted) {
      return this.fh.formInputError(this.appUserDetails, controlName);
    }
    return '';
  }
  getErrApplicantCurrency() {
    if (this.submitted) {
      return this.appUserDetails.errors && this.appUserDetails.errors.currencyrequired;
    }
    return '';
  }
  getErrorForm2(controlName: any) {
    if (this.submittedForm2) {
      return this.fh.formInputError(this.accountDetails, controlName);
    }
    return '';
  }
  getErrornew(controlName: any) {
    if (this.submittedForm3) {
      return this.fh.formInputError(this.beneficiaryDetails, controlName);
    }
    return '';
  }
  getErrorOfc(controlName: any) {
    if (this.submittedForm5) {
      return this.fh.formInputError(this.officeform, controlName);
    }
    return '';
  }
  getErrorCon(controlName: any) {
    if (this.submittedForm4) {
      return this.fh.formInputError(this.conversionDetails, controlName);
    }
    return '';
  }
  onChangeRole(isChecked: any) {
    this.checkedInfo = isChecked;
    if (isChecked.target.checked) {
      return this.table;
    }
    return this.checkedInfo;
  }
  onChangeRoleone(checked: any) {
    this.checkedInfo = checked;
    if (checked.target.checked) {
      return this.table;
    }
    return this.checkedInfo;
  }
  get officeformVal() {
    return this.officeform.value;
  }
  get conversionDetailVal() {
    return this.conversionDetails.value;
  }

  onClick(event: any) {
    if (event.target.checked == false) {
      this.conversionList = [];
      this.conversationDetailForm1Total = 0;
    }
  }
  onChangeRate(event: any) {
    if (event.target.checked == false) {
      this.rtCvrDtlsVoListArray = [];
      this.conversationDetailTotal = 0;
    }

  }

  onChecked(event: any) {
    if (event.target.checked == false) {
      this.beneficiaryDetails.reset({
        bnfDtlsVo: {
          swiftBnkNm: '',
          swiftBnkAddr1: '',
          swiftBnkAbacd: '',
          swiftBnkAbaCdDesc: ''
        }
      });
    }
  }
  resetForm() {
    this.accountDetails.reset({
      outRmtncDtlsVo: {
        studentNm: '',
        rltnShipOfBnf: '',
        studentId: '',
        cntryOfStdyAbrd: '',
        propState: '',
        propCntry: '',
        nmOfCmpny: '',
        isListedCmpny: '',
        uinNo: '',
        0: '',
        1: '',
        2: '',
        3: '',
        4: ''
      }
    });
  }
  onChange(event: any) {
    if (event.target.value != 'LRS') {
      this.resetForm();
    }
  }
  public modal_body_2: any = '';
  public fileList: any = [];
  setFileForDocument($event: any, index: any) {
    const file = $event.target.files[0];
    if (file.type === 'application/pdf' && file.size < (1024 * 1024 * 5)) {
      this.outwardMandatoryDocList[index].file = $event.target.files[0];
    } else {
      this.modal_body_2 = 'Please select only PDF file and size less than 5 MB.';
      this.modalService.open(this.contentbodyred, { size: 'sm' });
      delete this.outwardMandatoryDocList[index].file;
    }

  }
  ngAfterViewInit() {
    const stepper1 = this.stepper1.nativeElement;
    this.stepper = new Stepper(stepper1, {
      linear: false,
      animation: true,
    });
    this.comservice.accountType().subscribe(data => {
      if (data) {
        this.accounttype = data;
      }
    })
    this.getCountry();
    this.getCurrency();
    this.getMisSSISUBSEC();
    this.getMisSTATUSIB();
    this.getAccTp();
    this.getNostroApi()
    this.getABA_CD();
    this.getRelationList();
    this.getMisBSR_CODE();
    this.getMisBase_2();
    this.getMisGUA_COVER();
    this.getMisPRI_NPRI();
    this.getMisSCHEMES();
    this.getMisPurposeCode();
    this.getMisSECTOR();
    this.getMisSPL_BENEF();
    this.getDclList();
    this.getOutwardMandatoryDoc();

    const jsn: any = sessionStorage.getItem('user');
    if (jsn) {
      const customerId = JSON.parse(jsn);
      if (customerId && customerId.ibData && customerId.ibData.CustomerId) {
        this.appUserDetails.patchValue({
          outRmtncCustDtlsVo: {
            custId: customerId.ibData.CustomerId,
            dpCode: customerId.ibData.branchCode
          }
        });
        this.accountNumberList = customerId.ibData.accountDto.accountnumber
      }
    }
    setTimeout(() => {
      this.getChange({});
      this.ref.detectChanges();
    }, 1000);
    this.loadView();
  }
  viewDoc(outwardDoc: any) {
    var found = this.savedData.officeUse.officeAttchList.find((o: any) => outwardDoc.attchCd === o.attchCd);
    const dt = {
      filePath: found.attchPath,
      fileNm: found.attchValue,
    }
    try {
      const pt = environment.app_url
      window.open(pt + "/docView/" + found.attchPath, '_blank')
      return false;
    } catch (error) {
      // console.log(error)
    }

  }

  mandatory3Tab = "";
  saveDraft() {
    if (!this.appUserDetails.valid) {
      this.submitted = true;
      this.goTo(1);
      return 0
    }
    if (!this.onSubmitForm2Err()) {
      this.goTo(2);
      return 0
    }
    if (!this.onSubmitBenErr()) {
      this.goTo(3);
      return 0
    }
    if (this.beneficiaryDetails.value.mdOfPymnt == ""
      || this.beneficiaryDetails.value.mdOfPymnt == null) {
      this.mandatory3Tab = "This field is required";
      this.goTo(3);
      return 0
    }
    this.spinner.show();
    // Upload File and set in the data to send 
    const promiseArray: any = [];
    this.outwardMandatoryDocList.forEach((data: any) => {
      if (data.isChckd) {
        var formData: any = new FormData();
        formData.append('file', data.file);
        formData.append('code', data.attchCd);
        promiseArray.push(new Promise((resolve, reject) => {
          this.comservice.saveFile(formData)
            .subscribe((data) => {
              resolve(data)
            }, (err) => {
              reject(err)
            })
        }))
      }
    });
    Promise.all(promiseArray).then((values: any) => {
      var outwardMandatoryDocList: any = []
      if (values && values[0]) {
        try {
          values.forEach((dt: any, index: any) => {
            var found = this.outwardMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
            if (found) {
              outwardMandatoryDocList.push({
                "docAttchNm": dt.docAttchNm,
                "attchCd": found.attchCd,
                "isChckd": 1
              });
            }
          })
        } catch (err) {
          console.log(err)
        }
      }
      let draftData = this.outwardObjData(outwardMandatoryDocList);
      try {
        draftData['bnfDtls']['name'] = draftData.bnfDtls.beneNam;
      } catch (error) {

      }
      if (draftData.sysRefNo === "" && draftData.transRefNo === "") {
        this.comservice.saveDraft(draftData).subscribe((data: any) => {
          // this.draftdata = data;
          // Hadle Save Data
          this.savedData = data;
          if (data && data.sysRefNo != '' && data.sysRefNo != undefined) {
            this.appUserDetails.patchValue({
              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              outRmtncId: data.outRmtncId,
              taskId: data.taskId,
            });
            if (data && data.historyVoList) {
              if (this.currentMode && this.currentMode != "edit") {
                this.remarkDetails = data.historyVoList;
              }
            }
          }
          this.savedData.isEditable = true;
          setTimeout(() => {
            this.spinner.hide();
            this.modal_body = 'Draft Saved successfully';
            this.ref.detectChanges();
            this.modalService.open(this.content, { size: 'sm' });
          }, 2000);

        }, () => {
          this.spinner.hide();
          this.showDanger('No Data Saved');
        });
      } else {
        this.comservice.updateDraft(draftData).subscribe((data: any) => {
          this.savedData = data;
          if (data && data.sysRefNo != '') {
            this.appUserDetails.patchValue({
              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              outRmtncId: data.outRmtncId,
              taskId: data.taskId,
            });
            if (data && data.historyVoList) {
              if (this.currentMode && this.currentMode != "edit") {
                this.remarkDetails = data.historyVoList;
              }
            }
          }
          this.savedData.isEditable = true;
          setTimeout(() => {
            this.spinner.hide();
            this.modal_body = 'Draft Updated successfully';
            this.ref.detectChanges();
            this.modalService.open(this.content, { size: 'sm' });
          }, 2000);
        }, () => {
          this.spinner.hide();
          this.showDanger('No Data Saved');
        });
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.appUserDetails.valid) {
        this.next();
      }
    }

  }
  isThisFieldRequired(outwardDoc: any, $event: any) {
    if (outwardDoc && outwardDoc.attchCd) {
      var found = this.outwardMandatoryDocList.find((o: any) => o.attchCd === outwardDoc.attchCd);
      if (outwardDoc.attchCd == 'SIGN_CPY_APP') {
        if ((!found || !found.file || !found.file.name) && (found.docAttchNm == "" || typeof (found.docAttchNm) == 'undefined')) {
          return true;
        }
        if (found && found.docAttchNm != "") {
          return false;
        }
      }
      else {
        if (found.isChckd == true) {
          if ((!found || !found.file || !found.file.name) && (found.docAttchNm == "" || typeof (found.docAttchNm) == 'undefined')) {
            return true;
          }
          if (found && found.docAttchNm != "") {
            return false;
          }
        }
      }
    }
    return false;
  }
  checkedFileList($event: any, index: any, outwardDoc: any) {
    if (!$event) {

      this.outwardMandatoryDocList[index].file = "";
      this.outwardMandatoryDocList[index].isChckd = false;
      if (this.savedData && this.savedData.officeUse) {
        this.savedData.officeUse.officeAttchList.forEach((element: any, index: any) => {
          if (element && element.attchCd === outwardDoc.attchCd) {
            element.docAttchNm = "";
            element.attchPath = "";
            element.attchValue = "";
          }
        });
      }
      this.outwardMandatoryDocList[index].docAttchNm = "";

    } else {
      this.outwardMandatoryDocList[index].isChckd = true;
    }
  }
  /**
   * Generates JSON that need to be send
   * @param outwardMandatoryDocList 
   */
  outwardObjData(outwardMandatoryDocList: any) {

    var declaretonList: any = []
    this.dclList.forEach((element: any, index: any) => {
      if (element.isDclrtnChckd == true) {
        declaretonList.push({
          rowIndx: index,
          officeDclrtnId: null,
          encOfficeDclrtnId: null,
          dclrtnCd: element.dclrtnCd,
          dclrtnNm: element.dclrtnNm,
          isDclrtnChckd: element.isDclrtnChckd == true ? 1 : 0,
        });
      }
    })
    const conversionDt: any = this.conversionDetails.value;
    const officeUse: any = this.officeform.value
    const beneFicaryDetail: any = JSON.parse(JSON.stringify(this.beneficiaryDetails.value));
    const fnd: any = this.country.find((x: any) => (x.alfaCode == beneFicaryDetail.bnfDtlsVo.cntryId));
    if (fnd) {
      beneFicaryDetail.bnfDtlsVo.cntryId = fnd.countryId
    }
    if (beneFicaryDetail.name) {
      beneFicaryDetail.name = beneFicaryDetail.beneNam;
    }

    const accountDetailsList: any = [];
    this.accountDetailsList.forEach((element: any) => {
      accountDetailsList.push({
        accNo: element.accNo,
        accTp: element.accTp,
        fcy: element.fcy,
        amnt: element.amnt,
        srNo: element.srNo
      })
    });
    const conversionList: any = [];
    if (this.conversionList && this.conversionList.length) {
      this.conversionList.forEach((element: any) => {
        conversionList.push({
          frwdCntrctNo: element.frwdCntrctNo,
          srNo: 1,
          fcy: element.fcy,
          orgnlAmnt: element.orgnlAmnt,
          utlizAmnt: element.utlizAmnt,
          amntUtilizd: element.amntUtilizd,
          frgnBnkChrgs: element.frgnBnkChrgs,
        })
      });
    }

    const rtCvrDtlsVoListArray: any = [];
    if (this.rtCvrDtlsVoListArray && this.rtCvrDtlsVoListArray.length) {
      this.rtCvrDtlsVoListArray.forEach((element: any) => {
        rtCvrDtlsVoListArray.push({
          toFcy: element.toFcy,
          srNo: 1,
          frmFcy: element.frmFcy,
          amnt: element.amnt,
          rate: element.rate,
          retAdno: element.retAdno
        })
      });
    }

    const conversionDetailsRemitance: any = [];
    this.conversionDetailsRemitance.forEach((element: any) => {
      conversionDetailsRemitance.push({
        currency: element.currency,
        srNo: 1,
        amnt: element.amnt,
        address: element.address,
        rmtncDt: moment(element.rmtncDt).format('YYYY-MM-DDTHH:mm:ssZZ')
      })
    });

    let sampleData = {
      "outRmtncId": '',
      "taskId": '',
      "sysRefNo": "",
      "transRefNo": "",
      "sysRefDt": "",
      "appRefDt": "",
      "remittaceScheme": this.AppUserVal.remittaceScheme,
      "outRmtncCustDtls": this.appUserDetails.value.outRmtncCustDtlsVo,
      "frngExchng": this.AppUserVal.frngExchng,
      "othrCurrncy": this.AppUserVal.othrCurrncy,
      "currency": this.AppUserVal.currency,
      "amount": (+ this.AppUserVal.amount),
      "amntWords": this.amountval,
      "outRmtncDtls": {
        "purposeCd": this.accountValue.purposeCd,
        "puposedesc": this.accountValue.puposedesc,
        "srcOfFund": this.accountValue.srcOfFund,
        "purpose": this.accountValue.purpose,
        "rltnShipOfBnf": this.accountValue.rltnShipOfBnf,
        "studentNm": this.accountValue.studentNm,
        "studentId": this.accountValue.studentId,
        "cntryOfStdyAbrd": this.accountValue.cntryOfStdyAbrd,
        "propState": this.accountValue.propState,
        "propCntry": this.accountValue.propCntry,
        "nmOfCmpny": this.accountValue.nmOfCmpny,
        "isListedCmpny": this.accountValue.isListedCmpny,
        "uinNo": this.accountValue.uinNo,
        "invsmntTpList": this.accountValue.invsmntTpList,
        "addtnlInfo": this.accountValue.addtnlInfo,
        "addtnlInfo1": this.accountValue.addtnlInfo1,
        "addtnlInfo2": this.accountValue.addtnlInfo2,
        "addtnlInfo3": this.accountValue.addtnlInfo3,
        "autoLq": conversionDt.formCmmnAccVo.autoLq
      },
      "mdOfPymnt": beneFicaryDetail.mdOfPymnt,
      "bnfDtls": beneFicaryDetail.bnfDtlsVo,
      "formCmmnAcc": {
        "formAccDtlsList": accountDetailsList,
        "totAccAmnt": (+this.accountDetailTabl1Total),
        "isFrwdCntrct": this.isDtlsofFrwdCntrct === false ? 1 : 0,
        "formFrwdCntrctDtlsList": conversionList,
        "totFrwdCntrct": (+this.conversationDetailForm1Total),
        "isRtCvrWithTrDr": this.isRtCvrdwithTrdr === false ? 1 : 0,
        "formRtCvrDtlsList": rtCvrDtlsVoListArray,
        "totRtCvrAmnt": this.conversationDetailTotal
      },
      "rmtncDtlsCrncyList": conversionDetailsRemitance,
      "totalRmtncAmnt": this.totalConversionDetails,
      "dclrNm": conversionDt.dclrNm,
      "finYr": conversionDt.finYr,
      "usdFrm": conversionDt.usdFrm,
      "usdTo": conversionDt.usdTo,
      "formDt": conversionDt.formDt != "" ? moment(conversionDt.formDt).format('YYYY-MM-DDTHH:mm:ssZZ') : "",
      "formPlace": conversionDt.formPlace,
      "signature": "",
      "officeUse": {
        // "officeUseId": 1966,
        "accNo": officeUse.officeUseVo.accNo,
        "conscnChrg": officeUse.officeUseVo.cncssionChrg,
        "conscnPrcntg": officeUse.officeUseVo.cncssionPrcntg,
        "conscnFixdAmnt": officeUse.officeUseVo.cncssionFixdAmnt,
        "swiftPrcntg": officeUse.officeUseVo.swiftPrcntg,
        "swiftFixdAmnt": officeUse.officeUseVo.swiftFixdAmnt,
        "isFccAccSetlmnt": officeUse.officeUseVo.isFccAccStlment == 'YES' ? 1 : 0,
        "isFccAccStlment": officeUse.officeUseVo.isFccAccStlment == 'YES' ? 1 : 0,
        "fccAccNo": officeUse.officeUseVo.fccAccNo,
        "offcReqDocList": [],
        "officeAttchList": outwardMandatoryDocList,
        "officeDclrtnList": declaretonList,
        "officeMisList": [],
        "formRtCvrDtlsOffList": [],
        "dscrpncyObsrvdList": [],
        "instMstList": [],
        "totRtCvrOffAmnt": 0,
        "sanctnAttNm": null,
        "sanctnAttPath": null,
        "nosCharge": officeUse.officeUseVo.nosCharge,
        "customer": 0,
        "office": 0,
        "csms": 0,
        "cemail": 0,
        "osms": 0,
        "oemail": 0
      },
      "prodCd": null,
    }
    if (this.savedData && this.savedData.sysRefNo != '' && this.savedData.sysRefNo != undefined) {
      sampleData.sysRefNo = this.savedData.sysRefNo;
      sampleData.transRefNo = this.savedData.transRefNo;
      // sampleData.isEditable = this.savedData.isEditable ;
      sampleData.outRmtncId = this.savedData.outRmtncId;
      sampleData.taskId = this.savedData.taskId;
    }
    try {
      if (sampleData.outRmtncCustDtls.dpCode.toString().length == 3) {
        sampleData.outRmtncCustDtls.dpCode = "0" + sampleData.outRmtncCustDtls.dpCode
      }
      if (sampleData.outRmtncCustDtls.dpCode.toString().length == 2) {
        sampleData.outRmtncCustDtls.dpCode = "00" + sampleData.outRmtncCustDtls.dpCode
      }
    } catch (err) {
      // console.log(err); 
    }
    sampleData['bnfDtls']['isSwiftCodeNotAvl'] = this.beneficiaryDetails.value.bnfDtlsVo.isSwiftCodeNotAvl == true ? 1 : 0;

    return sampleData;
  }

  public savedData: any = {};
  onSubmitForm5() {
    // check if first form is valid
    if (!this.appUserDetails.valid) {
      this.submitted = true;
      this.goTo(1);
      return 0
    }
    if (!this.onSubmitForm2Err()) {
      this.goTo(2);
      return 0
    }
    if (!this.onSubmitBenErr()) {
      this.goTo(3);
      return 0
    }
    if (!this.onSubmitForm4Err()) {
      this.goTo(4);
      return 0
    }

    let isNoErrorOfcDate = true;
    let isNoErrorCon = true;
    if (!this.isRtCvrdwithTrdr) {
      if (this.rtCvrDtlsVoListArray.length == 0) {
        isNoErrorCon = false;
      }
      this.rtCvrDtlsVoListArray.forEach((rtCvrDtlsVo: any) => {
        if (rtCvrDtlsVo.frmFcy == '') {
          rtCvrDtlsVo.frmFcyReq = true;
          isNoErrorCon = false;
        } else {
          rtCvrDtlsVo.frmFcyReq = false;
        }
        if (rtCvrDtlsVo.toFcy == '') {
          rtCvrDtlsVo.toFcyReq = true;
          isNoErrorCon = false;
        } else {
          rtCvrDtlsVo.toFcyReq = false;
        }
        if (rtCvrDtlsVo.amnt == '') {
          rtCvrDtlsVo.amntReq = true;
          isNoErrorCon = false;
        } else {
          rtCvrDtlsVo.amntReq = false;
        }
        if (rtCvrDtlsVo.rate == '') {
          rtCvrDtlsVo.rateReq = true;
          isNoErrorCon = false;
        } else {
          rtCvrDtlsVo.rateReq = false;
        }
        // if (rtCvrDtlsVo.retAdno == '') {
        //   rtCvrDtlsVo.retAdnoReq = true;
        //   isNoErrorCon = false;
        // } else {
        //   rtCvrDtlsVo.retAdnoReq = false;
        // }

      });
    }
    this.submittedForm5 = true;

    // check if mandatory doc is uploaded
    var validFile = false;
    this.outwardMandatoryDocList.forEach((element: any, index: any) => {
      if (element && this.isThisFieldRequired(element, index)) {
        validFile = true;
      }
    });
    if (!validFile) {
      if (this.officeform.valid && isNoErrorOfcDate && isNoErrorCon) {
        this.spinner.show();
        // Upload File and set in the data to send
        const fileDataReceived = [];
        const promiseArray: any = [];
        this.outwardMandatoryDocList.forEach((data: any) => {
          if (data.isChckd) {
            if (data.file && data.file != "") {
              var formData: any = new FormData();
              formData.append('file', data.file);
              formData.append('code', data.attchCd);
              promiseArray.push(new Promise((resolve, reject) => {
                this.comservice.saveFile(formData)
                  .subscribe((data) => {
                    resolve(data)
                  }, (err) => {
                    reject(err)
                  })
              }))
            }
          }
        });
        Promise.all(promiseArray).then((values: any) => {
          var outwardMandatoryDocList: any = []
          if (values && values[0]) {
            try {
              values.forEach((dt: any, index: any) => {
                var found = this.outwardMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
                if (found) {
                  outwardMandatoryDocList.push({
                    "docAttchNm": dt.docAttchNm,
                    "attchCd": found.attchCd,
                    "isChckd": 1
                  });
                }
              })
            } catch (err) {
              // console.log(err)
            }
          }
          if (this.outwardMandatoryDocList && this.outwardMandatoryDocList.length > 0) {
            if (this.viewData && this.viewData.officeUse && this.viewData.officeUse.officeAttchList.length > 0) {
              this.outwardMandatoryDocList.forEach((dt: any, index: any) => {
                var found = this.viewData.officeUse.officeAttchList.find((o: any) => dt.attchCd === o.attchCd);
                if (found && found.isChckd && found.attchValue != '' && found.attchPath != '') {
                  outwardMandatoryDocList.push(found);
                }
              });
            }
          }


          // original save
          let sampleData: any = this.outwardObjData(outwardMandatoryDocList);
          try {
            sampleData['bnfDtls']['name'] = sampleData.bnfDtls.beneNam;
          } catch (error) {

          }
          if (sampleData.sysRefNo === "" && sampleData.transRefNo === "") {
            this.comservice.saveOutwordRemittanceForm(sampleData).subscribe(data => {
              this.savedData = data;
              if (data && data.sysRefNo != '') {
                this.appUserDetails.patchValue({
                  sysRefNo: data.sysRefNo,
                  transRefNo: data.transRefNo,
                  isEditable: data.isEditable,
                  outRmtncId: data.outRmtncId,
                  taskId: data.taskId,
                });
                if (data && data.historyVoList) {
                  this.remarkDetails = data.historyVoList;
                }
              }
              setTimeout(() => {
                this.spinner.hide();
                this.disableAllForm();
                this.currentMode = "view";
                this.modal_body = 'Data Saved successfully';
                this.ref.detectChanges();
                this.modalService.open(this.content, { size: 'sm' });

              }, 2000);
            }, (err) => {
              this.spinner.hide();
              setTimeout(() => {
                this.showDanger('Getting error')
              }, 2000);
            })
          } else {
            this.comservice.updateOutwordRemittanceForm(sampleData).subscribe(data => {
              this.savedData = data;
              if (data && data.historyVoList) {
                if (this.currentMode && this.currentMode != "edit") {
                  this.remarkDetails = data.historyVoList;
                }
              }
              setTimeout(() => {
                this.spinner.hide();
                this.disableAllForm();
                this.currentMode = "view";
                this.modal_body = 'Data Saved successfully';
                this.ref.detectChanges();
                this.modalService.open(this.content, { size: 'sm' });

              }, 2000);
            }, (err) => {
              this.spinner.hide();
              setTimeout(() => {
                this.modal_body = 'Getting error';
                this.ref.detectChanges();
                this.modalService.open(this.content, { size: 'sm' });
              }, 2000);
            })
          }


        }).catch((err) => {
          // console.log(err)
          this.spinner.hide();
          this.modal_body = 'File upload failed';
          this.ref.detectChanges();
          this.modalService.open(this.content, { size: 'sm' });
        });
      }
    } else {
      setTimeout(() => {
        this.spinner.hide();
        this.ref.detectChanges();
        this.modal_body = 'You forgot to select a file.';
        this.modalService.open(this.content, { size: 'sm' });
      }, 2000);
    }

  }
  disableAllForm() {
    this.appUserDetails.disable()
    this.accountDetails.disable()
    this.beneficiaryDetails.disable()
    this.conversionDetails.disable()
    this.officeform.disable()
  }
  enableAllForm() {
    this.appUserDetails.enable()
    this.accountDetails.enable()
    this.beneficiaryDetails.enable()
    this.conversionDetails.enable()
    this.officeform.enable()
  }
  showStandard(msg: any) {
    this.toastService.show(msg);
  }

  showSuccess(msg: any) {
    this.toastService.show(msg, { classname: 'bg-success text-light', delay: 5000 });
  }

  showDanger(dangerTpl: any) {
    this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 5000 });
  }
  onSubmitBen() {

    this.submittedForm3 = true;
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.beneficiaryDetails.valid && this.isNoBeneficiary()) {
        this.next();
      }
    }
  }
  onSubmitBenErr() {
    this.submittedForm3 = true;
    if (this.beneficiaryDetails.valid && this.isNoBeneficiary()) {
      return true;
    }
    return false;
  }
  isNoBeneficiary() {
    const bfDetails = this.beneficiaryDetails.value.bnfDtlsVo;
    if (bfDetails.isSwiftCodeNotAvl && this.submittedForm3) {
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

  onSubmitForm2() {
    this.submittedForm2 = true;
    let isNoError = true;

    this.accountDetailsList.forEach((accountDetail: any) => {
      if (accountDetail.accNo == '') {
        accountDetail.accNoReq = true;
        isNoError = false;
      } else {
        accountDetail.accNoReq = false;
      }
      if (accountDetail.accNo !== '' && accountDetail.accNo.length > 14) {
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
    if (this.isLrsCheckboxRequired()) {
      isNoError = false;
    }
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.accountDetails.valid && isNoError && this.accountDetailsList.length > 0) {
        this.next();

      }
    }
  }
  onSubmitForm2Err() {
    this.submittedForm2 = true;
    let isNoError = true;

    this.accountDetailsList.forEach((accountDetail: any) => {
      if (accountDetail.accNo == '') {
        accountDetail.accNoReq = true;
        isNoError = false;
      } else {
        accountDetail.accNoReq = false;
      }
      if (accountDetail.accNo !== '' && accountDetail.accNo.length > 14) {
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
    if (this.isLrsCheckboxRequired()) {
      isNoError = false;
    }
    if (this.accountDetails.valid && isNoError && this.accountDetailsList.length > 0) {
      return true;
    }
    return false;
  }
  isLrsCheckboxRequired() {
    if (this.AppUserVal.remittaceScheme == 'LRS') {
      const purpose = this.accountDetails.value.outRmtncDtlsVo.purpose;
      if (purpose == '' || purpose == null) {
        return true;
      } else {
        if (purpose == 'MNTNCE_CLS_RLTV') {
          const rltnShipOfBnf = this.accountDetails.value.outRmtncDtlsVo.rltnShipOfBnf
          if (rltnShipOfBnf == '' || rltnShipOfBnf == null) {
            return true;
          }
        }
        if (purpose == 'EDUCATION') {
          const studentNm = this.accountDetails.value.outRmtncDtlsVo.studentNm
          if (studentNm == '' || studentNm == null) {
            return true;
          }
          const studentId = this.accountDetails.value.outRmtncDtlsVo.studentId
          if (studentId == '' || studentId == null) {
            return true;
          }
          const cntryOfStdyAbrd = this.accountDetails.value.outRmtncDtlsVo.cntryOfStdyAbrd
          if (cntryOfStdyAbrd == '' || cntryOfStdyAbrd == null) {
            return true;
          }
        }
        if (purpose == 'PUR_IMMVBL_PRPRTY') {
          const propState = this.accountDetails.value.outRmtncDtlsVo.propState
          if (propState == '' || propState == null) {
            return true;
          }
          const propCntry = this.accountDetails.value.outRmtncDtlsVo.propCntry

          if (propCntry == '' || propCntry == null) {
            return true;
          }
        }
        if (purpose == 'INVSMNT_ABRD') {
          if (this.getinvsmntTpListErr()) {
            return true;
          }

          const nmOfCmpny = this.accountDetails.value.outRmtncDtlsVo.nmOfCmpny
          if (nmOfCmpny == '' || nmOfCmpny == null) {
            return true;
          }

          const isListedCmpny = this.accountDetails.value.outRmtncDtlsVo.isListedCmpny
          if (isListedCmpny == '' || isListedCmpny == null) {
            return true;
          }
          const uinNo = this.accountDetails.value.outRmtncDtlsVo.uinNo
          if (uinNo == '' || uinNo == null) {
            return true;
          }
        }
      }
    }
    return false;
  }
  onSubmitForm4() {
    this.submittedForm4 = true;
    // for rate coverd

    let isNoErrorCon = true;
    if (!this.isRtCvrdwithTrdr) {
      if (this.rtCvrDtlsVoListArray.length == 0) {
        isNoErrorCon = false;
      }
      this.rtCvrDtlsVoListArray.forEach((rtCvrDtlsVo: any) => {
        if (rtCvrDtlsVo.frmFcy == '') {
          rtCvrDtlsVo.frmFcyReq = true;
          isNoErrorCon = false;
        } else {
          rtCvrDtlsVo.frmFcyReq = false;
        }
        if (rtCvrDtlsVo.toFcy == '') {
          rtCvrDtlsVo.toFcyReq = true;
          isNoErrorCon = false;
        } else {
          rtCvrDtlsVo.toFcyReq = false;
        }
        if (rtCvrDtlsVo.amnt == '') {
          rtCvrDtlsVo.amntReq = true;
          isNoErrorCon = false;
        } else {
          rtCvrDtlsVo.amntReq = false;
        }
        if (rtCvrDtlsVo.rate == '') {
          rtCvrDtlsVo.rateReq = true;
          isNoErrorCon = false;
        } else {
          rtCvrDtlsVo.rateReq = false;
        }
        // if (rtCvrDtlsVo.retAdno == '') {
        //   rtCvrDtlsVo.retAdnoReq = true;
        //   isNoErrorCon = false;
        // } else {
        //   rtCvrDtlsVo.retAdnoReq = false;
        // }

      });
    }


    let isNoErrorConDet = true;
    if (!this.isDtlsofFrwdCntrct) {
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
    }

    //for date cureency amount


    let isNoErrorConDate = true;
    if (this.AppUserVal.remittaceScheme == 'LRS' && this.conversionDetailsRemitance.length > 0) {
      this.conversionDetailsRemitance.forEach((row: any) => {
        if (row.rmtncDt == '') {
          row.rmtncDtReq = true;
          isNoErrorConDate = false;
        } else {
          row.rmtncDtReq = false;
        }
        if (row.currency == '') {
          row.currencyReq = true;
          isNoErrorConDate = false;
        } else {
          row.currencyReq = false;
        }
        if (row.amnt == '') {
          row.amntReq = true;
          isNoErrorConDate = false;
        } else {
          row.amntReq = false;
        }
        if (row.address == '') {
          row.addressReqq = true;
          isNoErrorConDate = false;
        } else {
          row.addressReqq = false;
        }

      });
      if (this.conversionDetailsRemitance.length == 0) {
        isNoErrorConDate = false
      }
    }
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.conversionDetails.valid
        && isNoErrorCon
        && isNoErrorConDet
        && isNoErrorConDate
        && !this.istotalGreaterThanFc()) {
        this.next();
      }
    }
  }
  onSubmitForm4Err() {
    this.submittedForm4 = true;
    // for rate coverd

    let isNoErrorCon = true;
    if (!this.isRtCvrdwithTrdr) {
      if (this.rtCvrDtlsVoListArray.length == 0) {
        isNoErrorCon = false;
      }
      this.rtCvrDtlsVoListArray.forEach((rtCvrDtlsVo: any) => {
        if (rtCvrDtlsVo.frmFcy == '') {
          rtCvrDtlsVo.frmFcyReq = true;
          isNoErrorCon = false;
        } else {
          rtCvrDtlsVo.frmFcyReq = false;
        }
        if (rtCvrDtlsVo.toFcy == '') {
          rtCvrDtlsVo.toFcyReq = true;
          isNoErrorCon = false;
        } else {
          rtCvrDtlsVo.toFcyReq = false;
        }
        if (rtCvrDtlsVo.amnt == '') {
          rtCvrDtlsVo.amntReq = true;
          isNoErrorCon = false;
        } else {
          rtCvrDtlsVo.amntReq = false;
        }
        if (rtCvrDtlsVo.rate == '') {
          rtCvrDtlsVo.rateReq = true;
          isNoErrorCon = false;
        } else {
          rtCvrDtlsVo.rateReq = false;
        }
        // if (rtCvrDtlsVo.retAdno == '') {
        //   rtCvrDtlsVo.retAdnoReq = true;
        //   isNoErrorCon = false;
        // } else {
        //   rtCvrDtlsVo.retAdnoReq = false;
        // }

      });
    }


    let isNoErrorConDet = true;
    if (!this.isDtlsofFrwdCntrct) {
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
    }

    //for date cureency amount


    let isNoErrorConDate = true;
    if (this.AppUserVal.remittaceScheme == 'LRS' && this.conversionDetailsRemitance.length > 0) {
      this.conversionDetailsRemitance.forEach((row: any) => {
        if (row.rmtncDt == '') {
          row.rmtncDtReq = true;
          isNoErrorConDate = false;
        } else {
          row.rmtncDtReq = false;
        }
        if (row.currency == '') {
          row.currencyReq = true;
          isNoErrorConDate = false;
        } else {
          row.currencyReq = false;
        }
        if (row.amnt == '') {
          row.amntReq = true;
          isNoErrorConDate = false;
        } else {
          row.amntReq = false;
        }
        if (row.address == '') {
          row.addressReqq = true;
          isNoErrorConDate = false;
        } else {
          row.addressReqq = false;
        }

      });
      if (this.conversionDetailsRemitance.length == 0) {
        isNoErrorConDate = false
      }
    }
    if (this.conversionDetails.valid
      && isNoErrorCon
      && isNoErrorConDet
      && isNoErrorConDate
      && !this.istotalGreaterThanFc()) {
      return true;
    }
    return false;
  }
  get beneficiaryDetailsVal() {
    return this.beneficiaryDetails.value;
  }
  toStep(no: any) {
    this.stepper.to(no);
  }
  public misRbiPurposeList = []
  getMisPurposeCode() {
    this.comservice.misrbiPurposeCode().subscribe(data => {
      this.misRbiPurposeList = data.subCommonMasterList;
    })
  }

  public dclList: any = []
  getDclList() {
    this.comservice.getDeclrtnMaster().subscribe(data => {
      setTimeout(() => {
        data.subCommonMasterList.forEach((element: any, index: any) => {
          this.dclList.push(
            {
              officeDclrtnId: null,
              encOfficeDclrtnId: null,
              rowIndx: index,
              dclrtnCd: element.code,
              dclrtnNm: element.value,
            },
          )
          this.ref.detectChanges();

        });
      }, 1000)

    })
  }
  public outwardMandatoryDocList: any = []
  getOutwardMandatoryDoc() {
    this.comservice.getOutwardMandatoryDoc().subscribe(data => {
      setTimeout(() => {
        data.subCommonMasterList.forEach((element: any, index: any) => {
          this.outwardMandatoryDocList.push(
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
  }

  dclrCheckdValue: boolean = false
  checked: boolean = false;
  declare(event: any, el: any, index: any) {
    if (event.target.checked == true) {
      return this.dclrCheckdValue = true
    } else {
      return;
    }
  }

  public misBSR_CODEList = []
  getMisBSR_CODE() {
    this.comservice.misbsrCode().subscribe(data => {
      this.misBSR_CODEList = data.subCommonMasterList;
    })
  }
  public misSECTORList = []
  getMisSECTOR() {
    this.comservice.misSector().subscribe(data => {
      this.misSECTORList = data.subCommonMasterList;
    })
  }
  public misSSISUBSECList = []
  getMisSSISUBSEC() {
    this.comservice.misSSISUBSEC().subscribe(data => {
      this.misSSISUBSECList = data.subCommonMasterList;
    })
  }
  public misBase_2List = []
  getMisBase_2() {
    this.comservice.misBASE_2().subscribe(data => {
      this.misBase_2List = data.subCommonMasterList;
    })
  }
  public misSTATUSIBList = []
  getMisSTATUSIB() {
    this.comservice.misSTATUSIB().subscribe(data => {
      this.misSTATUSIBList = data.subCommonMasterList;
    })
  }
  public misSCHEMES = []
  getMisSCHEMES() {
    this.comservice.misSCHEMES().subscribe(data => {
      this.misSCHEMES = data.subCommonMasterList;
    })
  }
  public misPRI_NPRI = []
  getMisPRI_NPRI() {
    this.comservice.misPRI_NPRI().subscribe(data => {
      this.misPRI_NPRI = data.subCommonMasterList;
    })
  }

  getAccTp() {
    this.comservice.accType().subscribe(data => {
      this.accountTypeList = data.subCommonMasterList;
    })
  }

  public misGUA_COVER = []
  getMisGUA_COVER() {
    this.comservice.misGUA_COVER().subscribe(data => {
      this.misGUA_COVER = data.subCommonMasterList;
    })
  }
  public misSPL_BENEF = []
  getMisSPL_BENEF() {
    this.comservice.misSPL_BENEF().subscribe(data => {
      this.misSPL_BENEF = data.subCommonMasterList;
    })
  }
  getRelationList() {
    this.comservice.getRelationList().subscribe(data => {
      this.relationShipList = data.subCommonMasterList;
    })
  }

  public nostroList = [];
  public nostroBankList = [];
  public nostroSwiftCodeList = [];

  addSwiftData() {
    const control: any = this.officeform.get('NostroMasterVo.swiftCode');
    const found: any = this.nostroList.filter((o: any) => o.swiftCode === control.value);
    this.nostroSwiftCodeList = found;
    this.officeform.patchValue({
      NostroMasterVo: {
        signedCity: found[0].city,
        signedAccNo: found[0].accountNo,
        cbsGlCode: found[0].cbsGlCode,
        nostroId: found[0].nostroId,
      }
    })
  }

  getNostSwiftCode() {
    const control: any = this.officeform.get('NostroMasterVo.bankName');
    const found: any = this.nostroList.filter((o: any) => o.bankName === control.value);
    this.nostroSwiftCodeList = found;
    this.officeform.patchValue({
      signedCity: "",
      signedAccNo: "",
      cbsGlCodd: ""
    });
  }
  getNostroApi() {
    this.comservice.nostroApi({}).subscribe(data => {
      var resArr: any = [];
      this.nostroList = data;
      data.filter(function (item: any) {
        var i = resArr.findIndex((x: any) => (x.bankName == item.bankName));
        if (i <= -1) {
          resArr.push(item);
        }
        return null;
      });
      this.nostroBankList = resArr;
    })
  }

  public ABA_CDlist = []

  getABA_CD() {
    this.comservice.getABA_CD().subscribe(data => {
      this.ABA_CDlist = data.subCommonMasterList;
    })
  }
  convertNumberToWords(amount: any) {
    return this.fh.convertNumberToWords(amount);

  }
  // Load view mode
  public currentMode: any = "edit";
  loadView() {
    let snapshotParam = this.activatedRoute.snapshot.paramMap.get("outRmtncId");
    this.activatedRoute.paramMap.subscribe(params => {
      const outRmtncId = params.get("outRmtncId");
      const taskId = params.get("taskId");
      const mode = params.get("mode");
      this.currentMode = params.get("mode");
      let method = this.comservice.getOutwardRemitanceView(taskId, outRmtncId);
      if (mode == 'edit') {
        method = this.comservice.getOutwardEdit(taskId, outRmtncId);
      }
      if (outRmtncId && outRmtncId != "") {
        method.subscribe((data: any) => {
          // save logic earlier
          this.savedData = data;
          if (data && data.sysRefNo != '' && data.sysRefNo != null) {
            if (data && data.historyVoList) {
              if (mode !== 'edit') {
                this.remarkDetails = data.historyVoList;
              }
            }
            //save logic earlier ends
            try {
              this.viewData = data
              var rmtncDtlsCrncyList = this.viewData["rmtncDtlsCrncyList"]
              var NostroMaster = this.viewData["officeUse"];
              var auditDetails = this.viewData["auditDetails"];
              var nostrotable = NostroMaster;
              var formCmmnAccc = this.viewData["formCmmnAcc"];
              var formFrwdCntrctDtlsListt: any = []
              formFrwdCntrctDtlsListt = formCmmnAccc["formFrwdCntrctDtlsList"]
              var formRtCvrDtlsListt: any = []
              formRtCvrDtlsListt = formCmmnAccc["formRtCvrDtlsList"]
              this.rtCvrDtlsVoListArray = formRtCvrDtlsListt
              this.accountDetailsList = formCmmnAccc["formAccDtlsList"]
            } catch (err) {
              //  console.log(err);
            }
            this.conversionList = formFrwdCntrctDtlsListt


            if (outRmtncId != null) {
              try {
                this.appUserDetails.patchValue({
                  sysRefDt: new Date(this.viewData.sysRefDt),
                  appRefDt: new Date(this.viewData.appRefDt)
                });
              } catch (error) {

              }
              try {
                this.appUserDetails.patchValue({
                  outRmtncId: outRmtncId,
                  taskId: this.viewData.taskId,
                  sysRefNo: this.viewData.sysRefNo,
                  transRefNo: this.viewData.transRefNo,
                  //sysRefDt: new Date(this.viewData.sysRefDt),
                  // appRefDt: new Date(this.viewData.appRefDt),
                  remittaceScheme: this.viewData.remittaceScheme,
                  outRmtncCustDtlsVo: this.viewData.outRmtncCustDtls,
                  frngExchng: this.viewData.frngExchng,
                  othrCurrncy: this.viewData.othrCurrncy,
                  currency: this.viewData.currency,
                  amount: this.viewData.amount,
                  amntWords: this.viewData.amntWords,
                });
                this.amountval = this.viewData.amntWords;
                const outRmtncDtls = this.viewData.outRmtncDtls;
                var addtnlInfo = "";
                var addtnlInfo1 = "";
                var addtnlInfo2 = "";
                var addtnlInfo3 = "";
                try {
                  addtnlInfo = outRmtncDtls.addtnlInfo.replace("null", "");
                  addtnlInfo1 = outRmtncDtls.addtnlInfo1.replace("null", "");
                  addtnlInfo2 = outRmtncDtls.addtnlInfo2.replace("null", "");
                  addtnlInfo3 = outRmtncDtls.addtnlInfo3.replace("null", "");
                } catch (error) {
                  console.log(error)
                }
                this.accountDetails.patchValue({
                  amount: this.viewData.amount,
                  outRmtncDtlsVo: {
                    // "outwrdRmtncDtlsId": 1510,
                    "purposeCd": outRmtncDtls.purposeCd,
                    "puposedesc": outRmtncDtls.puposedesc,
                    "srcOfFund": outRmtncDtls.srcOfFund,
                    "purpose": outRmtncDtls.purpose,
                    "rltnShipOfBnf": outRmtncDtls.rltnShipOfBnf,
                    "studentNm": typeof (outRmtncDtls.studentNm) != null ? outRmtncDtls.studentNm : "",
                    "studentId": outRmtncDtls.studentId,
                    "cntryOfStdyAbrd": typeof (outRmtncDtls.cntryOfStdyAbrd) != null ? outRmtncDtls.cntryOfStdyAbrd : "",
                    "propState": outRmtncDtls.propState,
                    "propCntry": outRmtncDtls.propCntry,
                    "nmOfCmpny": outRmtncDtls.nmOfCmpny,
                    "isListedCmpny": outRmtncDtls.isListedCmpny,
                    "uinNo": outRmtncDtls.uinNo,
                    "invsmntTpList": outRmtncDtls.invsmntTpList && outRmtncDtls.invsmntTpList.length >= 0 ? outRmtncDtls.invsmntTpList : [],
                    "addtnlInfo": addtnlInfo, // outRmtncDtls.addtnlInfo,
                    "addtnlInfo1": addtnlInfo1,
                    "addtnlInfo2": addtnlInfo2,
                    "addtnlInfo3": addtnlInfo3,
                    "autoLq": outRmtncDtls.autoLq
                  }
                });

                this.ref.detectChanges();
                this.beneficiaryDetails.patchValue({
                  mdOfPymnt: this.viewData.mdOfPymnt,
                  bnfDtlsId: this.viewData.bnfDtlsId,
                  bnfDtlsVo: this.viewData.bnfDtls
                });
                this.beneficiaryDetails.patchValue({
                  bnfDtlsVo: {
                    beneNam: this.viewData.bnfDtls.name
                  }

                });


              } catch (err) {
                // console.log(err);
              }
              setTimeout(() => {
                try {
                  const fnd: any = this.country.find((x: any) => (x.countryId == this.viewData.bnfDtls.cntryId));
                  if (fnd) {
                    this.beneficiaryDetails.patchValue({
                      bnfDtlsVo: {
                        cntryId: fnd.alfaCode
                      }
                    });
                  }
                } catch (error) {

                }
              }, 1000);

              this.ref.detectChanges();

              try {
                this.isDtlsofFrwdCntrct = formCmmnAccc.isFrwdCntrct === 1 ? false : true;
                if (rmtncDtlsCrncyList && rmtncDtlsCrncyList.length > 0) {
                  this.conversionDetailsRemitance = rmtncDtlsCrncyList;
                  this.conversionDetailsRemitance.forEach((element: any) => {
                    element.rmtncDt = new Date(this.viewData.sysRefDt);
                  });
                }
                this.conversionDetails.patchValue({
                  // formDt: this.viewData.formDt,
                  formPlace: this.viewData.formPlace,
                  formCmmnAccId: this.viewData.formCmmnAccId,
                  accDtlsId: this.accountDetailsList.accDtlsId,
                  accountDetailsList: this.accountDetailsList,
                  totAccAmnt: formCmmnAccc.totAccAmnt,
                  conversionList: formFrwdCntrctDtlsListt,
                  totFrwdCntrct: formCmmnAccc.totFrwdCntrct,
                  rtCvrDtlsVoListArray: formRtCvrDtlsListt,
                  totRtCvrAmnt: this.viewData.totRtCvrAmnt,

                  totalRmtncAmnt: this.viewData.totalRmtncAmnt,
                  dclrNm: this.viewData.dclrNm,
                  finYr: this.viewData.finYr,
                  usdFrm: this.viewData.usdFrm,
                  usdTo: this.viewData.usdTo,
                  signature: this.viewData.signature,
                  formCmmnAccVo: {
                    autoLq: this.viewData.outRmtncDtls.autoLq,
                    isDtlsofFrwdCntrct: formCmmnAccc.isFrwdCntrct === 1 ? false : true,
                    isRtCvrdwithTrdr: formCmmnAccc.isRtCvrWithTrDr === 1 ? true : false,
                  }
                });

                this.isRtCvrdwithTrdr = formCmmnAccc.isRtCvrWithTrDr === 1 ? false : true;
                if (formCmmnAccc.formRtCvrDtlsList && formCmmnAccc.formRtCvrDtlsList.length) {
                  this.rtCvrDtlsVoListArray = formCmmnAccc.formRtCvrDtlsList;
                }
              } catch (err) {
                //console.log(err);
              }
              try {
                if (this.viewData.formDt != null) {
                  this.conversionDetails.patchValue({
                    formDt: new Date(this.viewData.formDt),
                  });
                } else {
                  this.conversionDetails.patchValue({
                    formDt: new Date(this.viewData.sysRefDt),
                  });
                }
              } catch (error) {

              }
              this.ref.detectChanges();


              try {
                this.officeform.patchValue({
                  officeUseVo: {
                    accNo: this.viewData.officeUse.accNo,
                    misDtlsList: [],
                    nosCharge: this.viewData.officeUse.nosCharge,
                    cncssionChrg: this.viewData.officeUse.conscnChrg,
                    isFccAccStlment: this.viewData.officeUse.isFccAccSetlmnt == 1 ? 'YES' : 'NO',
                    fccAccNo: this.viewData.officeUse.fccAccNo,
                    cncssionPrcntg: this.viewData.officeUse.cncssionPrcntg,
                    cncssionFixdAmnt: this.viewData.officeUse.conscnFixdAmnt,
                    swiftPrcntg: this.viewData.officeUse.swiftPrcntg,
                    swiftFixdAmnt: this.viewData.officeUse.swiftFixdAmnt,
                    atchmntSanctn: [],
                  },
                  NostroMasterVo: nostrotable.nostroMaster,
                  signedCopy: [],
                  signedCopyFile: [],
                  officeUseId: this.viewData.officeUse.officeUseId,

                });
                this.addSwiftData();
              } catch (err) {
                console.log(err);
              }
              setTimeout(() => {
                try {
                  this.outwardMandatoryDocList.forEach((dt: any, index: any) => {
                    var found = this.viewData.officeUse.officeAttchList.find((o: any) => dt.attchCd === o.attchCd);
                    if (found) {
                      dt.docAttchNm = found.attchValue;
                      dt.isChckd = found.isChckd === 1 ? true : false
                    }
                  });


                  this.dclList.forEach((el1: any) => {
                    this.viewData.officeUse.officeDclrtnList.forEach((el2: any) => {
                      if (el1.dclrtnCd == el2.dclrtnCd) {
                        el1.isDclrtnChckd = true;
                        // el1.isDclrtnChckd = el2.isDclrtnChckd;
                      }
                    });
                  });
                  this.viewData.officeUse.officeMisList.forEach((el2: any) => {
                    if (el2.misCd == "RBI_PRBS_CD") {
                      this.officeMisList.RBI_PRBS_CD.misValue = el2.misValue;
                    }
                    if (el2.misCd == "BSR_CD") {
                      this.officeMisList.BSR_CD.misValue = el2.misValue;
                    }
                    if (el2.misCd == "SECTOR") {
                      this.officeMisList.SECTOR.misValue = el2.misValue;
                    }
                    if (el2.misCd == "SSISUBSEC") {
                      this.officeMisList.SSISUBSEC.misValue = el2.misValue;
                    }
                    if (el2.misCd == "BASE_2") {
                      this.officeMisList.BASE_2.misValue = el2.misValue;
                    }
                    if (el2.misCd == "STATUSIB") {
                      this.officeMisList.STATUSIB.misValue = el2.misValue;
                    }
                    if (el2.misCd == "SCHEMES") {
                      this.officeMisList.SCHEMES.misValue = el2.misValue;
                    }
                    if (el2.misCd == "PRI_NPRI") {
                      this.officeMisList.PRI_NPRI.misValue = el2.misValue;
                    }
                    if (el2.misCd == "GUA_COVER") {
                      this.officeMisList.GUA_COVER.misValue = el2.misValue;
                    }
                    if (el2.misCd == "SPL_BENEF") {
                      this.officeMisList.SPL_BENEF.misValue = el2.misValue;
                    }
                  });
                  this.ref.detectChanges();
                } catch (err) {
                  console.log(err);
                }
                this.ref.detectChanges();
              }, 2000);
              if (this.viewData.outWardStatusId !== 3) {
                this.isApproved = true;
              }
              if (!this.viewData.isEditable) {
                this.disableAllForm();
              }
              try {
                this.ref.detectChanges();
                this.accountDetailTabl1TotalCal();
                this.getConversationDetailForm1Total();
                this.getConversationDetailTotal();
                this.totalConversionDetailsChange();
              } catch (err) {
                // console.log(err);
              }
            }
          }

        })
      }
    }, error => {
      //console.log(error);
    });
  }
}
