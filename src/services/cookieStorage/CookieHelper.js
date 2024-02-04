import jsCookie from 'js-cookie';

const CookieHelper = (function(){

    let _cookieExpiryUTCDate = null;



    const setCookie = function (cookieName, cookieValue, path, sameSite, milliseconds= null) {
        var expires = "";
        if (milliseconds !== null) {
        let localeDate = new Date();
        localeDate.setTime(localeDate.getTime() + (milliseconds));
        let dateAsUTC = localeDate.toUTCString();
        _cookieExpiryUTCDate = dateAsUTC;
        expires = "Expires=" + dateAsUTC;
        }
        document.cookie = cookieName + "=" + cookieValue + ';Path='+ path+';' +'SameSite='+sameSite+';' +  expires;
    }

    const setCookieWithExpiryTime = function(sessionCookieName, sessionCookieValue, path, utcDateExpired) {

        jsCookie.set(sessionCookieName, sessionCookieValue, {
            path: path,
            expires: utcDateExpired
        })
    }

    const getCookieExpiryUTCDate = function(){
        return _cookieExpiryUTCDate;
    }

    const getCookieValueByName = function(cookieName){
        let selectedCookie = jsCookie.get(cookieName);

        return selectedCookie;
    }

    const deleteCookieByNameSecurely = function(cookieName, cookiePath){
        document.cookie = cookieName +'=; Path='+ cookiePath +'; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

   

    return Object.freeze({
        setCookie : setCookie,        
        setCookieWithExpiryTime : setCookieWithExpiryTime,
        getCookieExpiryUTCDate : getCookieExpiryUTCDate,
        getCookieValueByName : getCookieValueByName,
        deleteCookieByNameSecurely : deleteCookieByNameSecurely
    });
})();
export default CookieHelper;