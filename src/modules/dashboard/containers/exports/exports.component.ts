import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ExportApplicantComponent } from './export-pages/export-applicant/export-applicant.component';
import { ExportBankBeneficiaryComponent } from './export-pages/export-bank-beneficiary/export-bank-beneficiary.component';
import { ExportChargComponent } from './export-pages/export-charg/export-charg.component';
import { ExportOfficeComponent } from './export-pages/export-office/export-office.component';
import { ExportPolicyComponent } from './export-pages/export-policy/export-policy.component';
import { ExportShipmentComponent } from './export-pages/export-shipment/export-shipment.component';
import Stepper from 'bs-stepper';
import { LcOfficeComponent } from '../lcform/forms-pages/lc-office/lc-office.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { DashboardService } from '@modules/dashboard/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../common';
import moment from 'moment';

@Component({
  selector: 'sb-exports',
  templateUrl: './exports.component.html',
  styleUrls: ['./exports.component.scss']
})
export class ExportsComponent implements OnInit {


  @ViewChild("content", { static: false }) content: any;
  // @ViewChild("contentbodyred", { static: false }) contentbodyred: any;

  @ViewChild('stepper2', { static: false }) stepper2: any;
  @ViewChild('exportShipment', { static: false }) exportShipment!: ExportShipmentComponent;
  @ViewChild('exportCharge', { static: false }) exportCharge!: ExportChargComponent;
  @ViewChild('exportPolicy', { static: false }) exportPolicy!: ExportPolicyComponent;
  @ViewChild('exportBeneficiary', { static: false }) exportBeneficiary!: ExportBankBeneficiaryComponent;
  @ViewChild('exportApplicant', { static: false }) exportApplicant!: ExportApplicantComponent;
  @ViewChild('exportOffice', { static: false }) exportOffice!: ExportOfficeComponent;

  @Output() fileChangeEvent = new EventEmitter<string>();
  @Output('charappEventgeEvent') appEvent = new EventEmitter();

  public approveremarks: any = '';
  public approveModalRef: any;
  public rejectModalRef: any;

  public stepper: any;
  exportSubmittedForm1: boolean = false;
  listAPi: any;
  savedData: any = [];
  currentMode: any;
  viewData: any = [];
  accountDetailTable: any = [];
  beneficiaryDetailList: any = [];
  firstTable: any = [];
  secondTable: any = [];
  tabaleone: any;
  Tablesecond: any;
  amount: any;


  public remarkDetails: any = [];
  public rejectremarks: any = '';
  country = [];
  currency = [];
  misRbiPurposeList: any = [];
  public accountDetailTabl1Total = 0;
  public accountDetailTabl1TotalFirst = 0;
  public accountDetailTabl1TotalThired = 0;
  public conversationDetailTotal = 0;
  public conversationDetailForm1Total = 0;

  public isApproved = false;
  public isRejected = false;
  accounttype: any = [];
  rtCvrDtlsVoListArray: any = [];
  pkgprchOrdDtlsVoList: any = []
  conversionList: any = [];
  accountDetailsList: any = [];
  pkgpcfcLcVoList: any;
  modal_title = "";
  modal_body = "";
  pkgltrCrdDtlsVoList: any = [];
  public parentMessage: string = '';
  outwardMandatoryDocList: any = [];


  constructor(private ref: ChangeDetectorRef,
    public toastService: ToastService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    public router: Router,
    public fh: FormHelperService,
    private formBuilder: FormBuilder,
    private comservice: AppCommonService, private activatedRoute: ActivatedRoute,
    private dashboardService: DashboardService) {

    this.amount = '';
  }

  ngOnInit(): void {
  }
  next() {
    this.stepper.next();
  }
  ngAfterViewInit() {
    const stepper2 = this.stepper2.nativeElement;
    this.stepper = new Stepper(stepper2, {
      linear: false,
      animation: true,
    });
    this.comservice.accountType().subscribe(data => {
      this.accounttype = data;
    })
    this.getCountry();
    this.getCurrency();
    this.getMisBSR_CODE();
    this.getMisBase_2();
    this.getMisGUA_COVER();
    this.getMisPRI_NPRI();
    this.getMisSCHEMES();
    this.getMisPurposeCode();
    this.getMisSECTOR();
    this.getMisSPL_BENEF();
    this.getMisSSISUBSEC();
    this.getMisSTATUSIB();

    setTimeout(() => {
      this.ref.detectChanges();
    }, 1000);
    this.loadView();

  }
  toStep(no: any) {
    this.stepper.to(no);
  }
  getMisPurposeCode() {
    this.comservice.misrbiPurposeCode().subscribe(data => {
      this.misRbiPurposeList = data.subCommonMasterList;
    })
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

  goTo(no: any) {
    this.stepper.to(no);
  }
  get canAppRej() {
    if (this.savedData && this.savedData.pcfcStatusId && this.savedData.pcfcStatusId != "") {
      if ([3].indexOf(this.savedData.pcfcStatusId) != -1 && (this.savedData.aprvRmrks === '' || this.savedData.aprvRmrks === null)) {
        return true;
      }
    }
    return false;
  }
  get AppUserVal() {
    if (this.exportApplicant && this.exportApplicant.exportApplicantForm) {
      return this.exportApplicant.exportApplicantForm.value;
    }
    return {};
  }
  get isSaved() {
    return this.AppUserVal.sysRefNo != '' ? true : false;
  }
  redirectHome() {
    this.router.navigate(['/dashboard/outward/remittance/landing'])
  }
  openApproveModal(content: any) {
    this.approveModalRef = this.modalService.open(content);
  }
  openRejectModal(content: any) {
    this.rejectModalRef = this.modalService.open(content);
  }
  get isDraft() {
    if (this.currentMode == 'view') {
      return false
    }
    if (this.savedData && this.savedData.pcfcStatusId && this.savedData.pcfcStatusId != "") {
      if ([4].indexOf(this.savedData.pcfcStatusId) != -1) {
        return true;
      }
    }
    if (this.savedData && typeof (this.savedData.transRefNo) == "undefined") {
      return true;
    }

    return false;
  }
  submitedAllForm(e: any) {

  }
  onSubmitFormPolicy() {
    this.exportPolicy.onSubmitpolicyForm5();
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.exportPolicy.exportPolicyDetails.valid) {
        this.next()
      }
    }
  }
  onSubmitApp() {
    this.exportApplicant.onSubmitApp();
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.exportApplicant.exportApplicantForm.valid) {
        this.next()
      }
    }
    this.exportApplicant.exportSubmittedForm1 = true;
  }
  disableAllForm() {
    this.exportCharge.exportChargeForm.disable()
    this.exportApplicant.exportApplicantForm.disable()
    this.exportBeneficiary.exportBeneficiaryForm.disable()
    this.exportOffice.exportOfficeform.disable()
    this.exportShipment.exportShipmentForm.disable()
    this.exportPolicy.exportPolicyDetails.disable()
  }
  onSubmitFormm6() {
    if (!this.exportApplicant.exportApplicantForm.valid) {
      this.exportApplicant.exportSubmittedForm1 = true;
      this.goTo(1);
      return 0
    }
    if (!this.exportBeneficiary.exportBeneficiaryForm.valid) {
      this.exportBeneficiary.submittedexportFrom3 = true;
      this.goTo(2);
      return 0
    }
    if (!this.exportShipment.exportShipmentForm.valid) {
      this.exportShipment.exportSubmittedForm2 = true;
      this.goTo(3);
      return 0
    }
    if (!this.exportCharge.exportChargeForm.valid) {
      this.exportCharge.exportsubmittedFrom4 = true;
      this.goTo(4);
      return 0
    }
    if (!this.exportPolicy.exportPolicyDetails.valid) {
      this.exportPolicy.exportsubmittedFrom5 = true;
      this.goTo(5);
      return 0
    }
    if (this.exportShipment.appUserVal.letterOfCredit == "NO") {
      if (this.exportBeneficiary.pkgprchOrdDtlsVoList.length === 0) {
        this.goTo(3);
        return 0
      }
    }
    if (this.exportShipment.appUserVal.letterOfCredit == "YES") {
      if (this.exportBeneficiary.pkgltrCrdDtlsVoList.length === 0) {
        this.goTo(3);
        return 0
      }
    }
    var validFile = false;
    this.exportOffice.outwardMandatoryDocList.forEach((element: any, index: any) => {
      if (element && this.isThisFieldRequired(element, index)) {
        validFile = true;
      }
    });
    var tablevalue = this.exportBeneficiary.accountDetailTabl1TotalCal();
    this.exportOffice.onSubmitForm6();
    if (!validFile) {
      if (this.exportOffice.exportOfficeform.valid) {
        this.spinner.show();
        const promiseArray: any = [];

        Promise.all(promiseArray).then((valBene: any) => {
          //call db for saving
          const promiseArray: any = [];
          this.exportOffice.outwardMandatoryDocList.forEach((data: any) => {
            if (data.isChckd) {
              var formData: any = new FormData();
              formData.append('file', data.file);
              formData.append('code', data.attchCd);
              promiseArray.push(new Promise((resolve, reject) => {
                this.comservice.saveLCFile(formData)
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
                  var found = this.exportOffice.outwardMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
                  if (found) {
                    outwardMandatoryDocList.push({
                      "docAttchNm": dt.docAttchNm,
                      "attchCd": found.attchCd,
                      "isChckd": 1
                    });
                  }
                })
              } catch (err) {

              }
            }
            if (this.exportOffice.outwardMandatoryDocList && this.exportOffice.outwardMandatoryDocList.length > 0) {
              if (this.exportOffice.viewData && this.exportOffice.viewData.officeUse && this.exportOffice.viewData.officeUse.officeAttchList.length > 0) {
                this.exportOffice.outwardMandatoryDocList.forEach((dt: any, index: any) => {
                  var found = this.exportOffice.viewData.officeUse.officeAttchList.find((o: any) => dt.attchCd === o.attchCd);
                  if (found && found.isChckd && found.attchValue != '' && found.attchPath != '') {
                    outwardMandatoryDocList.push(found);
                  }
                });
              }
            }

            // if (valBene && valBene[0]) {
            //   try {
            //     valBene.forEach((dt: any, index: any) => {
            //       this.exportBeneficiary.beneficiaryDetailList[index]['docAttchNm'] = dt.docAttchNm;
            //      })
            //   } catch (err) {

            //   }
            // }
            // if (this.beneficiary.beneficiaryDetailList && this.beneficiary.beneficiaryDetailList.length > 0) {
            //   if (this.office.viewData && this.office.viewData.officeUse && this.office.viewData.officeUse.offcReqDocList.length > 0) {
            //     this.beneficiary.beneficiaryDetailList.forEach((dt: any, index: any) => {
            //       var found = this.office.viewData.officeUse.offcReqDocList.find((o: any) => dt.attchCd === o.attchCd);
            //       if (found && found.attchValue != '' && found.attchPath != '') {
            //         this.beneficiaryDetailList.push(found);
            //       }
            //     });
            //   }
            // }

            let sampleDataLc = this.outwardObjData(outwardMandatoryDocList);

            sampleDataLc.pcfcCustDtls.dpCode = "" + sampleDataLc.pcfcCustDtls.dpCode;
            if (this.savedData && this.savedData.sysRefNo != '' && this.savedData.sysRefNo != undefined) {
              sampleDataLc.sysRefNo = this.savedData.sysRefNo;
              sampleDataLc.transRefNo = this.savedData.transRefNo;
              // sampleData.isEditable = this.savedData.isEditable ;
              sampleDataLc.pcfcId = this.savedData.pcfcId;
              sampleDataLc.taskId = this.savedData.taskId;
            }
            try {
              if (sampleDataLc.pcfcCustDtls.dpCode.toString().length == 3) {
                sampleDataLc.pcfcCustDtls.dpCode = "0" + sampleDataLc.pcfcCustDtls.dpCode
              }
              if (sampleDataLc.pcfcCustDtls.dpCode.toString().length == 2) {
                sampleDataLc.pcfcCustDtls.dpCode = "00" + sampleDataLc.pcfcCustDtls.dpCode
              }
            } catch (err) {
            }

            if (sampleDataLc.sysRefNo === "" && sampleDataLc.transRefNo === "") {
              this.comservice.savePcfcForm(sampleDataLc).subscribe(data => {
                this.savedData = data;
                this.exportOffice.savedData = this.savedData;
                if (data && data.sysRefNo != '') {
                  this.exportApplicant.exportApplicantForm.patchValue({
                    sysRefNo: data.sysRefNo,
                    transRefNo: data.transRefNo,
                    isEditable: data.isEditable,
                    pcfcId: data.pcfcId,
                    taskId: data.taskId,
                  });
                  if (data && data.historyBeanList) {
                    this.remarkDetails = data.historyBeanList;
                  }
                }
                setTimeout(() => {
                  this.spinner.hide();
                  this.disableAllForm();
                  this.currentMode = "view";
                  this.showSuccess('Data Saved successfully')
                }, 2000);
              }, (err) => {
                setTimeout(() => {
                  this.spinner.hide();
                  this.showDanger('Getting Error')
                }, 2000);
              })
            }
            else {
              sampleDataLc.priority = this.savedData.priority
              this.comservice.updatePcfcForm(sampleDataLc).subscribe(data => {
                this.savedData = data;
                this.exportOffice.savedData = this.savedData;
                if (data && data.sysRefNo != '') {
                  this.exportApplicant.exportApplicantForm.patchValue({
                    sysRefNo: data.sysRefNo,
                    transRefNo: data.transRefNo,
                    isEditable: data.isEditable,
                    pcfcId: data.pcfcId,
                    taskId: data.taskId,
                  });
                  if (data && data.historyBeanList) {
                    if (this.currentMode && this.currentMode != "edit") {
                      this.remarkDetails = data.historyBeanList;
                    }
                  }
                }
                setTimeout(() => {
                  this.spinner.hide();
                  this.disableAllForm();
                  this.currentMode = "view";
                  this.showSuccess('Data Saved successfully')
                }, 2000);


              }, (err) => {
                setTimeout(() => {
                  this.spinner.hide();
                  this.showDanger('Getting Error')
                  this.modalService.open(this.content, { size: 'sm' });
                }, 2000);
              })
            }

          }).catch((err) => {
            this.spinner.hide();
            this.showSuccess('File upload Failed. Please try again..');
          });;
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
        // if (found.isChckd == true) {
        // if ((!found || !found.file || !found.file.name) && (found.docAttchNm == "" || typeof (found.docAttchNm) == 'undefined')) {
        //   return true;
        // }
        // if (found && found.docAttchNm != "") {
        //   return false;
        // }
        // }
      }
    }
    return false;
  }


  form4Submitted(e: any) {
    this.next();
  }
  loadView() {
    let snapshotParam = this.activatedRoute.snapshot.paramMap.get("pcfcId");
    this.activatedRoute.paramMap.subscribe(params => {
      const pcfcId = params.get("pcfcId");
      const taskId = params.get("taskId");
      const mode = params.get("mode");
      this.currentMode = params.get("mode");
      let method = this.comservice.getPcfcView(taskId, pcfcId);

      if (mode == 'edit') {
        method = this.comservice.getPcfcEdit(taskId, pcfcId);
      }
      if (pcfcId && pcfcId != "") {
        method.subscribe((data: any) => {
          // save logic earlier
          this.savedData = data;
          if (data && data.sysRefNo != '' && data.sysRefNo != null) {
            if (data && data.historyBeanList) {
              if (mode !== 'edit') {
                this.remarkDetails = data.historyBeanList;
              }
            }
            try {
              // this.exportBeneficiary.pkgltrCrdDtlsVoList = this.savedData.formCmmnAcc.formLtrCrdtDtls;
              // this.exportBeneficiary.accountDetailTabl1TotalFirst = this.savedData.ltrCrdtDtlschk;//pkgltrCrdDtlsVoList

              // this.exportCharge.conversionList = this.savedData.formCmmnAcc.formFrwdCntrctDtlsList;//pkgltrCrdDtlsVoList
              // this.exportCharge.conversationDetailForm1Total = this.savedData.formCmmnAcc.isFrwdCntrct;


              // this.exportOffice.conversationDetailTotal = this.savedData.formCmmnAcc.isRtCvrWithTrDr;
              // this.advCharge.isDtlsofFrwdCntrct = this.savedData.formCmmnAcc.isFrwdCntrct === 1 ? true : false;
            } catch (error) {

            }
            //save logic earlier ends
            try {
              this.viewData = data;
              this.savedData = data;
              this.exportOffice.savedData = data;
              this.ref.detectChanges();
              var formPurchOrdDtlsTable = this.viewData["formPurchOrdDtls"];
              var pkgltrCrdDtlsVoListt = this.viewData["formLtrCrdtDtls"]

              var pkgpcfcLcVoListTable = this.viewData["formPcfcLcDtls"]
              var formLtrCrdtDtlstable = this.viewData["formLtrCrdtDtls"]
              var formPurchOrdDtlsTable = this.viewData["formPurchOrdDtls"]

              var formPcfcLcDtlstable = this.viewData["formPcfcLcDtls"]
              var formCmmnAcc = this.viewData["formCmmnAcc"];
              var formRtCvrDtlsList: any = []

              var formRtCvrDtlsList = formCmmnAcc["formRtCvrDtlsList"]

              var pcfcCustDtls = this.viewData["pcfcCustDtls"]

              var marginDtlList = this.viewData["marginDtlList"];
              var formFrwdCntrctDtlsList: any = []
              var formFrwdCntrctDtlsListTable = formCmmnAcc["formFrwdCntrctDtlsList"]
              var officeUsetab = this.viewData["officeUse"]
              var officeUseTable = officeUsetab["offcReqDocList"]
              var officeAttchListTable = officeUsetab['officeAttchList'];


              var marginDtlListTable = marginDtlList["accountDetailTable"]
              // var formFrwdCntrctDtlsOfficeTable = formCmmnAcc["formRtCvrDtlsList"]

              var pkgprchOrdDtlsVoList = this.viewData["pkgprchOrdDtlsVoList"]


            } catch (err) {
            }
            const exportApplicant: any = this.exportApplicant.exportApplicantForm;
            const exportCharge: any = this.exportCharge.exportChargeForm;
            const exportBeneficiary: any = this.exportBeneficiary.exportBeneficiaryForm;
            const exportShipment: any = this.exportShipment.exportShipmentForm;
            const exportPolicy: any = this.exportPolicy.exportPolicyDetails;
            const exportOffice: any = this.exportOffice.exportOfficeform;
            const applicantValue = exportApplicant.value


            try {
              this.rtCvrDtlsVoListArray.forEach((element: any) => {

                this.rtCvrDtlsVoListArray.push({
                  frmFcy: element.frmFcy,
                  toFcy: element.toFcy,
                  amnt: element.amnt,
                  rate: element.rate,
                  retAdno: element.retAdno,
                });
              });
            } catch (err) {
            }

            try {
              this.pkgprchOrdDtlsVoList.forEach((element: any) => {

                this.pkgprchOrdDtlsVoList.push({
                  formPurchOrdDtlsId: null,
                  pcfcForm: null,
                  refNo: element.refNo,
                  purOrdDate: element.purOrdDate,
                  fcy: element.fcy,
                  amnt: element.amnt,
                  amtUtlz: element.amtUtlz,
                  balAvl: element.balAvl,
                  inCoTerms: element.inCoTerms,
                  country: element.country,
                  auditDetails: null
                });
              });
            } catch (err) {
            }
            exportApplicant.patchValue({
              pcfcId: "",
              taskId: "",
              sysRefNo: this.viewData.sysRefNo,
              transRefNo: this.viewData.transRefNo,
              sysRefDt: moment(this.viewData.sysRefDt).format('YYYY-MM-DDTHH:mm:ssZZ'),
              appRefDt: "",
              pcfcCustDtlsVo: this.viewData.pcfcCustDtls,
              pcfcDtlsVo: {
                pcfcDomesticImport: this.viewData.pcfcDtls.pcfcDomesticImport,
                brnchNmMng: this.viewData.pcfcDtls.brnchNmMng,
                dpCodeMng: this.viewData.pcfcDtls.dpCodeMng,
                colltnChrg: this.viewData.pcfcDtls.colltnChrg,
                declTenor: this.viewData.pcfcDtls.declTenor,

              },
              currency: this.viewData.currency,
              amount: this.viewData.amount,
              amntWords: this.viewData.amntWords,
            });
            exportShipment.patchValue({
              lcDate: moment(this.viewData.lcDate).format('YYYY-MM-DDTHH:mm:ssZZ'),
              lcNum: this.viewData.lcNum,
              letterOfCredit: this.viewData.letterOfCredit,
              whrLcIsRcvByCN: this.viewData.whrLcIsRcvByCN,
              pcfcDtlsVo: {
                descGdsRmrks: this.viewData.pcfcDtls.descGdsRmrks,
                drftDays: this.viewData.pcfcDtls.drftDays,
                hsCode: this.viewData.pcfcDtls.hsCode,
                hsDesc: this.viewData.pcfcDtls.hsDesc,
                ltstShpmntDt: this.viewData.pcfcDtls.ltstShpMntDt,
              }
            });
            exportBeneficiary.patchValue({
              ltrCrdtDtlschk: this.viewData.ltrCrdtDtlschk,
              prchOrdDtlschk: this.viewData.prchOrdDtlschk,
              lcNum: this.viewData.lcNum,
              lcDate: moment(this.viewData.lcDate).format('YYYY-MM-DDTHH:mm:ssZZ'),
              pcfcBuyersDtlsVo: {
                buyersNm: this.viewData.pcfcBuyersDtls.buyersNm,
                cntryId: this.viewData.pcfcBuyersDtls.cntryId,
                addr2: this.viewData.pcfcBuyersDtls.addr2,
                addr1: this.viewData.pcfcBuyersDtls.addr1,
                cifId: this.viewData.pcfcBuyersDtls.cifId,
              },
              formLtrCrdtDtls: formLtrCrdtDtlstable,
              formPcfcLcDtls: formPcfcLcDtlstable,
              formPurchOrdDtls: formPurchOrdDtlsTable,
            });
            setTimeout(() => {
              this.exportShipment.loadPurposeDtls();
              this.ref.detectChanges();

            }, 3000);
            try {
              exportCharge.patchValue({
                formCmmnAccVo: {
                  isFrwdCntrct: this.viewData.formCmmnAcc.isFrwdCntrct
                },
                pcfcBankDtlsVo: {
                  addr1: this.viewData.pcfcBnkDtls.addr1,
                  addr2: this.viewData.pcfcBnkDtls.addr2,
                  bankDtlsCifId: this.viewData.pcfcBnkDtls.bankDtlsCifId,
                  bnfAccNo: this.viewData.pcfcBnkDtls.bnfAccNo,
                  cntryId: this.viewData.pcfcBnkDtls.cntryId,
                  interSwiftCode: this.viewData.pcfcBnkDtls.interSwiftCode,
                  isSwiftCodeNotAvl: this.viewData.pcfcBnkDtls.isSwiftCodeNotAvl,
                  name: this.viewData.pcfcBnkDtls.name,
                  swiftBnkAbaCdDesc: this.viewData.pcfcBnkDtls.swiftBnkAbaCdDesc,
                  swiftBnkAbacd: this.viewData.pcfcBnkDtls.swiftBnkAbacd,
                  swiftBnkAddr1: this.viewData.pcfcBnkDtls.swiftBnkAddr1,
                  swiftBnkAddr2: this.viewData.pcfcBnkDtls.swiftBnkAddr2,
                  swiftBnkNm: this.viewData.pcfcBnkDtls.swiftBnkNm,
                  swiftCode: this.viewData.pcfcBnkDtls.swiftCode,
                }

              });

              this.ref.detectChanges();
            } catch (error) {

            }

            this.exportBeneficiary.pkgltrCrdDtlsVoList = pkgltrCrdDtlsVoListt
            this.exportBeneficiary.pkgpcfcLcVoList = pkgpcfcLcVoListTable
            this.exportOffice.rtCvrDtlsVoListArray = formRtCvrDtlsList
            this.exportBeneficiary.pkgprchOrdDtlsVoList = formPurchOrdDtlsTable
            this.exportCharge.conversionList = formFrwdCntrctDtlsListTable
            // this.exportOffice.rtCvrDtlsVoListArray = formFrwdCntrctDtlsOfficeTable

            // if (formCmmnAcc.formRtCvrDtlsList && formCmmnAcc.formRtCvrDtlsList.length) {
            //   this.pkgltrCrdDtlsVoList = formCmmnAcc.formRtCvrDtlsList;
            // }


            exportPolicy.patchValue({

              pcfcDtlsVo: {
                takeConvsnRtOnBhlf: this.viewData.pcfcDtls.takeConvsnRtOnBhlf,
                declTenor: this.viewData.pcfcDtls.declTenor,
                polNo: this.viewData.pcfcDtls.polNo,
                dtd: moment(this.viewData.pcfcDtls.dtd).format('YYYY-MM-DDTHH:mm:ssZZ'),
                formDt: this.viewData.pcfcDtls.formDt,
                formPlace: this.viewData.pcfcDtls.formPlace,
              }

            });

            exportOffice.patchValue({
              // officeUseVo: {
              //   accNo: this.viewData.officeUse.accNo,
              // },
              accNo: this.viewData.officeUse.accNo,
              spreat: this.viewData.spreat,
              totRtCvrOffAmnt: this.viewData.spreat,
              liboreIntrstRt: this.viewData.liboreIntrstRt,
              officeUse: {
                "officeUseId": null,
                "accNo": this.viewData.officeUse.accNo,
                "conscnChrg": this.viewData.officeUse.conscnChrg,
                "conscnPrcntg": this.viewData.officeUse.conscnPrcntg,
                "conscnFixdAmnt": this.viewData.officeUse.conscnFixdAmnt,
                "swiftPrcntg": this.viewData.officeUse.swiftPrcntg,
                "swiftFixdAmnt": this.viewData.officeUse.swiftFixdAmnt,
                "isFccAccSetlmnt": 1,
                "fccAccNo": this.viewData.officeUse.fccAccNo,
                "offcReqDocList": null,
                officeAttchList: officeAttchListTable,
                "officeDclrtnList": null,
                "officeMisList": null,
                "formRtCvrDtlsOffList": null,
                "dscrpncyObsrvdList": null,
                "instMstList": null,
                "totRtCvrOffAmnt": null,
                "sanctnAttNm": null,
                "sanctnAttPath": null,
                "nostroMaster": null,
                "nosCharge": this.viewData.officeUse.nosCharge,
                "customer": null,
                "office": null,
                "csms": null,
                "cemail": null,
                "osms": null,
                "oemail": null,
              },
              formCmmnAccVo: {
                isRtCvrWithTrDr: this.viewData.formCmmnAcc.isRtCvrWithTrDr,
                // isRtCvrWithTrDr: formCmmnAcc.isRtCvrWithTrDr == true ? 1 : 0,

                "formCmmnAccId": null,
                "formAccDtlsList": [],
                "totAccAmnt": ".0",
                "isFrwdCntrct": this.viewData.formCmmnAcc.isFrwdCntrct,
                // "isFrwdCntrct": this.viewData.formCmmnAcc.isFrwdCntrct,
                "formFrwdCntrctDtlsList": this.viewData.formCmmnAcc.formFrwdCntrctDtlsList,
                // accountDetailsList: this.advBeneficiary.accountDetailsList,
                // totAccAmnt: formCmmnAccc.totAccAmnt,
                // conversionList: formFrwdCntrctDtlsListt,
                // totFrwdCntrct: formCmmnAccc.totFrwdCntrct,
                // "totFrwdCntrct": formCmmnAcc.totRtCvrAmnt,
                "formRtCvrDtlsList": formRtCvrDtlsList,
                // "totRtCvrAmnt": this.viewData.formCmmnAcc.totRtCvrAmnt,
              }
            });
            setTimeout(() => {
              try {
                this.exportOffice.outwardMandatoryDocList.forEach((dt: any, index: any) => {
                  var found = this.viewData.officeUse.officeAttchList.find((o: any) => dt.attchCd === o.attchCd);
                  if (found) {
                    dt.docAttchNm = found.attchValue;
                    dt.isChckd = found.isChckd === 1 ? true : false
                  }
                });
                this.ref.detectChanges();
              } catch (error) {
              }
            }, 3000);
            if (pcfcId != null) {
              if (this.viewData.pcfcStatusId !== 3) {
                this.isApproved = true;
              }
              if (!this.viewData.isEditable) {
                this.disableAllForm();
              }
              try {
                this.ref.detectChanges();
                this.exportBeneficiary.accountDetailTabl1TotalCalFirst();
                this.exportBeneficiary.accountDetailTabl1TotalCal();
                this.exportBeneficiary.accountDetailTabl1TotalCalThird();
                this.exportOffice.getConversationDetailTotal();
                this.exportCharge.getConversationDetailForm1Total();
              } catch (err) {
              }
              // }
            }
          }
        })
      }
    }, error => {
    });
  }
  accountDetailTabl1TotalCalFirst() {
    let total = 0;
    this.pkgltrCrdDtlsVoList.forEach((element: any) => {
      total += (+element.amnt)
    });
    this.accountDetailTabl1TotalFirst = total;
  }
  accountDetailTabl1TotalCal() {
    let total = 0;
    this.pkgprchOrdDtlsVoList.forEach((element: any) => {
      total += (+element.amnt)
    });
    this.accountDetailTabl1Total = total;
  }
  accountDetailTabl1TotalCalThird() {
    let total = 0;
    this.pkgpcfcLcVoList.forEach((element: any) => {
      total += (+element.loanAmt)
    });
    this.accountDetailTabl1TotalThired = total;
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
  onSubmitlcshipp() {
    this.exportShipment.onShipmentFormShipment();
    this.parentMessage = this.exportShipment.exportShipmentForm.value.letterOfCredit;

    this.exportShipment.exportSubmittedForm2 = true;
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.exportShipment.exportShipmentForm.valid && !this.exportBeneficiary.isNoBeneficiary()) {
        this.next()
      }
    }
  }
  isForm1Valid() {
    // check if first form is valid
    if (!this.exportApplicant.exportApplicantForm.valid) {
      this.exportApplicant.exportSubmittedForm1 = true;
      this.goTo(1);
      return 0
    }
    return 1
  }

  onSubmitFrm() {
    this.exportBeneficiary.onSubmitBankForm3();
    if (this.exportBeneficiary.exportBeneficiaryForm.valid) {
      if (this.exportShipment.appUserVal.letterOfCredit == "NO") {
        if (this.exportBeneficiary.pkgprchOrdDtlsVoList.length > 0) {
          this.next()
          return 0
        }
      }
      if (this.exportShipment.appUserVal.letterOfCredit == "YES") {
        if (this.exportBeneficiary.pkgltrCrdDtlsVoList.length > 0) {
          this.next();
          return 0
        }
      }

    }

  }
  get canUpdate() {
    if (this.savedData && this.savedData.pcfcStatusId && this.savedData.pcfcStatusId != "") {
      if ([3, 4, 7].indexOf(this.savedData.pcfcStatusId) != -1) {
        if (this.currentMode && this.currentMode == "edit") {
          return true;
        }
      }
    }

    return false;
  }
  onSubmitFormCharg() {
    this.exportCharge.onSubmitBankForm4();
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.exportCharge.exportChargeForm.valid) {
        this.next()
      }
    }
    this.exportCharge.exportsubmittedFrom4 = true;
  }
  getCountry() {
    this.comservice.getCountry().subscribe(data => {
      this.country = data;
    })
  }
  getCurrency() {
    this.comservice.getCurrency().subscribe(data => {
      this.currency = data;

    })
  }


  saveDraft() {
    if (this.isForm1Valid() == 0) {
      return 0
    }

    this.spinner.show();
    // Upload File and set in the data to send 
    const promiseArray: any = [];
    this.exportOffice.outwardMandatoryDocList.forEach((data: any) => {
      if (data.isChckd) {
        var formData: any = new FormData();
        formData.append('file', data.file);
        formData.append('code', data.attchCd);
        promiseArray.push(new Promise((resolve, reject) => {
          this.comservice.saveLCFile(formData)
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
            var found = this.exportOffice.outwardMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
            if (found) {
              outwardMandatoryDocList.push({
                "docAttchNm": dt.docAttchNm,
                "attchCd": found.attchCd,
                "isChckd": 1
              });
            }
          })
        } catch (err) {
        }
      }
      let draftData = this.outwardObjData(outwardMandatoryDocList);
      if (draftData.sysRefNo === "" && draftData.transRefNo === "") {
        this.comservice.savePcfcDraft(draftData).subscribe((data: any) => {
          // this.draftdata = data;
          // Hadle Save Data
          this.savedData = data;
          if (data && data.sysRefNo != '' && data.sysRefNo != undefined) {
            this.exportApplicant.exportApplicantForm.patchValue({
              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              pcfcId: data.pcfcId,
              taskId: data.taskId,
            });
            if (data && data.historyBeanList) {
              if (this.currentMode && this.currentMode != "edit") {
                this.remarkDetails = data.historyBeanList;
              }
            }
          }
          this.savedData.isEditable = true;
          setTimeout(() => {
            this.spinner.hide();
            this.showSuccess('Data Saved successfully')
          }, 2000);

        }, () => {
          this.spinner.hide();
          this.showDanger('No Data Saved');
        });
      } else {
        this.comservice.pcfcUpdateDraft(draftData).subscribe((data: any) => {
          this.savedData = data;
          if (data && data.sysRefNo != '') {
            this.exportApplicant.exportApplicantForm.patchValue({
              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              pcfcId: data.pcfcId,
              taskId: data.taskId,
            });
            if (data && data.historyBeanList) {
              if (this.currentMode && this.currentMode != "edit") {
                this.remarkDetails = data.historyBeanList;
              }
            }
          }
          this.savedData.isEditable = true;
          setTimeout(() => {
            this.spinner.hide();
            this.showSuccess('Data Saved successfully');
          }, 2000);
        }, () => {
          this.spinner.hide();
          this.showDanger('No Data Saved');
        });
      }
    }).catch((err) => {
      this.spinner.hide();
      this.showSuccess('File upload Failed. Please try again..');
    });;
  }
  showSuccess(msg: any) {
    this.toastService.show(msg, { classname: 'bg-success text-light', delay: 5000 });
  }
  showDanger(dangerTpl: any) {
    this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 5000 });
  }
  approveForm() {
    if (this.approveremarks != '') {
      this.approveModalRef.close();
      this.spinner.show();
      this.savedData.aprvRmrks = this.approveremarks;
      this.comservice.pcfcApproveForm(this.savedData)
        .subscribe((data) => {
          if (data && data.historyBeanList) {
            this.remarkDetails = data.historyBeanList;
          }
          this.savedData = data;
          this.isApproved = true;
          this.spinner.hide();
          this.showSuccess('Approve Successfully');
        }, () => {
          this.spinner.hide();
          this.showSuccess('Approve Failed');
        })
    }

  }
  rejectForm() {
    if (this.rejectremarks != '') {
      this.rejectModalRef.close();
      this.spinner.show();
      this.savedData.aprvRmrks = this.rejectremarks;
      this.comservice.pcfcRejectForm(this.savedData)
        .subscribe((data) => {
          if (data && data.historyBeanList) {
            this.remarkDetails = data.historyBeanList;
          }
          this.savedData = data;
          this.isApproved = true;
          this.showSuccess('Reject Successfully');
          this.spinner.hide();
        }, () => {
          this.showSuccess('Rejection Failed');
          this.spinner.hide();
        })
    }
  }
  /**
  * Generates JSON that need to be send
  * @param outwardMandatoryDocList 
  */
  outwardObjData(outwardMandatoryDocList: any) {

    const pkgltrCrdDtlsVoList: any = [];
    pkgltrCrdDtlsVoList.forEach((element: any) => {
      pkgltrCrdDtlsVoList.push({
        accDtlsId: "",
        srNo: 1,
        refNo: element.refNo,
        date: moment(element.date).format('YYYY-MM-DDTHH:mm:ssZZ'),
        expdt: moment(element.expdt).format('YYYY-MM-DDTHH:mm:ssZZ'),
        fcy: element.fcy,
        amnt: element.amnt,
        amtUtlz: element.amtUtlz,
        balAvl: element.balAvl,
        country: element.country,
      })
    });
    const pkgprchOrdDtlsVoList: any = [];
    pkgprchOrdDtlsVoList.forEach((element: any) => {
      pkgprchOrdDtlsVoList.push({
        srNo: 1,
        prchOrdDtlsRefNo: element.prchOrdDtlsRefNo,
        purOrdDate: element.purOrdDate,
        fcy: element.fcy,
        amnt: element.amnt,
        amntToBeUtlzed: element.amntToBeUtlzed,
        balavlb: element.balavlb,
        inCoTerms: element.inCoTerms,
        country: element.country,
      })
    });
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

    const pkgpcfcLcVoList: any = [];
    if (this.pkgpcfcLcVoList && this.pkgpcfcLcVoList.length) {
      this.pkgpcfcLcVoList.forEach((element: any) => {
        pkgpcfcLcVoList.push({
          pcfcLcRefNo: element.pcfcLcRefNo,
          date: element.date,
          srNo: 1,
          loanAmt: element.loanAmt,
          orderNo: element.orderNo,
          sactnAmtOrdr: element.sactnAmtOrdr,
          tenorDays: element.tenorDays,
          dueDate: element.dueDate,
        })
      });
    }
    const accountDetailTable: any = [];
    this.accountDetailTable.forEach((element: any) => {
      accountDetailTable.push({
        sNo: moment(element.sNo).format('YYYY-MM-DDTHH:mm:ssZZ'),
        margin: element.margin,
        deposit: element.deposit
      })
    });
    const exportApplicant: any = this.exportApplicant.exportApplicantForm;
    const exportCharge: any = this.exportCharge.exportChargeForm;
    const exportBeneficiary: any = this.exportBeneficiary.exportBeneficiaryForm;
    const exportShipment: any = this.exportShipment.exportShipmentForm;
    const exportPolicy: any = this.exportPolicy.exportPolicyDetails;
    const exportOffice: any = this.exportOffice.exportOfficeform;

    var sampleDataLc = {
      "pcfcId": "",
      "encPcfcId": null,
      "taskId": "",
      "encTaskId": "",
      "sysRefNo": "",
      "transRefNo": "",
      "sysRefDt": "",
      "appRefDt": "",
      "currency": 1,
      "amount": exportApplicant.value.amount,
      "amntWords": exportApplicant.value.amntWords,
      "letterOfCredit": exportShipment.value.letterOfCredit == "YES" ? 1 : 0,
      "whrLcIsRcvByCN": exportShipment.value.whrLcIsRcvByCN,
      "lcNum": exportShipment.value.lcNum,
      "ltrCrdtDtlschk": exportBeneficiary.value.ltrCrdtDtlschk == true ? 1 : 0,
      "prchOrdDtlschk": exportBeneficiary.value.prchOrdDtlschk == true ? 1 : 0,
      "lcDate": exportShipment.value.lcDate,
      "pcfcCustDtls": {
        "formCustDtlsId": null,
        "custId": exportApplicant.value.pcfcCustDtlsVo.custId,
        "accNo": exportApplicant.value.pcfcCustDtlsVo.accNo,
        "brnchNm": exportApplicant.value.pcfcCustDtlsVo.brnchNm,
        "dpCode": exportApplicant.value.pcfcCustDtlsVo.dpCode,
        "custNm": exportApplicant.value.pcfcCustDtlsVo.custNm,
        "address1": exportApplicant.value.pcfcCustDtlsVo.address1,
        "address2": exportApplicant.value.pcfcCustDtlsVo.address2,
        "address3": exportApplicant.value.pcfcCustDtlsVo.address3,
        "cntryId": exportApplicant.value.pcfcCustDtlsVo.cntryId,
        "stateId": null,
        "pinCode": null,
        "telNo": exportApplicant.value.pcfcCustDtlsVo.telNo,
        "mobNo": exportApplicant.value.pcfcCustDtlsVo.mobNo,
        "eMail": exportApplicant.value.pcfcCustDtlsVo.eMail,
        "altEmail": exportApplicant.value.pcfcCustDtlsVo.altEmail,
        "panNo": exportApplicant.value.pcfcCustDtlsVo.panNo,
        "ieCode": exportApplicant.value.pcfcCustDtlsVo.ieCode,
      },
      "pcfcSupDrwDtls": null,
      "pcfcDrweBnkDtls": null,
      "pcfcShipDtls": null,
      "formCmmnAcc": {
        "formCmmnAccId": null,
        "formAccDtlsList": [],
        "totAccAmnt": ".0",
        "isFrwdCntrct": exportCharge.value.formCmmnAccVo.isFrwdCntrct == true ? 1 : 0,
        "formFrwdCntrctDtlsList": this.exportCharge.conversionList,
        "totFrwdCntrct": this.exportCharge.conversationDetailForm1Total,
        "isRtCvrWithTrDr": exportOffice.value.formCmmnAccVo.isRtCvrWithTrDr == true ? 1 : 0,
        "formRtCvrDtlsList": [{ "srNo": null, "frmFcy": "4", "toFcy": "5", "amnt": "3243243", "rate": "4324", "retAdno": "" }],// this.exportOffice.rtCvrDtlsVoListArray,
        "totRtCvrAmnt": this.exportOffice.conversationDetailTotal,
      },
      "officeUse": {
        "officeUseId": null,
        "accNo": exportOffice.value.officeUseVo.accNo,
        "conscnChrg": exportOffice.value.officeUseVo.cncssionChrg,
        "conscnPrcntg": exportOffice.value.officeUseVo.cncssionPrcntg,
        "conscnFixdAmnt": exportOffice.value.officeUseVo.cncssionFixdAmnt,
        "swiftPrcntg": exportOffice.value.officeUseVo.swiftPrcntg,
        "swiftFixdAmnt": exportOffice.value.officeUseVo.swiftFixdAmnt,
        "isFccAccSetlmnt": exportOffice.value.officeUseVo.isFccAccStlment,
        "fccAccNo": exportOffice.value.officeUseVo.fccAccNo,
        "offcReqDocList": [],
        "officeAttchList": outwardMandatoryDocList,
        "officeDclrtnList": null,
        "officeMisList": null,
        "formRtCvrDtlsOffList": null,
        "dscrpncyObsrvdList": null,
        "instMstList": null,
        "totRtCvrOffAmnt": null,
        "sanctnAttNm": null,
        "sanctnAttPath": null,
        "nostroMaster": null,
        "nosCharge": exportOffice.value.officeUseVo.nosCharge,
        "customer": null,
        "office": null,
        "csms": null,
        "cemail": null,
        "osms": null,
        "oemail": null,
        "atchmntSanctn": null
      },
      "pcfcDtls": {
        "pCFCDtlsId": null,
        "brnchNmMng": exportApplicant.value.pcfcDtlsVo.brnchNmMng,
        "dpCodeMng": exportApplicant.value.pcfcDtlsVo.dpCodeMng,
        "pcfcDomesticImport": exportApplicant.value.pcfcDtlsVo.pcfcDomesticImport,
        "colltnChrg": exportApplicant.value.pcfcDtlsVo.colltnChrg,
        "drftDays": exportShipment.value.pcfcDtlsVo.drftDays,
        "declTenor": exportPolicy.value.pcfcDtlsVo.declTenor,
        "polNo": exportPolicy.value.pcfcDtlsVo.polNo,
        "dclDtd": moment(exportPolicy.value.pcfcDtlsVo.dtd).format('YYYY-MM-DDTHH:mm:ssZZ'),
        "formDt": exportPolicy.value.pcfcDtlsVo.formDt,
        "formPlace": exportPolicy.value.pcfcDtlsVo.formPlace,
        "signature": null,
        "fwrdchk": null,
        "retchk": null,
        "weretchk": null,
        "totalLtrCrdAmnt": this.exportBeneficiary.accountDetailTabl1TotalFirst,
        "totalPrchOrdAmnt": this.exportBeneficiary.accountDetailTabl1Total,
        "totalLoanAmnt": this.exportBeneficiary.accountDetailTabl1TotalThired,
        "ltstShpMntDt": exportShipment.value.pcfcDtlsVo.ltstShpmntDt,
        "hsCode": exportShipment.value.pcfcDtlsVo.hsCode,
        "descGdsRmrks": exportShipment.value.pcfcDtlsVo.descGdsRmrks,
        "takeConvsnRtOnBhlf": exportPolicy.value.takeConvsnRtOnBhlf == true ? 0 : 1,
        "auditDetails": null
      },

      "formLtrCrdtDtls": this.exportBeneficiary.pkgltrCrdDtlsVoList,
      "formPurchOrdDtls": this.exportBeneficiary.pkgprchOrdDtlsVoList,
      "formPcfcLcDtls": this.exportBeneficiary.pkgpcfcLcVoList,
      "pcfcBuyersDtls": {
        "buyersDtlsId": null,
        "cifId": exportBeneficiary.value.pcfcBuyersDtlsVo.cifId,
        "buyersNm": exportBeneficiary.value.pcfcBuyersDtlsVo.buyersNm,
        "addr1": exportBeneficiary.value.pcfcBuyersDtlsVo.addr1,
        "addr2": exportBeneficiary.value.pcfcBuyersDtlsVo.addr2,
        "cntryNm": null,
        "cntryId": 1,
      },
      "historyBeanList": [
      ],
      "pcfcBnkDtls": {
        "bnkDtlsId": null,
        "bankDtlsCifId": exportCharge.value.pcfcBankDtlsVo.bankDtlsCifId,
        "name": exportCharge.value.pcfcBankDtlsVo.name,
        "addr1": exportCharge.value.pcfcBankDtlsVo.addr1,
        "addr2": exportCharge.value.pcfcBankDtlsVo.addr2,
        "cntryNm": null,
        "cntryId": 1,
        "bnfAccNo": exportCharge.value.pcfcBankDtlsVo.bnfAccNo,
        "swiftCode": exportCharge.value.pcfcBankDtlsVo.swiftCode,
        "interSwiftCode": exportCharge.value.pcfcBankDtlsVo.interSwiftCode,
        "isSwiftCodeNotAvl": exportCharge.value.pcfcBankDtlsVo.isSwiftCodeNotAvl == true ? 1 : 0,
        "swiftBnkNm": exportCharge.value.pcfcBankDtlsVo.swiftBnkNm,
        "swiftBnkAddr1": exportCharge.value.pcfcBankDtlsVo.swiftBnkAddr1,
        "swiftBnkAddr2": exportCharge.value.pcfcBankDtlsVo.swiftBnkAddr2,
        "swiftBnkAbacd": exportCharge.value.pcfcBankDtlsVo.swiftBnkAbacd,
        "swiftBnkAbaCdDesc": exportCharge.value.pcfcBankDtlsVo.swiftBnkAbaCdDesc,
      },
      "auditDetails": null,
      "liboreIntrstRt": exportOffice.value.liboreIntrstRt,
      "spreat": exportOffice.value.spreat,
      "isEditable": false,
      "custNm": null,
      "pcfcStatus": null,
      "aprvRmrks": null,
      "priority": "LOW",
      "pcfcStatusId": 3
    }

    sampleDataLc.pcfcCustDtls.dpCode = "" + sampleDataLc.pcfcCustDtls.dpCode;
    if (this.savedData && this.savedData.sysRefNo != '' && this.savedData.sysRefNo != undefined) {
      sampleDataLc.sysRefNo = this.savedData.sysRefNo;
      sampleDataLc.transRefNo = this.savedData.transRefNo;
      // sampleData.isEditable = this.savedData.isEditable ;
      sampleDataLc.pcfcId = this.savedData.pcfcId;
      sampleDataLc.taskId = this.savedData.taskId;
    }
    try {
      if (sampleDataLc.pcfcCustDtls.dpCode.toString().length == 3) {
        sampleDataLc.pcfcCustDtls.dpCode = "0" + sampleDataLc.pcfcCustDtls.dpCode
      }
      if (sampleDataLc.pcfcCustDtls.dpCode.toString().length == 2) {
        sampleDataLc.pcfcCustDtls.dpCode = "00" + sampleDataLc.pcfcCustDtls.dpCode
      }
    } catch (err) {
    }
    return sampleDataLc;
  }
}
