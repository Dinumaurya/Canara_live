import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

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
import { GuarApplicantComponent } from './guar-applicant/guar-applicant.component';
import { GuarChargeComponent } from './guar-charge/guar-charge.component';
import { GuarbeneficiaryComponent } from './guarbeneficiary/guarbeneficiary.component';
import { GuarOfficeComponent } from './guar-office/guar-office.component';

@Component({
  selector: 'sb-guarantee',
  templateUrl: './guarantee.component.html',
  styleUrls: ['./guarantee.component.scss']
})
export class GuaranteeComponent implements OnInit {

  @ViewChild("content", { static: false }) content: any;
  // @ViewChild("contentbodyred", { static: false }) contentbodyred: any;

  @ViewChild('stepper8', { static: false }) stepper8: any;
  @ViewChild('GuarApplicant', { static: false }) GuarApplicant!: GuarApplicantComponent;
  @ViewChild('GuarCharge', { static: false }) GuarCharge!: GuarChargeComponent;
  @ViewChild('GuarBeneficiary', { static: false }) GuarBeneficiary!: GuarbeneficiaryComponent;
  @ViewChild('GuarOffice', { static: false }) GuarOffice!: GuarOfficeComponent;

  @Output() fileChangeEvent = new EventEmitter<string>();
  // @Output('appEvent') appEvent = new EventEmitter();

  public approveremarks: any = '';
  public approveModalRef: any;
  public rejectModalRef: any;

  public stepper: any;
  submittedguarForm1: boolean = false;
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

    const stepper8 = this.stepper8.nativeElement;
    this.stepper = new Stepper(stepper8, {
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
    if (this.savedData && this.savedData.guaranteeStatusId && this.savedData.guaranteeStatusId != "") {
      if ([3].indexOf(this.savedData.guaranteeStatusId) != -1 && (this.savedData.aprvRmrks === '' || this.savedData.aprvRmrks === null)) {
        return true;
      }
    }
    return false;
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
  get AppUserVal() {
    if (this.GuarApplicant && this.GuarApplicant.GuarApplicantForm) {
      return this.GuarApplicant.GuarApplicantForm.value;
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
    if (this.savedData && this.savedData.guaranteeStatusId && this.savedData.guaranteeStatusId != "") {
      if ([4].indexOf(this.savedData.guaranteeStatusId) != -1) {
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

  onSubmitApp() {
    this.GuarApplicant.onSubmitApp();
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.GuarApplicant.GuarApplicantForm.valid) {
        this.next()
      }
    }
    this.GuarApplicant.submittedguarForm1 = true;
  }
  onSubmitFrm() {
    this.GuarBeneficiary.onSubmitForm2();
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.GuarBeneficiary.guaranteeficiaryForm.valid) {
        this.next()
      }
    }
    this.GuarBeneficiary.submittedguaranteeFrom3 = true;
  }
  onSubmitlcshipp() {
    // this.exportShipment.onShipmentFormShipment();
    // this.parentMessage = this.exportShipment.exportShipmentForm.value.letterOfCredit;

    // this.exportShipment.exportSubmittedForm2 = true;
    // if (this.isSaved == true) {
    //   this.next();
    // } else {
    //   if (this.exportShipment.exportShipmentForm.valid && !this.GuarBeneficiary.isNoBeneficiary()) {
    //     this.next()
    //   }
    // }
  }
  onSubmitFormCharg() {
    this.GuarCharge.onSubmitForm4();
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.GuarCharge.GuarChargeDetails.valid) {
        this.next();
      }
    }
    this.GuarCharge.submittedGuarForm4 = true;
  }

  disableAllForm() {
    this.GuarApplicant.GuarApplicantForm.disable()
    this.GuarCharge.GuarChargeDetails.disable()
    this.GuarOffice.officeform.disable()
    this.GuarBeneficiary.guaranteeficiaryForm.disable()
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


  // saveGurntyForm
  onSubmitFormm6() {
    if (!this.GuarApplicant.GuarApplicantForm.valid) {
      this.GuarApplicant.submittedguarForm1 = true;
      this.goTo(1);
      return 0
    }
    if (!this.GuarBeneficiary.guaranteeficiaryForm.valid) {
      this.GuarBeneficiary.submittedguaranteeFrom3 = true;
      this.goTo(2);
      return 0
    }
    if (!this.GuarCharge.GuarChargeDetails.valid) {
      this.GuarCharge.submittedGuarForm4 = true;
      this.goTo(4);
      return 0
    }
    var validFile = false;
    this.outwardMandatoryDocList.forEach((element: any, index: any) => {
      if (element && this.isThisFieldRequired(element, index)) {
        validFile = true;
      }
    });
    // var tablevalue = this.GuarBeneficiary.accountDetailTabl1TotalCal();
    this.GuarOffice.onSubmitForm6();
    if (this.GuarOffice.officeform.valid) {
      this.spinner.show();
      const promiseArray: any = [];

      Promise.all(promiseArray).then((valBene: any) => {
        //call db for saving
        const promiseArray: any = [];
        this.GuarOffice.outwardMandatoryDocList.forEach((data: any) => {
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
        Promise.all(promiseArray)
          .then((values: any) => {
            var outwardMandatoryDocList: any = []

            if (values && values[0]) {
              try {
                values.forEach((dt: any, index: any) => {
                  var found = this.GuarOffice.outwardMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
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
            if (this.GuarOffice.outwardMandatoryDocList && this.GuarOffice.outwardMandatoryDocList.length > 0) {
              if (this.GuarOffice.viewData && this.GuarOffice.viewData.officeUse && this.GuarOffice.viewData.officeUse.officeAttchList.length > 0) {
                this.GuarOffice.outwardMandatoryDocList.forEach((dt: any, index: any) => {
                  var found = this.GuarOffice.viewData.officeUse.officeAttchList.find((o: any) => dt.attchCd === o.attchCd);
                  if (found && found.isChckd && found.attchValue != '' && found.attchPath != '') {
                    outwardMandatoryDocList.push(found);
                  }
                });
              }
            }

            // if (valBene && valBene[0]) {
            //   try {
            //     valBene.forEach((dt: any, index: any) => {
            //       this.GuarBeneficiary.beneficiaryDetailList[index]['docAttchNm'] = dt.docAttchNm;
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

            sampleDataLc.guaranteeCustDtlsVo.dpCode = "" + sampleDataLc.guaranteeCustDtlsVo.dpCode;
            if (this.savedData && this.savedData.sysRefNo != '' && this.savedData.sysRefNo != undefined) {
              sampleDataLc.sysRefNo = this.savedData.sysRefNo;
              sampleDataLc.transRefNo = this.savedData.transRefNo;
              // sampleData.isEditable = this.savedData.isEditable ;
              sampleDataLc.guaranteeFormId = this.savedData.guaranteeFormId;
              sampleDataLc.taskId = this.savedData.taskId;
            }
            try {
              if (sampleDataLc.guaranteeCustDtlsVo.dpCode.toString().length == 3) {
                sampleDataLc.guaranteeCustDtlsVo.dpCode = "0" + sampleDataLc.guaranteeCustDtlsVo.dpCode
              }
              if (sampleDataLc.guaranteeCustDtlsVo.dpCode.toString().length == 2) {
                sampleDataLc.guaranteeCustDtlsVo.dpCode = "00" + sampleDataLc.guaranteeCustDtlsVo.dpCode
              }
            } catch (err) {
            }

            if (sampleDataLc.sysRefNo === "" && sampleDataLc.transRefNo === "") {
              this.comservice.saveGurntyForm(sampleDataLc).subscribe(data => {
                this.savedData = data;
                this.GuarOffice.savedData = this.savedData;
                if (data && data.sysRefNo != '') {
                  this.GuarApplicant.GuarApplicantForm.patchValue({

                    sysRefNo: data.sysRefNo,
                    transRefNo: data.transRefNo,
                    isEditable: data.isEditable,
                    guaranteeFormId: data.guaranteeFormId,
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
              this.comservice.updateGurntyForm(sampleDataLc).subscribe(data => {
                this.savedData = data;
                this.GuarOffice.savedData = this.savedData;
                if (data && data.sysRefNo != '') {
                  this.GuarApplicant.GuarApplicantForm.patchValue({
                    sysRefNo: data.sysRefNo,
                    transRefNo: data.transRefNo,
                    isEditable: data.isEditable,
                    guaranteeFormId: data.guaranteeFormId,
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

  }
  form4Submitted(e: any) {
    this.next();
  }
  loadView() {
    let snapshotParam = this.activatedRoute.snapshot.paramMap.get("guaranteeFormId");
    this.activatedRoute.paramMap.subscribe(params => {
      const guaranteeFormId = params.get("guaranteeFormId");
      const taskId = params.get("taskId");
      const mode = params.get("mode");
      this.currentMode = params.get("mode");
      let method = this.comservice.getGuarantyView(taskId, guaranteeFormId);

      if (mode == 'edit') {
        method = this.comservice.getGuarantyEdit(taskId, guaranteeFormId);
      }
      if (guaranteeFormId && guaranteeFormId != "") {
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
              // this.GuarBeneficiary.pkgltrCrdDtlsVoList = this.savedData.formCmmnAcc.formLtrCrdtDtls;
              // this.GuarBeneficiary.accountDetailTabl1TotalFirst = this.savedData.ltrCrdtDtlschk;//pkgltrCrdDtlsVoList

              // this.GuarCharge.conversionList = this.savedData.formCmmnAcc.formFrwdCntrctDtlsList;//pkgltrCrdDtlsVoList
              // this.GuarCharge.conversationDetailForm1Total = this.savedData.formCmmnAcc.isFrwdCntrct;


              // this.GuarOffice.conversationDetailTotal = this.savedData.formCmmnAcc.isRtCvrWithTrDr;
              // this.advCharge.isDtlsofFrwdCntrct = this.savedData.formCmmnAcc.isFrwdCntrct === 1 ? true : false;
            } catch (error) {

            }
            //save logic earlier ends
            try {
              this.viewData = data;
              this.savedData = data;
              this.GuarOffice.savedData = data;
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
            const GuarApplicant: any = this.GuarApplicant.GuarApplicantForm;
            const GuarCharge: any = this.GuarCharge.GuarChargeDetails;
            const GuarBeneficiary: any = this.GuarBeneficiary.guaranteeficiaryForm;
            const GuarOffice: any = this.GuarOffice.officeform;

            GuarApplicant.patchValue({
              "guaranteeFormId": "",
              "encGuaranteeFormId": null,
              "taskId": "",
              "encTaskId": "",
              "sysRefNo": "",
              "transRefNo": "",
              "sysRefDt": "",
              "appRefDt": "",
              "guaranteeTransThrgh": null,
              "guaranteeCustDtlsVo": this.viewData.guaranteeCustDtlsVo,
              "currency": this.viewData.currency,
              "amount": this.viewData.amount,
              "amntWords": this.viewData.amntWords,
              "guaranteeTransBnkVo": {
                "formBnkDtlsID": null,
                "cifId": this.viewData.guaranteeTransBnkVo.cifId,
                "bnkNm": this.viewData.guaranteeTransBnkVo.bnkNm,
                "fullAddr": this.viewData.guaranteeTransBnkVo.fullAddr,
                "cntryId": this.viewData.guaranteeTransBnkVo.cntryId,
                "stateId": null,
                "swiftCode": this.viewData.guaranteeTransBnkVo.swiftCode,
                "pinCode": null,
                "fullAddr1": this.viewData.guaranteeTransBnkVo.fullAddr1,
                "fullAddr2": this.viewData.guaranteeTransBnkVo.fullAddr2,
                "auditDetails": null
              },

            });

            GuarBeneficiary.patchValue({
              "draftTenor": this.viewData.draftTenor,
              "tpSecurity": this.viewData.tpSecurity,
              "hsDesc": this.viewData.hsDesc,
              "hsCode": this.viewData.hsCode,
              "othrTransBnkVo": {
                "formBnkDtlsID": null,
                "cifId": this.viewData.othrTransBnkVo.cifId,
                "bnkNm": this.viewData.othrTransBnkVo.bnkNm,
                "fullAddr": this.viewData.othrTransBnkVo.fullAddr,
                "cntryId": this.viewData.othrTransBnkVo.cntryId,
                "stateId": null,
                "swiftCode": this.viewData.othrTransBnkVo.swiftCode,
                "pinCode": null,
                "fullAddr1": this.viewData.othrTransBnkVo.fullAddr1,
                "fullAddr2": this.viewData.othrTransBnkVo.fullAddr2,
                "auditDetails": null
              },
              "guaranteeBnfDtlsVo": {
                "formBnfDtlsID": null,
                "cifId": this.viewData.guaranteeBnfDtlsVo.cifId,
                "name": this.viewData.guaranteeBnfDtlsVo.name,
                "addr1": this.viewData.guaranteeBnfDtlsVo.addr1,
                "addr2": this.viewData.guaranteeBnfDtlsVo.addr2,
                "addr3": this.viewData.guaranteeBnfDtlsVo.addr3,
                "cntryNm": this.viewData.guaranteeBnfDtlsVo.cntryNm,
                "pinCode": null,
                "auditDetails": null
              },
            });

            try {
              GuarCharge.patchValue({
                // "place": this.viewData.formPlace,
                "expiryDate": this.viewData.formDt,
                "placeExpiry": this.viewData.formPlace,
                "guaranteeChrgDtlsVo": {
                  "guaranteeChrgId": null,
                  "accOf": this.viewData.guaranteeChrgDtlsVo.accOf,
                  "chrgCnfrm": this.viewData.guaranteeChrgDtlsVo.chrgCnfrm,
                  "cnfrmChrsAccOf": null,
                  "pymntInstruc": this.viewData.guaranteeChrgDtlsVo.pymntInstruc,
                  "sndrRcvrInfo": this.viewData.guaranteeChrgDtlsVo.sndrRcvrInfo,
                  "appAccInfo": null,
                  "docReq": this.viewData.guaranteeChrgDtlsVo.docReq,
                  "addCondition": this.viewData.guaranteeChrgDtlsVo.addCondition,
                },

              });

              this.ref.detectChanges();
            } catch (error) {

            }
            GuarOffice.patchValue({
              "officeUseVo": {
                "officeUseId": null,
                "accNo": this.viewData.accNo,
                "conscnChrg": this.viewData.conscnChrg,
                "conscnPrcntg": ".0",
                "conscnFixdAmnt": ".0",
                "swiftPrcntg": ".0",
                "swiftFixdAmnt": ".0",
                "isFccAccSetlmnt": null,
                "fccAccNo": this.viewData.fccAccNo,
                "offcReqDocList": [],
                "officeAttchList": [{ "rowIndx": 0, "attchId": null, "encAttchId": null, "attchCd": "PROFORMA_INV_OF_SUPPL", "attchNm": "", "isChckd": 1 }],
                "officeDclrtnList": null,
                "officeMisList": null,
                "formRtCvrDtlsOffList": null,
                "dscrpncyObsrvdList": null,
                "instMstList": null,
                "totRtCvrOffAmnt": null,
                "sanctnAttNm": null,
                "sanctnAttPath": null,
                "nostroMaster": null,
                "nosCharge": null,
                "customer": null,
                "office": null,
                "csms": null,
                "cemail": null,
                "osms": null,
                "oemail": null,
                "atchmntSanctn": null
              }
            });
            setTimeout(() => {
              try {
                this.GuarOffice.outwardMandatoryDocList.forEach((dt: any, index: any) => {
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
            if (guaranteeFormId != null) {
              if (this.viewData.guaranteeStatusId !== 3) {
                this.isApproved = true;
              }
              if (!this.viewData.isEditable) {
                this.disableAllForm();
              }
              try {
                this.ref.detectChanges();
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

  isForm1Valid() {
    // check if first form is valid
    if (!this.GuarApplicant.GuarApplicantForm.valid) {
      this.GuarApplicant.submittedguarForm1 = true;
      this.goTo(1);
      return 0
    }
    return 1
  }


  get canUpdate() {
    if (this.savedData && this.savedData.guaranteeStatusId && this.savedData.guaranteeStatusId != "") {
      if ([3, 4, 7].indexOf(this.savedData.guaranteeStatusId) != -1) {
        if (this.currentMode && this.currentMode == "edit") {
          return true;
        }
      }
    }

    return false;
  }



  saveDraft() {
    if (this.isForm1Valid() == 0) {
      return 0
    }

    this.spinner.show();
    // Upload File and set in the data to send 
    const promiseArray: any = [];
    // this.GuarOffice.outwardMandatoryDocList.forEach((data: any) => {
    //   if (data.isChckd) {
    //     var formData: any = new FormData();
    //     formData.append('file', data.file);
    //     formData.append('code', data.attchCd);
    //     promiseArray.push(new Promise((resolve, reject) => {
    //       this.comservice.saveLCFile(formData)
    //         .subscribe((data) => {
    //           resolve(data)
    //         }, (err) => {
    //           resolve(err)
    //         })
    //     }))
    //   }
    // });
    Promise.all(promiseArray).then((values: any) => {
      var outwardMandatoryDocList: any = []
      if (values && values[0]) {
        try {
          // values.forEach((dt: any, index: any) => {
          //   var found = this.GuarOffice.outwardMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
          //   if (found) {
          //     outwardMandatoryDocList.push({
          //       "docAttchNm": dt.docAttchNm,
          //       "attchCd": found.attchCd,
          //       "isChckd": 1
          //     });
          //   }
          // })
        } catch (err) {
        }
      }
      let draftData = this.outwardObjData(outwardMandatoryDocList);
      if (draftData.sysRefNo === "" && draftData.transRefNo === "") {
        this.comservice.saveGuarantyDraft(draftData).subscribe((data: any) => {
          // this.draftdata = data;
          // Hadle Save Data
          this.savedData = data;
          if (data && data.sysRefNo != '' && data.sysRefNo != undefined) {
            this.GuarApplicant.GuarApplicantForm.patchValue({
              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              guaranteeFormId: data.guaranteeFormId,
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
        this.comservice.guarantyUpdateDraft(draftData).subscribe((data: any) => {
          this.savedData = data;
          if (data && data.sysRefNo != '') {
            this.GuarApplicant.GuarApplicantForm.patchValue({
              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              guaranteeFormId: data.guaranteeFormId,
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
    });
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
    const GuarApplicant: any = this.GuarApplicant.GuarApplicantForm;
    const GuarCharge: any = this.GuarCharge.GuarChargeDetails;
    const GuarBeneficiary: any = this.GuarBeneficiary.guaranteeficiaryForm;
    const GuarOffice: any = this.GuarOffice.officeform;

    var sampleDataLc =
    {
      "guaranteeFormId": "",
      "encGuaranteeFormId": null,
      "taskId": "",
      "encTaskId": "",
      "sysRefNo": "",
      "transRefNo": "",
      "sysRefDt": "",
      "appRefDt": "",
      "guaranteeTransThrgh": null,
      "guaranteeCustDtlsVo": GuarApplicant.value.guaranteeCustDtlsVo,
      "guaranteeTransBnkVo": GuarApplicant.value.guaranteeTransBnkVo,
      "othrTransBnkVo": {
        "formBnkDtlsID": null,
        "cifId": GuarBeneficiary.value.othrTransBnkVo.cifId,
        "bnkNm": GuarBeneficiary.value.othrTransBnkVo.bnkNm,
        "fullAddr": GuarBeneficiary.value.othrTransBnkVo.fullAddr,
        "cntryId": GuarBeneficiary.value.othrTransBnkVo.cntryId,
        "stateId": null,
        "swiftCode": GuarBeneficiary.value.othrTransBnkVo.swiftCode,
        "pinCode": null,
        "fullAddr1": GuarBeneficiary.value.othrTransBnkVo.fullAddr1,
        "fullAddr2": GuarBeneficiary.value.othrTransBnkVo.fullAddr2,
        "auditDetails": null
      },
      "guaranteeBnfDtlsVo": {
        "formBnfDtlsID": null,
        "cifId": GuarBeneficiary.value.guaranteeBnfDtlsVo.cifId,
        "name": GuarBeneficiary.value.guaranteeBnfDtlsVo.name,
        "addr1": GuarBeneficiary.value.guaranteeBnfDtlsVo.addr1,
        "addr2": GuarBeneficiary.value.guaranteeBnfDtlsVo.addr2,
        "addr3": null,
        "cntryNm": GuarBeneficiary.value.guaranteeBnfDtlsVo.cntryNm,
        "pinCode": null,
        "auditDetails": null
      },
      "guaranteeChrgDtlsVo": GuarCharge.value.guaranteeChrgDtlsVo,
      "currency": GuarApplicant.value.currency,
      "amount": GuarApplicant.value.amount,
      "amntWords": GuarApplicant.value.amntWords,
      "place": null,
      "crDt": null,
      "draftTenor": GuarBeneficiary.value.draftTenor,
      "tpSecurity": GuarBeneficiary.value.tpSecurity,
      "draftBy": null,
      "draftDays": null,
      "draftCustomerNm": null,
      "expiryDate": "2021-04-07T18:30:00.000+0000",
      "placeExpiry": "MUMBAI",
      "hsDesc": null,
      "typeOfGoods": "CAPITAL",
      "hsCode": "504",
      "loginUsr": null,
      "officeUseVo": {
        "officeUseId": null,
        "accNo": "5643294735463", //GuarOffice.officeUseVo.accNo,
        "conscnChrg": 'NO',//GuarOffice.officeUseVo.conscnChrg,
        "conscnPrcntg": ".0",
        "conscnFixdAmnt": ".0",
        "swiftPrcntg": ".0",
        "swiftFixdAmnt": ".0",
        "isFccAccSetlmnt": null,
        "fccAccNo": null,
        "offcReqDocList": [],
        "officeAttchList": [{ "rowIndx": 0, "attchId": null, "encAttchId": null, "attchCd": "PROFORMA_INV_OF_SUPPL", "attchNm": "", "isChckd": 1 }],
        "officeDclrtnList": null,
        "officeMisList": null,
        "formRtCvrDtlsOffList": null,
        "dscrpncyObsrvdList": null,
        "instMstList": null,
        "totRtCvrOffAmnt": null,
        "sanctnAttNm": null,
        "sanctnAttPath": null,
        "nostroMaster": null,
        "nosCharge": null,
        "customer": null,
        "office": null,
        "csms": null,
        "cemail": null,
        "osms": null,
        "oemail": null,
        "atchmntSanctn": null
      },
      "error": null,
      "aprvRmrks": null,
      "priority": "LOW",
      "guaranteeStatus": null,
      "guaranteeStatusId": 7,
      "userinfoVo": null,
      "historyVoList": null,
      "wrkInPrgs": false,
      "isIbForm": 0,
      "contrefno": null,
      "riskRt": 2,
      "descGdsRmrks": "DDSD"
    }

    sampleDataLc.guaranteeCustDtlsVo.dpCode = "" + sampleDataLc.guaranteeCustDtlsVo.dpCode;
    if (this.savedData && this.savedData.sysRefNo != '' && this.savedData.sysRefNo != undefined) {
      sampleDataLc.sysRefNo = this.savedData.sysRefNo;
      sampleDataLc.transRefNo = this.savedData.transRefNo;
      // sampleData.isEditable = this.savedData.isEditable ;
      sampleDataLc.guaranteeFormId = this.savedData.guaranteeFormId;
      sampleDataLc.taskId = this.savedData.taskId;
    }
    try {
      if (sampleDataLc.guaranteeCustDtlsVo.dpCode.toString().length == 3) {
        sampleDataLc.guaranteeCustDtlsVo.dpCode = "0" + sampleDataLc.guaranteeCustDtlsVo.dpCode
      }
      if (sampleDataLc.guaranteeCustDtlsVo.dpCode.toString().length == 2) {
        sampleDataLc.guaranteeCustDtlsVo.dpCode = "00" + sampleDataLc.guaranteeCustDtlsVo.dpCode
      }
    } catch (err) {
    }


    // sampleDataLc['bnfDtls']['isSwiftCodeNotAvl'] = this.beneficiaryDetails.value.bnfDtlsVo.isSwiftCodeNotAvl == true ? 1 : 0;

    return sampleDataLc;
  }
}
