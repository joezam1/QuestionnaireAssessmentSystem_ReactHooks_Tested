'use strict'

import HttpRequest from './HttpRequest.js';
import HttpRequestMethod from '../enumerations/HttpRequestMethod.js';
import CookieProperty from '../stringLiterals/CookieProperty.js';
import LocalStorageService from '../localStorage/LocalStorageService.js';
import CookieService from '../cookieStorage/CookieService.js';

//Test:DONE
let getMethod = function (url, responseCallback, selectedHeaders = null) {
    let options = {
        method: HttpRequestMethod[HttpRequestMethod.GET],
        mode:'cors',
        headers: getHeaders(selectedHeaders)
    }
    console.log('fetchMethod-url', url);
    console.log('fetchMethod-options', options);
    HttpRequest.fetchMethod(url, options, responseCallback);
}

//Test:DONE
let postMethod = function (url, payload, responseCallback, selectedHeaders = null) {
    let jsonPayload = JSON.stringify(payload);

    let options = {
        method: HttpRequestMethod[HttpRequestMethod.POST],
        mode:'cors',
        cache: "no-cache",        
        headers: getHeaders(selectedHeaders),
        body: jsonPayload
    }

    HttpRequest.fetchMethod(url, options, responseCallback);
}

//Test: DONE
let deleteMethod = function (url, payload, responseCallback, selectedHeaders = null) {
    let jsonPayload = JSON.stringify(payload);

    let options = {
        method: HttpRequestMethod[HttpRequestMethod.DELETE],
        mode:'cors',
        headers: getHeaders(selectedHeaders),
        body: jsonPayload
    }

    HttpRequest.fetchMethod(url, options, responseCallback);
}

const RequestMethodService = Object.freeze({
    getMethod : getMethod,
    postMethod : postMethod,
    deleteMethod : deleteMethod
});

export default RequestMethodService;



//#REGION Private Methods

function getSessionToken(){
    const cookieName = LocalStorageService.getItemFromLocalStorage(CookieProperty.NAME);
    const sessionToken = CookieService.getCookieFromDataStoreByName(cookieName);
    return sessionToken; 
}

function getHeaders(selectedHeadersObj) {
    let defaultHeadersObj = {
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + getSessionToken(),
    }
    let authHeaders = null ;
    let headers = Object.assign({},defaultHeadersObj,authHeaders,selectedHeadersObj)
    return headers;
}

//#ENDREGION Private Methods