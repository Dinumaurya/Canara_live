import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of, Subject, throwError } from 'rxjs';
import { environment } from "../../../environments/environment";
import { APP_URL, aPP_url } from "./app.contant";
import { EncryptionService } from './encryption.service';
@Injectable()
export class AppCommonService {

  CountryMaster: string[] | undefined;

  constructor(private http: HttpClient, public encryptionService: EncryptionService,) { }
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
    return this.http.post<any>(environment.app_url, {
      'reqType': 'GET',
      'reqUrl': `login/dmsLogin/${encrypted}`,
      'reqBodyObject': {}
    });
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

  getAuthKey() {
    const jsn: any = sessionStorage.getItem('user');
    if (jsn) {
      const customerId = JSON.parse(jsn);
      if (customerId && customerId.ibData && customerId.ibData.AuthKey) {
        return customerId.ibData.AuthKey;
      }
    }
    return "";
  }
  getBranchCode() {
    const jsn: any = sessionStorage.getItem('user');
    if (jsn) {
      const customerId = JSON.parse(jsn);
      if (customerId && customerId.ibData && customerId.ibData.AuthKey) {
        return customerId.ibData.branchCode;
      }
    }
    return "";
  }
  getAccountNo() {
    const jsn: any = sessionStorage.getItem('user');
    if (jsn) {
      const customerId = JSON.parse(jsn);
      if (customerId && customerId.ibData && customerId.ibData.AuthKey) {
        return customerId.ibData.accountDto.accountnumber;
      }
    }
    return "";
  }
  getUserId() {
    const usersId = sessionStorage.getItem("userId");
    if (usersId && usersId != "") {
      //return this.encryptionService.encrypt(usersId, environment.encryptKey)
      return usersId;
    }
    //return "";
    return 111111;
  }
  getCustomerId() {
    const usersId = sessionStorage.getItem("customerId");
    if (usersId) {
      return this.encryptionService.encrypt(usersId, environment.encryptKey)
      //return usersId;
    }
    //return "";
    return 111111;
  }
  getApplicantDetails(id: any): Observable<any> {
    return this.http.post<any>(environment.app_url, {
      'reqType': 'GET',
      'reqUrl': 'Details/Client/' + id,
      'reqBodyObject': {}
    });
  }


 /*  getUserId() {
    const usersId = sessionStorage.getItem("userId");
    if (usersId) {
      return usersId;
    }
    //return "";
    return 111111;
  }
  getCustomerId() {
    const usersId = sessionStorage.getItem("customerId");
    if (usersId) {
      return usersId;
    }
    //return "";
    return 111111;
  }
  getApplicantDetails(id: any): Observable<any> {
    return this.http.post<any>(environment.app_url, {
      'reqType': 'GET',
      'reqUrl': 'Cbs/ApplicantDetails/' + id,
      'reqBodyObject': {}
    });
  } */

  getCountry(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.countryUrl,
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.countryUrl);
    }

  }

  getProcess(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.processType,
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.processType);
    }

  }
  getIncoterms(): Observable<any> {
    return this.http.post<any>(environment.app_url, {
      'reqType': 'GET',
      'reqUrl': APP_URL.commonApi + APP_URL.incoterms,
      'reqBodyObject': {}
    });
  }
  getDocType(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.getDocType,
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.getDocType);
    }

  }
  getDocDescList(descID: any): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.getDocDescList + '/' + descID,
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.getDocDescList);
    }

  }
  docCodeList(codeID: any, docLongDesc: any): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.getDocCodeList + '/' + codeID + '/' + docLongDesc,
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>('assets/codelist.json?' + '/' + codeID + '/' + docLongDesc);
    }

  }
  hscCode(hsccode: any): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.getDocCodeList + '/' + hsccode,
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.getDocCodeList);
    }

  }
  docCodeListt(data: any, data2: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.getDocCodeList + '/' + data2 + '/' + encodeURI(data),
          'reqBodyObject': {}
        });
      } else {
        return this.http.get<any>('assets/codelist.json');
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  getDashboard(): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.BarChartApi + '/' + this.getUserId() + "/ALL/dms/dms",
          'reqBodyObject': {}
        });
      } else {
        return this.http.get<any>("assets/BarChartApi.json?");
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }


  getCurrency(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.currencyUrl,
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.currencyUrl);
    }

  }
  // saveLcForm(data: any): Observable<any> {
  //   if (environment.production) {
  //     return this.http.post<any>(environment.app_url, {
  //       'reqType': 'POST',
  //       'reqUrl': APP_URL.lcSave,
  //       'reqBodyObject': data
  //     })
  //   } else {
  //     return this.http.get<any>(environment.app_url + APP_URL.lcSave)
  //   }
  // }
  // updateLcForm(data: any): Observable<any> {
  //   if (environment.production) {
  //     return this.http.post<any>(environment.app_url, {
  //       'reqType': 'POST',
  //       'reqUrl': APP_URL.lcUpdate + '/' + this.getUserId(),
  //       'reqBodyObject': data
  //     })
  //   } else {
  //     return this.http.get<any>(environment.app_url + APP_URL.accountType)
  //   }
  //   //return this.http.post<any>("http://localhost:8088/CNDMSNETBNK/" + APP_URL.lcSave + '/' + this.getUserId(),  data)
  // }

  updateLcForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'POST',
        'reqUrl': APP_URL.lcUpdate + '/' + this.getUserId(),
        'reqBodyObject': data
      })
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  lcUpdate(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.lcUpdate + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.get<any>(environment.app_url + APP_URL.lcUpdate)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }

  // savePcfcForm(data: any): Observable<any> {
  //   if (this.getUserId() !== "") {
  //     return this.http.post<any>(environment.app_url, {
  //       'reqType': 'POST',
  //       'reqUrl': APP_URL.pcfcSave + '/' + this.getUserId(),
  //       'reqBodyObject': data
  //     })
  //   } else {
  //     console.log('No session Available')
  //     return throwError(new Error());
  //   }
  // }
  getPcfcView(taskId: any, pcfcId: any): Observable<any> {

    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': aPP_url.pcfcView + '' + taskId + '/' + pcfcId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.pcfcView + '' + taskId + '/' + pcfcId + '/' + this.getUserId())
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  savePcfcForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.pcfcSave + '/' + this.getUserId(),
          'reqBodyObject': data
        })
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.pcfcSave + '/' + this.getUserId(), data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }

  getPcfcEdit(taskId: any, pcfcId: any): Observable<any> {
    if (this.getUserId() !== "") {
      var userId = 123321;
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.pcfcEdit + '' + taskId + '/' + pcfcId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.pcfcEdit + '' + taskId + '/' + pcfcId + '/' + this.getUserId())
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  pcfcApproveForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.pcfcApprove + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.get<any>(environment.app_url + APP_URL.commonApi);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  pcfcRejectForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.pcfcReject + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.get<any>(environment.app_url + APP_URL.commonApi);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  listApiPcfc(data?: any, page?: any) {

    if (this.getUserId() !== "") {
      if (data && page) {
        data.page = page;
      }
      if (data) {
        data.loginId = this.getUserId();
      }
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.pcfcListView + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.pcfcListView + '/' + 123321, data, page)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }

  updatePcfcForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.pcfcUpdate + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.pcfcUpdate + '/' + 123321, data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  savePcfcDraft(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.pcfcDraft + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.pcfcDraft + '/' + this.getUserId(), data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  pcfcUpdateDraft(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.pcfcDraftUpdate + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.pcfcDraftUpdate + '/' + 123321, data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  saveBillForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.billSave + '/' + this.getUserId(),
          'reqBodyObject': data
        })
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.billSave + '/' + this.getUserId(), data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  // listApiPcfc(data: any): Observable<any> {
  // if (environment.production) {
  //   return this.http.post<any>(environment.app_url, {
  //     'reqType': 'POST',
  //     'reqUrl': APP_URL.pcfcSave + '/' + this.getUserId(),
  //     'reqBodyObject': data
  //   })
  // } else {
  // return this.http.get<any>(environment.app_url + APP_URL.accountType)
  // }
  //   return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.pcfcListView + '/' + this.getUserId(),  data)
  // }
  saveLcForm(data: any): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'POST',
        'reqUrl': APP_URL.lcSave + '/' + this.getUserId(),
        'reqBodyObject': data
      })
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.accountType)
    }
    //return this.http.post<any>("http://localhost:8088/CNDMSNETBNK/" + APP_URL.lcSave + '/' + this.getUserId(),  data)
  }
  accountType(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.accountType,
        'reqBodyObject': {}
      })
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.accountType)
    }
  }

  purposeCode(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.purposeCode,
        'reqBodyObject': {}
      })
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.purposeCode)
    }
  }

  purposeCodeDesciption(purposeCode: any): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.purposeCodeDesc + purposeCode,
        'reqBodyObject': {}
      })
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.purposeCodeDesc + purposeCode)
    }
  }
  hsCodeDescription(hsCode: any): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.hsCodeDesc + hsCode,
        'reqBodyObject': {}
      })
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.hsCodeDesc + hsCode)
    }
  }
  saveOutwordRemittanceForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'POST',
        'reqUrl': APP_URL.saveOutword + '/' + this.getUserId(),
        'reqBodyObject': data
      })
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  saveAdvRemForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'POST',
        'reqUrl': APP_URL.advSaveForm + '/' + this.getUserId(),
        'reqBodyObject': data
      })
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  updateOutwordRemittanceForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'POST',
        'reqUrl': APP_URL.updateOutword + '/' + this.getUserId(),
        'reqBodyObject': data
      })
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  nostroApi(data: any): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.nostroApi,
        'reqBodyObject': data
      })
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.nostroApi)

    }
  }
  // beneficiaryDetails = "assets/BeneficiaryDetails.json";
  // getBeneficiaryDetails(): Observable<any> {
  //   return this.http.get<any>(this.beneficiaryDetails);
  // }

  beneficiaryDetails = "assets/BeneficiaryDetails.json";
  getBeneDetails(): Observable<any> {
    return this.http.get<any>(this.beneficiaryDetails);
  }
  getBeneficiaryDetails(accno: any, fb: any, th: any): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': 'Beneficiary/Type/' + accno + '/' + fb + '/' + th + '',
        'reqBodyObject': {}
      });
    } else {
      var ben = 'Beneficiary/Type/';
      return this.http.get<any>(environment.app_url + ben + accno + '/' + fb + '/' + th + '');
    }
  }

  saveLCFile(data: any): Observable<any> {
    return this.http.post<any>(environment.app_url + "/upload", data)
  }
  saveFile(data: any): Observable<any> {
    return this.http.post<any>(environment.app_url + "/upload", data)
  }
  viewFile(data: any): Observable<any> {
    return this.http.post<any>(environment.app_url + "/upload/view", data)
  }
  accType(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'ACC_TP',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  misrbiPurposeCode(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'RBI_PRBS_CD',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  misbsrCode(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'BSR_CD',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }

  }
  misSector(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'SECTOR',
        'reqBodyObject': {}
      });
    } else { }
    return this.http.get<any>(environment.app_url + APP_URL.commonApi);
  }
  misSSISUBSEC(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'SSISUBSEC',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  misBASE_2(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'BASE_2',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  misSTATUSIB(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'STATUSIB',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  misSCHEMES(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'SCHEMES',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  misPRI_NPRI(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'PRI_NPRI',
        'reqBodyObject': {}
      });
    } else { }
    return this.http.get<any>(environment.app_url + APP_URL.commonApi);
  }
  misGUA_COVER(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'GUA_COVER',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  misSPL_BENEF(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'SPL_BENEF',
        'reqBodyObject': {}
      });
    } else { }
    return this.http.get<any>(environment.app_url + APP_URL.commonApi);
  }
  getABA_CD(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'ABA_CD',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  getRelationList(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'RLTN_SHIP',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  getTravelAndOtherPurpose(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'TRAVEL_AND_OTHERS_PURPOSE',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  approveForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.approveOutWard + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.get<any>(environment.app_url + APP_URL.commonApi);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  rejectForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.rejectOutWard + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.get<any>(environment.app_url + APP_URL.commonApi);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  listApiOutward() {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'RLTN_SHIP',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }


  getDeclrtnMaster(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'OUTWRD_DECLR_BRNCH',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  getOutwardMandatoryDoc(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'OUTWRD_MNDTRY_DOC',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  getLCMandatoryDoc(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'LC_MNDTRY_DOC',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  getExportMandatoryDoc(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'PCFC_MNDTRY_DOC',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  getExportBillsDoc(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'EXPORT_BILLS_MNDTRY_DOC',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
/* code by Dinesh */
  getExportBillsDoc1(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'IMPORT_BILLS_MNDTRY_DOC',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }

  permissionForm(form: any) {
    const dt = sessionStorage.getItem("user");
    if (dt != null) {
      const user: any = JSON.parse(dt);
      if (user) {
        const rights = user.processRights.find((o: any) => form.code === o.processType.code);
        return rights;
      }
    }

  }
  getAdvanceDeclarationBranch(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'ADVNCE_DECLR_BRNCH',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  getAdvanceMandatoryDoc(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'ADVNCE_MNDTRY_DOC',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  getOutwardRemitanceView(taskId: any, outRmtncId: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.outwardView + '' + taskId + '/' + outRmtncId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("assets/sampleView.json?" + outRmtncId)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  getOutwardEdit(taskId: any, outRmtncId: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.outwardEdit + '' + taskId + '/' + outRmtncId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("assets/sampleView.json?" + outRmtncId)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }

  getLcView(taskId: any, lcFormId: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.lcView + '' + taskId + '/' + lcFormId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("assets/sampleView.json?" + lcFormId)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  getLcEdit(taskId: any, lcFormId: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.LcEdit + '' + taskId + '/' + lcFormId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("assets/sampleView.json?" + lcFormId)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  getAdvView(taskId: any, advRemId: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.advView + '' + taskId + '/' + advRemId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("assets/sampleView.json?" + advRemId)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  getAdvEdit(taskId: any, advRemId: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.advEdit + '' + taskId + '/' + advRemId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("assets/sampleView.json?" + advRemId)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  listApiOutwardRem(data?: any, page?: any) {
    if (this.getUserId() !== "") {
      if (data && page) {
        data.page = page;
      }
      if (data) {
        data.loginId = this.getUserId();
      }
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.listView + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        return this.http.get<any>("assets/listView.json?" + page);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  listApiLc(data?: any, page?: any) {
    if (this.getUserId() !== "") {
      if (data && page) {
        data.page = page;
      }
      if (data) {
        data.loginId = this.getUserId();
      }
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.lcListView + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        return this.http.get<any>("assets/lcListView.json?" + page);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }

  listApiAdvance(data?: any, page?: any) {
    if (this.getUserId() !== "") {
      if (data && page) {
        data.page = page;
      }
      if (data) {
        data.loginId = this.getUserId();
      }
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.advListView + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        return this.http.get<any>("assets/lcListView.json?" + page);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  getDashBarPieList(outward?: any, Pending?: any, page?: any) {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.dashBarPieList + '/' + this.getUserId() + '/' + `ALL/dms/dms/${Pending}/${outward}/${page}`,

        });
      } else {
        return this.http.get<any>("assets/DashboarList.json?" + page);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  // 
  listview = "assets/listView.json";
  getlistview(): Observable<any> {
    return this.http.get<any>(this.listview);
  }


  getPiechart(Pending: any) {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.pieChartUrl + '/' + this.getUserId() + '/ALL/dms/dms/' + Pending,

        });
      }
      else {
        return this.http.get<any>("assets/piechart.json?" + Pending);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  // piechart = "assets/piechart.json";
  // getPiechart(): Observable<any> {
  //   return this.http.get<any>(this.piechart);
  // }
  saveDraft(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.draftUrl + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.get<any>(environment.app_url + APP_URL.draftUrl)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  lcSaveDraft(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.LcDraft + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.get<any>(environment.app_url + APP_URL.LcDraft)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  AdvSaveDraft(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.advSaveDraft + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.get<any>(environment.app_url + APP_URL.advSaveDraft)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  updateDraft(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.updateDraft + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.get<any>(environment.app_url + APP_URL.updateDraft)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  lcUpdateDraft(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.LcUpdateDraft + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.get<any>(environment.app_url + APP_URL.LcUpdateDraft)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  advUpdateDraft(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.advDraftUpdate + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.get<any>(environment.app_url + APP_URL.advDraftUpdate)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  advSaveUpdate(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.advRemUpdate + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.get<any>(environment.app_url + APP_URL.advRemUpdate)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  lcApproveForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.lcApproveOutWard + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.get<any>(environment.app_url + APP_URL.commonApi);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  lcRejectForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.lcRejectOutWard + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.get<any>(environment.app_url + APP_URL.commonApi);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  advApproveForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.advApproveForm + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.get<any>(environment.app_url + APP_URL.commonApi);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  advRejectForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.advRejectForm + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.get<any>(environment.app_url + APP_URL.commonApi);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  saveUpload(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'POST',
        'reqUrl': APP_URL.saveUpload,
        'reqBodyObject': data
      })
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  documentView(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'POST',
        'reqUrl': APP_URL.documentView,
        'reqBodyObject': data
      })
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  billListApi(data?: any, page?: any) {
    if (this.getUserId() !== "") {
      if (data && page) {
        data.page = page;
      }
      if (data) {
        data.loginId = this.getUserId();
      }
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.billListView + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/expBillsFormLoad/search/123321?" + page, {});
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  getBillView(taskId: any, exportBillsId: any): Observable<any> {

    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.billView + '/' + taskId + '/' + exportBillsId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.billView + '/' + taskId + '/' + exportBillsId + '/' + 123321)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  getBillEdit(taskId: any, exportBillsId: any): Observable<any> {

    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.billEdit + '/' + taskId + '/' + exportBillsId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.billEdit + '/' + taskId + '/' + exportBillsId + '/' + 123321)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  updateBillForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.billUpdate + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.billUpdate + '/' + 123321, data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  saveBillDraft(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.billDraft + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.billDraft + '/' + this.getUserId(), data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  updateBillDraft(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.updateBillDraft + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.get<any>(environment.app_url + APP_URL.updateBillDraft)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  billApproveForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.billApproveForm + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.get<any>(environment.app_url + APP_URL.commonApi);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  billRejectForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.billRejectForm + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.get<any>(environment.app_url + APP_URL.commonApi);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }

  saveCpfcForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.cpfcSaveForm + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.post<any>("http://localhost:8484/CNDMSNETBNK/" + APP_URL.cpfcSaveForm + '/' + this.getUserId(), data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  updateCpfcForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.CpfcUpdate + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.post<any>("http://localhost:8484/CNDMSNETBNK/" + APP_URL.CpfcUpdate + '/' + this.getUserId(), data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  saveCpfcDraft(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.CpfcDraft + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.post<any>("http://localhost:8484/CNDMSNETBNK/" + APP_URL.CpfcDraft + '/' + this.getUserId(), data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }

  CpfcApproveForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.CpfcApproveForm + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.post<any>("http://localhost:8484/CNDMSNETBNK/" + APP_URL.CpfcApproveForm + '/' + this.getUserId(), data)

      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  CpfcRejectForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.CpfcRejectForm + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.post<any>("http://localhost:8484/CNDMSNETBNK/" + APP_URL.CpfcRejectForm + '/' + this.getUserId(), data)

      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  cpfcListApi(data?: any, page?: any) {
    if (this.getUserId() !== "") {
      if (data && page) {
        data.page = page;
      }
      if (data) {
        data.loginId = this.getUserId();
      }
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.cpfcListView + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        return this.http.post<any>("http://localhost:8484/CNDMSNETBNK/inwrdRmtnceLoad/search/111111?" + page, {});
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  getCpfcView(taskId: any, inRmtncId: any): Observable<any> {

    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.cpfcView + '/' + taskId + '/' + inRmtncId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("http://localhost:8484/CNDMSNETBNK/" + APP_URL.cpfcView + '/' + taskId + '/' + inRmtncId + '/' + this.getUserId())
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  getCpfcEdit(taskId: any, inRmtncId: any): Observable<any> {

    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.cpfcEdit + '/' + taskId + '/' + inRmtncId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("http://localhost:8484/CNDMSNETBNK/" + APP_URL.cpfcEdit + '/' + taskId + '/' + inRmtncId + '/' + this.getUserId())
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  updateCpcftDraft(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.updateCpfcDraft + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.get<any>(environment.app_url + APP_URL.updateCpfcDraft)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }


  saveImportBillColForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.importBillCollectionSave + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.importBillCollectionSave + '/' + 111111, data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  updateImportBillColForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.importBillCollectionUpdate + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.importBillCollectionUpdate + '/' + 111111, data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  saveImportBillColDraft(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.ImportBillDraft + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.ImportBillDraft + '/' + 123321, data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }

  ImportBillColApproveForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.importBillCollectionApprove + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.importBillCollectionApprove + '/' + this.getUserId(), data)

      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  ImportBillColRejectForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.importBillCollectionReject + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.importBillCollectionReject + '/' + this.getUserId(), data)

      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  ImportBillColListApi(data?: any, page?: any) {
    if (this.getUserId() !== "") {
      if (data && page) {
        data.page = page;
      }
      if (data) {
        data.loginId = this.getUserId();
      }
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.importBillCollectionListAPi + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/inwrdRmtnceLoad/search/111111?" + page, data);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  getImportBillColView(taskId: any, inRmtncId: any): Observable<any> {

    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.importBillCollectionView + '/' + taskId + '/' + inRmtncId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.importBillCollectionView + '/' + taskId + '/' + inRmtncId + '/' + this.getUserId())
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  getImportBillColEdit(taskId: any, inRmtncId: any): Observable<any> {

    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.importBillCollectionEdit + '/' + taskId + '/' + inRmtncId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.importBillCollectionEdit + '/' + taskId + '/' + inRmtncId + '/' + this.getUserId())
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  updateImportBillColDraft(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.updateImportBillDraft + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.get<any>(environment.app_url + APP_URL.updateImportBillDraft)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }

  saveFwrdCntrctForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          // 'reqUrl': APP_URL.fwrdCntSave + '/' + this.getUserId(),
          'reqUrl': APP_URL.fwrdCntSave + '/' + this.getUserId(),

          'reqBodyObject': data
        })
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.fwrdCntSave + '/' + this.getUserId(), data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }

  updateFwrdCntrctForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          // 'reqUrl': APP_URL.fwrdCntSave + '/' + this.getUserId(),
          'reqUrl': APP_URL.fwrdCntUpdate + '/' + this.getUserId(),

          'reqBodyObject': data
        })
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.fwrdCntSave + '/' + this.getUserId(), data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }

  listApiFwdCntct(data?: any, page?: any) {
    if (this.getUserId() !== "") {
      if (data && page) {
        data.page = page;
      }
      if (data) {
        data.loginId = this.getUserId();
      }
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.fwrdCntList + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.fwrdCntView + '/' + this.getUserId(), data)
        // return this.http.get<any>("assets/listView.json?" + page);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }

  getFwrdCntrctView(taskId: any, inRmtncId: any): Observable<any> {

    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.fwrdCntView + '/' + taskId + '/' + inRmtncId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.importBillCollectionView + '/' + taskId + '/' + inRmtncId + '/' + this.getUserId())
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  getFwrdCntrctEdit(taskId: any, inRmtncId: any): Observable<any> {

    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.fwrdCntEdit + '/' + taskId + '/' + inRmtncId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.importBillCollectionEdit + '/' + taskId + '/' + inRmtncId + '/' + this.getUserId())
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }

  approveFwrdCntrctForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.fwrdCntApprove + '/' + 'IM',
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.get<any>(environment.app_url + APP_URL.commonApi);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }

  rejectFwrdCntrctForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.fwrdCntReject + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.get<any>(environment.app_url + APP_URL.commonApi);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }

  getDocDeliveryList(): Observable<any> {
    return this.http.post<any>(environment.app_url, {
      'reqType': 'GET',
      'reqUrl': APP_URL.commonApi + 'DOC_DELIVERY',
      'reqBodyObject': {}
    });
  }

  getDlvryOfFundsList(): Observable<any> {
    return this.http.post<any>(environment.app_url, {
      'reqType': 'GET',
      'reqUrl': APP_URL.commonApi + 'DLVRY_OF_FUNDS',
      'reqBodyObject': {}
    });
  }

  draftFwrdCntrctForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          // 'reqUrl': APP_URL.fwrdCntSave + '/' + this.getUserId(),
          'reqUrl': APP_URL.fwrdCntDraft + '/' + this.getUserId(),

          'reqBodyObject': data
        })
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.fwrdCntSave + '/' + this.getUserId(), data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }

  updateDraftFwrdCntrctForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          // 'reqUrl': APP_URL.fwrdCntSave + '/' + this.getUserId(),
          'reqUrl': APP_URL.fwrdCntDraftUpdate + '/' + this.getUserId(),

          'reqBodyObject': data
        })
      } else {
        return this.http.post<any>("http://localhost:8087/CNDMSNETBNK/" + APP_URL.fwrdCntSave + '/' + this.getUserId(), data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  getForwardMandatoryDoc(): Observable<any> {
    if (environment.production) {
      return this.http.post<any>(environment.app_url, {
        'reqType': 'GET',
        'reqUrl': APP_URL.commonApi + 'FWDCNT_MNDTRY_DOC',
        'reqBodyObject': {}
      });
    } else {
      return this.http.get<any>(environment.app_url + APP_URL.commonApi);
    }
  }
  listApiOutwardGuarnty(data?: any, page?: any) {
    if (this.getUserId() !== "") {
      if (data && page) {
        data.page = page;
      }
      if (data) {
        data.loginId = this.getUserId();
      }
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.gaurntyListView + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        return this.http.get<any>("assets/listView.json?" + page);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }

  saveGurntyForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.gurntySave + '/' + this.getUserId(),
          'reqBodyObject': data
        })
      } else {
        return this.http.post<any>("http://localhost:236/CNDMSNETBNK/" + APP_URL.gurntySave + '/' + this.getUserId(), data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  updateGurntyForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.gurntyUpdate + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.post<any>("http://localhost:236/CNDMSNETBNK/" + APP_URL.gurntyUpdate + '/' + 123321, data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  getGuarantyView(taskId: any, guaranteeFormId: any): Observable<any> {

    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.gurntyView + '' + taskId + '/' + guaranteeFormId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("http://localhost:236/CNDMSNETBNK/" + APP_URL.gurntyView + '/' + taskId + '/' + guaranteeFormId + '/' + 111111)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  getGuarantyEdit(taskId: any, guaranteeFormId: any): Observable<any> {
    if (this.getUserId() !== "") {
      var userId = 123321;
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'GET',
          'reqUrl': APP_URL.gurntyEdit + '' + taskId + '/' + guaranteeFormId + '/' + this.getUserId(),
          'reqBodyObject': {}
        })
      } else {
        return this.http.get<any>("http://localhost:236/CNDMSNETBNK/" + APP_URL.gurntyEdit + '/' + taskId + '/' + guaranteeFormId + '/' + 111111)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  guarantyApproveForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.gurntyApprove + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.get<any>(environment.app_url + APP_URL.commonApi);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  guarantyRejectForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.gurntyReject + '/' + this.getUserId(),
          'reqBodyObject': data
        });
      } else {
        //Todo Reject
        return this.http.get<any>(environment.app_url + APP_URL.commonApi);
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }
  listApiGuaranty(data?: any, page?: any) {

    if (this.getUserId() !== "") {
      if (data && page) {
        data.page = page;
      }
      if (data) {
        data.loginId = this.getUserId();
      }
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.gaurntyListView + '/' + 111111,
          'reqBodyObject': data
        });
      } else {
        return this.http.post<any>("http://localhost:236/CNDMSNETBNK/" + APP_URL.gaurntyListView + '/' + 111111, data, page)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }

  }

  saveGuarantyDraft(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.gurntyDraft + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.post<any>("http://localhost:236/CNDMSNETBNK/" + APP_URL.gurntyDraft + '/' + this.getUserId(), data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  guarantyUpdateDraft(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.gurntyUpdateDraft + '/' + this.getUserId(),
          'reqBodyObject': data

        })
      } else {
        return this.http.post<any>("http://localhost:236/CNDMSNETBNK/" + APP_URL.gurntyUpdateDraft + '/' + 123321, data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
  saveLCAmendForm(data: any): Observable<any> {
    if (this.getUserId() !== "") {
      if (environment.production) {
        return this.http.post<any>(environment.app_url, {
          'reqType': 'POST',
          'reqUrl': APP_URL.lcAmenedmnetSave + '/' + this.getUserId(),
          'reqBodyObject': data
        })
      } else {
        return this.http.post<any>("http://localhost:236/CNDMSNETBNK/" + APP_URL.lcAmenedmnetSave + '/' + this.getUserId(), data)
      }
    } else {
      console.log('No session Available')
      return throwError(new Error());
    }
  }
}


