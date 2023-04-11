import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';

@Component({
  selector: 'sb-amend-lc-office',
  templateUrl: './amend-lc-office.component.html',
  styleUrls: ['./amend-lc-office.component.scss']
})

export class AmendLcOfficeComponent implements OnInit {
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
public lcOfficeEmbedform: FormGroup
@Output('ammentOfficeEvent') ammentOfficeEvent = new EventEmitter();
public submittedlcForm2 : boolean = false
  savedData: any=[];
  outwardMandatoryDocList: any=[];
  @ViewChild("contentbodyred", { static: false }) contentbodyred: any;
  viewData: any;

  constructor(
    private ref: ChangeDetectorRef,
    public fh: FormHelperService,
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
    private modalConfig: NgbModalConfig,
    private modalService: NgbModal) {

    this.lcOfficeEmbedform = this.formBuilder.group({
      // customerRep: new FormControl('', [Validators.required]),


      officeUseVo: this.formBuilder.group({
        misValue: new FormControl('', []),
        isChckd: new FormControl('', []),
        fccAccNo: new FormControl('', []),
        cncssionChrg: new FormControl('', []),
        cncssionPrcntg: new FormControl('', []),
        cncssionFixdAmnt: new FormControl('', []),
        swiftPrcntg: new FormControl('', []),
        swiftFixdAmnt: new FormControl('', []),
        attchCd: new FormControl('', []),


        // nosCharge: new FormControl('', [Validators.required]),
        isFccAccStlment: new FormControl('', []),
        // fccAccNo: new FormControl('', [Validators.required]),
        // cncssionPrcntg: new FormControl('', [Validators.required]),
        // cncssionFixdAmnt: new FormControl('', [Validators.required]),
        // swiftPrcntg: new FormControl('', [Validators.required]),
        // swiftFixdAmnt: new FormControl('', [Validators.required]),
        atchmnt: new FormControl('', []),
      }),





      // NostroMasterVo: this.formBuilder.group({
      //   bankName: new FormControl('', [Validators.required]),
      //   swiftCode: new FormControl('', [Validators.required]),
      // }),

    });
  }
get lcOfficeEmbedformVal() {
  return this.lcOfficeEmbedform.value;
}
modal_title = "";
modal_body = "";
setFileForDocument($event: any, index: any) {
  const file = $event.target.files[0];
  if (file.type === 'application/pdf' && file.size < (1024 * 1024 * 5)) {
    this.outwardMandatoryDocList[index].file = $event.target.files[0];
  } else {
    this.modal_body = 'Please select only PDF file and size less than 5 MB.';
    this.modalService.open(this.contentbodyred, { size: 'sm' });
    delete this.outwardMandatoryDocList[index].file;
  }

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
ngOnInit(): void {
}
  /**
   * Generates JSON that need to be send
   * @param outwardMandatoryDocList 
   */
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
getLcOfficeError(controlName: any) {
  if (this.submittedlcForm2) {
    return this.fh.formInputError(this.lcOfficeEmbedform, controlName);
  }
  return '';
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
onSubmitApp() {
 
  
  this.submittedlcForm2 = true;

  if (this.lcOfficeEmbedform.valid) {
    this.ammentOfficeEvent.emit(this.lcOfficeEmbedform.value)
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
get AppUserVal() {
  return this.lcOfficeEmbedform.value;
}
}
