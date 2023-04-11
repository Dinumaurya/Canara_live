import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import Stepper from 'bs-stepper';
import { AppCommonService } from '@common/services';
import { ToastService } from '../../common';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportBillApplicantComponent } from './import-bill-applicant/import-bill-applicant.component';
import { ImportBillPolicyComponent } from './import-bill-policy/import-bill-policy.component';
import { ImportBillChargeComponent } from './import-bill-charge/import-bill-charge.component';
import { ImportBillOfficeComponent } from './import-bill-office/import-bill-office.component';
import { ImportBillBankBeneComponent } from './import-bill-bank-bene/import-bill-bank-bene.component';
import { ImportBillShipmentComponent } from './import-bill-shipment/import-bill-shipment.component';
@Component({
  selector: 'sb-import-bill-collection',
  templateUrl: './import-bill-collection.component.html',
  styleUrls: ['./import-bill-collection.component.scss']
})
export class ImportBillCollectionComponent implements OnInit, AfterViewInit {
  public stepper: any;
  public savedData: any;
  public currentMode: any;
  public remarkDetails: any = [];
  public approveremarks: any = '';
  public rejectremarks: any = '';
  public approveModalRef: any;
  public rejectModalRef: any;
  public isApproved = false;
  public isRejected = false;
  public viewData: any = [];
  public country = [];
  public currency = [];
  public parentMessage!: string;
  public shipmentMessage!: string;
  public rtCvrDtlsVoListArray: any = [];
  public conversionList: any = [];
  public conversionList2Table: any = []
  public conversationDetailTotal = 0;
  public conversionList2TableeTotal = 0;
  public beneficiaryDetailList: any = [];
  public accountDetailsList: any = [];
  public insMstVoList: any = [];
  public otherbankDetails: any = [];
  public canarabankDetails: any = [];
  public conversationDetailForm1Total = 0;
  public accountDetailTabl1Total = 0;
  public billOfEntryVoList: any = [];
  public formFrwdCntrctDtlsList: any = [];

  @ViewChild('stepper4', { static: false }) stepper4: any;
  @ViewChild("content", { static: false }) content: any;
  @ViewChild('importBillApplicant', { static: false }) importBillApplicant!: ImportBillApplicantComponent;
  @ViewChild('importBillCharge', { static: false }) importBillCharge!: ImportBillChargeComponent;
  @ViewChild('importBillPolicy', { static: false }) importBillPolicy!: ImportBillPolicyComponent;
  @ViewChild('importBillBeneficiary', { static: false }) importBillBeneficiary!: ImportBillBankBeneComponent;
  @ViewChild('importBillShipment', { static: false }) importBillShipment!: ImportBillShipmentComponent;
  @ViewChild('importBillOffice', { static: false }) importBillOffice!: ImportBillOfficeComponent;

  constructor(
    private comservice: AppCommonService,
    public toastService: ToastService,
    private spinner: NgxSpinnerService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  onSubmitFormm6() {
    if (!this.onSubmitApp()) {
      this.importBillApplicant.submittedBillApplicant = true;
      this.goTo(1);
      return 0
    }
    if (!this.addOnSubmitshipp()) {
      this.goTo(2);
      return 0
    }
    if (!this.onSubmitbeneFrm()) {
      this.goTo(3);
      return 0
    }

    if (!this.importBillCharge.billChargeForm.valid) {
      this.importBillCharge.submitted = true;
      this.goTo(4);
      return 0
    }
    if (!this.importBillPolicy.billPolicyDetails.valid) {
      this.importBillPolicy.billsubmittedFrom5 = true;
      this.goTo(5);
      return 0
    }
    var validFile = true;
    this.importBillOffice.outwardMandatoryDocList.forEach((element: any, index: any) => {
      if (element && this.importBillOffice.isThisFieldRequired(element, index)) {
        validFile = false;
      }
    });
    this.importBillOffice.onSubmitForm6();
    if (this.importBillOffice.billOfficeform.valid && validFile) {
      this.spinner.show();
      const promiseArray: any = [];
      this.importBillBeneficiary.beneficiaryDetailList.forEach((data: any, index: any) => {
        if (data.file && data.file != "") {
          var formData: any = new FormData();
          formData.append('file', data.file);
          formData.append('code', data.docTp);
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

        if (valBene && valBene[0]) {
          try {
            valBene.forEach((dt: any, index: any) => {
              this.importBillBeneficiary.beneficiaryDetailList[index]['docAttchNm'] = dt.docAttchNm;
              this.importBillBeneficiary.beneficiaryDetailList[index]['attchNm'] = dt.attchNm;
              this.importBillBeneficiary.beneficiaryDetailList[index]['attchPath'] = dt.attchPath;
            })
          } catch (err) {

          }
        }
        const promiseArray: any = [];
        this.importBillOffice.outwardMandatoryDocList.forEach((data: any) => {
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
                var found = this.importBillOffice.outwardMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
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
          if (this.importBillOffice.outwardMandatoryDocList && this.importBillOffice.outwardMandatoryDocList.length > 0) {
            if (this.viewData && this.viewData.officeUse && this.viewData.officeUse.officeAttchList.length > 0) {
              this.importBillOffice.outwardMandatoryDocList.forEach((dt: any, index: any) => {
                var found = this.viewData.officeUse.officeAttchList.find((o: any) => dt.attchCd === o.attchCd);
                if (found && found.isChckd && found.attchValue != '' && found.attchPath != '') {
                  outwardMandatoryDocList.push(found);
                }
              });
            }
          }
          let sampleDataLc = this.outwardObjData(outwardMandatoryDocList);
          try {
            if (sampleDataLc.importBillsCustDtls.dpCode.toString().length == 3) {
              sampleDataLc.importBillsCustDtls.dpCode = "0" + sampleDataLc.importBillsCustDtls.dpCode
            }
            if (sampleDataLc.importBillsCustDtls.dpCode.toString().length == 2) {
              sampleDataLc.importBillsCustDtls.dpCode = "00" + sampleDataLc.importBillsCustDtls.dpCode
            }
          } catch (err) {
          }
          if (sampleDataLc.sysRefNo === "" && sampleDataLc.transRefNo === "") {
            this.comservice.saveImportBillColForm(sampleDataLc).subscribe(data => {
              this.savedData = data;
              this.importBillOffice.savedData = this.savedData;
              if (data && data.sysRefNo != '') {
                this.importBillApplicant.importBillApplicantDetail.patchValue({
                  sysRefNo: data.sysRefNo,
                  transRefNo: data.transRefNo,
                  isEditable: data.isEditable,
                  importBillsId: data.importBillsId,
                  taskId: data.taskId,
                });
                if (data && data.historyList) {
                  this.remarkDetails = data.historyList;
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
            // sampleDataLc.priority = this.savedData.priority
            this.comservice.updateImportBillColForm(sampleDataLc).subscribe(data => {
              this.savedData = data;
              this.importBillOffice.savedData = this.savedData;
              if (data && data.sysRefNo != '') {
                this.importBillApplicant.importBillApplicantDetail.patchValue({
                  sysRefNo: data.sysRefNo,
                  transRefNo: data.transRefNo,
                  isEditable: data.isEditable,
                  importBillsId: data.importBillsId,
                  taskId: data.taskId,
                });
                if (data && data.historyList) {
                  if (this.currentMode && this.currentMode != "edit") {
                    this.remarkDetails = data.historyList;
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
      });
    } else {
      this.goTo(6);
    }
  }
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

    const importBillApplicant: any = this.importBillApplicant.importBillApplicantDetail;
    const importBillCharge: any = this.importBillCharge.billChargeForm;
    const importBillBeneficiary: any = this.importBillBeneficiary.billBankBenefiacry;
    const importBillShipment: any = this.importBillShipment.billShipmentForm;
    const importBillPolicy: any = this.importBillPolicy.billPolicyDetails;
    const importBillOffice: any = this.importBillOffice.billOfficeform;
    var sampleDataLc = {
      "importBillsId": null,
      "encImportBillsId": null,
      "encTaskId": "",
      "taskId": null,
      "sysRefNo": "",
      "transRefNo": "",
      "sysRefDt": "",
      "appRefDt": "",
      "currency": importBillApplicant.value.currency,
      "othrCurrency": importBillApplicant.value.othrCurrency,
      "amount": importBillApplicant.value.amount,
      "amntWords": importBillApplicant.value.amntWords,
      "billPayment": importBillApplicant.value.billPayment, 
      "letterOfCredit": importBillApplicant.value.letterOfCredit,
      "cbsCntrctLcNum": importBillApplicant.value.cbsCntrctLcNum,
      "lcDate": importBillApplicant.value.lcDate,
      "draftTenor": importBillShipment.value.draftTenor,
      "draftBy": importBillShipment.value.draftBy,
      "draftDays": importBillShipment.value.draftDays,
      "draftCustomerNm": importBillShipment.value.draftCustomerNm,
      "docDt": importBillShipment.value.docDt,
      "isBillEntry": importBillCharge.value.isBillEntry,
      "billRemarks": importBillCharge.value.billRemarks,
      "formPlace": importBillPolicy.value.formPlace,
      "formDt": importBillPolicy.value.formDt,
      "signature": null,
      "othrDoc": null,
      "othrBnkRefNo": importBillOffice.value.othrBnkRefNo,
      "aprvRmrks": null,
      "priority": "LOW",
      "cbsCntrctRefNo": importBillApplicant.value.cbsCntrctRefNo,
      "impBillsStatusId": 1,
      "importBillsStatus": null,
      "error": null,
      "prodCd": null,
      "custNm": null,
      "frmCrDate": null,
      "toCrDate": null,
      "frmCrDateMd": null,
      "toCrDateMd": null,
      "contrefno": null,
      "bills": importBillApplicant.value.bills,
      "wrkInPrgs": false,
      "importBillsCustDtls": importBillApplicant.value.importBillsCustDtls,
      "impBillsSupDrwDtls":
      {
        "supDrweDtlsId": null,
        "cifId": importBillBeneficiary.value.importBillsSupDrwDtlsVo.cifId,
        "name": importBillBeneficiary.value.importBillsSupDrwDtlsVo.name,
        "addr1": importBillBeneficiary.value.importBillsSupDrwDtlsVo.addr1,
        "addr2": importBillBeneficiary.value.importBillsSupDrwDtlsVo.addr2,
        "cntryId": importBillBeneficiary.value.importBillsSupDrwDtlsVo.cntryId,
        "bnfAccNo": importBillBeneficiary.value.importBillsSupDrwDtlsVo.bnfAccNo,
        "auditDetails": null
      },
      "impBillsDrweBnkDtls": importBillBeneficiary.value.importBillsDrweBnkDtlsVo,
      "impBillsShipDtls": {
        "lcShipDtlsId": null,
        "plRcpt": importBillShipment.value.importBillsShipDtlsVo.plRcpt,
        "pol": importBillShipment.value.importBillsShipDtlsVo.pol,
        "pod": importBillShipment.value.importBillsShipDtlsVo.pod,
        "plDlvry": importBillShipment.value.importBillsShipDtlsVo.plDlvry,
        "ltstShpMntDt": importBillShipment.value.importBillsShipDtlsVo.ltstShpMntDt,
        "hsCode": importBillShipment.value.importBillsShipDtlsVo.hsCode,
        "proInvNo": importBillShipment.value.importBillsShipDtlsVo.proInvNo,
        "dgftPolicy": null,
        "impLicNo": null,
        "inCoTerms": importBillShipment.value.importBillsShipDtlsVo.inCoTerms,
        "otherDtls": null,
        "descGdsRmrks": importBillShipment.value.importBillsShipDtlsVo.descGdsRmrks,
        "auditDetails": null,
        "invAmount": ".0",
        "proInvDt": null,
        "shpmntMrks": importBillShipment.value.importBillsShipDtlsVo.shpmntMrks,
        "shpmntInfo": importBillShipment.value.importBillsShipDtlsVo.shpmntInfo,
        "shpmntDtls": importBillShipment.value.importBillsShipDtlsVo.shpmntDtls,
        "carrierNm": importBillShipment.value.importBillsShipDtlsVo.carrierNm,
        "goodsShpmntDt": importBillShipment.value.importBillsShipDtlsVo.goodsShpmntDt,
        "transShpmntAllwd": importBillShipment.value.importBillsShipDtlsVo.transShpmntAllwd,
        "prtlShpmntAllwd": importBillShipment.value.importBillsShipDtlsVo.prtlShpmntAllwd,
        "typeOfGoods": null
      },
      "formCmmnAcc": {
        "formCmmnAccId": null,
        "formAccDtlsList": this.importBillCharge.accDtlsVoList,
        "totAccAmnt": this.importBillCharge.accountDetailTabl1Total,
        "isFrwdCntrct": importBillCharge.value.formCmmnAccVo.isDtlsofFrwdCntrct == true ? 1 : 0,
        "formFrwdCntrctDtlsList": this.importBillCharge.formFrwdCntrctDtlsList,
        "totFrwdCntrct": null,
        "isRtCvrWithTrDr": importBillCharge.value.formCmmnAccVo.isDtlsofFrwdCntrct == true ? 1 : 0,
        "formRtCvrDtlsList": this.importBillCharge.formFrwdCntrctDtlsList,
        "totRtCvrAmnt": this.importBillCharge.utilizeTotal
      },
      "officeUse": {
        "officeUseId": null,
        "accNo": importBillOffice.value.accNo,
        "conscnChrg": importBillOffice.value.conscnChrg,
        "conscnPrcntg": importBillOffice.value.conscnPrcntg,
        "conscnFixdAmnt": importBillOffice.value.conscnFixdAmnt,
        "swiftPrcntg": importBillOffice.value.swiftPrcntg,
        "swiftFixdAmnt": importBillOffice.value.swiftFixdAmnt,
        "isFccAccSetlmnt": 1,
        "fccAccNo": importBillOffice.value.fccAccNo,
        "offcReqDocList": this.importBillBeneficiary.beneficiaryDetailList,
        "officeAttchList": outwardMandatoryDocList,
        "officeDclrtnList": null,
        "officeMisList": null,
        "formRtCvrDtlsOffList": [],
        "dscrpncyObsrvdList": null,
        "instMstList": null,
        "totRtCvrOffAmnt": ".0",
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
      "billOfEntryList": this.importBillCharge.billOfEntryVoList,
      "dscrpncyDtls": importBillBeneficiary.value.dscrpncyDtlsVo,
      "historyList": [],
      "isEditable": false,
      "auditDetails": null
    }
    try {
      if (sampleDataLc.importBillsCustDtls.dpCode.toString().length == 3) {
        sampleDataLc.importBillsCustDtls.dpCode = "0" + sampleDataLc.importBillsCustDtls.dpCode
      }
      if (sampleDataLc.importBillsCustDtls.dpCode.toString().length == 2) {
        sampleDataLc.importBillsCustDtls.dpCode = "00" + sampleDataLc.importBillsCustDtls.dpCode
      }
    } catch (err) {
    }
    return sampleDataLc;
  }
  loadView() {
    this.activatedRoute.paramMap.subscribe(params => {
      const importBillsId = params.get("importBillsId");
      const taskId = params.get("taskId");
      const mode = params.get("mode");
      this.currentMode = params.get("mode");
      let method = this.comservice.getImportBillColView(taskId, importBillsId);

      if (mode == 'edit') {
        method = this.comservice.getImportBillColEdit(taskId, importBillsId);
      }
      if (importBillsId && importBillsId != "") {
        method.subscribe((data: any) => {
          // save logic earlier
          this.savedData = data;
          if (data && data.sysRefNo != '' && data.sysRefNo != null) {
            if (data && data.historyList) {
              if (mode !== 'edit') {
                this.remarkDetails = data.historyList;
              }
            }
            try {
              this.importBillCharge.formFrwdCntrctDtlsList = this.savedData.formCmmnAcc.formFrwdCntrctDtlsList;//pkgltrCrdDtlsVoList
            } catch (error) {

            }
            //save logic earlier ends
            try {
              this.viewData = data;
              this.savedData = data;
              this.ref.detectChanges();
              var formCmmnAcc = this.viewData["formCmmnAcc"];
              var formRtCvrDtlsList: any = [];
              var formRtCvrDtlsList = formCmmnAcc["formRtCvrDtlsList"];
              var marginDtlList = this.viewData["marginDtlList"];
              var billOfEntryVoList = formCmmnAcc["billOfEntryVoList"];
              var officeUsetab = this.viewData["officeUse"];
              var officeUseTable = officeUsetab["offcReqDocList"];
              var officeAttchListTable = officeUsetab['officeAttchList'];
            } catch (err) {
            }
            const importBillCollectionApplicant: any = this.importBillApplicant.importBillApplicantDetail;
            const importBillCollectionCharge: any = this.importBillCharge.billChargeForm;
            const importBillCollectionBeneficiary: any = this.importBillBeneficiary.billBankBenefiacry;
            const importBillCollectionShipment: any = this.importBillShipment.billShipmentForm;
            const importBillCollectionPolicy: any = this.importBillPolicy.billPolicyDetails;
            const importBillCollectionOffice: any = this.importBillOffice.billOfficeform;
            this.importBillOffice.savedData = this.savedData;
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
            importBillCollectionApplicant.patchValue({
              importBillsId: "",
              encImportBillsId: null,
              encTaskId: "",
              taskId: "",
              cbsCntrctRefNo: this.viewData.cbsCntrctRefNo,
              sysRefNo: this.viewData.sysRefNo,
              transRefNo: this.viewData.transRefNo,
              sysRefDt: this.viewData.sysRefDt,
              billPayment: this.viewData.billPayment,
              bills: this.viewData.bills,
              cbsCntrctLcNum: this.viewData.cbsCntrctLcNum,
              lcDate: this.viewData.lcDate,
              whrLcIsRcvByCN: this.viewData.whrLcIsRcvByCN,
              letterOfCredit: this.viewData.letterOfCredit,
              amount: this.viewData.amount,
              currency: this.viewData.currency,
              amntWords: this.viewData.amntWords,
              importBillsCustDtls: this.viewData.importBillsCustDtls,
            });
            importBillCollectionShipment.patchValue({
              draftTenor: this.viewData.draftTenor,
              draftDays: this.viewData.drafdraftDaystTenor,
              draftBy: this.viewData.draftBy,
              draftCustomerNm: this.viewData.draftCustomerNm,
              docDt: this.viewData.docDt,
              importBillsShipDtlsVo: this.viewData.impBillsShipDtls,
            });
            setTimeout(() => {
              this.importBillShipment.loadPurposeDtls();
              this.ref.detectChanges();
            }, 3000);
            this.importBillCharge.accDtlsVoList = this.viewData.formCmmnAcc.formAccDtlsList;
            this.ref.detectChanges();
            importBillCollectionBeneficiary.patchValue({
              billRemarks: this.viewData.billRemarks,
              importBillsSupDrwDtlsVo: this.viewData.impBillsSupDrwDtls,
              importBillsDrweBnkDtlsVo: this.viewData.impBillsDrweBnkDtls,
              dscrpncyDtlsVo: this.viewData.dscrpncyDtls,
            });
            setTimeout(() => {
              try {
                this.importBillBeneficiary.beneficiaryDetailList = this.viewData['officeUse']['offcReqDocList'];
                this.importBillBeneficiary.beneficiaryDetailList.forEach((element: any, index: number) => {
                  this.importBillBeneficiary.docDescList(element, index, () => {
                    this.importBillBeneficiary.getDocCodeList(element, index);
                  });

                });
                this.ref.detectChanges();
              } catch (error) {
              }
            }, 3000);
            try {
              importBillCollectionCharge.patchValue({
                isBillEntry: this.viewData.isBillEntry,
                billRemarks: this.viewData.billRemarks,
              });
              this.ref.detectChanges();
            } catch (error) {

            }
            this.importBillCharge.billOfEntryVoList = billOfEntryVoList
            importBillCollectionPolicy.patchValue({
              formPlace: this.viewData.formPlace,
              formDt: moment(this.viewData.formDt).format('YYYY-MM-DDTHH:mm:ssZZ'),
            });

            importBillCollectionOffice.patchValue({
              accNo: this.viewData.officeUse.accNo,
              spreat: this.viewData.spreat,
              totRtCvrOffAmnt: this.viewData.spreat,
              liboreIntrstRt: this.viewData.liboreIntrstRt,
              officeUse: {
                "officeUseId": null,
                "othrBnkRefNo": this.viewData.othrBnkRefNo,
                "accNo": this.viewData.accNo,
                "conscnChrg": this.viewData.officeUse.conscnChrg,
                "conscnPrcntg": this.viewData.officeUse.conscnPrcntg,
                "conscnFixdAmnt": this.viewData.officeUse.conscnFixdAmnt,
                "swiftPrcntg": this.viewData.officeUse.swiftPrcntg,
                "swiftFixdAmnt": this.viewData.officeUse.swiftFixdAmnt,
                "isFccAccSetlmnt": 1,
                "fccAccNo": this.viewData.officeUse.fccAccNo,
                "offcReqDocList": officeUseTable,
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
                "formCmmnAccId": null,
                "formAccDtlsList": [],
                "totAccAmnt": ".0",
                "isFrwdCntrct": this.viewData.formCmmnAcc.isFrwdCntrct,
                "formFrwdCntrctDtlsList": this.viewData.formCmmnAcc.formFrwdCntrctDtlsList,
                "formRtCvrDtlsList": formRtCvrDtlsList,
              }
            });
            setTimeout(() => {
              try {
                this.importBillOffice.outwardMandatoryDocList.forEach((dt: any, index: any) => {
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
            if (importBillsId != null) {
              if (this.viewData.impBillsStatusId !== 3) {
                this.isApproved = true;
              }
              if (!this.viewData.isEditable) {
                this.disableAllForm();
              }
              try {
                this.ref.detectChanges();
                this.importBillCharge.getUtilizeTotal();
                this.importBillCharge.getConversationDetailForm1Total();
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
  getConversationDetailForm1Total() {
    let total = 0;
    if (this.billOfEntryVoList && this.billOfEntryVoList.length) {
      this.billOfEntryVoList.forEach((element: any) => {
        total += (+element.boeAmnt)
      });
    }
    this.conversationDetailForm1Total = total;
  }
  getUtilizeTotal() {
    let total = 0;
    if (this.formFrwdCntrctDtlsList && this.formFrwdCntrctDtlsList.length) {
      this.formFrwdCntrctDtlsList.forEach((element: any) => {
        total += (+element.amntUtilizd)
      });
    }
  }
  accountDetailTabl1TotalCal() {
    let total = 0;
    this.accountDetailsList.forEach((element: any) => {
      total += (+element.amnt)
    });
    this.accountDetailTabl1Total = total;
  }
  getConversationDetailTotal() {
    let total = 0;
    this.rtCvrDtlsVoListArray.forEach((element: any) => {
      total += (+element.amnt)
    });
    this.conversationDetailTotal = total;
  }
  // isForm1Valid() {
  //   // check if first form is valid
  //   if (!this.importBillApplicant.importBillApplicantDetail.valid) {
  //     this.importBillApplicant.submittedBillApplicant = true;
  //     this.goTo(1);
  //     return 0
  //   }
  //   return 1
  // }
  disableAllForm() { }
  saveDraft() {
    if (!this.onSubmitApp()) {
      this.importBillApplicant.submittedBillApplicant = true;
      this.goTo(1);
      return 0
    }
    if (!this.addOnSubmitshipp()) {
      this.goTo(2);
      return 0
    }
    if (!this.onSubmitbeneFrm()) {
      this.goTo(3);
      return 0
    }

    this.spinner.show();
    // Upload File and set in the data to send 
    const promiseArray: any = [];
    this.importBillOffice.outwardMandatoryDocList.forEach((data: any) => {
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
            var found = this.importBillOffice.outwardMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
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
        this.comservice.saveImportBillColDraft(draftData).subscribe((data: any) => {
          // this.draftdata = data;
          // Hadle Save Data
          this.savedData = data;
          if (data && data.sysRefNo != '' && data.sysRefNo != undefined) {
            this.importBillApplicant.importBillApplicantDetail.patchValue({
              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              importBillsId: data.importBillsId,
              taskId: data.taskId,
            });
            if (data && data.historyList) {
              if (this.currentMode && this.currentMode != "edit") {
                this.remarkDetails = data.historyList;
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
        this.comservice.updateImportBillColDraft(draftData).subscribe((data: any) => {
          this.savedData = data;
          if (data && data.sysRefNo != '') {
            this.importBillApplicant.importBillApplicantDetail.patchValue({
              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              importBillsId: data.importBillsId,
              taskId: data.taskId,
            });
            if (data && data.historyList) {
              if (this.currentMode && this.currentMode != "edit") {
                this.remarkDetails = data.historyList;
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
  get isDraft() {
    if (this.currentMode == 'eidt') {
      return false
    }
    if (this.savedData && this.savedData.impBillsStatusId && this.savedData.impBillsStatusId != "") {
      if ([4].indexOf(this.savedData.impBillsStatusId) != -1) {
        return true;
      }
    }
    if (this.savedData && typeof (this.savedData.transRefNo) == "undefined") {
      return true;
    }
    return false;
  }
  get canUpdate() {
    if (this.savedData && this.savedData.impBillsStatusId && this.savedData.impBillsStatusId != "") {
      if ([3, 4, 7].indexOf(this.savedData.impBillsStatusId) != -1) {
        if (this.currentMode && this.currentMode == "edit") {
          return true;
        }
      }
    }

    return false;
  }
  ngOnInit(): void {

  }
  next() {
    this.stepper.next();
  }
  getCurrency() {
    this.comservice.getCurrency().subscribe(data => {
      this.currency = data;

    })
  }
  getCountry() {
    this.comservice.getCountry().subscribe(data => {
      this.country = data;
    })
  }
  ngAfterViewInit() {
    const stepper4 = this.stepper4.nativeElement;
    this.stepper = new Stepper(stepper4, {
      linear: false,
      animation: true,
    });
    this.getCountry();
    this.getCurrency();
    setTimeout(() => {
      this.ref.detectChanges();
    }, 1000);
    this.loadView();
  }
  toStep(no: any) {
    this.stepper.to(no);
  }
  goTo(no: any) {
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
      this.comservice.ImportBillColApproveForm(this.savedData)
        .subscribe((data) => {
          if (data && data.historyList) {
            this.remarkDetails = data.historyList;
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
  modal_title = "";
  modal_body = "";
  showSuccess(msg: any) {
    this.toastService.show(msg, { classname: 'bg-success text-light', delay: 5000 });
  }
  showDanger(dangerTpl: any) {
    this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 5000 });
  }
  redirectHome() {
    this.router.navigate(['/dashboard/billCollection'])
  }
  get appUserVal() {
    if (this.importBillApplicant && this.importBillApplicant.importBillApplicantDetail) {
      return this.importBillApplicant.importBillApplicantDetail.value;
    }
    return {};
  }
  get isEditable() {
    return this.currentMode == "view" ? true : false;
  }
  get isSaved() {
    return this.appUserVal.sysRefNo != '' ? true : false;
  }
  onSubmitApp() {
    this.importBillApplicant.submittedBillApplicant = true;
    if (this.importBillApplicant.importBillApplicantDetail.valid && this.importBillApplicant.isBillOrPaymentSelected == false) {
      this.next()
      return true;
    }
    return false;
  }
  addOnSubmitshipp() {
    this.importBillShipment.onShipmentFormShipment();
    this.importBillShipment.submittedBillShipment = true;
    if (this.importBillShipment.billShipmentForm.valid == true && this.importBillShipment.getShipmentError() == false && this.importBillApplicant.appUserVal.billPayment != 'FOR_PAYMENT') {
      this.next();
      return true;
    }
    if (this.importBillApplicant.appUserVal.billPayment == 'FOR_PAYMENT') {
      this.next();
      return true;
    }
    return false;
  }

  onSubmitbeneFrm() {
    this.importBillBeneficiary.submitted = true;
    if (this.importBillBeneficiary.onSubmitBankBene() && this.importBillBeneficiary.billBankBenefiacry.valid == true && this.importBillApplicant.appUserVal.billPayment != 'FOR_PAYMENT') {
      this.next();
      return true;
    }
    if (this.importBillApplicant.appUserVal.billPayment == 'FOR_PAYMENT') {
      this.next();
      return true;
    }
    return false;
  }
  onSubmitFormCharg() {
    const isValid = this.importBillCharge.onSubmitBankForm4();
    this.importBillCharge.submitted = true;
    if (isValid == true) {
      this.next();
    }
  }
  onSubmitFormPolicy() {
    this.importBillPolicy.billsubmittedFrom5 = true;
    if (this.importBillPolicy.billPolicyDetails.valid) {
      this.next()
    }
  }

  rejectForm() {
    if (this.rejectremarks != '') {
      this.rejectModalRef.close();
      this.spinner.show();
      this.savedData.aprvRmrks = this.rejectremarks;
      this.comservice.ImportBillColRejectForm(this.savedData)
        .subscribe((data) => {
          if (data && data.historyList) {
            this.remarkDetails = data.historyList;
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
    if (this.savedData && this.savedData.impBillsStatusId && this.savedData.impBillsStatusId != "") {
      if ([3].indexOf(this.savedData.impBillsStatusId) != -1 && (this.savedData.aprvRmrks === '' || this.savedData.aprvRmrks === null)) {
        return true;
      }
    }
    return false;
  }
}
