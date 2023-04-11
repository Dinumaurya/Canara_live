import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { DashboardService } from '@modules/dashboard/services';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Stepper from 'bs-stepper';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../common';
import { OfficedetailComponent } from './formspages/officedetail/officedetail.component';
import {ChargedetailComponent } from './formspages/chargedetail/chargedetail.component';
import { ApplicantdetailComponent} from './formspages/applicantdetail/applicantdetail.component';
import { BenedetailComponent } from './formspages/benedetail/benedetail.component';
import { ShipdetailComponent} from './formspages/shipdetail/shipdetail.component';
import { PoliComponent } from './formspages/poli/poli.component';

@Component({
  selector: 'sb-inlandlcform',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inlandlcform.component.html',
  styleUrls: ['./inlandlcform.component.scss']
})
export class InlandlcformComponent implements OnInit, AfterViewInit {
  @ViewChild("content", { static: false }) content: any;
  @ViewChild('stepper1', { static: false }) stepper1: any;
  @ViewChild('shipment', { static: false }) shipment!: ShipdetailComponent;
  @ViewChild('charge', { static: false }) charge!: ChargedetailComponent;
  @ViewChild('policy', { static: false }) policy!: PoliComponent;
  @ViewChild('beneficiary', { static: false }) beneficiary!: BenedetailComponent;
  @ViewChild('applicant', { static: false }) applicant!: ApplicantdetailComponent;
  @ViewChild('office', { static: false }) office!: OfficedetailComponent;
  @Output() fileChangeEvent = new EventEmitter<string>();
  @Output('charappEventgeEvent') appEvent = new EventEmitter();
  savedData: any = [];
  currentMode: any;
  viewData: any = [];
  accountDetailTable: any = [];
  beneficiaryDetailList: any = [];
  firstTable: any = [];
  submitted = false;
  public approveModalRef: any;
  public accountDetailsList: any = [];
  public accountDetailTabl1Total = 0;
  public conversionList: any = [];
  public conversionRateList: any = [];
  public beneficiaryList: any = [];
  public conversionDetailsRemitance: any = [];
  public stepper: any;
  public remarkDetails: any = [];
  public rejectremarks: any = '';
  public isApproved = false;
  public isRejected = false;
  country = [];
  currency = [];
  accounttype = [];
  purposecode: any = [];
  selected = false;
  checkedInfo: any;
  table: any;
  isChecked: boolean = true;
  checked: boolean = true;
  conversationDetailForm1Total = 0;
  conversationDetailTotal = 0;
  public obj: any = {};
  public amountval: any
  submittedlcForm1: boolean = false;
  public approveremarks: any = '';
  public rejectModalRef: any;
  rtCvrDtlsVoListArray: any = [];
  constructor(private ref: ChangeDetectorRef,
    public toastService: ToastService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    public router: Router,
    public fh: FormHelperService,
    private comservice: AppCommonService, private activatedRoute: ActivatedRoute,
    private dashboardService: DashboardService) {
  }

  accountDetailTabl1TotalCal() {
    let total = 0;
    this.accountDetailsList.forEach((element: any) => {
      total += (+element.amount)
    });
    this.accountDetailTabl1Total = total;
  }
  next() {
    this.stepper.next();
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
  ngOnInit() {
    this.comservice.purposeCode().subscribe(result => {
      this.purposecode = result;
    })
    this.dashboardService.getSecondtable().subscribe(result => {
      this.firstTable = result.arrayfirstTable;
    })
    this.dashboardService.gettableValue().subscribe(result => {
      this.beneficiaryDetailList = result.arraytable;
    })
  }

  ngAfterViewInit() {
    const stepper1 = this.stepper1.nativeElement;
    this.stepper = new Stepper(stepper1, {
      linear: false,
      animation: true,
    });
    this.comservice.accountType().subscribe(data => {
      this.accounttype = data;
    })
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


  get isSaved() {
    return this.AppUserVal.sysRefNo != '' ? true : false;
  }
  onSubmitApp() {
    this.applicant.onSubmitApp();
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.applicant.lcappUserDetails.valid) {
        this.next()
      }
    }
    this.applicant.submittedlcForm1 = true;
  }
  onSubmitFrm() {
    var dt: any = this.beneficiary.onSubmitForm2();
    this.beneficiary.submittedlcForm2 = true;
    if (this.isSaved == true) {
      this.next();
    } else {
      if (dt == true) {
        this.next()
      }
    }
  }
  onSubmitlcshipp() {
    this.shipment.onSubmitlcship();
    this.shipment.submittedlcFormship = true;
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.shipment.lcshipmentDetails.valid) {
        this.next()
      }
    }
  }
  onSubmitFormCharg() {
    this.charge.onSubmitForm4();
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.charge.lcChargeDetails.valid) {
        this.next()
      }
    }
  }
  onSubmitFormPolicy() {
    this.policy.onSubmitForm5();
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.policy.policyform.valid) {
        this.next()
      }
    }
  }

  modal_title = "";
  modal_body = "";
  goTo(no: any) {
    this.stepper.to(no);
  }

  onSubmitFormlc() {
    if (!this.applicant.lcappUserDetails.valid) {
      this.applicant.submittedlcForm1 = true;
      this.goTo(1);
      return 0
    }
    if (!this.beneficiary.lcaccountDetails.valid) {
      this.beneficiary.submittedlcForm2 = true;
      this.goTo(2);
      return 0
    }
    if (!this.shipment.lcshipmentDetails.valid) {
      this.shipment.submittedlcFormship = true;
      this.goTo(3);
      return 0
    }
    if (!this.charge.lcChargeDetails.valid) {
      this.charge.submittedlcForm4 = true;
      this.goTo(4);
      return 0
    }

    var validFile = true;
    this.office.outwardMandatoryDocList.forEach((element: any, index: any) => {
      if (element && this.office.isThisFieldRequired(element, index)) {
        validFile = false;
      }
    });
    this.office.onSubmitForm6();
    if (this.office.officeform.valid && validFile) {
      this.spinner.show();
      const promiseArray: any = [];
      this.beneficiary.beneficiaryDetailList.forEach((data: any, index: any) => {
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
        const promiseArray: any = [];
        this.office.outwardMandatoryDocList.forEach((data: any) => {
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
                var found = this.office.outwardMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
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
          if (this.office.outwardMandatoryDocList && this.office.outwardMandatoryDocList.length > 0) {
            if (this.office.viewData && this.office.viewData.officeUse && this.office.viewData.officeUse.officeAttchList.length > 0) {
              this.office.outwardMandatoryDocList.forEach((dt: any, index: any) => {
                var found = this.office.viewData.officeUse.officeAttchList.find((o: any) => dt.attchCd === o.attchCd);
                if (found && found.isChckd && found.attchValue != '' && found.attchPath != '') {
                  outwardMandatoryDocList.push(found);
                }
              });
            }
          }

          if (valBene && valBene[0]) {
            try {
              valBene.forEach((dt: any, index: any) => {
                this.beneficiary.beneficiaryDetailList[index]['docAttchNm'] = dt.docAttchNm;
              })
            } catch (err) {

            }
          }
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
          sampleDataLc.lcCustDtls.dpCode = "" + sampleDataLc.lcCustDtls.dpCode;
          if (this.savedData && this.savedData.sysRefNo != '' && this.savedData.sysRefNo != undefined) {
            sampleDataLc.sysRefNo = this.savedData.sysRefNo;
            sampleDataLc.transRefNo = this.savedData.transRefNo;
            sampleDataLc.lcFormId = this.savedData.lcFormId;
            sampleDataLc.taskId = this.savedData.taskId;
          }
          try {
            if (sampleDataLc.lcCustDtls.dpCode.toString().length == 3) {
              sampleDataLc.lcCustDtls.dpCode = "0" + sampleDataLc.lcCustDtls.dpCode
            }
            if (sampleDataLc.lcCustDtls.dpCode.toString().length == 2) {
              sampleDataLc.lcCustDtls.dpCode = "00" + sampleDataLc.lcCustDtls.dpCode
            }
          } catch (err) {
          }
          if (sampleDataLc.sysRefNo === "" && sampleDataLc.transRefNo === "") {
            this.comservice.saveLcForm(sampleDataLc).subscribe(data => {
              this.savedData = data;
              if (data && data.sysRefNo != '') {
                this.applicant.lcappUserDetails.patchValue({
                  sysRefNo: data.sysRefNo,
                  transRefNo: data.transRefNo,
                  isEditable: data.isEditable,
                  lcFormId: data.lcFormId,
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
            this.comservice.updateLcForm(sampleDataLc).subscribe(data => {
              this.savedData = data;
              if (data && data.sysRefNo != '') {
                this.applicant.lcappUserDetails.patchValue({

                  sysRefNo: data.sysRefNo,
                  transRefNo: data.transRefNo,
                  isEditable: data.isEditable,
                  lcFormId: data.lcFormId,
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

  get canAppRej() {
    if (this.savedData && this.savedData.lcStatusId && this.savedData.lcStatusId != "") {
      if ([3].indexOf(this.savedData.lcStatusId) != -1 && (this.savedData.aprvRmrks === '' || this.savedData.aprvRmrks === null)) {
        return true;
      }
    }
    return false;
  }

  redirectHome() {
    this.router.navigate(['/dashboard/outward/lcform'])
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


  outwardObjData(outwardMandatoryDocList: any) {

    const accountDetailTable: any = [];
    this.accountDetailTable.forEach((element: any) => {
      accountDetailTable.push({
        sNo: moment(element.sNo).format('YYYY-MM-DDTHH:mm:ssZZ'),
        margin: element.margin,
        deposit: element.deposit
      })
    });
    const applicant: any = this.applicant.lcappUserDetails;
    const charge: any = this.charge.lcChargeDetails;
    const beneficiary: any = this.beneficiary.lcaccountDetails.value;
    const shipment: any = this.shipment.lcshipmentDetails;
    const pilocy: any = this.policy.policyform;
    const applicantValue = applicant.value
    try {
      const fnd: any = this.beneficiary.beneficiaryList.find((x: any) => (x.beneId == beneficiary.lCBnfDtlsVo.name));
      if (fnd) {
        beneficiary.lCBnfDtlsVo.name = fnd.beneNam;
      }
    } catch (err) {

    }
    var sampleDataLc = {
      lcFormId: "",
      taskId: "",
      sysRefNo: "",
      transRefNo: "",
      sysRefDt: "",
      appRefDt: "",
      lcCustDtls: applicantValue.lcCustDtls,
      lcTransThrgh: applicantValue.lcTransThrgh,
      currency: applicantValue.currency,
      amount: +applicantValue.amount,
      amntWords: applicantValue.amntWords,
      lcTransBnk: applicantValue.lcTransBnk,
      othrTransBnk: {
        cifId: beneficiary.othrTransBnkVo.cifId,
        bnkNm: beneficiary.othrTransBnkVo.bnkNm,
        fullAddr: beneficiary.othrTransBnkVo.fullAddr,
        fullAddr1: beneficiary.othrTransBnkVo.fullAddr1,
        fullAddr2: beneficiary.othrTransBnkVo.fullAddr2,
        cntryId: beneficiary.othrTransBnkVo.cntryId,
        swiftCode: beneficiary.othrTransBnkVo.swiftCode,
      },
      lCBnfDtls: {
        cifId: beneficiary.lCBnfDtlsVo.cifId,
        name: beneficiary.lCBnfDtlsVo.name,
        addr1: beneficiary.lCBnfDtlsVo.addr1,
        addr2: beneficiary.lCBnfDtlsVo.addr2,
        addr3: beneficiary.lCBnfDtlsVo.addr3,
        cntryNm: beneficiary.lCBnfDtlsVo.cntryNm
      },
      isAgree: pilocy.value.isAgree == true ? 1 : 0,
      formPlace: pilocy.value.formPlace,
      formDt: pilocy.value.formDt,
      insCmpny: pilocy.value.insCmpny,
      policyNo: pilocy.value.policyNo,
      policyAmount: pilocy.value.policyAmnt,
      formCoverDt: pilocy.value.coverDate,
      formEndDt: pilocy.value.endDate,
      draftTenor: beneficiary.draftTenor,
      tpSecurity: beneficiary.tpSecurity,
      priority: "",
      lCChrgDtls: {
        accOf: charge.value.lCChrgDtlsVo.accOf,
        prdPresentation: charge.value.lCChrgDtlsVo.prdPresentation,
        chrgCnfrm: charge.value.lCChrgDtlsVo.chrgCnfrm,
        cnfrmChrsAccOf: charge.value.lCChrgDtlsVo.cnfrmChrsAccOf,
        pymntInstruc: charge.value.lCChrgDtlsVo.pymntInstruc,
        sndrRcvrInfo: charge.value.lCChrgDtlsVo.sndrRcvrInfo,
        docReq: charge.value.lCChrgDtlsVo.docReq,
        addCondition: charge.value.lCChrgDtlsVo.addCondition,
      },
      lCShipDtls:
      {
        descGdsRmrks: shipment.value.lCShipDtlsVo.descGdsRmrks,
        dgftPolicy: shipment.value.lCShipDtlsVo.dgftPolicy,
        hsCode: shipment.value.lCShipDtlsVo.hsCode,
        hsDesc: shipment.value.lCShipDtlsVo.hsDesc,
        impLicNo: shipment.value.lCShipDtlsVo.impLicNo,
        inCoTerms: shipment.value.lCShipDtlsVo.inCoTerms,
        ltstShpMntDt: shipment.value.lCShipDtlsVo.ltstShpMntDt,
        otherDtls: shipment.value.lCShipDtlsVo.otherDtls,
        plDlvry: shipment.value.lCShipDtlsVo.plDlvry,
        plRcpt: shipment.value.lCShipDtlsVo.plRcpt,
        pod: shipment.value.lCShipDtlsVo.pod,
        pol: shipment.value.lCShipDtlsVo.pol,
        proInvNo: shipment.value.lCShipDtlsVo.proInvNo,
      },
      lCFormDtls: {
        tollerance: beneficiary.tollerance,
        tolAvlWith: beneficiary.tolAvlWith,
        bnkNm: beneficiary.bnkNm,
        swiftCode: beneficiary.swiftCode,
        tolAvlBy: beneficiary.tolAvlBy,
        defPymntRmrks: beneficiary.defPymntRmrks,
        mixPymntRmrks: beneficiary.mixPymntRmrks,
        draftTenor: beneficiary.draftTenor,
        tpSecurity: beneficiary.tpSecurity,
        draftBy: beneficiary.draftBy,
        beforeDays: beneficiary.beforeDays,
        draftDays: beneficiary.draftDays,
        draftCustNm: beneficiary.draftCustNm,
        partialShipment: beneficiary.partialShipment,
        transShipment: beneficiary.transShipment,
        expiryDate: beneficiary.expiryDate,
        placeExpiry: beneficiary.placeExpiry,
      },
      marginDtlList: this.firstTable,
      officeUse: {
        offcReqDocList: this.beneficiary.beneficiaryDetailList,
        officeAttchList: outwardMandatoryDocList,
        officeDclrtnList: [],
        officeMisList: [],
      }
    }
    try {
      sampleDataLc.officeUse.offcReqDocList.forEach((dt: any) => {
        delete dt.docList;
      });
    } catch (error) {}
    sampleDataLc.lcCustDtls.dpCode = "" + sampleDataLc.lcCustDtls.dpCode;
    if (this.savedData && this.savedData.sysRefNo != '' && this.savedData.sysRefNo != undefined) {
      sampleDataLc.sysRefNo = this.savedData.sysRefNo;
      sampleDataLc.transRefNo = this.savedData.transRefNo;
      sampleDataLc.lcFormId = this.savedData.lcFormId;
      sampleDataLc.taskId = this.savedData.taskId;
    }
    try {
      if (sampleDataLc.lcCustDtls.dpCode.toString().length == 3) {
        sampleDataLc.lcCustDtls.dpCode = "0" + sampleDataLc.lcCustDtls.dpCode
      }
      if (sampleDataLc.lcCustDtls.dpCode.toString().length == 2) {
        sampleDataLc.lcCustDtls.dpCode = "00" + sampleDataLc.lcCustDtls.dpCode
      }
    } catch (err) {
    }
    return sampleDataLc;
  }
  isForm1Valid() {
    if (!this.applicant.lcappUserDetails.valid) {
      this.goTo(1);
      return 0
    }
    return 1
  }
  mandatory3Tab = "";
  saveDraft() {
    if (this.isForm1Valid() == 0) {
      return 0
    }
    if (this.beneficiary.lcaccountDetails.value.tolAvlWith == ""
      || this.beneficiary.lcaccountDetails.value.tolAvlWith == null) {
      this.mandatory3Tab = "This field is required";
      this.goTo(2);
      return 0
    }
    this.spinner.show();
    // Upload File and set in the data to send 
    const promiseArray: any = [];
    this.office.outwardMandatoryDocList.forEach((data: any) => {
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
            var found = this.office.outwardMandatoryDocList.find((o: any) => dt.docAttchNm.indexOf(o.attchCd) !== -1);
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
        this.comservice.lcSaveDraft(draftData).subscribe((data: any) => {
          // Hadle Save Data
          this.savedData = data;
          if (data && data.sysRefNo != '' && data.sysRefNo != undefined) {
            this.applicant.lcappUserDetails.patchValue({
              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              lcFormId: data.lcFormId,
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
        this.comservice.lcUpdateDraft(draftData).subscribe((data: any) => {
          this.savedData = data;
          if (data && data.sysRefNo != '') {
            this.applicant.lcappUserDetails.patchValue({
              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              lcFormId: data.lcFormId,
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
  disableAllForm() {
    this.charge.lcChargeDetails.disable()
    this.applicant.lcappUserDetails.disable()
    this.beneficiary.lcaccountDetails.disable()
    this.office.officeform.disable()
    this.shipment.lcshipmentDetails.disable()
    this.policy.policyform.disable()
  }
  get AppUserVal() {
    if (this.applicant && this.applicant.lcappUserDetails) {
      return this.applicant.lcappUserDetails.value;
    }
    return {};
  }
  get AppUserBeneficiary() {
    return this.beneficiary.lcaccountDetails.valid;
  }
  inputChange(event: any) {
    this.amountval = this.convertNumberToWords(event.target.value)
  }
  convertNumberToWords(amount: any) {
    return this.fh.convertNumberToWords(amount);
  }
  showDanger(dangerTpl: any) {
    this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 5000 });
  }
  loadView() {
    this.activatedRoute.paramMap.subscribe(params => {
      const lcFormId = params.get("lcFormId");
      const taskId = params.get("taskId");
      const mode = params.get("mode");
      this.currentMode = params.get("mode");
      let method = this.comservice.getLcView(taskId, lcFormId);
      if (mode == 'edit') {
        method = this.comservice.getLcEdit(taskId, lcFormId);
      }
      if (lcFormId && lcFormId != "") {
        method.subscribe((data: any) => {
          // save logic earlier
          this.savedData = data;
          if (data && data.sysRefNo != '' && data.sysRefNo != null) {
            if (data && data.historyBeanList) {
              if (mode !== 'edit') {
                this.remarkDetails = data.historyBeanList;
              }
            }
            //save logic earlier ends
            try {
              this.viewData = data;
              this.savedData = data;
              this.office.savedData = data;
              this.ref.detectChanges();
              var marginDtlList = this.viewData["marginDtlList"];
              var formFrwdCntrctDtlsListt: any = []
              var formRtCvrDtlsListt: any = []
              var officeUsetab = this.viewData["officeUse"]
              var officeUseTable = officeUsetab["offcReqDocList"]
              var marginDtlListTable = marginDtlList["accountDetailTable"]
              this.rtCvrDtlsVoListArray = formRtCvrDtlsListt
            } catch (err) {
            }
            this.conversionList = formFrwdCntrctDtlsListt
            const applicant: any = this.applicant.lcappUserDetails;
            const charge: any = this.charge.lcChargeDetails;
            const beneficiary: any = this.beneficiary.lcaccountDetails;
            const shipment: any = this.shipment.lcshipmentDetails;
            const pilocy: any = this.policy.policyform;
            const office: any = this.office.officeform;
            try {
              this.beneficiaryDetailList.forEach((element: any) => {

                this.beneficiaryDetailList.push({
                  docTp: element.docTp,
                  docDesc: element.docDesc,
                  docCd: element.docCd,
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
                this.beneficiary.beneficiaryDetailList = this.viewData['officeUse']['offcReqDocList'];
                this.beneficiary.beneficiaryDetailList.forEach((element: any, index: any) => {
                  this.beneficiary.docDescList(element, index);
                  this.beneficiary.getDocCodeList(element, index);
                });

                this.beneficiary.accountDetailTable = this.viewData.marginDtlList;
                this.ref.detectChanges();
              } catch (error) {
              }
            }, 3000);
            this.ref.detectChanges();
            setTimeout(() => {
              try {
                this.office.outwardMandatoryDocList.forEach((dt: any, index: any) => {
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

            this.accountDetailTable.forEach((element: any) => {
              accountDetailTable.push({
                sNo: moment(element.sNo).format('YYYY-MM-DDTHH:mm:ssZZ'),
                margin: element.margin,
                deposit: element.deposit
              })
            });
            applicant.patchValue({
              lcFormId: "",
              taskId: "",
              sysRefNo: this.viewData.sysRefNo,
              transRefNo: this.viewData.transRefNo,
              sysRefDt: moment(this.viewData.sysRefDt).format('YYYY-MM-DDTHH:mm:ssZZ'),
              appRefDt: "",
              lcTransThrgh: this.viewData.lcTransThrgh,
              lcCustDtls: this.viewData.lcCustDtls,
              lcTransBnk: this.viewData.lcTransBnk,
              currency: this.viewData.currency,
              amount: this.viewData.amount,
              amntWords: this.viewData.amntWords,
            });
            try {
              charge.patchValue({
                lCChrgDtlsVo: {
                  accOf: this.viewData.lCChrgDtls.accOf,
                  prdPresentation: this.viewData.lCChrgDtls.prdPresentation,
                  chrgCnfrm: this.viewData.lCChrgDtls.chrgCnfrm,
                  cnfrmChrsAccOf: this.viewData.lCChrgDtls.cnfrmChrsAccOf,
                  pymntInstruc: this.viewData.lCChrgDtls.pymntInstruc,
                  sndrRcvrInfo: this.viewData.lCChrgDtls.sndrRcvrInfo,
                  docReq: this.viewData.lCChrgDtls.docReq,
                  addCondition: this.viewData.lCChrgDtls.addCondition,
                }
              });

              this.ref.detectChanges();
            } catch (error) {

            }

            beneficiary.patchValue({
              bnkNm: this.viewData.lCFormDtls.bnkNm,
              marginDtlList: marginDtlListTable,
              officeUse: {
                offcReqDocList: officeUseTable,
                docList: officeUseTable,
                officeAttchList: {
                  rowIndx: 0,
                  attchId: null,
                  encAttchId: null,
                  attchCd: "STMPD_LC_APP",
                  attchNm: "",
                  isChckd: 1
                },
                officeDclrtnList: [],
                officeMisList: [],
              },
              // bnkswiftCls:this.viewData.bnkswiftCls,
              defPymntRmrks: this.viewData.lCFormDtls.defPymntRmrks,
              draftBy: this.viewData.lCFormDtls.draftBy,
              draftCustomerNm: this.viewData.lCFormDtls.draftCustomerNm,
              draftDays: this.viewData.lCFormDtls.draftDays,
              draftTenor: this.viewData.lCFormDtls.draftTenor,
              expiryDate: this.viewData.lCFormDtls.expiryDate,
              beforeDays: this.viewData.lCFormDtls.beforeDays,
              draftCustNm: this.viewData.lCFormDtls.draftCustNm,
              lCBnfDtlsVo: this.viewData.lCBnfDtls,
              othrTransBnkVo: this.viewData.othrTransBnk,
              partialShipment: this.viewData.lCFormDtls.partialShipment,
              placeExpiry: this.viewData.lCFormDtls.placeExpiry,
              swiftCode: this.viewData.lCFormDtls.swiftCode,
              tolAvlBy: this.viewData.lCFormDtls.tolAvlBy,
              tolAvlWith: this.viewData.lCFormDtls.tolAvlWith,
              tollerance: this.viewData.lCFormDtls.tollerance,
              tpSecurity: this.viewData.lCFormDtls.tpSecurity,
              transShipment: this.viewData.lCFormDtls.transShipment,

            });
            setTimeout(() => {
              this.shipment.loadPurposeDtls();
              this.ref.detectChanges();

            }, 3000);
            shipment.patchValue({
              lCShipDtlsVo: {
                descGdsRmrks: this.viewData.lCShipDtls.descGdsRmrks,
                dgftPolicy: this.viewData.lCShipDtls.dgftPolicy,
                hsCode: this.viewData.lCShipDtls.hsCode,
                hsDesc: this.viewData.lCShipDtls.hsDesc,
                impLicNo: this.viewData.lCShipDtls.impLicNo,
                inCoTerms: this.viewData.lCShipDtls.inCoTerms,
                ltstShpMntDt: this.viewData.lCShipDtls.ltstShpMntDt,
                otherDtls: this.viewData.lCShipDtls.otherDtls,
                plDlvry: this.viewData.lCShipDtls.plDlvry,
                plRcpt: this.viewData.lCShipDtls.plRcpt,
                pod: this.viewData.lCShipDtls.pod,
                pol: this.viewData.lCShipDtls.pol,
                proInvNo: this.viewData.lCShipDtls.proInvNo,
              }
            });

            pilocy.patchValue({
              coverDate: this.viewData.formCoverDt,
              endDate: this.viewData.formEndDt,
              formDt: this.viewData.formDt,
              formPlace: this.viewData.formPlace,
              insCmpny: this.viewData.insCmpny,
              isAgree: this.viewData.isAgree,
              policyAmount: this.viewData.policyAmount,
              policyAmnt: this.viewData.policyAmount,
              policyNo: this.viewData.policyNo,
            });
            office.patchValue({
              officeUseVo: this.viewData.officeUse,
              officeAttchList: {
                rowIndx: 0,
                attchId: null,
                encAttchId: null,
                attchCd: "STMPD_LC_APP",
                attchNm: "",
                isChckd: 1
              },
            });

            if (lcFormId != null) {
              if (this.viewData.lcStatusId !== 3) {
                this.isApproved = true;
              }
              if (!this.viewData.isEditable) {
                this.disableAllForm();
              }
              try {
                this.ref.detectChanges();
                this.accountDetailTabl1TotalCal();
              } catch (err) {
              }
            }
          }
        })
      }
    }, error => {
    });
  }
}