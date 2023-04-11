import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import moment from 'moment';
@Component({
  selector: 'sb-export-shipment',
  templateUrl: './export-shipment.component.html',
  styleUrls: ['./export-shipment.component.scss']
})
export class ExportShipmentComponent implements OnInit {
  exportShipmentForm: FormGroup;
  exportSubmittedForm2: boolean = false;
  @Output('exportshipmentEvent') exportshipmentEvent = new EventEmitter();
  @ViewChild("content", { static: false }) content: any;
  @ViewChild("contentbodyred", { static: false }) contentbodyred: any;
  @Output() informShipmentParent = new EventEmitter();

  public modal_title = "Status"
  public modal_body = "Please correct form";
  public modal_body_2 = "";
  constructor(
    public fh: FormHelperService,
    private comservice: AppCommonService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {

    this.exportShipmentForm = this.formBuilder.group({
      lcNum: new FormControl('', []),
      lcDate: new FormControl('', []),
      // modeOfPayment: new FormControl('', [ ]),
      letterOfCredit: new FormControl('', [Validators.required]),
      whrLcIsRcvByCN: new FormControl('', []),
      pcfcDtlsVo: this.formBuilder.group({
        drftDays: new FormControl('', [Validators.required]),
        descGdsRmrks: new FormControl('', [Validators.required]),
        ltstShpmntDt: new FormControl('', []),
        hsDesc: new FormControl('', [Validators.required]),
        hsCode: new FormControl('', [Validators.required]),
      }),

    })
  }
  get appUserVal() {
    return this.exportShipmentForm.value;
  }
  ngOnInit(): void {
  }
  getErrorShipmentForm(controlName: any) {
    if (this.exportSubmittedForm2) {
      return this.fh.formInputError(this.exportShipmentForm, controlName);
    }
    return '';
  }
  onShipmentFormShipment() {
    this.exportSubmittedForm2 = true;
    if (this.exportShipmentForm.valid) {
      this.exportshipmentEvent.emit(this.exportShipmentForm.value)
    }
  }
  changeLetter(event: any) {
    this.informShipmentParent.emit(event.target.value);

    if (event.target.value == 'NO') {
      this.exportShipmentForm.patchValue({
        lcNum: '',
        lcDate:"",
        whrLcIsRcvByCN:''
      });
    } else if (event.target.value == 'YES') {
      this.exportShipmentForm.patchValue({
        pcfcDtlsVo: {
          ltstShpmntDt: '',
        }
      });
    }
  }
  loadPurposeDtls() {
    const val = this.exportShipmentForm.value;
    if (val.pcfcDtlsVo.hsCode != '') {
      this.comservice.hsCodeDescription(val.pcfcDtlsVo.hsCode).subscribe(data => {
        if (data && data != null) {
          this.exportShipmentForm.patchValue({
            pcfcDtlsVo: {
              hsDesc: data.hsDesc
            }
          })
        } else {
          this.exportShipmentForm.patchValue({
            pcfcDtlsVo: {
              hsDesc: "",
              hsCode:""
            }
          })
          this.modal_body_2 = 'H.S. Code is invalid kindly refer the "View H.S. Code" link next to description';
          this.modalService.open(this.contentbodyred, { size: 'sm' });
        }
      })
    }
  }
  hsCodeDoc(link: any) {
    try {
      const pt = environment.app_url
      window.open(pt + "/docDownload/" + link, '_blank');
    } catch (error) {
    }
  }
  // getPurchesOrderTab(control: any) {
  //   this.exportShipmentEvent.emit(this.currentMsgToSibling);
  //   if (this.lcaccountDetails.value.draftTenor == 'USANCE') {
  //     const val = this.accountValue[control];
  //     if (val == '' || val == null) {
  //       return this.submittedlcForm2 && true;
  //     }
  //     return false;
  //   }
  // }
}
