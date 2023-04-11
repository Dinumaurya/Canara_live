import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import Stepper from 'bs-stepper';
import { AppCommonService } from '@common/services';
import { ToastService } from '../../common';
import { NgxSpinnerService } from 'ngx-spinner';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from '@modules/dashboard/services';
import { ActivatedRoute, Router } from '@angular/router';
import { BillShipmentComponent } from './bill-shipment/bill-shipment.component';
import { BillChargeComponent } from './bill-charge/bill-charge.component';
import { BillPolicyComponent } from './bill-policy/bill-policy.component';
import { BillBankBeneficiaryComponent } from './bill-bank-beneficiary/bill-bank-beneficiary.component';
import { BillApplicantComponent } from './bill-applicant/bill-applicant.component';
import { BillOfficeComponent } from './bill-office/bill-office.component';

@Component({
  selector: 'sb-bill-collection',
  templateUrl: './bill-collection.component.html',
  styleUrls: ['./bill-collection.component.scss']
})
export class BillCollectionComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper4', { static: false }) stepper4: any;
  @ViewChild("content", { static: false }) content: any;
  @ViewChild('billShipment', { static: false }) billShipment!: BillShipmentComponent;
  @ViewChild('billCharge', { static: false }) billCharge!: BillChargeComponent;
  @ViewChild('billPolicy', { static: false }) billPolicy!: BillPolicyComponent;
  @ViewChild('billBeneficiary', { static: false }) billBeneficiary!: BillBankBeneficiaryComponent;
  @ViewChild('billApplicant', { static: false }) billApplicant!: BillApplicantComponent;
  @ViewChild('billOffice', { static: false }) billOffice!: BillOfficeComponent;
  @Output('billAppEvent') billAppEvent = new EventEmitter();

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
  public isEBFA:boolean=false;

  constructor(private comservice: AppCommonService,
    public toastService: ToastService,
    private spinner: NgxSpinnerService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  onSubmitFormm6() {
    if (!this.billApplicant.billApplicantDetail.valid) {
      this.billApplicant.submittedBillApplicant = true;
      this.goTo(1);
      return 0
    }
    if (!this.billShipment.onShipmentFormShipment()) {
       this.goTo(2);
      return 0
    }
    if (!this.billBeneficiary.onSubmitBankBene()) {
      this.goTo(3);
      return 0
    }

    if (!this.billCharge.onSubmitBankForm4()) {
      this.goTo(4);
      return 0
    }
    if (!this.billPolicy.onSubmitBillPolicyForm5()) {
      this.goTo(5);
      return 0
    }
    //
    var validFile = true;
    this.billOffice.outwardMandatoryDocList.forEach((element: any, index: any) => {
      if (element && this.billOffice.isThisFieldRequired(element, index)) {
        validFile = false;
      }
    });
    this.billOffice.onSubmitForm6();
    if (this.billOffice.billOfficeform.valid && validFile) {
      //
      this.spinner.show();
      const promiseArrayBene: any = [];
      this.billBeneficiary.beneficiaryDetailList.forEach((data: any, index: any) => {
        if (data.file && data.file != "") {
          var formData: any = new FormData();
          formData.append('file', data.file);
          formData.append('code', data.docTp);
          promiseArrayBene.push(new Promise((resolve, reject) => {
            this.comservice.saveLCFile(formData)
              .subscribe((data) => {
                resolve(data)
              }, (err) => {
                reject(err)
              })
          }))
        }
      });

      Promise.all(promiseArrayBene)
        .then((valBene: any) => {
          //call db for saving
          const promiseArray: any = [];
          this.billOffice.outwardMandatoryDocList.forEach((data: any) => {
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
                  var found = this.billOffice.outwardMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
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
            if (this.billOffice.outwardMandatoryDocList && this.billOffice.outwardMandatoryDocList.length > 0) {
              if (this.billOffice.viewData && this.billOffice.viewData.officeUse && this.billOffice.viewData.officeUse.officeAttchList.length > 0) {
                this.billOffice.outwardMandatoryDocList.forEach((dt: any, index: any) => {
                  var found = this.billOffice.viewData.officeUse.officeAttchList.find((o: any) => dt.attchCd === o.attchCd);
                  if (found && found.isChckd && found.attchValue != '' && found.attchPath != '') {
                    outwardMandatoryDocList.push(found);
                  }
                });
              }
            }

            if (valBene && valBene[0]) {
              try {
                valBene.forEach((dt: any, index: any) => {
                  this.billBeneficiary.beneficiaryDetailList[index]['docAttchNm'] = dt.docAttchNm;
                })
              } catch (err) {

              }
            }
            if (this.billBeneficiary.beneficiaryDetailList && this.billBeneficiary.beneficiaryDetailList.length > 0) {
              if (this.billOffice.viewData && this.billOffice.viewData.officeUse && this.billOffice.viewData.officeUse.offcReqDocList.length > 0) {
                this.billBeneficiary.beneficiaryDetailList.forEach((dt: any, index: any) => {
                  var found = this.billOffice.viewData.officeUse.offcReqDocList.find((o: any) => dt.attchCd === o.attchCd);
                  if (found && found.attchValue != '' && found.attchPath != '') {
                    this.beneficiaryDetailList.push(found);
                  }
                });
              }
            }

            let sampleDataLc = this.outwardObjData(outwardMandatoryDocList);

            sampleDataLc.exportBillsCustDtls.dpCode = "" + sampleDataLc.exportBillsCustDtls.dpCode;
            if (this.savedData && this.savedData.sysRefNo != '' && this.savedData.sysRefNo != undefined) {
              sampleDataLc.sysRefNo = this.savedData.sysRefNo;
              sampleDataLc.transRefNo = this.savedData.transRefNo;
              // sampleData.isEditable = this.savedData.isEditable ;
              sampleDataLc.exportBillsId = this.savedData.exportBillsId;
              sampleDataLc.taskId = this.savedData.taskId;
            }
            try {
              if (sampleDataLc.exportBillsCustDtls.dpCode.toString().length == 3) {
                sampleDataLc.exportBillsCustDtls.dpCode = "0" + sampleDataLc.exportBillsCustDtls.dpCode
              }
              if (sampleDataLc.exportBillsCustDtls.dpCode.toString().length == 2) {
                sampleDataLc.exportBillsCustDtls.dpCode = "00" + sampleDataLc.exportBillsCustDtls.dpCode
              }
            } catch (err) {
            }

            if (sampleDataLc.sysRefNo === "" && sampleDataLc.transRefNo === "") {
              this.comservice.saveBillForm(sampleDataLc).subscribe(data => {
                this.savedData = data;
                this.billOffice.savedData = data;
                if (data && data.sysRefNo != '') {
                  this.billApplicant.billApplicantDetail.patchValue({

                    sysRefNo: data.sysRefNo,
                    transRefNo: data.transRefNo,
                    isEditable: data.isEditable,
                    exportBillsId: data.exportBillsId,
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

              this.comservice.updateBillForm(sampleDataLc).subscribe(data => {
                this.savedData = data;
                this.billOffice.savedData = data;
                if (data && data.sysRefNo != '') {
                  this.billApplicant.billApplicantDetail.patchValue({

                    sysRefNo: data.sysRefNo,
                    transRefNo: data.transRefNo,
                    isEditable: data.isEditable,
                    exportBillsId: data.exportBillsId,
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
        }).catch((err) => {
          this.spinner.hide();
          this.showSuccess('File upload Failed. Please try again..');
        });;

    }
  }
  get applicantValue() {
    if (this.billApplicant && this.billApplicant.billApplicantDetail) {
      return this.billApplicant.billApplicantDetail.value;

    }
    return {};
  }
  outwardObjData(outwardMandatoryDocList: any) {
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
      })
    }
    const conversionList: any = [];
    if (this.conversionList && this.conversionList.length) {
      this.conversionList.forEach((element: any) => {
        conversionList.push({
          frwdCntrctNo: element.frwdCntrctNo,
          frwdCntrctDtlsId: 2677,
          srNo: "",
          fcy: element.fcy,
          orgnlAmnt: element.orgnlAmnt,
          utlizAmnt: element.utlizAmnt,
          amntUtilizd: element.amntUtilizd,
          frgnBnkChrgs: element.frgnBnkChrgs,
        })
      })
    }
    const conversionList2Table: any = [];
    if (this.conversionList2Table && this.conversionList2Table.length) {
      this.conversionList2Table.forEach((element: any) => {
        conversionList2Table.push({
          pcfcCntractRefNo: element.pcfcCntractRefNo,
          fcy: element.fcy,
          srNo: null,
          loanAmount: element.loanAmount,
          loanAdjst: element.loanAdjst,
          outstdngAmt: element.outstdngAmt,
          amntToBeUtlzed: element.amntToBeUtlzed,
        })
      })
    }
    const accountDetailsList: any = [];
    if (this.accountDetailsList && this.accountDetailsList.length) {
      this.accountDetailsList.forEach((element: any) => {
        accountDetailsList.push({
          accDtlsId: "",
          srNo: 1,
          accNo: element.accNo,
          accTp: element.accTp,
          fcy: element.fcy,
          amnt: element.amnt,
        })
      })
    }
    const beneficiaryDetailList: any = [];
    if (this.beneficiaryDetailList && this.beneficiaryDetailList.length) {
      this.beneficiaryDetailList.forEach((element: any) => {
        beneficiaryDetailList.push({
          accDtlsId: "",
          srNo: 1,
          accNo: element.accNo,
          accTp: element.accTp,
          fcy: element.fcy,
          amnt: element.amnt,
        })
      })
    }
    const insMstVoList: any = [];
    if (this.insMstVoList && this.insMstVoList.length) {
      this.insMstVoList.forEach((element: any) => {
        insMstVoList.push({
          instMstSNo: element.instMstSNo,
          instMstCode: element.instMstCode,
          instMstDesc: element.instMstDesc,
        })
      })
    }
    const otherbankDetails: any = [];
    if (this.otherbankDetails && this.otherbankDetails.length) {
      this.otherbankDetails.forEach((element: any) => {
        otherbankDetails.push({
          eFIRCRefNo: element.eFIRCRefNo,
          srNo: null,
          fcy: element.fcy,
          oriAmntOthr: element.oriAmntOthr,
          utiAmntOthr: element.utiAmntOthr,
        })
      })
    }
    const canarabankDetails: any = [];
    if (this.canarabankDetails && this.canarabankDetails.length) {
      this.canarabankDetails.forEach((element: any) => {
        canarabankDetails.push({
          cntctRefNum: element.cntctRefNum,
          srNo: null,
          fcy: element.fcy,
          oriAmnt: element.oriAmnt,
          utiAmnt: element.utiAmnt,
        })
      })
    }

    const billApplicant: any = this.billApplicant.billApplicantDetail;
    const billCharge: any = this.billCharge.billChargeForm;
    const billBeneficiary: any = this.billBeneficiary.billBankBenefiacry;
    const billShipment: any = this.billShipment.billShipmentForm;
    const billPolicy: any = this.billPolicy.billPolicyDetails;
    const billOffice: any = this.billOffice.billOfficeform;


    var sampleDataLc = {
      "exportBillsId": '',
      "taskId": '',
      "encExportBillsId": '',
      "encTaskId": '',
      "docDt": billShipment.value.docDt,
      "sysRefNo": '',
      "transRefNo": '',
      "sysRefDt": '',
      "appRefDt": '',
      "formPlace": billPolicy.value.formPlace,
      "formDt": billPolicy.value.formDt,
      "signature": null,
      "isBillEntry": billBeneficiary.value.isBillEntry,
      "isCanaraBnk": billCharge.value.isCanaraBnk,
      "currency": billApplicant.value.currency,
      "othrCurrency": null,
      "amount": billApplicant.value.amount,
      "amntWords": billApplicant.value.amntWords,
      "dclTxt": billPolicy.value.dclTxt,
      "bills": billApplicant.value.bills,
      "billpurchs": billApplicant.value.billpurchs,
      "letterOfCredit": billApplicant.value.letterOfCredit,
      "auditDetails": null,
      "exportBillsCustDtls": {
        "formCustDtlsId": null,
        "custId": billApplicant.value.exportBillsCustDtlsVo.custId,
        "accNo": billApplicant.value.exportBillsCustDtlsVo.accNo,
        "brnchNm": billApplicant.value.exportBillsCustDtlsVo.brnchNm,
        "dpCode": billApplicant.value.exportBillsCustDtlsVo.dpCode,
        "custNm": billApplicant.value.exportBillsCustDtlsVo.custNm,
        "address1": billApplicant.value.exportBillsCustDtlsVo.address1,
        "address2": billApplicant.value.exportBillsCustDtlsVo.address2,
        "address3": billApplicant.value.exportBillsCustDtlsVo.address3,
        "cntryId": billApplicant.value.exportBillsCustDtlsVo.cntryId,
        "stateId": null,
        "pinCode": null,
        "telNo": billApplicant.value.exportBillsCustDtlsVo.telNo,
        "mobNo": billApplicant.value.exportBillsCustDtlsVo.mobNo,
        "eMail": billApplicant.value.exportBillsCustDtlsVo.eMail,
        "altEmail": billApplicant.value.exportBillsCustDtlsVo.altEmail,
        "panNo": billApplicant.value.exportBillsCustDtlsVo.panNo,
        "ieCode": billApplicant.value.exportBillsCustDtlsVo.ieCode,
      },
      "expBillsShipDtls": {
        "lcShipDtlsId": null,
        "plRcpt": billShipment.value.exportBillsShipDtlsVo.plRcpt,
        "pol": billShipment.value.exportBillsShipDtlsVo.pol,
        "pod": billShipment.value.exportBillsShipDtlsVo.pod,
        "plDlvry": billShipment.value.exportBillsShipDtlsVo.plDlvry,
        "ltstShpMntDt": billShipment.value.exportBillsShipDtlsVo.ltstShpmntDt,
        "hsCode": billShipment.value.exportBillsShipDtlsVo.hsCode,
        "hsDesc": billShipment.value.exportBillsShipDtlsVo.hsDesc,
        "proInvNo": billShipment.value.exportBillsShipDtlsVo.proInvNo,
        "dgftPolicy": null,
        "impLicNo": null,
        "inCoTerms": billShipment.value.exportBillsShipDtlsVo.inCoTerms,
        "otherDtls": null,
        "descGdsRmrks": billShipment.value.exportBillsShipDtlsVo.descGdsRmrks,
        "auditDetails": null,
        "invAmount": null,
        "proInvDt": null,
        "shpmntMrks": billShipment.value.exportBillsShipDtlsVo.shpmntMrks,
        "shpmntInfo": null,
        "shpmntDtls": null,
        "carrierNm": billShipment.value.exportBillsShipDtlsVo.carrierNm,
        "goodsShpmntDt": null,
        "transShpmntAllwd": billShipment.value.exportBillsShipDtlsVo.transShpmntAllwd === true ? 'TRNS_SHP_ALLWD' : null,
        "prtlShpmntAllwd": billShipment.value.exportBillsShipDtlsVo.prtlShpmntAllwd === true ? 'PRTL_SHP_ALLWD' : null,
        "typeOfGoods": null
      },
      "expBillDtls": null,
      "expBillsSupDrwDtls": {
        "supDrweDtlsId": null,
        "cifId": billBeneficiary.value.exportBillsSupDrwDtlsVo.cifId,
        "name": billBeneficiary.value.exportBillsSupDrwDtlsVo.name,
        "addr1": billBeneficiary.value.exportBillsSupDrwDtlsVo.addr1,
        "addr2": billBeneficiary.value.exportBillsSupDrwDtlsVo.addr2,
        "cntryId": billBeneficiary.value.exportBillsSupDrwDtlsVo.cntryId,
        "bnfAccNo": null,
        "auditDetails": null
      },
      "expBillsDrweBnkDtls": {
        "drweBnkDtlsId": null,
        "cifId": billBeneficiary.value.exportBillsDrweBnkDtlsVo.cifId,
        "drweBnkNm": billBeneficiary.value.exportBillsDrweBnkDtlsVo.drweBnkNm,
        "addr1": billBeneficiary.value.exportBillsDrweBnkDtlsVo.addr1,
        "addr2": billBeneficiary.value.exportBillsDrweBnkDtlsVo.addr2,
        "cntryId": billBeneficiary.value.exportBillsDrweBnkDtlsVo.cntryId,
        "swiftCode": billBeneficiary.value.exportBillsDrweBnkDtlsVo.swiftCode,
        "isSwiftCodeNotAvl": null,
        "swiftBnkNm": null,
        "swiftBnkAddr1": null,
        "swiftBnkAddr2": null,
        "swiftBnkAbacd": null,
        "swiftBnkAbaCdDesc": null,
        "swftCntryId": null,
        "interSwiftCode": null,
        "drweAccNo": null,
        "auditDetails": null
      },
      "pkgCrdtInFrnCrrncies": this.billCharge.conversionList2Table,
      "formCmmnAcc": {
        "formCmmnAccId": null,
        "formAccDtlsList": this.billCharge.accountDetailsList,
        "totAccAmnt": ".0",
        "isFrwdCntrct": billCharge.value.formCmmnAccVo.isDtlsofFrwdCntrct == true ? 1 : 0,
        "formFrwdCntrctDtlsList": this.billCharge.conversionList,
        "totFrwdCntrct": null,
        "isRtCvrWithTrDr": billOffice.value.formCmmnAccVo.isRtCvrWithTrDr == true ? 1 : 0,
        "formRtCvrDtlsList": this.billOffice.rtCvrDtlsVoListArray,
        "totRtCvrAmnt": this.billOffice.conversationDetailTotal,
      },
      "officeUse": {
        "officeUseId": null,
        "accNo": billOffice.value.officeUseVo.accNo,
        "conscnChrg": billOffice.value.officeUseVo.cncssionChrg,
        "conscnPrcntg": billOffice.value.officeUseVo.cncssionPrcntg,
        "conscnFixdAmnt": billOffice.value.officeUseVo.cncssionFixdAmnt,
        "swiftPrcntg": billOffice.value.officeUseVo.swiftPrcntg,
        "swiftFixdAmnt": billOffice.value.officeUseVo.swiftFixdAmnt,
        "isFccAccSetlmnt": billOffice.value.officeUseVo.isFccAccStlment,
        "fccAccNo": billOffice.value.officeUseVo.fccAccNo,
        "offcReqDocList": this.billBeneficiary.beneficiaryDetailList,
        "officeAttchList": outwardMandatoryDocList,
        "officeDclrtnList": null,
        "officeMisList": null,
        "formRtCvrDtlsOffList": null,
        "dscrpncyObsrvdList": this.billOffice.dscrpncyObsrvdList,
        "instMstList": this.billOffice.insMstVoList,
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
      "dscrpncyDtls": {
        "dscrpncyDtlsId": null,
        "isGdsDsc": null,
        "dscrpncyGdsDsc": null,
        "isinvNo": null,
        "dscrpncyInvNo": null,
        "isplRcpt": null,
        "dscrpncyPlRcpt": null,
        "isPol": null,
        "dscrpncyPol": null,
        "isPod": null,
        "dscrpncyPod": null,
        "isPlDlvry": null,
        "dscrpncyPlDlvry": null,
        "isDiscrpntLC": billBeneficiary.value.dscrpncyDtlsVo.isDiscrpntLC,
        "cifId": billBeneficiary.value.dscrpncyDtlsVo.cifId,
        "name": billBeneficiary.value.dscrpncyDtlsVo.name,
        "addr1": billBeneficiary.value.dscrpncyDtlsVo.addr1,
        "addr2": billBeneficiary.value.dscrpncyDtlsVo.addr2,
        "cntryId": billBeneficiary.value.dscrpncyDtlsVo.cntryId,
        "auditDetails": null
      },
      "postShipFinDtlList": this.billShipment.conversionList,
      "dtlOfShpgBill": null,
      "expBillOthrDtls": {
        "exportOthrDtlBillsId": null,
        "pcfcNum": null,
        "bankName": billCharge.value.expBillOthrDtlsVo.bankName,
        "accNum": billCharge.value.expBillOthrDtlsVo.accNum,
        "swiftCode": billCharge.value.expBillOthrDtlsVo.swiftCode,
        "interSwiftCode": billCharge.value.expBillOthrDtlsVo.interSwiftCode,
        "bnkName": billCharge.value.expBillOthrDtlsVo.bnkName,
        "fullAdd": billCharge.value.expBillOthrDtlsVo.fullAdd,
        "abaCode": billCharge.value.expBillOthrDtlsVo.abaCode,
        "swiftBnkAbaCdDesc": billCharge.value.expBillOthrDtlsVo.swiftBnkAbaCdDesc,
        "isNOCfrmBnksAv": null,
        "isSwftCodeNotAvl": billCharge.value.expBillOthrDtlsVo.isSwftCodeNotAvl == true ? 1 : 0,
        "swftfullAdd": null,
        "auditDetails": null
      },
      "invdRmdcList": this.billCharge.canarabankDetails,
      "invdRmdcOrList": this.billCharge.otherbankDetails,
      "expbillOfEntryList": this.billBeneficiary.billOfEntryVoList,
      "totalPsLoanAmt": ".0",
      "whrLcIsRcvByCN": billApplicant.value.whrLcIsRcvByCN,
      "lcNum": billApplicant.value.lcNum,
      "lcDate": billApplicant.value.lcDate,
      "draftTenor": billShipment.value.draftTenor,
      "draftBy": billShipment.value.draftBy,
      "draftDays": billShipment.value.draftDays,
      "draftCustomerNm": billShipment.value.draftCustomerNm,
      "billRemarks": billBeneficiary.value.billRemarks,
      "isPreSpmtAvl": billCharge.value.isPreSpmtAvl == true ? 1 : 0,
      "pcfcNum": billCharge.value.pcfcNum,
      "isNocPreSpmtAvl": billCharge.value.isNocPreSpmtAvl == true ? 1 : 0,
      "othrBnkRefNo": billOffice.value.othrBnkRefNo,
      "pckgCrdtTotl": this.billCharge.conversionList2TableeTotal,
      "isPckgCredit": billCharge.value.isPckgCredit == true ? 1 : 0,
      "prodCd": null,
      "othrDoc": null,
      "brd": billApplicant.value.brd,
      "intrstRt": billOffice.value.liboreIntrstRt,
      "expSpreat": billOffice.value.expSpreat,
      "aprvRmrks": null,
      "priority": "LOW",
      "expBillsStatusId": 3,
      "wrkInPrgs": false,
      "historyBeanList": [],
      "isEditable": false,
      "custNm": null,
      "expBillsStatus": null
    }
    sampleDataLc.exportBillsCustDtls.dpCode = "" + sampleDataLc.exportBillsCustDtls.dpCode;
    if (this.savedData && this.savedData.sysRefNo != '' && this.savedData.sysRefNo != undefined) {
      sampleDataLc.sysRefNo = this.savedData.sysRefNo;
      sampleDataLc.transRefNo = this.savedData.transRefNo;
      sampleDataLc.exportBillsId = this.savedData.exportBillsId;
      sampleDataLc.taskId = this.savedData.taskId;
    }
    try {
      if (sampleDataLc.exportBillsCustDtls.dpCode.toString().length == 3) {
        sampleDataLc.exportBillsCustDtls.dpCode = "0" + sampleDataLc.exportBillsCustDtls.dpCode
      }
      if (sampleDataLc.exportBillsCustDtls.dpCode.toString().length == 2) {
        sampleDataLc.exportBillsCustDtls.dpCode = "00" + sampleDataLc.exportBillsCustDtls.dpCode
      }
    } catch (err) {
    }
    return sampleDataLc;
  }
  loadView() {
    this.activatedRoute.paramMap.subscribe(params => {
      const exportBillsId = params.get("exportBillsId");
      const taskId = params.get("taskId");
      const mode = params.get("mode");
      this.currentMode = params.get("mode");
      let method = this.comservice.getBillView(taskId, exportBillsId);
      if (mode == 'edit') {
        method = this.comservice.getBillEdit(taskId, exportBillsId);
      }
      if (exportBillsId && exportBillsId != "") {
        method.subscribe((data: any) => {
          this.savedData = data;
          if (data && data.sysRefNo != '' && data.sysRefNo != null) {
            if (data && data.historyBeanList) {
              if (mode !== 'edit') {
                this.remarkDetails = data.historyBeanList;
              }
            }
            try {
              this.viewData = data;
              this.savedData = data;
              this.billOffice.savedData = data;
              this.ref.detectChanges();
              var formCmmnAcc = this.viewData["formCmmnAcc"];
              var formRtCvrDtlsList: any = []
              var formRtCvrDtlsList = formCmmnAcc["formRtCvrDtlsList"]
              var officeUsetab = this.viewData["officeUse"]
              var officeUseTable = officeUsetab["offcReqDocList"]
              var postShipFinDtlListTable = this.viewData["postShipFinDtlList"]
              var expbillOfEntryListTable = this.viewData["expbillOfEntryList"]
              var invdRmdcListTable = this.viewData["invdRmdcList"]
              var invdRmdcOrListTable = this.viewData["invdRmdcOrList"]
              var formAccDtlsListTable = formCmmnAcc["formAccDtlsList"]
              var frwdCntrctDtlsVoListTable = formCmmnAcc["formFrwdCntrctDtlsList"]
              var pkgCrdtInFrnCrrnciesTable = this.viewData["pkgCrdtInFrnCrrncies"]
              var dscrpncyObsrvdListTable = officeUsetab["dscrpncyObsrvdList"]

            } catch (err) {
            }
            const billApplicant: any = this.billApplicant.billApplicantDetail;
            const billCharge: any = this.billCharge.billChargeForm;
            const billBeneficiary: any = this.billBeneficiary.billBankBenefiacry;
            const billShipment: any = this.billShipment.billShipmentForm;
            const billPolicy: any = this.billPolicy.billPolicyDetails;
            const billOffice: any = this.billOffice.billOfficeform;


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
            billApplicant.patchValue({
              sysRefNo: this.viewData.sysRefNo,
              transRefNo: this.viewData.transRefNo,
              sysRefDt: this.viewData.sysRefDt,
              bills: this.viewData.bills,
              lcNum: this.viewData.lcNum,
              lcDate: this.viewData.lcDate,
              whrLcIsRcvByCN: this.viewData.whrLcIsRcvByCN,
              letterOfCredit: this.viewData.letterOfCredit,
              brd: this.viewData.brd,
              amount: this.viewData.amount,
              currency: this.viewData.currency,
              amntWords: this.viewData.amntWords,
              billpurchs: this.viewData.billpurchs,
              exportBillsCustDtlsVo: {
                accNo: this.viewData.exportBillsCustDtls.accNo,
                address1: this.viewData.exportBillsCustDtls.address1,
                address2: this.viewData.exportBillsCustDtls.address2,
                address3: this.viewData.exportBillsCustDtls.address3,
                altEmail: this.viewData.exportBillsCustDtls.altEmail,
                brnchNm: this.viewData.exportBillsCustDtls.brnchNm,
                cntryId: this.viewData.exportBillsCustDtls.cntryId,
                custId: this.viewData.exportBillsCustDtls.custId,
                custNm: this.viewData.exportBillsCustDtls.custNm,
                dpCode: this.viewData.exportBillsCustDtls.dpCode,
                eMail: this.viewData.exportBillsCustDtls.eMail,
                formCustDtlsId: null,
                ieCode: this.viewData.exportBillsCustDtls.ieCode,
                mobNo: this.viewData.exportBillsCustDtls.mobNo,
                panNo: this.viewData.exportBillsCustDtls.panNo,
                pinCode: null,
                stateId: null,
                telNo: this.viewData.exportBillsCustDtls.telNo,
              },
            });
            billShipment.patchValue({
              draftTenor: this.viewData.draftTenor,
              draftDays: this.viewData.draftDays,
              draftBy: this.viewData.draftBy,
              draftCustomerNm: this.viewData.draftCustomerNm,
              docDt: this.viewData.docDt,
              exportBillsShipDtlsVo: {
                hsCode: this.viewData.expBillsShipDtls.hsCode,
                descGdsRmrks: this.viewData.expBillsShipDtls.descGdsRmrks,
                proInvNo: this.viewData.expBillsShipDtls.proInvNo,
                plRcpt: this.viewData.expBillsShipDtls.plRcpt,
                pol: this.viewData.expBillsShipDtls.pol,
                pod: this.viewData.expBillsShipDtls.pod,
                plDlvry: this.viewData.expBillsShipDtls.plDlvry,
                carrierNm: this.viewData.expBillsShipDtls.carrierNm,
                inCoTerms: this.viewData.expBillsShipDtls.inCoTerms,
                ltstShpmntDt: this.viewData.expBillsShipDtls.ltstShpMntDt,
                shpmntMrks: this.viewData.expBillsShipDtls.shpmntMrks,
                transShpmntAllwd: this.viewData.expBillsShipDtls.transShpmntAllwd === 'TRNS_SHP_ALLWD' ? true : false,
                prtlShpmntAllwd: this.viewData.expBillsShipDtls.prtlShpmntAllwd === 'PRTL_SHP_ALLWD' ? true : false,

              },

            });
            setTimeout(() => {
              try {
                this.billOffice.outwardMandatoryDocList.forEach((dt: any, index: any) => {
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
            setTimeout(() => {
              try {
                this.billBeneficiary.beneficiaryDetailList = this.viewData['officeUse']['offcReqDocList'];
                this.billBeneficiary.beneficiaryDetailList.forEach((element: any, index: number) => {
                  this.billBeneficiary.docDescList(element, index, () => {
                    this.billBeneficiary.getDocCodeList(element, index);
                  });

                });
                this.ref.detectChanges();
              } catch (error) {
              }
            }, 3000);
            billBeneficiary.patchValue({
              billRemarks: this.viewData.billRemarks,
              isBillEntry: this.viewData.isBillEntry,
              exportBillsSupDrwDtlsVo: {
                name: this.viewData.expBillsSupDrwDtls.name,
                cntryId: this.viewData.expBillsSupDrwDtls.cntryId,
                addr2: this.viewData.expBillsSupDrwDtls.addr2,
                addr1: this.viewData.expBillsSupDrwDtls.addr1,
                cifId: this.viewData.expBillsSupDrwDtls.cifId,
              },
              exportBillsDrweBnkDtlsVo: {
                cifId: this.viewData.expBillsDrweBnkDtls.cifId,
                drweBnkNm: this.viewData.expBillsDrweBnkDtls.drweBnkNm,
                cntryId: this.viewData.expBillsDrweBnkDtls.cntryId,
                addr2: this.viewData.expBillsDrweBnkDtls.addr2,
                addr1: this.viewData.expBillsDrweBnkDtls.addr1,
                swiftCode: this.viewData.expBillsDrweBnkDtls.swiftCode,
              },
              dscrpncyDtlsVo: {
                isDiscrpntLC: this.viewData.dscrpncyDtls.isDiscrpntLC,
                name: this.viewData.dscrpncyDtls.name,
                cntryId: this.viewData.dscrpncyDtls.cntryId,
                addr2: this.viewData.dscrpncyDtls.addr2,
                addr1: this.viewData.dscrpncyDtls.addr1,
                cifId: this.viewData.dscrpncyDtls.cifId,
              },
            });
            setTimeout(() => {
              // this.exportShipment.loadPurposeDtls();
              this.ref.detectChanges();

            }, 3000);
            try {
              billCharge.patchValue({
                isPreSpmtAvl: this.viewData.isPreSpmtAvl,
                isPckgCredit: this.viewData.isPckgCredit,
                pcfcNum: this.viewData.pcfcNum,
                isNocPreSpmtAvl: this.viewData.isNocPreSpmtAvl,
                isCanaraBnk: this.viewData.isCanaraBnk,
                formCmmnAccVo: {
                  isDtlsofFrwdCntrct: this.viewData.isDtlsofFrwdCntrct,
                },
                expBillOthrDtlsVo: {
                  bankName: this.viewData.bankName,
                  accNum: this.viewData.accNum,
                  swiftCode: this.viewData.swiftCode,
                  interSwiftCode: this.viewData.interSwiftCode,
                  isSwftCodeNotAvl: this.viewData.isSwftCodeNotAvl,
                  bnkName: this.viewData.bnkName,
                  fullAdd: this.viewData.fullAdd,
                  abaCode: this.viewData.abaCode,
                  swiftBnkAbaCdDesc: this.viewData.swiftBnkAbaCdDesc,
                },
              })
              this.ref.detectChanges();
            } catch (error) {

            }

            this.billOffice.rtCvrDtlsVoListArray = formRtCvrDtlsList
            this.billShipment.conversionList = postShipFinDtlListTable
            this.billBeneficiary.billOfEntryVoList = expbillOfEntryListTable
            this.billCharge.canarabankDetails = invdRmdcListTable
            this.billCharge.otherbankDetails = invdRmdcOrListTable
            this.billCharge.accountDetailsList = formAccDtlsListTable
            this.billCharge.conversionList = frwdCntrctDtlsVoListTable
            this.billCharge.conversionList2Table = pkgCrdtInFrnCrrnciesTable
            this.ref.detectChanges();
            billPolicy.patchValue({
              dclTxt: this.viewData.dclTxt,
              formPlace: this.viewData.formPlace,
              formDt: this.viewData.formDt,
            });

            billOffice.patchValue({
              expSpreat: this.viewData.expSpreat,
              liboreIntrstRt: this.viewData.intrstRt,
              othrBnkRefNo: this.viewData.othrBnkRefNo,
              formCmmnAccVo: {
                "formCmmnAccId": null,
                "formAccDtlsList": [],
                "totAccAmnt": ".0",
                "isFrwdCntrct": 0,
                "formFrwdCntrctDtlsList": null,
                "totFrwdCntrct": null,
                "isRtCvrWithTrDr": this.viewData.formCmmnAcc.isRtCvrWithTrDr,
                "formRtCvrDtlsList": [
                ],
                "totRtCvrAmnt": "1000.0"
              },
              officeUse: {
                "officeUseId": null,
                "accNo": this.viewData.officeUse.accNo,
                "conscnChrg": this.viewData.officeUse.conscnChrg,
                "conscnPrcntg": this.viewData.officeUse.conscnPrcntg,
                "conscnFixdAmnt": this.viewData.officeUse.conscnFixdAmnt,
                "swiftPrcntg": this.viewData.officeUse.swiftPrcntg,
                "swiftFixdAmnt": this.viewData.officeUse.swiftFixdAmnt,
                "isFccAccSetlmnt": this.viewData.officeUse.isFccAccSetlmnt,
                "fccAccNo": this.viewData.officeUse.fccAccNo,
                "offcReqDocList": officeUseTable,
                "officeAttchList": this.viewData.officeUse.officeAttchList,
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
            });

            if (exportBillsId != null) {
              if (this.viewData.expBillsStatusId !== 3) {
                this.isApproved = true;
              }
              if (!this.viewData.isEditable) {
                this.disableAllForm();
              }
              try {
                this.ref.detectChanges();
                this.billCharge.accountDetailTabl1TotalCal();
                this.billCharge.getConversationDetailForm1Total();
                this.billCharge.getConversationDetailForm2Total();
                this.billOffice.getConversationDetailTotal();
                this.billShipment.getConversationDetailForm1Total();

              } catch (err) {
              }
            }
          }
        })
      }
    }, error => {
    });
  }
  getConversationDetailForm2Total() {
    let total = 0;
    if (this.conversionList2Table && this.conversionList2Table.length) {
      this.conversionList2Table.forEach((element: any) => {
        total += (+element.outstdngAmt)
      });
    }
    this.conversionList2TableeTotal = total;
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
  saveDraft() {

    if (!this.billApplicant.billApplicantDetail.valid) {
      this.billApplicant.submittedBillApplicant = true;
      this.goTo(1);
      return 0
    }
    if (!this.billBeneficiary.onSubmitBankBene()) {
      this.goTo(2);
      return 0
    }
    if (!this.billShipment.billShipmentForm.valid) {
      if (["BIL_PURCHS_COLCTN", "SUB_SEQ_DSCNT"].indexOf(this.shipmentMessage) != -1) {
        if (this.billShipment.conversionList.length == 0 || this.billShipment.conversionList.length == null) {
          this.billShipment.submittedBillShipment = true;
          this.goTo(3);
          return 0
        }
      } else {
        this.billShipment.submittedBillShipment = true;
        this.goTo(3);
        return 0
      }
    }

    this.spinner.show();
    // Upload File and set in the data to send 
    const promiseArray: any = [];
    this.billOffice.outwardMandatoryDocList.forEach((data: any) => {
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
              var found = this.billOffice.outwardMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
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
          this.comservice.saveBillDraft(draftData).subscribe((data: any) => {
            // this.draftdata = data;
            // Hadle Save Data
            this.savedData = data;

            if (data && data.sysRefNo != '' && data.sysRefNo != undefined) {
              this.billApplicant.billApplicantDetail.patchValue({
                sysRefNo: data.sysRefNo,
                transRefNo: data.transRefNo,
                isEditable: data.isEditable,
                exportBillsId: data.exportBillsId,
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
          this.comservice.updateBillDraft(draftData).subscribe((data: any) => {
            this.savedData = data;
            if (data && data.sysRefNo != '') {
              this.billApplicant.billApplicantDetail.patchValue({
                sysRefNo: data.sysRefNo,
                transRefNo: data.transRefNo,
                isEditable: data.isEditable,
                exportBillsId: data.exportBillsId,
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
  disableAllForm() {

    this.billCharge.billChargeForm.disable()
    this.billApplicant.billApplicantDetail.disable()
    this.billBeneficiary.billBankBenefiacry.disable()
    this.billOffice.billOfficeform.disable()
    this.billShipment.billShipmentForm.disable()
    this.billPolicy.billPolicyDetails.disable()
  }

  onChangeevent(event: any) {
    var  BtnVal=event.target.value;
    if (BtnVal =="ADV_PYMNT_RCVD") {
      this.isEBFA=true;
    } else{
      this.isEBFA=false;
    }
    }

  get isDraft() {
    if (this.currentMode == 'eidt') {
      return false
    }
    if (this.savedData && this.savedData.expBillsStatusId && this.savedData.expBillsStatusId != "") {
      if ([4].indexOf(this.savedData.expBillsStatusId) != -1) {
        return true;
      }
    }
    if (this.savedData && typeof (this.savedData.transRefNo) == "undefined") {
      return true;
    }
    return false;
  }
  get canUpdate() {
    if (this.savedData && this.savedData.expBillsStatusId && this.savedData.expBillsStatusId != "") {
      if ([3, 4, 7].indexOf(this.savedData.expBillsStatusId) != -1) {
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
      this.comservice.billApproveForm(this.savedData)
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
  modal_title = "";
  modal_body = "";
  showSuccess(msg: any) {
    this.toastService.show(msg, { classname: 'bg-success text-light', delay: 5000 });
  }
  showDanger(dangerTpl: any) {
    this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 5000 });
  }
  redirectHome() {
    this.router.navigate(['/dashboard/outward/bill']);
  }
  get appUserVal() {
    if (this.billApplicant && this.billApplicant.billApplicantDetail) {
      return this.billApplicant.billApplicantDetail.value;
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
    this.billApplicant.onSubmitApp();
    this.billApplicant.submittedBillApplicant = true;
    if (this.billApplicant.billApplicantDetail.value.bills == 'DIRCT_EXPRT_BIL') {
      this.billAppEvent.emit(this.billApplicant.billApplicantDetail.value.bills)
      this.parentMessage = this.billApplicant.billApplicantDetail.value.bills;
    } else if (this.billApplicant.billApplicantDetail.value.bills == 'BIL_PURCHS_COLCTN') {
      this.shipmentMessage = this.billApplicant.billApplicantDetail.value.bills;
    } else if (this.billApplicant.billApplicantDetail.value.bills == 'SUB_SEQ_DSCNT') {
      this.shipmentMessage = this.billApplicant.billApplicantDetail.value.bills;
    }
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.billApplicant.billApplicantDetail.valid) {
        this.next()
      } else if (this.parentMessage == 'DIRCT_EXPRT_BIL') {
        this.next();
      }
    }
  }
  addOnSubmitshipp() {
    if (this.billShipment.onShipmentFormShipment()) {
      this.next()
    }
  }

  onSubmitbeneFrm() {
    if (this.billBeneficiary.onSubmitBankBene()) {
      this.next()
    }
  }
  onSubmitFormCharg() {
    if (this.billCharge.onSubmitBankForm4()) {
      this.next()
    }
  }
  onSubmitFormPolicy() {
    if (this.billPolicy.onSubmitBillPolicyForm5()) {
      this.next()
    }
  }

  rejectForm() {
    if (this.rejectremarks != '') {
      this.rejectModalRef.close();
      this.spinner.show();
      this.savedData.aprvRmrks = this.rejectremarks;
      this.comservice.billRejectForm(this.savedData)
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
    if (this.savedData && this.savedData.expBillsStatusId && this.savedData.expBillsStatusId != "") {
      if ([3].indexOf(this.savedData.expBillsStatusId) != -1 && (this.savedData.aprvRmrks === '' || this.savedData.aprvRmrks === null)) {
        return true;
      }
    }
    return false;
  }
}
