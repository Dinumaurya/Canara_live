import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AdvBankBeneficiaryComponent } from './adv-bank-beneficiary/adv-bank-beneficiary.component';
import { AdvChargeComponent } from './adv-charge/adv-charge.component';
import { AdvPolicyComponent } from './adv-policy/adv-policy.component';
import { AdvShipmentDetailComponent } from './adv-shipment-detail/adv-shipment-detail.component';
import Stepper from 'bs-stepper';
import { AppCommonService } from '@common/services';
import { ToastService } from '../../common';
import { NgxSpinnerService } from 'ngx-spinner';

import { AdvOfficeUseComponent } from './adv-office-use/adv-office-use.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from '@modules/dashboard/services';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'sb-advance-rem',
  templateUrl: './advance-rem.component.html',
  styleUrls: ['./advance-rem.component.scss']
})
export class AdvanceRemComponent implements OnInit, AfterViewInit {
  @ViewChild("content", { static: false }) content: any;

  public stepper: any;

  @ViewChild('advApplicant', { static: false }) advApplicant: any;
  @ViewChild('stepper3', { static: false }) stepper3: any;
  @ViewChild('advShipment', { static: false }) advShipment!: AdvShipmentDetailComponent;
  @ViewChild('advCharge', { static: false }) advCharge!: AdvChargeComponent;
  @ViewChild('advPolicy', { static: false }) advPolicy!: AdvPolicyComponent;
  @ViewChild('advBeneficiary', { static: false }) advBeneficiary!: AdvBankBeneficiaryComponent;
  @ViewChild('advOffice', { static: false }) advOffice!: AdvOfficeUseComponent;
  currentMode: any;
  savedData: any = [];
  submittedAdvAppForm1: boolean = false;
  remarkDetails: any = [];
  beneficiaryDetailList: any = [];
  imagename: any;
  contentbodyred: any;
  accountDetailsList: any = [];
  accountDetailTabl1Total = 0;
  public isDtlsofFrwdCntrct: boolean = true;
  conversionList: any = [];
  conversationDetailForm1Total = 0;
  isRtCvrdwithTrdr: boolean = true;
  conversationDetailTotal = 0;
  rejectModalRef: any;
  approveModalRef: any;
  public rejectremarks: any = '';
  public approveremarks: any = '';
  public isApproved = false;
  public isRejected = false;
  viewData: any = [];
  @Input() currency = [];
  @Input() country: any = [];
  constructor(private comservice: AppCommonService,
    public toastService: ToastService,
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    public router: Router,
    private activatedRoute: ActivatedRoute,) { }
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
    const stepper3 = this.stepper3.nativeElement
    this.stepper = new Stepper(stepper3, {
      linear: false,
      animation: true,
    });
    this.getBeneficiaryDetails();
    this.getCountry();
    this.getCurrency();
    this.loadView();
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
  ngOnInit(): void {
    this.dashboardService.gettableValue().subscribe(result => {
      this.beneficiaryDetailList = result.arraytable;
    })
  }

  next() {
    this.stepper.next();
  }
  toStep(no: any) {
    this.stepper.to(no);
  }
  openRejectModal(content: any) {
    this.rejectModalRef = this.modalService.open(content);
  }
  openApproveModal(content: any) {
    this.approveModalRef = this.modalService.open(content);
  }
  approveForm() {
    if (this.approveremarks != '') {
      this.approveModalRef.close();
      this.spinner.show();
      this.savedData.aprvRmrks = this.approveremarks;
      this.comservice.advApproveForm(this.savedData)
        .subscribe((data) => {
          if (data && data.historyBeanList) {
            this.remarkDetails = data.historyBeanList;
          }
          this.savedData = data;
          console.log(this.savedData);

          this.isApproved = true;
          this.spinner.hide();
          this.showSuccess('Approve Successfully');
        }, () => {
          this.spinner.hide();
          this.showSuccess('Approve Failed');
        })
    }

  }
  modal_title = "";

  rejectForm() {
    if (this.rejectremarks != '') {
      this.rejectModalRef.close();
      this.spinner.show();
      this.savedData.aprvRmrks = this.rejectremarks;
      this.comservice.advRejectForm(this.savedData)
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
  get canAppRej() {
    if (this.savedData && this.savedData.advRemStatusId && this.savedData.advRemStatusId != "") {
      if ([3].indexOf(this.savedData.advRemStatusId) != -1 && (this.savedData.aprvRmrks === '' || this.savedData.aprvRmrks === null)) {
        return true;
      }
    }
    return false;
  }
  goTo(no: any) {
    this.stepper.to(no);
  }
  get isDraft() {
    if (this.currentMode == 'view') {
      return false
    }
    if (this.savedData && this.savedData.advRemStatusId && this.savedData.advRemStatusId != "") {
      if ([4].indexOf(this.savedData.advRemStatusId) != -1) {
        return true;
      }
    }
    if (this.savedData && typeof (this.savedData.transRefNo) == "undefined") {
      return true;
    }

    return false;
  }
  get AppUserVal() {
    if (this.advApplicant && this.advApplicant.advApplicantForm) {
      return this.advApplicant.advApplicantForm.value;
    }
    return {};
  }
  get canUpdate() {
    if (this.savedData && this.savedData.advRemStatusId && this.savedData.advRemStatusId != "") {
      if ([3, 4, 7].indexOf(this.savedData.advRemStatusId) != -1) {
        if (this.currentMode && this.currentMode == "edit") {
          return true;
        }
      }
    }

    return false;
  }
  viewDoc(lcDoc: any) {
    var found = this.savedData.officeUse.offcReqDocList.find((o: any) => lcDoc.attchCd === o.attchCd);
    const dt = {
      filePath: found.attchPath,
      fileNm: found.attchValue,
    }
    console.log(dt);

    try {
      // const pt = environment.app_url
      // window.open(pt + "/docView/" + found.attchPath, '_blank')
      // return false;
    } catch (error) {
    }

  }
  addOnSubmitshipp() {
    this.advShipment.onSubmitAddShipmanet();
    if (this.advShipment.onSubmitAddShipmanet() && this.advShipment.advShipmentDetails.valid) {
      this.setOfficeForm();
      this.next()
    }
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
  outwardAdvData(advanceMandatoryDocList: any) {

    const accountDetailTable: any = [];
    const advApplicant: any = this.advApplicant.advApplicantForm.value;
    const advCharge: any = this.advCharge.advChargeDetails.value;
    const advBeneficiary: any = this.advBeneficiary.advBeneficiaryForm.value;
    const advShipment: any = this.advShipment.advShipmentDetails.value;
    const advPolicy: any = this.advPolicy.advPolicyDetails.value;
    const advOffice: any = this.advOffice.addOfficeform.value;
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
    // const fnd: any = this.country.find((x: any) => (x.alfaCode == beneFicaryDetail.lCadvRemDrweBnkDtlsVo.cntryId));
    // if (fnd) {
    //   advBeneficiary.advRemDrweBnkDtlsVo.cntryId = fnd.countryId
    // }
    try {
      const fnd: any = this.advShipment.beneficiaryList.find((x: any) => (x.beneId == advBeneficiary.lCadvRemDrweBnkDtlsVo.name));
      if (fnd) {
        advShipment.advRemDrweBnkDtlsVo.name = fnd.beneNam;
      }
    } catch (err) {

    }
    let isNoError = true;

    this.accountDetailsList.forEach((accountDetail: any) => {
      if (accountDetail.accNo == '') {
        accountDetail.accNoReq = true;
        isNoError = false;
      } else {
        accountDetail.accNoReq = false;
      }
      if (accountDetail.accNo !== '' && accountDetail.accNo.length > 13) {
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
    const beneFicaryDetail: any = JSON.parse(JSON.stringify(advShipment.advRemSupDrwDtlsVo));
    const fnd: any = this.country.find((x: any) => (x.alfaCode == beneFicaryDetail.cntryId));
    if (fnd) {
      beneFicaryDetail.cntryId = fnd.countryId
    }

    var sampleDataLc = {
      advRemId: null,
      encAdvRemId: null,
      taskId: null,
      encTaskId: "",
      sysRefNo: "",
      transRefNo: "",
      sysRefDt: "",
      appRefDt: "",
      partFullPayment: advApplicant.partFullPayment,
      advRemCustDtls: {
        formCustDtlsId: null,
        custId: advApplicant.advRemCustDtlsVo.custId,
        accNo: advApplicant.advRemCustDtlsVo.accNo,
        brnchNm: advApplicant.advRemCustDtlsVo.brnchNm,
        dpCode: advApplicant.advRemCustDtlsVo.dpCode,
        custNm: advApplicant.advRemCustDtlsVo.custNm,
        address1: advApplicant.advRemCustDtlsVo.address1,
        address2: advApplicant.advRemCustDtlsVo.address2,
        address3: advApplicant.advRemCustDtlsVo.address3,
        cntryId: advApplicant.advRemCustDtlsVo.cntryId,
        stateId: null,
        pinCode: null,
        telNo: advApplicant.advRemCustDtlsVo.telNo,
        mobNo: advApplicant.advRemCustDtlsVo.mobNo,
        eMail: advApplicant.advRemCustDtlsVo.eMail,
        altEmail: advApplicant.advRemCustDtlsVo.altEmail,
        panNo: advApplicant.advRemCustDtlsVo.panNo,
        ieCode: advApplicant.advRemCustDtlsVo.ieCode,
      },
      currency: advApplicant.currency,
      amount: advApplicant.amount,
      amntWords: advApplicant.amntWords,
      advRemSupDrwDtls: beneFicaryDetail,
      advRemDrweBnkDtls: {
        drweBnkDtlsId: null,
        cifId: advShipment.advRemDrweBnkDtlsVo.cifId,
        drweBnkNm: advShipment.advRemDrweBnkDtlsVo.drweBnkNm,
        addr1: advShipment.advRemDrweBnkDtlsVo.addr1,
        addr2: advShipment.advRemDrweBnkDtlsVo.addr2,
        cntryId: advShipment.advRemDrweBnkDtlsVo.cntryId,
        swiftCode: advShipment.advRemDrweBnkDtlsVo.swiftCode,
        isSwiftCodeNotAvl: advBeneficiary.advRemDrweBnkDtlsVo.isSwiftCodeNotAvl === true ? 1 : 0,
        swiftBnkNm: advBeneficiary.advRemDrweBnkDtlsVo.swiftBnkNm,
        swiftBnkAddr1: advBeneficiary.advRemDrweBnkDtlsVo.swiftBnkAddr1,
        swiftBnkAddr2: advBeneficiary.advRemDrweBnkDtlsVo.swiftBnkAddr2,
        swiftBnkAbacd: advBeneficiary.advRemDrweBnkDtlsVo.swiftBnkAbacd,
        swiftBnkAbaCdDesc: advBeneficiary.advRemDrweBnkDtlsVo.swiftBnkAbaCdDesc,
        swftCntryId: null, // advBeneficiary.advRemDrweBnkDtlsVo.swftCntryId,
        interSwiftCode: advShipment.advRemDrweBnkDtlsVo.interSwiftCode, // advBeneficiary.advRemDrweBnkDtlsVo.interSwiftCode,
        drweAccNo: advShipment.advRemDrweBnkDtlsVo.drweAccNo,
        auditDetails: null
      },
      formCmmnAcc: {
        formCmmnAccId: null,
        formAccDtlsList: this.advBeneficiary.accountDetailsList,
        totAccAmnt: this.advBeneficiary.accountDetailTabl1Total,
        isFrwdCntrct: this.advCharge.isDtlsofFrwdCntrct === true ? 1 : 0,
        formFrwdCntrctDtlsList: this.advCharge.conversionList,
        totFrwdCntrct: this.advCharge.conversationDetailForm1Total,
        isRtCvrWithTrDr: this.advOffice.isRtCvrdwithTrdr === false ? 1 : 0,
        formRtCvrDtlsList: this.advOffice.rtCvrDtlsVoListArray,
        totRtCvrAmnt: this.advOffice.conversationDetailTotal,
        //isDtlsofFrwdCntrct: this.advCharge.isDtlsofFrwdCntrct === true ? 1 : 0,
      },
      addInfo: advCharge.addInfo,
      licNo: advPolicy.licNo,
      declrCumUnd: advPolicy.declrCumUnd,
      formDt: advPolicy.formDt,
      formPlace: advPolicy.formPlace,
      signature: null,
      officeUse: {
        officeUseId: null,
        accNo: advOffice.officeUseVo.accNo,
        conscnChrg: advOffice.officeUseVo.conscnChrg,
        conscnPrcntg: advOffice.officeUseVo.conscnPrcntg,
        conscnFixdAmnt: advOffice.officeUseVo.conscnFixdAmnt,
        swiftPrcntg: advOffice.officeUseVo.swiftPrcntg,
        swiftFixdAmnt: advOffice.officeUseVo.swiftFixdAmnt,
        isFccAccSetlmnt: advOffice.officeUseVo.isFccAccSetlmnt === true ? 1 : 0,
        fccAccNo: advOffice.officeUseVo.fccAccNo,
        offcReqDocList: this.advShipment.beneficiaryDetailList,
        officeAttchList: advanceMandatoryDocList,
        officeDclrtnList: null,
        officeMisList: null,
        formRtCvrDtlsOffList: null,
        dscrpncyObsrvdList: null,
        instMstList: null,
        totRtCvrOffAmnt: null,
        sanctnAttNm: null,
        sanctnAttPath: null,
        nostroMaster: null,
        nosCharge: null,
        customer: null,
        office: null,
        csms: null,
        cemail: null,
        osms: null,
        oemail: null,
        atchmntSanctn: null
      },
      aprvRmrks: null,
      priority: "LOW",
      advRemStatusId: 3,
      wrkInPrgs: false,
      historyBeanList: [],
      isEditable: false,
      custNm: null,
      advRemStatus: null,
      auditDetails: null,
      advRemShipDtls: {
        lcShipDtlsId: null,
        plRcpt: null,
        pol: advShipment.advRemShipDtlsVo.pol,
        pod: advShipment.advRemShipDtlsVo.pod,
        plDlvry: null,
        ltstShpMntDt: advShipment.advRemShipDtlsVo.ltstShpMntDt,
        hsCode: advShipment.advRemShipDtlsVo.hsCode,
        proInvNo: advShipment.advRemShipDtlsVo.proInvNo,
        dgftPolicy: null,
        impLicNo: null,
        inCoTerms: advShipment.advRemShipDtlsVo.inCoTerms,
        otherDtls: null,
        descGdsRmrks: advShipment.advRemShipDtlsVo.descGdsRmrks,
        auditDetails: null,
        invAmount: advShipment.advRemShipDtlsVo.invAmount,
        proInvDt: advShipment.advRemShipDtlsVo.proInvDt,
        shpmntMrks: null,
        shpmntInfo: null,
        shpmntDtls: null,
        carrierNm: null,
        goodsShpmntDt: null,
        transShpmntAllwd: null,
        prtlShpmntAllwd: null,
        typeOfGoods: null
      }
    }
    try {
      sampleDataLc.officeUse.offcReqDocList.forEach((dt: any) => {
        delete dt.docList;
      });
      // sampleDataLc.officeUse.docList.forEach((dt: any) => {
      //   delete dt.docList;
      // });
    } catch (error) {

    }


    sampleDataLc.advRemCustDtls.dpCode = "" + sampleDataLc.advRemCustDtls.dpCode;
    if (this.savedData && this.savedData.sysRefNo != '' && this.savedData.sysRefNo != undefined) {
      sampleDataLc.sysRefNo = this.savedData.sysRefNo;
      sampleDataLc.transRefNo = this.savedData.transRefNo;
      // sampleData.isEditable = this.savedData.isEditable ;
      sampleDataLc.advRemId = this.savedData.advRemId;
      sampleDataLc.taskId = this.savedData.taskId;
    }
    try {
      if (sampleDataLc.advRemCustDtls.dpCode.toString().length == 3) {
        sampleDataLc.advRemCustDtls.dpCode = "0" + sampleDataLc.advRemCustDtls.dpCode
      }
      if (sampleDataLc.advRemCustDtls.dpCode.toString().length == 2) {
        sampleDataLc.advRemCustDtls.dpCode = "00" + sampleDataLc.advRemCustDtls.dpCode
      }
    } catch (err) {
    }


    sampleDataLc['advRemDrweBnkDtls']['isSwiftCodeNotAvl'] = this.advBeneficiary.advBeneficiaryForm.value.advRemDrweBnkDtlsVo.isSwiftCodeNotAvl == true ? 1 : 0;

    return sampleDataLc;
  }
  isForm1Valid() {
    // check if first form is valid

    if (!this.advApplicant.advApplicantForm.valid) {
      this.advApplicant.submittedAdvAppForm1 = true;
      this.goTo(1);
      return 0
    }
    return 1
  }
  redirectHome() {
    this.router.navigate(['/dashboard/outward/advRem'])
  }
  disableAllForm() {
    this.advCharge.advChargeDetails.disable()
    this.advApplicant.advApplicantForm.disable()
    this.advBeneficiary.advBeneficiaryForm.disable()
    this.advOffice.addOfficeform.disable()
    this.advShipment.advShipmentDetails.disable()
    this.advPolicy.advPolicyDetails.disable()
  }
  get isSaved() {
    return this.AppUserVal.sysRefNo != '' ? true : false;
  }
  setOfficeForm() {
    this.advOffice.checkedFileList(false, 0, this.advOffice.advanceMandatoryDocList[0])
    this.advOffice.advanceMandatoryDocList[0].isChecked = true;
    this.advOffice.advanceMandatoryDocList[0].isChckd = true;
    this.advOffice.advanceMandatoryDocList[0].attchPath = this.advShipment.beneficiaryDetailList[0].attchPath;
    this.advOffice.advanceMandatoryDocList[0].docAttchNm = "";
    this.advOffice.advanceMandatoryDocList[0].attchValue = this.advShipment.beneficiaryDetailList[0].attchValue;
    this.advOffice.advanceMandatoryDocList[0].file = this.advShipment.beneficiaryDetailList[0].file;

  }
  onSubmitFormm6() {

    this.advOffice.onSubmitOfficeForm6();
    if (!this.advApplicant.advApplicantForm.valid) {
      this.advApplicant.submittedAdvAppForm1 = true;
      this.goTo(1);
      return 0
    }
    /**
     * SHipment Details Form Submit
     */
    if (!this.advShipment.onSubmitAddShipmanet()) {
      this.advShipment.submittedAdvAppForm2 = true;
      this.goTo(2);
      return 0
    } else {
      this.setOfficeForm();
    }
    if (!this.advBeneficiary.onSubmitBankForm3()) {
      this.goTo(3);
      return 0
    }
    if (!this.advCharge.advChargeDetails.valid) {
      this.advCharge.submittedChargeForm4 = true;
      this.goTo(4);
      return 0
    }
    if (!this.advPolicy.advPolicyDetails.valid
      && !this.advPolicy.isImportLicenceNoErr) {
      this.goTo(5);
      return 0
    }
    var validFile = true;
    this.advOffice.advanceMandatoryDocList.forEach((element: any, index: any) => {
      if (element && this.advOffice.isThisFieldRequired(element, index)) {
        validFile = false;
      }
    });
    if (this.advOffice.addOfficeform.valid && validFile) {
      this.spinner.show();
      const promiseArray: any = [];
      const indexArr: any = [];
      this.advShipment.beneficiaryDetailList.forEach((data: any, index: any) => {
        if (data.file && data.file != "") {
          var formData: any = new FormData();
          formData.append('file', data.file);
          formData.append('code', data.docTp);
          indexArr.push(index);
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
      Promise.all(promiseArray).then((valBene: any) => {
        const promiseArray: any = [];
        this.advOffice.advanceMandatoryDocList.forEach((data: any) => {
          if (data.isChckd) {
            if (data.file && data.file != "") {
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
          }
        });
        Promise.all(promiseArray).then((values: any) => {
          var advanceMandatoryDocList: any = []
          var beneficiaryDetailList: any = [];
          if (values && values[0]) {

            try {
              values.forEach((dt: any, index: any) => {
                var found = this.advOffice.advanceMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
                if (found) {
                  advanceMandatoryDocList.push({
                    "docAttchNm": dt.docAttchNm,
                    "attchCd": found.attchCd,
                    "isChckd": 1
                  });
                }
              })
            } catch (err) {

            }
          }
          if (this.advOffice.advanceMandatoryDocList
            && this.advOffice.advanceMandatoryDocList.length > 0) {
            if (this.viewData
              && this.viewData.officeUse
              && this.viewData.officeUse.officeAttchList.length > 0) {
              this.advOffice.advanceMandatoryDocList.forEach((dt: any, index: any) => {
                var found = this.viewData.officeUse.officeAttchList.find((o: any) => dt.attchCd === o.attchCd);
                if (found && found.isChckd && found.attchValue != '' && found.attchPath != '') {
                  advanceMandatoryDocList.push(found);
                }
              });
            }
          }

          if (valBene && valBene[0]) {
            try {
              indexArr.forEach((dt: any, index: any) => {
                this.advShipment.beneficiaryDetailList[dt]['docAttchNm'] = valBene[index].docAttchNm;
                this.advShipment.beneficiaryDetailList[dt]['attchNm'] = valBene[index].attchNm;
                this.advShipment.beneficiaryDetailList[dt]['attchPath'] = valBene[index].attchPath;
              })
            } catch (err) {

            }
          }
          let sampleDataLc = this.outwardAdvData(advanceMandatoryDocList);

          sampleDataLc.advRemCustDtls.dpCode = "" + sampleDataLc.advRemCustDtls.dpCode;
          if (this.savedData && this.savedData.sysRefNo != '' && this.savedData.sysRefNo != undefined) {
            sampleDataLc.sysRefNo = this.savedData.sysRefNo;
            sampleDataLc.transRefNo = this.savedData.transRefNo;
            // sampleData.isEditable = this.savedData.isEditable ;
            sampleDataLc.advRemId = this.savedData.advRemId;
            sampleDataLc.taskId = this.savedData.taskId;
          }
          try {
            if (sampleDataLc.advRemCustDtls.dpCode.toString().length == 3) {
              sampleDataLc.advRemCustDtls.dpCode = "0" + sampleDataLc.advRemCustDtls.dpCode
            }
            if (sampleDataLc.advRemCustDtls.dpCode.toString().length == 2) {
              sampleDataLc.advRemCustDtls.dpCode = "00" + sampleDataLc.advRemCustDtls.dpCode
            }
          } catch (err) {
          }
          if (sampleDataLc.sysRefNo === "" && sampleDataLc.transRefNo === "") {
            this.comservice.saveAdvRemForm(sampleDataLc).subscribe(data => {
              this.savedData = data;
              this.advOffice.savedData = data;

              if (data && data.sysRefNo != '') {
                this.advApplicant.advApplicantForm.patchValue({

                  sysRefNo: data.sysRefNo,
                  transRefNo: data.transRefNo,
                  isEditable: data.isEditable,
                  advRemId: data.advRemId,
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
          } else {


            sampleDataLc.priority = this.savedData.priority
            this.comservice.advSaveUpdate(sampleDataLc).subscribe(data => {
              this.savedData = data;
              this.advOffice.savedData = data;
              if (data && data.sysRefNo != '') {
                this.advApplicant.advApplicantForm.patchValue({
                  sysRefNo: data.sysRefNo,
                  transRefNo: data.transRefNo,
                  isEditable: data.isEditable,
                  advRemId: data.advRemId,
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

        });
      }).catch((err) => {
        this.spinner.hide();
        this.showSuccess('File upload Failed. Please try again..');
      });;

    }
  }
  modal_body = "";

  modal_body_2 = '';

  onSubmitApp() {
    this.advApplicant.onSubmitApp();
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.advApplicant.advApplicantForm.valid) {
        this.next()
      }
    }
    this.advApplicant.submittedlcForm1 = true;
  }
  onSubmitFormCharg() {
    if (this.advCharge.onSubmitAddChargeForm4()) {
      this.next();
    }
  }
  onSubmitbeneFrm() {
    if (this.advBeneficiary.onSubmitBankForm3()) {
      this.next();
    }
  }
  submitedAllForm(e: any) {

  }
  onSubmitFormPolicy() {
    this.advPolicy.onSubmitpolicyForm5();
    if (this.advPolicy.advPolicyDetails.valid) {
      if (this.advPolicy.isImportLicenceNoErr) {
        this.next()
      }
    }
  }
  mandatory3Tab = "";

  saveDraft() {
    if (this.isForm1Valid() == 0) {
      return 0
    }
    this.spinner.show();
    const promiseArray: any = [];
    this.advOffice.advanceMandatoryDocList.forEach((data: any) => {
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
            var found = this.advOffice.advanceMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
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
      let draftData = this.outwardAdvData(outwardMandatoryDocList);
      if (draftData.sysRefNo === "" && draftData.transRefNo === "") {
        this.comservice.AdvSaveDraft(draftData).subscribe((data: any) => {
          // this.draftdata = data;
          // Hadle Save Data
          this.savedData = data;

          if (data && data.sysRefNo != '' && data.sysRefNo != undefined) {
            this.advApplicant.advApplicantForm.patchValue({
              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              advRemId: data.advRemId,
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
        this.comservice.advUpdateDraft(draftData).subscribe((data: any) => {
          this.savedData = data;
          if (data && data.sysRefNo != '') {
            this.advApplicant.advApplicantForm.patchValue({
              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              advRemId: data.advRemId,
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

  loadView() {
    this.activatedRoute.paramMap.subscribe(params => {
      const advRemId = params.get("advRemId");
      const taskId = params.get("taskId");
      const mode = params.get("mode");
      this.currentMode = params.get("mode");
      let method = this.comservice.getAdvView(taskId, advRemId);

      if (mode == 'edit') {
        method = this.comservice.getAdvEdit(taskId, advRemId);
      }
      if (advRemId && advRemId != "") {
        method.subscribe((data: any) => {
          this.savedData = data;
          if (data && data.sysRefNo != '' && data.sysRefNo != null) {
            if (data && data.historyBeanList) {
              if (mode !== 'edit') {
                this.remarkDetails = data.historyBeanList;
              }
            }
            try {
              this.advCharge.conversionList = this.savedData.formCmmnAcc.formFrwdCntrctDtlsList;
              this.advCharge.conversationDetailForm1Total = this.savedData.formCmmnAcc.totFrwdCntrct;

              this.advCharge.isDtlsofFrwdCntrct = this.savedData.formCmmnAcc.isFrwdCntrct === 1 ? true : false;
            } catch (error) {

            }
            try {
              this.viewData = data;
              console.log(this.viewData);
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
              this.savedData = data;
              this.advOffice.savedData = data;
              this.ref.detectChanges();
              var lcCustDtls = this.viewData["lcCustDtls"]
              var formCmmnAccc = this.viewData["formCmmnAcc"];
              formFrwdCntrctDtlsListt = formCmmnAccc["formFrwdCntrctDtlsList"]
              var formRtCvrDtlsListt: any = formCmmnAccc["formRtCvrDtlsList"]
              this.advOffice.isRtCvrdwithTrdr = formCmmnAccc["isRtCvrWithTrDr"] == 1 ? false : true;
              this.advOffice.rtCvrDtlsVoListArray = formRtCvrDtlsListt
              this.accountDetailsList = formCmmnAccc["formAccDtlsList"]
              console.log(this.accountDetailsList[0]);
              this.advBeneficiary.accountDetailsList = formCmmnAccc.formAccDtlsList;
              this.ref.detectChanges();
              var marginDtlList = this.viewData["marginDtlList"];
              var formFrwdCntrctDtlsListt: any = [];
              var officeUsetab = this.viewData["officeUse"];
              var officeUseTable = officeUsetab["offcReqDocList"];
              var formFrwdCntrctDtlsListt: any = [];
              formFrwdCntrctDtlsListt = formCmmnAccc["formFrwdCntrctDtlsList"];

            } catch (err) {
            }
            this.conversionList = formFrwdCntrctDtlsListt
            const advApplicantVal: any = this.advApplicant.advApplicantForm;
            const advCharge: any = this.advCharge.advChargeDetails;
            const advBeneficiary: any = this.advBeneficiary.advBeneficiaryForm;
            const advShipment: any = this.advShipment.advShipmentDetails;
            const advPolicy: any = this.advPolicy.advPolicyDetails;
            const advOffice: any = this.advOffice.addOfficeform;

            try {
              this.beneficiaryDetailList.forEach((element: any) => {

                this.beneficiaryDetailList.push({
                  docTp: element.docTp,
                  docDesc: element.docDesc,
                  docCd: element.docCd,
                  // docList: element.docList,
                  noOfOrgnls: element.noOfOrgnls,
                  noOfCopies: element.noOfCopies,
                  docRefNo: element.docRefNo,
                  docDt: moment(element.docDt).format('YYYY-MM-DDTHH:mm:ssZZ'),
                  atchmnt: element.atchmnt
                });
              });
            } catch (err) {
            }
            setTimeout(() => {
              try {
                this.advShipment.beneficiaryDetailList = this.viewData['officeUse']['offcReqDocList'];
                this.advShipment.beneficiaryDetailList.forEach((element: any, index: number) => {
                  this.advShipment.docDescList(element, index);
                  this.advShipment.getDocCodeList(element, index);
                });

                this.ref.detectChanges();
              } catch (error) {
              }
            }, 3000);

            this.ref.detectChanges();
            setTimeout(() => {
              try {
                this.advOffice.advanceMandatoryDocList.forEach((dt: any, index: any) => {
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
            this.ref.detectChanges();
            const accountDetailTable: any = [];
            accountDetailTable.forEach((element: any) => {
              accountDetailTable.push({
                sNo: moment(element.sNo).format('YYYY-MM-DDTHH:mm:ssZZ'),
                margin: element.margin,
                deposit: element.deposit
              })
            });
            console.log(officeUseTable);

            advApplicantVal.patchValue({
              advRemId: "",
              encAdvRemId: null,
              taskId: "",
              encTaskId: "",
              sysRefNo: this.viewData.sysRefNo,
              transRefNo: this.viewData.transRefNo,
              sysRefDt: moment(this.viewData.sysRefDt).format('YYYY-MM-DDTHH:mm:ssZZ'),
              appRefDt: "",
              partFullPayment: this.viewData.partFullPayment,
              advRemCustDtlsVo: {
                accNo: this.viewData.advRemCustDtls.accNo,
                address1: this.viewData.advRemCustDtls.address1,
                address2: this.viewData.advRemCustDtls.address2,
                address3: this.viewData.advRemCustDtls.address3,
                altEmail: this.viewData.advRemCustDtls.altEmail,
                brnchNm: this.viewData.advRemCustDtls.brnchNm,
                cntryId: 1,
                custId: this.viewData.advRemCustDtls.custId,
                custNm: this.viewData.advRemCustDtls.custNm,
                dpCode: this.viewData.advRemCustDtls.dpCode,
                eMail: this.viewData.advRemCustDtls.eMail,
                ieCode: this.viewData.advRemCustDtls.ieCode,
                mobNo: this.viewData.advRemCustDtls.mobNo,
                panNo: this.viewData.advRemCustDtls.panNo,
                telNo: this.viewData.advRemCustDtls.telNo,
              },
              currency: this.viewData.currency,
              amount: this.viewData.amount,
              amntWords: this.viewData.amntWords,
            });
            try {
              advCharge.patchValue({
                addInfo: this.viewData.addInfo,
                isDtlsofFrwdCntrct: this.viewData.formCmmnAcc.isFrwdCntrct === 1 ? true : false,
                formCmmnAcc: {
                  formCmmnAccId: null,
                  isFrwdCntrct: this.viewData.formCmmnAcc.isFrwdCntrct === 1 ? true : false,
                  accountDetailsList: this.advBeneficiary.accountDetailsList,
                  totAccAmnt: formCmmnAccc.totAccAmnt,
                  conversionList: formFrwdCntrctDtlsListt,
                  totFrwdCntrct: formCmmnAccc.totFrwdCntrct,
                  rtCvrDtlsVoListArray: formRtCvrDtlsListt,
                  totRtCvrAmnt: this.viewData.totRtCvrAmnt,
                  isRtCvrWithTrDr: null,
                  formRtCvrDtlsList: null,
                },
              });
              this.advCharge.conversationDetailForm1Total = this.viewData.formCmmnAcc.totFrwdCntrct;
              this.advCharge.conversionList = this.viewData.formCmmnAcc.formFrwdCntrctDtlsList;
              this.ref.detectChanges();
            } catch (error) {

            }
            advShipment.patchValue({
              advRemSupDrwDtlsVo: this.viewData.advRemSupDrwDtls,
              advRemShipDtlsVo: this.viewData.advRemShipDtls,
              advRemDrweBnkDtlsVo: {
                cifId: this.viewData.advRemDrweBnkDtls.cifId,
                drweBnkNm: this.viewData.advRemDrweBnkDtls.drweBnkNm,
                addr1: this.viewData.advRemDrweBnkDtls.addr1,
                addr2: this.viewData.advRemDrweBnkDtls.addr2,
                cntryId: this.viewData.advRemDrweBnkDtls.cntryId,
                swiftCode: this.viewData.advRemDrweBnkDtls.swiftCode,
                interSwiftCode: this.viewData.advRemDrweBnkDtls.interSwiftCode,
                drweAccNo: this.viewData.advRemDrweBnkDtls.drweAccNo
              }
            });
            setTimeout(() => {
              try {
                const fnd: any = this.country.find((x: any) => (x.countryId == this.viewData.advRemSupDrwDtls.cntryId));
                if (fnd) {
                  advShipment.patchValue({
                    advRemSupDrwDtlsVo: {
                      cntryId: fnd.alfaCode
                    }
                  });
                }
              } catch (error) {

              }
            }, 1000);
            advBeneficiary.patchValue({
              advRemDrweBnkDtlsVo:
              {
                drweBnkDtlsId: this.viewData.advRemDrweBnkDtls.drweBnkDtlsId,
                // cifId: this.viewData.advRemDrweBnkDtls.cifId,
                // drweBnkNm: this.viewData.advRemDrweBnkDtls.drweBnkNm,
                // addr1: this.viewData.advRemDrweBnkDtls.addr1,
                // addr2: this.viewData.advRemDrweBnkDtls.addr2,
                // cntryId: this.viewData.advRemDrweBnkDtls.cntryId,
                // swiftCode: this.viewData.advRemDrweBnkDtls.swiftCode,
                isSwiftCodeNotAvl: this.viewData.advRemDrweBnkDtls.isSwiftCodeNotAvl,
                swiftBnkNm: this.viewData.advRemDrweBnkDtls.swiftBnkNm,
                swiftBnkAddr1: this.viewData.advRemDrweBnkDtls.swiftBnkAddr1,
                swiftBnkAddr2: this.viewData.advRemDrweBnkDtls.swiftBnkAddr2,
                swiftBnkAbacd: this.viewData.advRemDrweBnkDtls.swiftBnkAbacd,
                swiftBnkAbaCdDesc: this.viewData.advRemDrweBnkDtls.swiftBnkAbaCdDesc,
                swftCntryId: this.viewData.advRemDrweBnkDtls.swftCntryId,
                // interSwiftCode: this.viewData.advRemDrweBnkDtls.interSwiftCode,
                // drweAccNo: this.viewData.advRemDrweBnkDtls.drweAccNo,
                auditDetails: null
              },
            });

            setTimeout(() => {
              this.advShipment.loadPurposeDtls();
              this.ref.detectChanges();

            }, 3000);

            advPolicy.patchValue({
              formDt: this.viewData.formDt,
              formPlace: this.viewData.formPlace,
              impLicNo: this.viewData.impLicNo,
              licNo: this.viewData.licNo,
              policyNo: this.viewData.policyNo,
              declrCumUnd: this.viewData.declrCumUnd
            });
            advOffice.patchValue({
              officeUseVo: this.viewData.officeUse,
              accNo: this.viewData.officeUse.accNo,
              atchmntSanctn: null,
              cemail: null,
              conscnChrg: "NO",
              conscnFixdAmnt: this.viewData.officeUse.conscnFixdAmnt,
              conscnPrcntg: this.viewData.officeUse.conscnPrcntg,
              csms: null,
              customer: null,
              dscrpncyObsrvdList: null,
              fccAccNo: null,
              formRtCvrDtlsOffList: null,
              instMstList: null,
              isFccAccSetlmnt: 1,
              nosCharge: null,
              nostroMaster: null,
              oemail: null,
              offcReqDocList: officeUseTable,
              docList: officeUseTable,

              officeDclrtnList: null,
              officeMisList: null,

            });
            if (advRemId != null) {
              if (this.viewData.advRemStatusId !== 3) {
                this.isApproved = true;
              }
              if (!this.viewData.isEditable) {
                this.disableAllForm();
              }
              try {
                this.ref.detectChanges();
                this.accountDetailTabl1TotalCal();
                this.advBeneficiary.accountDetailTabl1TotalCal();
              } catch (err) {
              }
            }
          }
        })
      }
    }, error => {
    });
  }

  accountDetailTabl1TotalCal() {
    let total = 0;
    this.accountDetailsList.forEach((element: any) => {
      total += (+element.amount)
    });
    this.accountDetailTabl1Total = total;
  }
  public beneficiaryList: any = [];
  getBeneficiaryDetails() {
    try {

      const jsn: any = sessionStorage.getItem('user');
      const customerId = JSON.parse(jsn);
      if (customerId && customerId.ibData && customerId.ibData.UserID) {
        var UserId = customerId.ibData.UserID
      }
      if (customerId && customerId.ibData && customerId.ibData.UserID) {
        this.comservice.getBeneficiaryDetails(customerId.ibData.AuthKey, 'FTB', UserId)
          .subscribe(data => {
            if (data.beneDetails) {
              this.beneficiaryList = data.beneDetails;
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
}
