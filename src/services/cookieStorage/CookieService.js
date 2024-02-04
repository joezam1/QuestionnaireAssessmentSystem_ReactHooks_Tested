import CookieHelper from './CookieHelper.js';
import MonitorService from '../monitoring/MonitoringService.js';

const CookieService = (function(){

//Test: DONE
const insertCookieInDataStore = function(cookieName, cookieValue, optionsObject){
    try{
        MonitorService.capture('optionsObject', optionsObject)
        let properties = {
            path: optionsObject.path,
            maxAge : optionsObject.maxAge,
            sameSite: 'Lax'
        }
        CookieHelper.setCookie(cookieName, cookieValue, properties.path, properties.sameSite, properties.maxAge);
        return 'ok';
    }
    catch(error){
        let errorMessage= new Error('Failed to save the cookie to the storage: ', error);
        MonitorService.capture('errorMessage', errorMessage);
        return error;
    }
}
//Test: DONE
const getCookieFromDataStoreByName = function(cookieName){
    let selectedCookie = CookieHelper.getCookieValueByName(cookieName);
    return selectedCookie;
}

const getCookieExpiryUTCDate = function(){
    const result =  CookieHelper.getCookieExpiryUTCDate();
    return result;
}

//Test: DONE
const deleteCookieFromDataStoreByNameAndPath = function(cookieName, cookiePath){
    try{
        CookieHelper.deleteCookieByNameSecurely(cookieName, cookiePath);
        return 'OK';
    }
    catch(error){
        let errorMessage= new Error('Failed to Delete the cookie from the storage: ', error);
        MonitorService.capture('errorMessage', errorMessage);
        return errorMessage;
    }
}
//Test: DONE
const sessionCookieIsExpired = function(cookieSessionUTCDateExpired){
    let dateNow = new Date();
    //To convert to UTC datetime by subtracting the current Timezone offset
    var utcDate =  new Date(dateNow.getTime() + (dateNow.getTimezoneOffset()*60000));
    let dateExpiredUtcAsDate = new Date(cookieSessionUTCDateExpired)
    MonitorService.capture('sessionCookieIsExpired-utdDate', utcDate);
    MonitorService.capture('sessionCookieIsExpired-dateExpiredUtcAsDate', dateExpiredUtcAsDate);

    let dateNowUtcAsTime = utcDate.getTime();
    let dateExpiredUtcAsTime = dateExpiredUtcAsDate.getTime();
    if( dateNowUtcAsTime > dateExpiredUtcAsTime){
        return true;
    }
    return false;
}

return Object.freeze({
    insertCookieInDataStore : insertCookieInDataStore,
    getCookieFromDataStoreByName : getCookieFromDataStoreByName,
    getCookieExpiryUTCDate : getCookieExpiryUTCDate,
    deleteCookieFromDataStoreByNameAndPath : deleteCookieFromDataStoreByNameAndPath,
    sessionCookieIsExpired : sessionCookieIsExpired
});
})();

export default CookieService;