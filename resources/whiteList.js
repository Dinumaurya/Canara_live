const currentWhitelist = ["accDtlsId",
    "accNo",
    "accNoReq",
    "accTpReq",
    "addInfo",
    "addr1",
    "addr2",
    "address1",
    "address2",
    "address3",
    "advRemCustDtls",
    "advRemDrweBnkDtls",
    "advRemId",
    "advRemShipDtls",
    "advRemStatus",
    "advRemStatusId",
    "advRemSupDrwDtls",
    "agnstAmt",
    "agnstCurr",
    "altEmail",
    "amntReq",
    "amntWords",
    "amount",
    "amountReq",
    "appRefDt",
    "aprvRmrks",
    "atchmnt",
    "atchmntReqq",
    "atchmntSanctn",
    "attchId",
    "attchNm",
    "attchPath",
    "attchValue",
    "auditDetails",
    "bankName",
    "billIndexId",
    "billOfEntryList",
    "billPayment",
    "billRemarks",
    "bills",
    "bnfAccNo",
    "boeAmnt",
    "boeAmntReq",
    "boeDate",
    "boeDateReq",
    "boeNo",
    "boeNoReq",
    "brnchNm",
    "brnchNmMng",
    "carrierNm",
    "cbs",
    "cbsCntrctLcNum",
    "cbsCntrctRefNo",
    "cemail",
    "cifId",
    "cntDate",
    "cntryId",
    "code",
    "conscnChrg",
    "conscnFixdAmnt",
    "conscnPrcntg",
    "contNo",
    "contractRdio",
    "contrefno",
    "csms",
    "currency",
    "custId",
    "custNm",
    "customer",
    "declrCumUnd",
    "deliveryRdio",
    "depAcc",
    "deptId",
    "descGdsRmrks",
    "dgftPolicy",
    "docCd",
    "docCdReqq",
    "docDesc",
    "docDescReq",
    "docDt",
    "docDtReqq",
    "docEdDate",
    "docRefNo",
    "docRefNoReqq",
    "docStDate",
    "docTp",
    "docTpReqq",
    "dpCode",
    "dpCodeMng",
    "draftBy",
    "draftCustomerNm",
    "draftDays",
    "draftTenor",
    "drweAccNo",
    "drweBnkDtlsId",
    "drweBnkNm",
    "dscrpncyDtls",
    "dscrpncyDtlsId",
    "dscrpncyGdsDsc",
    "dscrpncyInvNo",
    "dscrpncyObsrvdList",
    "dscrpncyPlDlvry",
    "dscrpncyPlRcpt",
    "dscrpncyPod",
    "dscrpncyPol",
    "eMail",
    "encAdvRemId",
    "encAttchId",
    "encFwdCntId",
    "encImportBillsId",
    "encTaskId",
    "encdata",
    "error",
    "expimpRdio",
    "fccAccNo",
    "fcyReq",
    "fdEdDate",
    "fdStDate",
    "file",
    "filename",
    "formAccDtlsList",
    "formCmmnAcc",
    "formCmmnAccId",
    "formCustDtlsId",
    "formDt",
    "formFrwdCntrctDtlsList",
    "formPlace",
    "formRtCvrDtlsList",
    "formRtCvrDtlsOffList",
    "formStatus",
    "frmCrDate",
    "frmCrDateMd",
    "frmFcy",
    "frmFcyReq",
    "frwdCntrctDtlsId",
    "fwdCntCustDtls",
    "fwdCntDtls",
    "fwdCntId",
    "fwdCntStatus",
    "goodsShpmntDt",
    "historyBeanList",
    "historyList",
    "historyVoList",
    "hsCode",
    "ieCode",
    "impBillsDrweBnkDtls",
    "impBillsShipDtls",
    "impBillsStatusId",
    "impBillsSupDrwDtls",
    "impLicNo",
    "importBillsCustDtls",
    "importBillsForm",
    "importBillsId",
    "importBillsStatus",
    "inCoTerms",
    "instMstList",
    "interSwiftCode",
    "invAmount",
    "invDt",
    "invDtReq",
    "invNo",
    "invNoReq",
    "isBillEntry",
    "isDiscrpntLC",
    "isEditable",
    "isFccAccSetlmnt",
    "isFrwdCntrct",
    "isGdsDsc",
    "isPlDlvry",
    "isPod",
    "isPol",
    "isRtCvrWithTrDr",
    "isSwiftCodeNotAvl",
    "isinvNo",
    "isplRcpt",
    "lcDate",
    "lcNum",
    "lcShipDtlsId",
    "letterOfCredit",
    "licNo",
    "loginId",
    "ltstShpMntDt",
    "mobNo",
    "name",
    "nameTemp",
    "noOfCopies",
    "noOfCopiesReqq",
    "noOfOrgnls",
    "noOfOrgnlsReqq",
    "nosCharge",
    "nostroMaster",
    "oemail",
    "offcReqDocList",
    "office",
    "officeAttchList",
    "officeDclrtnList",
    "officeMisList",
    "officeReqId",
    "officeUse",
    "officeUseId",
    "osms",
    "otherDtls",
    "othrBnkRefNo",
    "othrCurrency",
    "othrDoc",
    "outWardStatus",
    "outWardStatusId",
    "outwrdRmtncDtlsId",
    "page",
    "panNo",
    "partFullPayment",
    "pendingDays",
    "pinCode",
    "plDlvry",
    "plRcpt",
    "pod",
    "pol",
    "portCode",
    "portCodeReq",
    "priority",
    "proInvDt",
    "proInvNo",
    "processHistoryId",
    "processStatus",
    "processStatusId",
    "processTypeId",
    "prtlShpmntAllwd",
    "puposedesc",
    "purposeCd",
    "rate",
    "rateReq",
    "remarks",
    "reqBodyObject",
    "reqType",
    "reqUrl",
    "retAdno",
    "retAdnoReq",
    "rmtncCrncyDtlsId",
    "rowIndx",
    "rtCvrDtlsId",
    "sNo",
    "sanctnAttNm",
    "sanctnAttPath",
    "scanAttchNm",
    "shpmntDtls",
    "shpmntInfo",
    "shpmntMrks",
    "signature",
    "statChngdBy",
    "statChngdDt",
    "statChngdUser",
    "stateId",
    "supDrweDtlsId",
    "swftCntryId",
    "swiftBnkAbaCdDesc",
    "swiftBnkAbacd",
    "swiftBnkAddr1",
    "swiftBnkAddr2",
    "swiftBnkNm",
    "swiftCode",
    "swiftFixdAmnt",
    "swiftPrcntg",
    "sysRefDt",
    "sysRefNo",
    "takeConvsnRtOnBhlf",
    "taskId",
    "telNo",
    "toCrDate",
    "toCrDateMd",
    "toFcy",
    "toFcyReq",
    "totAccAmnt",
    "totFrwdCntrct",
    "totRtCvrAmnt",
    "totRtCvrOffAmnt",
    "transRefNo",
    "transShpmntAllwd",
    "typeOfGoods",
    "usrId",
    "valDate",
    "whrLcIsRcvByCN",
    "wrkInPrgs"
];

const missingPara = ["travelAndOtherDesc",
    "ultimateBenCountry",
    "currencyMoreDtls",
    "outRmtncId",
    "remittaceScheme",
    "frngExchng",
    "othrCurrncy",
    "srcOfFund",
    "purpose",
    "rltnShipOfBnf",
    "studentNm",
    "studentId",
    "cntryOfStdyAbrd",
    "propState",
    "propCntry",
    "nmOfCmpny",
    "isListedCmpny",
    "uinNo",
    "invsmntTpList",
    "addtnlInfo",
    "addtnlInfo1",
    "addtnlInfo2",
    "addtnlInfo3",
    "autoLq",
    "mdOfPymnt",
    "beneNam",
    "bnkNm",
    "bnfDtlsId",
    "accTp",
    "fcy",
    "amnt",
    "srNo",
    "rmtncDtlsCrncyList",
    "totalRmtncAmnt",
    "dclrNm",
    "finYr",
    "usdFrm",
    "usdTo",
    "isFccAccStlment",
    "docAttchNm",
    "attchCd",
    "isChckd",
    "prodCd",
    "lcFormId",
    "lcCustDtls",
    "lcTransThrgh",
    "lcTransBnk",
    "bnkNm",
    "fullAddr",
    "fullAddr1",
    "fullAddr2",
    "othrTransBnk",
    "cntryNm",
    "isAgree",
    "insCmpny",
    "policyNo",
    "policyAmount",
    "formCoverDt",
    "formEndDt",
    "tpSecurity",
    "lCChrgDtls",
    "accOf",
    "prdPresentation",
    "chrgCnfrm",
    "cnfrmChrsAccOf",
    "pymntInstruc",
    "sndrRcvrInfo",
    "docReq",
    "addCondition",
    "hsDesc",
    "lCFormDtls",
    "tollerance",
    "tolAvlWith",
    "bnkNm",
    "tolAvlBy",
    "defPymntRmrks",
    "mixPymntRmrks",
    "tpSecurity",
    "partialShipment",
    "transShipment",
    "expiryDate",
    "placeExpiry",
    "docAttchNm",
    "attchCd",
    "isChckd"]


var result = missingPara.filter(item => currentWhitelist.indexOf(item) == -1);
console.log(result);