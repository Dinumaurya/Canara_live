import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {

    constructor() { }

    // encrypt
    encrypt(message: string, key: string) {
        var ciphertext = CryptoJS.AES.encrypt(
            message,
            CryptoJS.enc.Base64.parse(key),
            {
                mode: CryptoJS.mode.ECB
            }
        );
        return ciphertext.toString();
    }

    // decrypt
    decrypt(ciphertext: string, key: string) {
        var bytes = CryptoJS.AES.decrypt(
            ciphertext,
            CryptoJS.enc.Base64.parse(key),
            {
                mode: CryptoJS.mode.ECB
            }
        );
        var message = bytes.toString(CryptoJS.enc.Utf8);
        return message;
    }

}
