import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { environment } from "../../../environments/environment";
import { APP_URL } from "./app.contant";
@Injectable()
export class AppCommonService {

  CountryMaster: string[] | undefined;

  constructor(private http: HttpClient) { }
  getAppCommon$(): Observable<{}> {
    return of({});
  }
  public isLoggedIn(): boolean {
    let sessionItem = sessionStorage.getItem('token');
    if (sessionItem == null) {
      return false;
    } else {
      return true;
    }
  }
  public loggingOut() {
    sessionStorage.removeItem('token');
  }
  public authenticate(encrypted: any): Observable<any> {
    const loginURL = environment.app_url + `login/dmsLogin/${encrypted}`
    return this.http.get(loginURL);
  }
  public authenticateWithPassword(credentials: any): Observable<any> {
    const loginURL = environment.app_url + `login/dmsLogin/${credentials.userId + "/" + credentials.password}`
    return this.http.get(loginURL);
  }
  public getProfile(userId: number): Observable<any> {
    const profileURL = environment.app_url + `profile/${userId}`;
    return this.http.get(profileURL);
  }
  public getContacts(userId: number): Observable<any> {
    const contactsURL = environment.app_url + `profile/${userId}/contacts`;
    return this.http.get(contactsURL);
  }
  public createProfile(profile: any) {
    const createURL = environment.app_url + `createProfile`;
    return this.http.post(createURL, profile);
  }
  public addContact(contact: any, userId: number): Observable<any> {
    const addContactURL = environment.app_url + `profile/${userId}/addContact`;
    return this.http.post(addContactURL, contact);
  }
  public deleteContact(userId: number, contactId: number): Observable<any> {
    const deleteContactURL = environment.app_url + `profile/${userId}/delete/${contactId}`;
    return this.http.delete(deleteContactURL);
  }
  public searchContact(userId: number, name: string): Observable<any> {
    const searchContactURL = environment.app_url + `profile/${userId}/${name}`;
    return this.http.get(searchContactURL);
  }
  public updatePassword(userId: number, password: string): Observable<any> {
    const updateURL = environment.app_url + `updateProfile/${userId}/${password}`;
    return this.http.put(updateURL, {});
  }

  getCountry(): Observable<any> {
    return this.http.post<any>(environment.app_url, {
      'reqType': 'GET',
      'reqUrl': APP_URL.countryUrl,
      'reqBodyObject': {}
    });
    // return this.http.get<any>(APP_URL.countryUrl);
  }

  getCurrency(): Observable<any> {
    return this.http.post<any>(environment.app_url, {
      'reqType': 'GET',
      'reqUrl': APP_URL.currencyUrl,
      'reqBodyObject': {}
    });

  }

  accountType(): Observable<any> {
    return this.http.post<any>(environment.app_url, {
      'reqType': 'GET',
      'reqUrl': APP_URL.accountType,
      'reqBodyObject': {}
    })
  }

  purposeCode(): Observable<any> {
    return this.http.post<any>(environment.app_url, {
      'reqType': 'GET',
      'reqUrl': APP_URL.purposeCode,
      'reqBodyObject': {}
    })
  }

  purposeCodeDesciption(purposeCode: any): Observable<any> {
    return this.http.post<any>(environment.app_url, {
      'reqType': 'GET',
      'reqUrl': APP_URL.purposeCodeDesc + purposeCode,
      'reqBodyObject': {}
    })
  }
  saveOutwordRemittanceForm(data: any): Observable<any> {
    return this.http.post<any>(environment.app_url, {
      'reqType': 'POST',
      'reqUrl': APP_URL.saveOutword,
      'reqBodyObject': data
    })
  }
  nostroApi(data: any): Observable<any> {
    return this.http.post<any>(environment.app_url, {
      'reqType': 'POST',
      'reqUrl': APP_URL.nostroApi,
      'reqBodyObject': data
    })
  }
  beneficiaryDetails = "assets/BeneficiaryDetails.json";
  getBeneficiaryDetails(): Observable<any> {
    return this.http.get<any>(this.beneficiaryDetails);
  }
  accType(): Observable<any> {
    return this.http.get<any>(APP_URL.commonApi + 'ACC_TP');
  }
  misrbiPurposeCode(): Observable<any> {
    return this.http.get<any>(APP_URL.commonApi + 'RBI_PRBS_CD');
  }
  misbsrCode(): Observable<any> {
    return this.http.get<any>(APP_URL.commonApi + 'BSR_CD');
  }
  misSector(): Observable<any> {
    return this.http.get<any>(APP_URL.commonApi + 'SECTOR');
  }
  misSSISUBSEC(): Observable<any> {
    return this.http.get<any>(APP_URL.commonApi + 'SSISUBSEC');
  }
  misBASE_2(): Observable<any> {
    return this.http.get<any>(APP_URL.commonApi + 'BASE_2');
  }
  misSTATUSIB(): Observable<any> {
    return this.http.get<any>(APP_URL.commonApi + 'STATUSIB');
  }
  misSCHEMES(): Observable<any> {
    return this.http.get<any>(APP_URL.commonApi + 'SCHEMES');
  }
  misPRI_NPRI(): Observable<any> {
    return this.http.get<any>(APP_URL.commonApi + 'PRI_NPRI');
  }
  misGUA_COVER(): Observable<any> {
    return this.http.get<any>(APP_URL.commonApi + 'GUA_COVER');
  }
  misSPL_BENEF(): Observable<any> {
    return this.http.get<any>(APP_URL.commonApi + 'SPL_BENEF');
  }
  getABA_CD(): Observable<any> {
    return this.http.get<any>(APP_URL.commonApi + 'ABA_CD');
  }
  getRelationList(): Observable<any> {
    return this.http.get<any>(APP_URL.commonApi + 'RLTN_SHIP');
  }
}

// branchName