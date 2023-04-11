import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/helper/form.helper';
import { AppCommonService } from '@common/services/app-common.service';
import { ToastService } from '../../../../common';
import { DashboardService } from '@modules/dashboard/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import moment from 'moment';




@Component({
  selector: 'sb-benedetail',
  templateUrl: './benedetail.component.html',
  styleUrls: ['./benedetail.component.scss']
})
export class BenedetailComponent implements OnInit, AfterViewInit {
  amount: any;

  public lcaccountDetails: FormGroup;
  public accountDetailTabl1Total = 0;
  @Input() country = []
  @Input() currency = []
  @Output('benificiaryEvent') benificiaryEvent = new EventEmitter();

  submittedlcForm2: boolean = false;
  public accountDetailsList: any = [];
  beneficiaryDetail: any = [];
  beneficiaryDetailList: any = []
  accountDetailTable: any = [];
  trans: any;
  lcTransBnkVo: any;
  getsamebankValue: any = [];
  sameasbnk: any;
  beneficiaryList: any;
  Incoterms: any;
  getDocType: any = [];
  getDocDescType: any = [];
  docCodeList: any;
  selectedValue: any;
  msDesc: any;
  docCodeListt: any;
  selectedRadio: any;
  secondTable: any = [];
  @Input() savedData: any;
  imagename: any;
  constructor(
    private ref: ChangeDetectorRef,
    public fh: FormHelperService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private comservice: AppCommonService,
    private dashboardService: DashboardService,
    public toastService: ToastService) {

    this.amount = 0;
    this.lcaccountDetails = this.formBuilder.group({
      tollerance: new FormControl('', [Validators.required]),
      bnkswiftCls: new FormControl('', []),
      swiftCode: new FormControl('', []),
      bnkNm: new FormControl('', []),
      tolAvlBy: new FormControl('', [Validators.required]),
      tolAvlBy1: new FormControl('', []),
      tolAvlBy2: new FormControl('', []),
      tolAvlBy3: new FormControl('', []),
      tolAvlBy4: new FormControl('', []),
      tolAvlBy5: new FormControl('', []),
      draftBy: new FormControl('', []),
      draftDays: new FormControl('', []),
      draftCustomerNm: new FormControl('', []),
      transShipment: new FormControl('', [Validators.required]),
      partialShipment: new FormControl('', [Validators.required]),
      expiryDate: new FormControl('', [Validators.required]),
      placeExpiry: new FormControl('', [Validators.required]),
      tolAvlWith: new FormControl('', [Validators.required]),
      draftTenor: new FormControl('', [Validators.required]),
      tpSecurity: new FormControl('', [Validators.required]),
      defPymntRmrks: new FormControl('', []),
      mixPymntRmrks: new FormControl('', []),

      marginDtlVoList: this.formBuilder.group({
        srNo: new FormControl('', []),
        margin: new FormControl('', []),
        deposit: new FormControl('', []),
      }),
      lCBnfDtlsVo: this.formBuilder.group({
        cifId: new FormControl(39956420, [Validators.required]),
        name: new FormControl('', [Validators.required]),
        beneNam: new FormControl('', []),
        addr1: new FormControl('', [Validators.required]),
        addr2: new FormControl('', []),
        cntryNm: new FormControl('', [Validators.required]),
      }),
      othrTransBnkVo: this.formBuilder.group({
        cifId: new FormControl(39956420, [Validators.required]),
        bnkNm: new FormControl('', [Validators.required]),
        fullAddr: new FormControl('', [Validators.required]),
        fullAddr1: new FormControl('', []),
        fullAddr2: new FormControl('', []),
        cntryId: new FormControl('', [Validators.required]),
        swiftCode: new FormControl('', [Validators.required]),
      }),
    })
  }
  getErrorForm2(controlName: any) {
    if (this.submittedlcForm2) {
      return this.fh.formInputError(this.lcaccountDetails, controlName);
    }
    return '';
  }

  getLCBankVo() {
    this.dashboardService.getlcTransBnkVo().subscribe(result => {
      this.lcTransBnkVo = result;

    })
  }
  get cifid() { return this.lcaccountDetails.get('cifid') };

  ngAfterViewInit() {
    this.dashboardService.getSameAsBnk().subscribe(result => {
      this.sameasbnk = result.sameAsBnk;
      if (this.sameasbnk == 'SAME_BNK') {
        this.dashboardService.getlcTransBnkVo().subscribe(data => {
          this.getsamebankValue = data;

          this.lcaccountDetails.patchValue({
            othrTransBnkVo: {
              cifId: this.getsamebankValue.cifId,
              bnkNm: this.getsamebankValue.bnkNm,
              fullAddr: this.getsamebankValue.fullAddr,
              fullAddr1: this.getsamebankValue.fullAddr1,
              fullAddr2: this.getsamebankValue.fullAddr2,
              cntryId: this.getsamebankValue.cntryId,
              swiftCode: this.getsamebankValue.swiftCode
            }
          })
        })
      } else if (this.sameasbnk == 'OTHR_BNK') {
        return
      }
    })
    this.dashboardService.getTrans().subscribe(result => {
      this.trans = result.trans;
      if (this.trans == true) {
        this.getLCBankVo();
      } else {
        if (this.trans == false)
          return
      }
    })
    this.comservice.getDocType().subscribe(result => {
      this.getDocType = result;
    });
    this.getBeneficiaryDetails();
    this.dashboardService.gettableValue().subscribe(data => {
      this.secondTable = data.beneficiaryDetailList;

      setTimeout(() => {
        data.beneficiaryDetailList.forEach((element: any, index: any) => {
          this.beneficiaryDetailList.push(
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


      this.beneficiaryDetailList.forEach((element: any) => {

        this.beneficiaryDetailList.push({
          docTp: element.docTp,
          docDesc: element.docDesc,
          docCd: element.docCd,
          //docList: element.docList,
          noOfOrgnls: element.noOfOrgnls,
          noOfCopies: element.noOfCopies,
          docRefNo: element.docRefNo,
          docDt: moment(element.docDt).format('YYYY-MM-DDTHH:mm:ssZZ'),
          atchmnt: element.atchmnt
        });
      });
    })
  }
  ngOnInit(): void {
    this.getLcMandatoryDoc();
    // this.loadDefaultBeneficiary();
  }

  onChecked(event: any) {
    if (event.target.value == 'ANY_BNK') {
      this.lcaccountDetails.patchValue({
        swiftCode: '',
        bnkNm: '',
      })
    }
  }
  getImageText(txt: any, beneIndex: number) {
    var dt = "";
    try {
      if (this.savedData && this.savedData.officeUse && this.savedData.officeUse.offcReqDocList) {
        var found = this.savedData.officeUse.offcReqDocList[beneIndex]
        if (found) {
          dt = found.docAttchNm;
        }
      }
    } catch (err) { }
    try {
      var found = this.savedData.officeUse.offcReqDocList[beneIndex];
      if (found) {
        dt = found.attchNm;
      }

    } catch (err) { }
    return dt
  }
  checkedFileList($event: any, index: any) {

    if (!$event) {
      this.beneficiaryDetailList[index].file = "";
    }
  }
  getLcMandatoryDoc() {
    this.beneficiaryDetailList.forEach((element: any, index: any) => {
      this.beneficiaryDetailList.push({
        rowIndx: index,
        attchId: index,
        encAttchId: index,
        attchCd: element.atchmnt,
        attchNm: element.attchNm,
        isChckd: 1,
      });
    })
  }

  masterDocType(beneIndex: number) {
    if (this.beneficiaryDetailListMaster[beneIndex] &&
      this.beneficiaryDetailListMaster[beneIndex].getDocDescType) {
      return this.beneficiaryDetailListMaster[beneIndex].getDocDescType;
    }
    return [];
  }
  masterDocCd(beneIndex: number) {
    if (this.beneficiaryDetailListMaster[beneIndex] &&
      this.beneficiaryDetailListMaster[beneIndex].docCodeListt) {
      return this.beneficiaryDetailListMaster[beneIndex].docCodeListt;
    }
    return [];
  }
  public beneficiaryDetailListMaster: any = [];
  getDocCodeList(doc: any, index: number, cb?: any) {
    this.comservice.docCodeListt(doc.docDesc, doc.docTp).subscribe(result => {
      if (this.beneficiaryDetailListMaster && !this.beneficiaryDetailListMaster[index]) {
        this.beneficiaryDetailListMaster[index] = {};
      }
      this.beneficiaryDetailListMaster[index]['docCodeListt'] = result;
      if (cb && typeof (cb) == "function") {
        cb();
      }
    })
  }
  docDescList(doc: any, index: number, cb?: any) {
    this.comservice.getDocDescList(doc.docTp)
      .subscribe(result => {
        if (this.beneficiaryDetailListMaster && !this.beneficiaryDetailListMaster[index]) {
          this.beneficiaryDetailListMaster[index] = {};
        }
        this.beneficiaryDetailListMaster[index]['getDocDescType'] = result;
        if (cb && typeof (cb) == "function") {
          cb();
        }
      })
  }
  getBeneficiaryDetails() {
    try {
      const jsn: any = sessionStorage.getItem('user');
      const customerId = JSON.parse(jsn);
      const dt = customerId.ibData.AuthKey
      if (customerId && customerId.ibData && customerId.ibData.UserID) {
        var UserId = customerId.ibData.UserID
      }
      if (customerId && customerId.ibData && customerId.ibData.UserID) {
        this.comservice.getBeneficiaryDetails(dt, 'LCB', UserId)
          .subscribe(data => {
            if (data.beneDetails) {
              this.beneficiaryList = data.beneDetails;
            }
          },
            (err) => { }
          )
      }
    } catch (error) {
    }

  }
  getFileText(index: any) {
    if (this.beneficiaryDetailList) {
      var found = this.beneficiaryDetailList[index];
      if (found && found.file && found.file.name) {
        const frm = found.file.name;
        if (frm != '') {
          return frm.replace(/\\$/, '').split('\\').pop();;
        }
      }
    }
    return 'Choose File'
  }

  @ViewChild("contentbodyred", { static: false }) contentbodyred: any;
  modal_body_2 = '';
  modal_body_1 = '';
  setFileForDocument($event: any, index: any) {
    const file = $event.target.files[0];
    this.imagename = file.name
    if (file.type === 'application/pdf' && file.size < (1024 * 1024 * 5)) {
      this.beneficiaryDetailList[index].file = $event.target.files[0];
    } else {
      this.modal_body_2 = 'Please select only PDF file and size less than 5 MB.';
      this.modalService.open(this.contentbodyred, { size: 'sm' });
      delete this.beneficiaryDetailList[index].file;
    }

  }
  viewDoc(doc: any) {
    try {
      const pt = environment.app_url
      window.open(pt + "/docView/" + doc.attchPath, '_blank')
      return false;
    } catch (error) {
    }

  }
  modal_title = "";
  beneficiarySelected() {
    const val = this.lcaccountDetails.value;
    const found = this.beneficiaryList.find((o: any) => o.beneId === val.lCBnfDtlsVo.beneNam);
    if (found && found.beneNam) {
      const countryNam: any = this.country.find((o: any) => o.alfaCode === found.countryNam);
      const advisingBankCountryNam: any = this.country.find((o: any) => o.alfaCode === found.countryNam);

      this.lcaccountDetails.patchValue({
        lCBnfDtlsVo: {
          addr1: found.addr1,
          addr2: found.addr2,
          name: found.beneNam,
          swiftCode: found.swiftCode,
          cntryId: typeof (countryNam) != 'undefined' ? countryNam.countryId : "",
          bnfAccNo: found.beneAcct,
          bnkNm: found.beneBankNam,
        },
        othrTransBnkVo: {
          bnkNm: found.advisingBankNam,
          fullAddr: found.advisingBankaddr1,
          fullAddr1: found.advisingBankaddr1,
          fullAddr2: found.advisingBankAddr2,
          cntryId: typeof (advisingBankCountryNam) != 'undefined' ? advisingBankCountryNam.countryId : "",
          swiftCode: found.advisingBankSwiftCod
        }
      })
    }
  }


  getrelationDEFFERED(control: any) {
    const val = this.accountValue[control];
    if (val == '' || val == null) {
      return this.submittedlcForm2 && true;
    }
    return false;
  }
  onCheckbboxSelect(event: any) {
    this.selectedRadio = event.target.value
    if (this.selectedRadio == 'MIX_PYMNT') {
      this.lcaccountDetails.patchValue({
        defPymntRmrks: '',
      })
    } else if (this.selectedRadio == 'DEFFERED_PYMNT') {
      this.lcaccountDetails.patchValue({
        mixPymntRmrks: '',
      })
    }
  }
  changeSight(event: any) {
    if (event.target.value == 'SIGHT') {
      this.lcaccountDetails.patchValue({
        draftDays: '',
        draftBy: '',
        draftCustomerNm: ''
      });
    }
  }
  getrelationMixedPay(control: any) {

    if (this.lcaccountDetails.value.tolAvlBy == 'MIX_PYMNT') {
      const val = this.accountValue[control];
      if (val == '' || val == null) {
        return this.submittedlcForm2 && true;
      }
      return false;
    }
  }

  getSIGHT(control: any) {
    if (this.lcaccountDetails.value.draftTenor == 'USANCE') {
      const val = this.accountValue[control];
      if (val == '' || val == null) {
        return this.submittedlcForm2 && true;
      }
      return false;
    }
  }

  getChange(dataProp: any) {
    this.getBeneficiaryDetails();
    try {

      this.comservice.getApplicantDetails(this.comservice.getAuthKey())
        .subscribe(data2 => {
          let data = data2;
          if (typeof (data2.body) == "string") {
            data = { body: JSON.parse(data2.body) };
          }
         /*  if (data && data.body && data.body.Response && data.body.Response.CustomerInfoResponse) { */
         if (data && data.body && data.body && data.body.CustomerInfoResponse)
         {
              const rsp = data.body;
            const rcData = rsp.CustomerInfoResponse;
            const client = rsp.client;
            const Cust=rcData.CustomerFullName.slice(0,35);
            console.log(Cust);
            this.lcaccountDetails.patchValue({
              outRmtncCustDtlsVo: {
                custId: client,
                custNm:Cust,
                /* custNm: typeof (rcData.CustomerFullName) != 'object' ? rcData.CustomerFullName : '', */
                mobNo: typeof (rcData.Phone) != 'object' ? rcData.Phone : '',
                eMail: typeof (rcData.EmailId) != 'object' ? rcData.EmailId : '',
                address1: typeof (rcData.Address1) != 'object' ? rcData.Address1 : '',
                address2: typeof (rcData.Address2) != 'object' ? rcData.Address2 : '',
                address3: typeof (rcData.Address3) != 'object' ? rcData.Address3 : '',
                panNo: typeof (rcData.PANCardNo) != 'object' ? rcData.PANCardNo : '',
                ieCode: typeof (rcData.IECCode) != 'object' ? rcData.IECCode : '',
              },
            })
          } else {
            this.showDanger('No such data')
          }
        }, (err) => {
          this.showDanger('Something went wrong')
        })
    } catch (error) {
    }
  }
  showSuccess(msg: any) {
    this.toastService.show(msg, { classname: 'bg-success text-light', delay: 5000 });
  }

  showDanger(dangerTpl: any) {
    this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 5000 });
  }
  get lcAccountValue() {
    return this.lcaccountDetails.value;
  }
  public onAddRowDetailsRemitance(): void {
    this.beneficiaryDetailList.push({
      docTp: "",
      docDesc: "",
      docCd: "",

      noOfOrgnls: "",
      noOfCopies: "",
      docRefNo: "",
      docDt: "",
      atchmnt: "",
    });
  }
  public onAddRowClick(): void {
    this.accountDetailTable.push({
      srNo: 1,
      margin: '',
      deposit: '',
    });
  }
  deleteConDtlRemitance(index: any) {
    this.beneficiaryDetailList.splice(index, 1)
  }

  deleteAccountDetail(index: any) {
    this.accountDetailTable.splice(index, 1)
    this.accountDetailTabl1TotalCal();

  }
  onSubmitForm2() {
    this.submittedlcForm2 = true;
    let isNoErrorConDate = false;
    this.beneficiaryDetailList.forEach((row: any) => {
      if (row.docTp == '') {
        row.docTpReqq = true;
        isNoErrorConDate = false;
      } else {
        row.docTpReqq = false;
      }
      if (row.docDesc == '') {
        row.docDescReq = true;
        isNoErrorConDate = false;
      } else {
        row.docDescReq = false;
      }
      if (row.docCd == '') {
        row.docCdReqq = true;
        isNoErrorConDate = false;
      } else {
        row.docCdReqq = false;
      }
      if (row.noOfOrgnls == '') {
        row.noOfOrgnlsReqq = true;
        isNoErrorConDate = false;
      } else {
        row.noOfOrgnlsReqq = false;
      }
      if (row.docDt == '') {
        row.docDtReqq = true;
        isNoErrorConDate = false;
      } else {
        row.docDtReqq = false;
      }
      if (row.file && row.file.name == '') {
        row.atchmntReqq = true;
        isNoErrorConDate = false;
      } else {
        row.atchmntReqq = false;
      }
      if (row.noOfCopies == '') {
        row.noOfCopiesReqq = true;
        isNoErrorConDate = false;
      } else {
        row.noOfCopiesReqq = false;
      }
      if (row.docRefNo == '') {
        row.docRefNoReqq = true;
        isNoErrorConDate = false;
      } else {
        row.docRefNoReqq = false;
      }
    });
    if (this.lcaccountDetails.valid && !isNoErrorConDate && !this.getrelationMixedPay('mixPymntRmrks') && !this.getSIGHT('draftDays')) {
      this.benificiaryEvent.emit(this.lcaccountDetails.value)
      return true;
    }
    return false;
  }
  get AppUserVal() {
    return this.lcaccountDetails.value;
  }
  get accountValue() {
    return this.lcaccountDetails.value;
  }
  get accountValue1() {
    return this.lcaccountDetails.value;
  }
  accountDetailTabl1TotalCal() {
    let total = 0;
    this.accountDetailTable.forEach((element: any) => {
      total += (+element.deposit)
    });
    this.accountDetailTabl1Total = total;

  }
  checkboxrequired() {
    if (this.AppUserVal.frngExchng == 'FIX_AMNT_FCY') {
      const cifId = this.accountDetailTable.value.othrTransBnkVo.cifId;
      if (cifId == '' || cifId == null) {
        return true;
      } else {

      }
    }
  }
}