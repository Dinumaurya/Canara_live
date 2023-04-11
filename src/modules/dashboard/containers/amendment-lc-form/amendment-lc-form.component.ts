import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { DashboardService } from '@modules/dashboard/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Stepper from 'bs-stepper';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../common';
import { AmendLcApplicantComponent } from './amend-lc-applicant/amend-lc-applicant.component';
import { AmendLcOfficeComponent } from './amend-lc-office/amend-lc-office.component';
import { AmendLcShipmentComponent } from './amend-lc-shipment/amend-lc-shipment.component';

@Component({
  selector: 'sb-amendment-lc-form',
  templateUrl: './amendment-lc-form.component.html',
  styleUrls: ['./amendment-lc-form.component.scss']
})
export class AmendmentLcFormComponent implements OnInit {
  public stepper: any;
  currentMode: any;

  viewData: any = [];

  amount: any;
  @ViewChild("content", { static: false }) content: any;

  @ViewChild('amendApplicant', { static: false }) amendApplicant!: AmendLcApplicantComponent;
  @ViewChild('amendShipment', { static: false }) amendShipment!: AmendLcShipmentComponent;
  @ViewChild('amendOffice', { static: false }) amendOffice!: AmendLcOfficeComponent;

  @ViewChild('stepper7', { static: false }) stepper7: any;

  modal_title = "";
  modal_body = "";
  country = [];
  currency = [];
  approveModalRef: any;
  public rejectremarks: any = '';
  @ViewChild("contentbodyred", { static: false }) contentbodyred: any;

  rejectModalRef: any;
  approveremarks: any = '';
  savedData: any = [];
  public remarkDetails: any = [];
  public isApproved = false;
  public isRejected = false;
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
  form4Submitted(e: any) {
    this.next();
  }
  next() {
    this.stepper.next();
  }
  saveDraft() { }

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
  ngAfterViewInit() {
    const stepper7 = this.stepper7.nativeElement;
    this.stepper = new Stepper(stepper7, {
      linear: false,
      animation: true,
    });
    this.getCountry();
    this.getCurrency();

    // this.loadView();

  }
  get AppUserVal() {
    if (this.amendApplicant && this.amendApplicant.lcappUserDetails) {
      return this.amendApplicant.lcappUserDetails.value;
    }
    return {};
  }
  get isSaved() {
    return this.AppUserVal.sysRefNo != '' ? true : false;
  }

  onSubmitApp() {
    this.amendApplicant.onSubmitApp();
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.amendApplicant.lcappUserDetails.valid) {
        this.next()
      }
    }
    this.amendApplicant.submittedlcForm1 = true;
  }
  get canAppRej() {
    if (this.savedData && this.savedData.lcStatusId && this.savedData.lcStatusId != "") {
      if ([3].indexOf(this.savedData.lcStatusId) != -1 && (this.savedData.aprvRmrks === '' || this.savedData.aprvRmrks === null)) {
        return true;
      }
    }
    return false;
  }

  toStep(no: any) {
    this.stepper.to(no);
  }
  onSubmitlcshipp() {
    this.amendShipment.onSubmitShipApp();
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.amendShipment.amendShipmentDetails.valid) {
        this.next()
      }
    }
    this.amendShipment.submittedlcForm2 = true;
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
  approveForm() {
    if (this.approveremarks != '') {
      this.approveModalRef.close();
      this.spinner.show();
      this.savedData.aprvRmrks = this.approveremarks;
      this.comservice.lcApproveForm(this.savedData)
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

  showSuccess(msg: any) {
    this.toastService.show(msg, { classname: 'bg-success text-light', delay: 5000 });
  }
  disableAllForm() {
    // this.charge.lcChargeDetails.disable()
    // this.applicant.lcappUserDetails.disable()
    // this.beneficiary.lcaccountDetails.disable()
    // this.office.officeform.disable()
    // this.shipment.lcshipmentDetails.disable()
    // this.policy.policyform.disable()
  }
  goTo(no: any) {
    this.stepper.to(no);
  }
  onSubmitFormm6() {
    console.log("kkkkkkkkkkk");

    // if (!this.amendApplicant.lcappUserDetails.valid) {
    //   this.amendApplicant.submittedlcForm1 = true;
    //   this.goTo(1);
    //   return 0
    // }

    // if (!this.amendShipment.amendShipmentDetails.valid) {
    //   this.amendShipment.submittedlcForm2 = true;
    //   this.goTo(3);
    //   return 0
    // }

    var validFile = false;
    this.amendOffice.outwardMandatoryDocList.forEach((element: any, index: any) => {
      if (element && this.isThisFieldRequired(element, index)) {
        validFile = true;
      }
    });
    this.amendOffice.onSubmitApp();
    // if (!validFile) {
    if (this.amendOffice.lcOfficeEmbedform.valid) {
      this.spinner.show();
      const promiseArray: any = [];

      Promise.all(promiseArray).then((valBene: any) => {
        //call db for saving
        const promiseArray: any = [];
        this.amendOffice.outwardMandatoryDocList.forEach((data: any) => {
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
                var found = this.amendOffice.outwardMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
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
          if (this.amendOffice.outwardMandatoryDocList && this.amendOffice.outwardMandatoryDocList.length > 0) {
            if (this.amendOffice.viewData && this.amendOffice.viewData.officeUse && this.amendOffice.viewData.officeUse.officeAttchList.length > 0) {
              this.amendOffice.outwardMandatoryDocList.forEach((dt: any, index: any) => {
                var found = this.amendOffice.viewData.officeUse.officeAttchList.find((o: any) => dt.attchCd === o.attchCd);
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

          // sampleDataLc.pcfcCustDtls.dpCode = "" + sampleDataLc.pcfcCustDtls.dpCode;
          if (this.savedData && this.savedData.sysRefNo != '' && this.savedData.sysRefNo != undefined) {
            sampleDataLc.sysRefNo = this.savedData.sysRefNo;
            sampleDataLc.transRefNo = this.savedData.transRefNo;
            // sampleData.isEditable = this.savedData.isEditable ;
            sampleDataLc.lcaaFormId = this.savedData.lcaaFormId;
            sampleDataLc.taskId = this.savedData.taskId;
          }


          if (sampleDataLc.sysRefNo === "" && sampleDataLc.transRefNo === "") {
            this.comservice.saveLCAmendForm(sampleDataLc).subscribe(data => {
              this.savedData = data;
              this.amendOffice.savedData = this.savedData;
              if (data && data.sysRefNo != '') {
                this.amendApplicant.lcappUserDetails.patchValue({
                  sysRefNo: data.sysRefNo,
                  transRefNo: data.transRefNo,
                  isEditable: data.isEditable,
                  lcaaFormId: data.lcaaFormId,
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
              this.amendOffice.savedData = this.savedData;
              if (data && data.sysRefNo != '') {
                this.amendApplicant.lcappUserDetails.patchValue({
                  sysRefNo: data.sysRefNo,
                  transRefNo: data.transRefNo,
                  isEditable: data.isEditable,
                  lcaaFormId: data.lcaaFormId,
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
      });

    }
    // } else {
    //   setTimeout(() => {
    //     this.spinner.hide();
    //     this.ref.detectChanges();
    //     this.modal_body = 'You forgot to select a file.';
    //     this.modalService.open(this.content, { size: 'sm' });
    //   }, 2000);
    // }
  }

  showDanger(dangerTpl: any) {
    this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 5000 });
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
  rejectForm() {
    if (this.rejectremarks != '') {
      this.rejectModalRef.close();
      this.spinner.show();
      this.savedData.aprvRmrks = this.rejectremarks;
      this.comservice.lcRejectForm(this.savedData)
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
  get isEditable() {
    return this.currentMode == "view" ? true : false;
  }
  /**
* Generates JSON that need to be send
* @param outwardMandatoryDocList 
*/
  outwardObjData(outwardMandatoryDocList: any) {


    const amendApplicant: any = this.amendApplicant.lcappUserDetails;
    const amendShipment: any = this.amendShipment.amendShipmentDetails;
    const amendOffice: any = this.amendOffice.lcOfficeEmbedform;

    var sampleDataLc = { "lcaaFormId": "", "taskId": "", "sysRefNo": "", "transRefNo": "", "sysRefDt": "", "appRefDt": "", "lcaCustDtls": { "accNo": "1588201001268", "address1": "20 1 SITE IV INDUSTRIAL AREA", "address2": "SAHIBABAD", "address3": "GHAZIABAD", "altEmail": "", "brnchNm": "BRANCH", "custId": 13961989, "custNm": "FAIREXPORT", "dpCode": "1588", "eMail": "najimdn@fairexports.net", "ieCode": "0391146670", "mobNo": "919810062291", "panNo": "AAACF3799A", "telNo": "" }, "lcaTransThrgh": "OTHR_BNK", "currency": "4", "amount": 40, "amntWords": "forty ", "lcaTransBnk": { "bnkNm": "BANKNAME", "fullAddr": "adddd", "fullAddr1": "ddd", "fullAddr2": "ddd", "cntryId": "15", "swiftCode": "KABADKKK" }, "othrTransBnk": { "bnkNm": "HDFC", "fullAddr": "Addd1", "fullAddr1": "Addd1", "fullAddr2": "Addd2", "cntryId": "IN", "swiftCode": "HDFC1231" }, "lcaBnfDtls": { "name": "lca Beneficiary", "addr1": "Add1", "addr2": "Add2", "addr3": "", "cntryNm": "KZ" }, "isAgree": 1, "formPlace": "dfsdfsdf", "formDt": "2021-08-28T09:07:22.000Z", "insCmpny": "asdasd", "policyNo": "sasd", "policyAmount": "33", "formCoverDt": "2021-08-26T09:07:14.000Z", "formEndDt": "2021-08-28T09:07:15.000Z", "draftTenor": "USANCE", "tpSecurity": "OTHER", "priority": "", "lcaChrgDtls": { "accOf": "BENEFICIARY", "prdPresentation": "3", "chrgCnfrm": "WITH", "cnfrmChrsAccOf": "APPLICANT", "pymntInstruc": "xczxc", "sndrRcvrInfo": "zxczx", "docReq": "zxcz", "addCondition": "xczxczx" }, "lcaShipDtls": { "descGdsRmrks": "xcasasdasd", "dgftPolicy": "IMP_LIC_NO", "hsCode": "504", "hsDesc": "Default", "impLicNo": "asdasdsa", "inCoTerms": "CIF", "ltstShpMntDt": "2021-08-25T09:06:28.000Z", "plDlvry": "qwewqe", "plRcpt": "weqwe", "pod": "qweqw", "pol": "weqw", "proInvNo": "asd" }, "lcaaFormDtls": { "tollerance": "3", "tolAvlWith": "ANY_BNK", "bnkNm": "", "swiftCode": "", "tolAvlBy": "NEGOTIATION", "defPymntRmrks": "", "mixPymntRmrks": "", "draftTenor": "USANCE", "tpSecurity": "OTHER", "draftBy": "AFTER", "draftDays": "1", "partialShipment": "NOT_PERMITTED", "transShipment": "NOT_PERMITTED", "expiryDate": "2021-09-04T09:05:05.000Z", "placeExpiry": "dsdfsd" }, "officeUse": { "offcReqDocList": [{ "docTp": "TRANSPORT", "docDesc": "AIRWAY BILL", "docCd": "AIRWAY BILL", "noOfOrgnls": "1", "noOfCopies": "1", "docRefNo": "1", "docDt": "2021-08-28T09:05:52.000Z", "atchmnt": "", "file": {}, "docTpReqq": false, "docDescReq": false, "docCdReqq": false, "noOfOrgnlsReqq": false, "docDtReqq": false, "atchmntReqq": false, "noOfCopiesReqq": false, "docRefNoReqq": false, "docAttchNm": "20210805_11584563690240903_TRANSPORT.pdf" }], "officeAttchList": [{ "docAttchNm": "20210805_11584569153118444_STMPD_lca_APP.pdf", "attchCd": "STMPD_lca_APP", "isChckd": 1 }], "officeDclrtnList": [], "officeMisList": [] } }

    return sampleDataLc;
  }
  get canUpdate() {
    if (this.savedData && this.savedData.lcStatusId && this.savedData.lcStatusId != "") {
      if ([3, 4, 7].indexOf(this.savedData.lcStatusId) != -1) {
        if (this.currentMode && this.currentMode == "edit") {
          return true;
        }
      }
    }

    return false;
  }

  get isDraft() {
    if (this.currentMode == 'view') {
      return false
    }
    if (this.savedData && this.savedData.lcStatusId && this.savedData.lcStatusId != "") {
      if ([4].indexOf(this.savedData.lcStatusId) != -1) {
        return true;
      }
    }
    if (this.savedData && typeof (this.savedData.transRefNo) == "undefined") {
      return true;
    }

    return false;
  }


}