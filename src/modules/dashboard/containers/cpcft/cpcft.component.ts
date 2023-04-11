
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCommonService } from '@common/services/app-common.service';
import { DashboardService } from '@modules/dashboard/services/dashboard.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Stepper from 'bs-stepper';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from '../../common';
import { CpfcFirstComponent } from './cpfc-first/cpfc-first.component';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { environment } from 'environments/environment';

@Component({
  selector: 'sb-cpcft',
  templateUrl: './cpcft.component.html',
  styleUrls: ['./cpcft.component.scss']
})
export class CpcftComponent implements OnInit {
  stepper: any;
  @ViewChild("content", { static: false }) content: any;

  @ViewChild('cpftApplicant', { static: false }) cpftApplicant!: CpfcFirstComponent;
  savedData: any = [];

  public currency: any = [];
  public cpcftForm: FormGroup;
  amount: string;
  public submittedinvertform2: boolean = false
  public cpcftFormSecond: FormGroup
  submittedInvdertBill: boolean = false;

  public remarkDetails: any = [];
  public approveremarks: any = '';
  public rejectremarks: any = '';
  public approveModalRef: any;
  public rejectModalRef: any;
  public isApproved = false;
  public isRejected = false;
  amntWords: any;
  imagename: any;
  outwardMandatoryDocList: any = [];
  viewData: any = [];
  constructor(private ref: ChangeDetectorRef, public fh: FormHelperService,
    private formBuilder: FormBuilder, private comservice: AppCommonService, private activatedRoute: ActivatedRoute,
    private dashboardService: DashboardService, public router: Router, private modalService: NgbModal, public toastService: ToastService, private spinner: NgxSpinnerService,) {
    this.amount = '';

    var address3
    const email = '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$';
    const pan = '[a-zA-Z]{3}[ABCFGHLJPTFabcfghljptf]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}';
    const phone = '[6-9]\\d{9}'
    const sysdate =
      '^(0?[1-9]|[12][0-9]|3[01])-(jan|Jan|JAN|feb|Feb|FEB|mar|Mar|MAR|apr|Apr|APR|may|May|MAY|jun|Jun|JUN|jul|Jul|JUL|aug|Aug|AUG|sep|Sep|SEP|oct|Oct|OCT|nov|Nov|NOV|dec|Dec|DEC)-(19|20)dds([0-1][0-9]|[2][0-3]):([0-5][0-9])$';
    const dt = new Date();
    const customerName = '^[a-zA-Z]+$';

    this.cpcftForm = this.formBuilder.group({
      inRmtncId: new FormControl('', []),
      sysRefNo: new FormControl('', []),
      transRefNo: new FormControl('', []),
      sysRefDt: new FormControl('', []),
      nmOfBen: new FormControl('', [Validators.required]),
      custNm: new FormControl('', [Validators.required,Validators.pattern(this.fh.CUSTOMER_NAME_REG)]),
      rmtrNM: new FormControl('', [Validators.required]),
      expRemm: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      currency: new FormControl('', [Validators.required]),
    });
    this.cpcftFormSecond = this.formBuilder.group({
      eefcAccNo: new FormControl('', [Validators.required]),
      rmntncDt: new FormControl('', [Validators.required]),
      sysRefNo: new FormControl('', []),
      bnkCntry: new FormControl('', [Validators.required]),
      swiftCode: new FormControl('', [Validators.required]),
      amntWords: new FormControl('', []),
      instruction: new FormControl('', [Validators.required]),
      crditAccNo: new FormControl('', [Validators.required]),
      crditDtls: new FormControl('', [Validators.required]),
    });
  }
  @ViewChild('stepper2', { static: false }) stepper2: any;

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    const stepper2 = this.stepper2.nativeElement;
    this.stepper = new Stepper(stepper2, {
      linear: false,
      animation: true,
    });
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
  next() {
    this.stepper.next();
  }
  get AppUserVal() {
    return this.cpcftForm.value;

  }
  get isSaved() {
    return this.AppUserVal.sysRefNo != '' ? true : false;
  }
  getErrorInvertBill(controlName: any) {
    if (this.submittedInvdertBill) {
      return this.fh.formInputError(this.cpcftForm, controlName);
    }
    return '';
  }
  getErrorInvertBillform2(controlName: any) {
    if (this.submittedinvertform2) {
      return this.fh.formInputError(this.cpcftFormSecond, controlName);
    }
    return '';
  }
  onSubmitAppCpfcForm() {
    // this.cpftApplicant.onSubmitAppCpfc();
    this.submittedInvdertBill = true;
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.cpcftForm.valid) {
        this.next()
      }
    }
  }
  form4Submitted() {

  }
  get canAppRej() {
    if (this.savedData && this.savedData.inWardStatusId && this.savedData.inWardStatusId != "") {
      if ([3].indexOf(this.savedData.inWardStatusId) != -1 && (this.savedData.aprvRmrks === '' || this.savedData.aprvRmrks === null)) {
        return true;
      }
    }
    return false;
  }
  onSubmitAppCpfc() {

    this.submittedInvdertBill = true;
    if (this.isSaved == true) {
      this.next();
    } else {
      if (this.cpcftForm.valid) {
        this.next();
      }
    }
  }

  onSubmitFormm6() {
    if (!this.cpcftFormSecond.valid) {
      this.submittedinvertform2 = true;
      this.goTo(1);
      return 0
    }

    if (this.cpcftFormSecond.valid) {
    this.spinner.show();
    const promiseArray: any = [];
    if (typeof (this.inward_file) != "undefined") {
      var formData: any = new FormData();
      formData.append('file', this.inward_file);
      formData.append('code', "INWARD_REMMITANCE");
      promiseArray.push(new Promise((resolve, reject) => {
        this.comservice.saveLCFile(formData)
          .subscribe((data) => {
            resolve(data)
          }, (err) => {
            reject(err)
          })
      }))
    }
    Promise.all(promiseArray)
    .then((values: any) => {
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

        }
     
      }

      let sampleDataLc = this.outwardObjData(outwardMandatoryDocList);


      if (sampleDataLc.sysRefNo === "" && sampleDataLc.transRefNo === "") {
        this.comservice.saveCpfcForm(sampleDataLc).subscribe(data => {

          this.savedData = data;
          if (data && data.sysRefNo != '') {
            this.cpcftForm.patchValue({

              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              inRmtncId: data.inRmtncId,
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

        this.comservice.updateCpfcForm(sampleDataLc).subscribe(data => {
          this.savedData = data;
          // this.billOffice.savedData  = data;
          if (data && data.sysRefNo != '') {
            this.cpcftForm.patchValue({

              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              inRmtncId: data.inRmtncId,
              taskId: data.taskId,
            });
            if (data && data.historyVoList) {
              if (this.currentMode && this.currentMode != "edit") {
                this.remarkDetails = data.historyVoList;
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
            // this.modalService.open(this.content, { size: 'sm' });

          }, 2000);
        })
      }

    }).catch((err)=>{
      this.spinner.hide();
      this.showSuccess('File upload Failed. Please try again..');
    });


    }
  }
  modal_body: string = '';
  modal_title: string = '';
  disableAllForm() {

    this.cpcftForm.disable()
    this.cpcftFormSecond.disable()

  }
  showSuccess(msg: any) {
    this.toastService.show(msg, { classname: 'bg-success text-light', delay: 5000 });
  }
  showDanger(dangerTpl: any) {
    this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 5000 });
  }
  redirectHome() {
    this.router.navigate(['/dashboard/outward/remittance/landing'])
  }
  convertNumberToWords(amount: any) {
    return this.fh.convertNumberToWords(amount);
  }
  inputChange(event: any) {
    this.amount = event.target.value;

    this.amntWords = this.convertNumberToWords(this.amount)
    // this.lcappUserDetails.controls['amntWords'].value = this.amount;
    this.cpcftFormSecond.controls['amntWords'].setValue(this.amntWords);

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

  public inward_file: any

  setFileForDocument($event: any) {

    const file = $event.target.files[0];
    this.imagename = file.name
    if (file.type === 'application/pdf' && file.size < 5000000) {
      this.inward_file = $event.target.files[0];
    } else {
      this.modal_body = 'Please select only PDF file and size less than 5 MB.';
      this.modalService.open(this.content, { size: 'sm' });
    } 
  }

  get isDraft() {
    if (this.currentMode == 'eidt') {
      return false
    }
    if (this.savedData && this.savedData.inWardStatusId && this.savedData.inWardStatusId != "") {
      if ([4].indexOf(this.savedData.inWardStatusId) != -1) {
        return true;
      }
    }
    if (this.savedData && typeof (this.savedData.transRefNo) == "undefined") {
      return true;
    }
    return false;
  }
  get canUpdate() {
    if (this.savedData && this.savedData.inWardStatusId && this.savedData.inWardStatusId != "") {
      if ([3, 4, 7].indexOf(this.savedData.inWardStatusId) != -1) {
        if (this.currentMode && this.currentMode == "edit") {
          return true;
        }
      }
    }
    return false;
  }
  getCurrency() {
    this.comservice.getCurrency().subscribe(data => {
      this.currency = data;

    })
  }
  country() { }
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
      this.comservice.CpfcApproveForm(this.savedData)
        .subscribe((data) => {
          if (data && data.historyVoList) {
            this.remarkDetails = data.historyVoList;
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
      this.comservice.CpfcRejectForm(this.savedData)
        .subscribe((data) => {
          if (data && data.historyVoList) {
            this.remarkDetails = data.historyVoList;
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
  isForm1Valid() {
    // check if first form is valid
    if (!this.cpcftForm.valid) {
      this.submittedInvdertBill = true;
      this.goTo(1);
      return 0
    }
    return 1
  }
  saveDraft() {

    if (this.isForm1Valid() == 0) {
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
        }
      }
      let draftData = this.outwardObjData(outwardMandatoryDocList);
      if (draftData.sysRefNo === "" && draftData.transRefNo === "") {
        this.comservice.saveCpfcDraft(draftData).subscribe((data: any) => {
          // this.draftdata = data;
          // Hadle Save Data
          this.savedData = data;

          if (data && data.sysRefNo != '' && data.sysRefNo != undefined) {
            this.cpcftForm.patchValue({
              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              inRmtncId: data.inRmtncId,
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
            this.showSuccess('Data Saved successfully')
          }, 2000);

        }, () => {
          this.spinner.hide();
          this.showDanger('No Data Saved');
        });
      } else {
        this.comservice.updateCpcftDraft(draftData).subscribe((data: any) => {
          this.savedData = data;
          if (data && data.sysRefNo != '') {
            this.cpcftForm.patchValue({
              sysRefNo: data.sysRefNo,
              transRefNo: data.transRefNo,
              isEditable: data.isEditable,
              inRmtncId: data.inRmtncId,
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
            this.showSuccess('Data Saved successfully');
          }, 2000);
        }, () => {
          this.spinner.hide();
          this.showDanger('No Data Saved');
        });
      }
    }).catch((err)=>{
      this.spinner.hide();
      this.showSuccess('File upload Failed. Please try again..');
    });;
  }
  outwardObjData(outwardMandatoryDocList: any) {

    const cpftApplicant: any = this.cpcftForm;
    const cpcftFormSecond: any = this.cpcftFormSecond;
    console.log(cpftApplicant.value);
    console.log(this.inward_file);

    var sampleDataLc = {
      "inRmtncId": "",
      "taskId": "",
      "sysRefNo": "",
      "transRefNo": "",
      "sysRefDt": "",
      "appRefDt": "",
      "currency": 1,
      "amount": cpftApplicant.value.amount,
      "amntWords": cpcftFormSecond.value.amntWords,
      "rmtrNM": cpftApplicant.value.rmtrNM,
      "expRemm": cpftApplicant.value.expRemm,
      "rmntncDt": cpcftFormSecond.value.rmntncDt,
      "bnkCntry": 1,
      "swiftCode": cpcftFormSecond.value.swiftCode,
      "crditAccNo": cpcftFormSecond.value.crditAccNo,
      "eefcAccNo": cpcftFormSecond.value.eefcAccNo,
      "instruction": cpcftFormSecond.value.instruction,
      "crditDtls": cpcftFormSecond.value.crditDtls,
      "swftDelNote": '',
      "prodCd": null,
      "aprvRmrks": null,
      "priority": null,
      "wrkInPrgs": false,
      "inWardStatus": null,
      "inWardStatusId": null,
      "encTaskId": null,
      "historyVoList": null,
      "custNm": cpftApplicant.value.custNm,
      "error": null,
      "auditDetails": null,
      "isEditable": null,
      "nmOfBen": cpftApplicant.value.nmOfBen,
      "officeUse": {
        "officeUseId": null,
        "accNo": null,
        "conscnChrg": null,
        "conscnPrcntg": null,
        "conscnFixdAmnt": null,
        "swiftPrcntg": null,
        "swiftFixdAmnt": null,
        "isFccAccSetlmnt": null,
        "fccAccNo": null,
        "offcReqDocList": null,
        "officeAttchList": this.inward_file,
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
    }

    // sampleDataLc['bnfDtls']['isSwiftCodeNotAvl'] = this.beneficiaryDetails.value.bnfDtlsVo.isSwiftCodeNotAvl == true ? 1 : 0;

    return sampleDataLc;
  }

  public currentMode: any = "edit";

  loadView() {
    let snapshotParam = this.activatedRoute.snapshot.paramMap.get("inRmtncId");
    this.activatedRoute.paramMap.subscribe(params => {
      const inRmtncId = params.get("inRmtncId");
      const taskId = params.get("taskId");
      const mode = params.get("mode");

      this.currentMode = params.get("mode");
      let method = this.comservice.getCpfcView(taskId, inRmtncId);
      if (mode == 'edit') {
        method = this.comservice.getCpfcEdit(taskId, inRmtncId);
      }
      if (inRmtncId && inRmtncId != "") {
        method.subscribe((data: any) => {
          // save logic  
          this.savedData = data;
          if (data && data.sysRefNo != '' && data.sysRefNo != null) {
            if (data && data.historyVoList) {
              if (mode !== 'edit') {
                this.remarkDetails = data.historyVoList;
              }
            }

            //save logic earlier ends
            try {
              this.viewData = data;
              this.savedData = data;
              console.log(this.viewData);

            } catch (err) {
            }
            const cpcftForm: any = this.cpcftForm;
            const cpcftFormSecond: any = this.cpcftFormSecond;
            console.log(cpcftForm.value);
            console.log(cpcftFormSecond.value);


            cpcftForm.patchValue({
              sysRefNo: this.viewData.sysRefNo,
              transRefNo: this.viewData.transRefNo,
              sysRefDt: this.viewData.sysRefDt,
              nmOfBen: this.viewData.nmOfBen,
              custNm: this.viewData.custNm,
              rmtrNM: this.viewData.rmtrNM,
              expRemm: this.viewData.expRemm,
              amount: this.viewData.amount,
              currency: this.viewData.currency,
              // swftDelNote:thi
            });
            setTimeout(() => {
              try {
                this.outwardMandatoryDocList.forEach((dt: any, index: any) => {
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
            cpcftFormSecond.patchValue({
              eefcAccNo: this.viewData.eefcAccNo,
              rmntncDt: this.viewData.rmntncDt,
              bnkCntry: this.viewData.bnkCntry,
              swiftCode: this.viewData.swiftCode,
              amntWords: this.viewData.amntWords,
              instruction: this.viewData.instruction,
              crditAccNo: this.viewData.crditAccNo,
              crditDtls: this.viewData.crditDtls,
              "officeUse": {
                "officeUseId": null,
                "accNo": null,
                "conscnChrg": null,
                "conscnPrcntg": null,
                "conscnFixdAmnt": null,
                "swiftPrcntg": null,
                "swiftFixdAmnt": null,
                "isFccAccSetlmnt": null,
                "fccAccNo": null,
                "offcReqDocList": null,
                // "officeAttchList": this.inward_file,
                officeAttchList:[{ 
                "rowIndx": 0, 
                "attchId": null,
                "encAttchId": null, 
                "attchCd": "INWARD_REMMITANCE", 
                "attchNm": "", 
                "isChckd": 1,
                "docAttchNm": ""
               }],
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



            if (inRmtncId != null) {
              if (this.viewData.inWardStatusId !== 3) {
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
}