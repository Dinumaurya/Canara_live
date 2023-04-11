import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable()
export class DashboardService {
  piechart!: any;
  bnkNm!: any;
  cifId!: any;
  cntryId!: any;
  swiftCode!: any;
  docTp!: any;
  docDesc!: any;
  docList!: any;
  noOfOrgnls!: any;
  noOfCopies!: any;
  docRefNo!: any;
  docDt!: any;
  atchmnt!: any;
  constructor() { }
  activePoints!: any[];
  lcTransBnkVo!: any[]
  sameAsBnk!:any
  trans!: any
  beneficiaryDetailList:any=[]
  setSecondtableValue:any=[]
  private newUser = new BehaviorSubject<any>({
    piechart: this.piechart
  });
  private dashbarpieList = new BehaviorSubject<any>({
    activePoints: this.activePoints
  });
  private newLcTransBnkVo = new BehaviorSubject<any>({
    bnkNm: this.bnkNm,
    cifId: this.cifId,
    cntryId:this.cntryId,
    swiftCode:this.swiftCode
      });
  private newTrans = new BehaviorSubject<any>({
    trans: this.trans
  });
  
  private beneSecondtable = new BehaviorSubject<any>({
    setSecondtableValue: this.setSecondtableValue
  });
  private beneficiaryDetailtable = new BehaviorSubject<any>({
    beneficiaryDetailList: this.beneficiaryDetailList
    // docTp:this.docTp,
    // docDesc:this.docDesc,
    // docList:this.docList,
    // noOfOrgnls:this.noOfOrgnls,
    // noOfCopies:this.noOfCopies,
    // docRefNo:this.docRefNo,
    // docDt:this.docDt,
    // atchmnt:this.atchmnt,
  });
  private sameBnk = new BehaviorSubject<any>({
    sameAsBnk: this.sameAsBnk
  });
  getDashboard$(): Observable<{}> {
    return of({});
  }
  setNewUserInfo(activePoints: any) {
    this.newUser.next(activePoints);
  }
  getNewUserInfo() {
    return this.newUser.asObservable();
  }
  setpiechart(piechart: any) {
    this.newUser.next(piechart);
  }
  getpiechart() {
    return this.dashbarpieList.asObservable();
  }
  setlcTransBnkVo(lcTransBnkVo: any) {
    this.newLcTransBnkVo.next(lcTransBnkVo);
  }
  getlcTransBnkVo() {
    return this.newLcTransBnkVo.asObservable();
  }
  setSameAsBnk(sameAsBnk: any) {
    this.sameBnk.next(sameAsBnk);
  }
  getSameAsBnk() {
    return this.sameBnk.asObservable();

  }
  setTrans(trans: any) {
    this.newTrans.next(trans);
  }
  getTrans() {
    return this.newTrans.asObservable();
  }
  settableValue(beneficiaryDetailList: any=[]) {
    this.beneficiaryDetailtable.next(beneficiaryDetailList);
  }
  gettableValue() {
    return this.beneficiaryDetailtable.asObservable();

  }
  setSecondtable(setSecondtableValue: any) {
    this.beneSecondtable.next(setSecondtableValue);
  }
  getSecondtable() {
    return this.beneSecondtable.asObservable();

  }
}
