import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';


@Component({
  selector: 'sb-export-office',
  templateUrl: './export-office.component.html',
  styleUrls: ['./export-office.component.scss']
})
export class ExportOfficeComponent implements OnInit {
  exportOfficeform: FormGroup;
  viewData: any;
  submittedlcForm6: boolean = false;
  @Output('officeEvent') officeEvent = new EventEmitter();
  misRbiPurposeList: any;
  purposecode: any;
  accountTypeList: any = [];
  relationShipList: any = [];
  savedData: any = {};
  modal_title = "Status"
  modal_body = "Please correct form";
  public isDtlsofFrwdCntrct: boolean = true;
  public conversationDetailTotal = 0;
  @Input() country = [];
  @Input() currency = [];
  @ViewChild("content", { static: false }) content: any;
  rtCvrDtlsVoListArray: any = [];

  constructor(
    private ref: ChangeDetectorRef,
    public fh: FormHelperService,
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
    private modalService: NgbModal) {
    this.exportOfficeform = this.formBuilder.group({
      spreat: new FormControl('', []),
      othrBnkRefNo: new FormControl('', []), 
      liboreIntrstRt: new FormControl('', []),
      formCmmnAccVo: this.formBuilder.group({
        isRtCvrWithTrDr: new FormControl('', []),
      }),
      officeUseVo: this.formBuilder.group({
        misValue: new FormControl('', []),
        fccAccNo: new FormControl('', []),
        cncssionChrg: new FormControl('', []),
        cncssionPrcntg: new FormControl('', []),
        cncssionFixdAmnt: new FormControl('', []),
        swiftPrcntg: new FormControl('', []),
        swiftFixdAmnt: new FormControl('', []),
        attchCd: new FormControl('', []),
        accNo: new FormControl('', []),
        attchList: this.formBuilder.group({
          attchCd: new FormControl('', []),
          attchNm: new FormControl('', []),
        }),
        attchList1: this.formBuilder.group({
          attchCd: new FormControl('', []),
          atchmnt: new FormControl('', []),
        }),
        attchList2: this.formBuilder.group({
          attchCd: new FormControl('', []),
          attchNm: new FormControl('', []),
        }),
        attchList3: this.formBuilder.group({
          attchCd: new FormControl('', []),
          // attchNm:new FormControl('', [Validators.required]),
        }),
        sttlmntDclrtn0: this.formBuilder.group({
          dclrtnCd: new FormControl('', []),
        }),
        sttlmntDclrtn1: this.formBuilder.group({
          dclrtnCd: new FormControl('', []),
        }),
        sttlmntDclrtn2: this.formBuilder.group({
          dclrtnCd: new FormControl('', []),
        }),
        sttlmntDclrtn3: this.formBuilder.group({
          dclrtnCd: new FormControl('', []),
        }),
        sttlmntDclrtn4: this.formBuilder.group({
          dclrtnCd: new FormControl('', []),
        }),
        sttlmntDclrtn5: this.formBuilder.group({
          dclrtnCd: new FormControl('', []),
        }),
        misDtlsList: this.formBuilder.group({
          misValue: new FormControl('', []),
        }),
        misDtlsList1: this.formBuilder.group({
          misValue: new FormControl('', []),
        }),

        misDtlsList2: this.formBuilder.group({
          misValue: new FormControl('', []),
        }),
        misDtlsList3: this.formBuilder.group({
          misValue: new FormControl('', []),
        }),
        misDtlsList4: this.formBuilder.group({
          misValue: new FormControl('', []),
        }),
        misDtlsList5: this.formBuilder.group({
          misValue: new FormControl('', []),
        }),
        misDtlsList6: this.formBuilder.group({
          misValue: new FormControl('', []),
        }),
        misDtlsList7: this.formBuilder.group({
          misValue: new FormControl('', []),
        }),
        misDtlsList8: this.formBuilder.group({
          misValue: new FormControl('', []),
        }),
        misDtlsList9: this.formBuilder.group({
          misValue: new FormControl('', []),
        }),
        isFccAccStlment: new FormControl('', []),
        atchmntSanctn: new FormControl('', []),
      }),
    });
  }
  public onAddRowConvrsionRate(): void {
    if ((this.rtCvrDtlsVoListArray == null || this.rtCvrDtlsVoListArray == undefined)) {
      this.rtCvrDtlsVoListArray = [];
    }
    this.rtCvrDtlsVoListArray.push({
      srNo: 1,
      frmFcy: '',
      toFcy: '',
      amnt: '',
      rate: '',
      retAdno: '',
    });
  }

  getConversationDetailTotal() {
    let total = 0;
    this.rtCvrDtlsVoListArray.forEach((element: any) => {
      total += (+element.amnt)
    });
    this.conversationDetailTotal = total;
    console.log(this.conversationDetailTotal);

  }
  deleteConversionRateDetail(index: any) {
    this.rtCvrDtlsVoListArray.splice(index, 1);
    this.getConversationDetailTotal()
  }
  get officeformVal() {
    return this.exportOfficeform.value;
  }
  outwardMandatoryDocList: any = [];
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
    const frm = this.exportOfficeform.get('officeUseVo.atchmntSanctn');
    if (frm?.value != '') {
      return frm?.value.replace(/\\$/, '').split('\\').pop();;
    }
    return 'Choose File'
  }
  setFileForDocument($event: any, index: any) {
    const file = $event.target.files[0];
    if (file.type === 'application/pdf' && file.size < 5000000) {
      this.outwardMandatoryDocList[index].file = $event.target.files[0];
    } else {
      this.modal_body = 'Please select only PDF file and size less than 5 MB.';
      this.modalService.open(this.content, { size: 'sm' });
      delete  this.outwardMandatoryDocList[index].file;
    }
  }
  public currentMode: any = "edit";

  get isEditable() {
    return this.currentMode == "view" ? true : false;
  }


  checkedFileList($event: any, index: any, outwardDoc: any) {
    if (!$event) {

      this.outwardMandatoryDocList[index].file = "";
      this.outwardMandatoryDocList[index].isChckd = false;

      this.outwardMandatoryDocList[index].docAttchNm = "";

    } else {
      this.outwardMandatoryDocList[index].isChckd = true;
    }
  }
  getOutwardMandatoryDoc() {
    this.comservice.getExportMandatoryDoc().subscribe(data => {
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
  ngOnInit(): void {
    this.comservice.purposeCode().subscribe(result => {
      this.purposecode = result;
    });

    // this.officeform.disable();
  }
  getErrorShipmentForm(controlName: any) {
    if (this.submittedlcForm6) {
      return this.fh.formInputError(this.exportOfficeform, controlName);
    }
    return '';
  }
  ngAfterViewInit() {
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
    this.getOutwardMandatoryDoc();
  }
  changerateCov(event: any) {
    if (event.target.checked == false) {
      this.rtCvrDtlsVoListArray = [];
      this.conversationDetailTotal = 0;
    }
  }
  onChangeFccAcc(event: any) {
    if (event.target.value == '1') {
      this.exportOfficeform.patchValue({
        officeUseVo: {
          fccAccNo: '',
        }
      });
    }
  }
  onChangecnssn(event: any) {
    if (event.target.value == 'NO') {
      this.exportOfficeform.patchValue({
        officeUseVo: {
          cncssionPrcntg: '',
          cncssionFixdAmnt: '',
          swiftPrcntg: '',
          swiftFixdAmnt: ''
        }
      });
    }
  }
  onSubmitForm6() {
    this.submittedlcForm6 = true;
    let isNoErrorCon = true;
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
      if (rtCvrDtlsVo.retAdno == '') {
        rtCvrDtlsVo.retAdnoReq = true;
        isNoErrorCon = false;
      } else {
        rtCvrDtlsVo.retAdnoReq = false;
      }

    });

    if (this.exportOfficeform.valid && !isNoErrorCon) {
      this.officeEvent.emit(this.exportOfficeform.value)
    } else {
      return
    }
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

}
