import React , {useEffect , useState} from 'react';
import { Link, Navigate } from 'react-router-dom';

import RoutePathConfig from '../../configuration/clientRoutes/RoutePathConfig';
import EnvConfig from '../../configuration/environment/EnvConfig';
import ApiEndpointsConfig from '../../configuration/server/ApiEndpointsConfig';
import RequestMethodService from '../../services/HttpProtocol/RequestMethodService'; 
import MonitorService from '../../services/monitoring/MonitoringService.js';
import HttpResponseStatus from '../../services/enumerations/httpResponseStatus';
import NotificationService from '../../services/notifications/NotificationService';
import SessionConfig from '../../configuration/authentication/SessionConfig.js';
import LocalStorageService from '../../services/localStorage/LocalStorageService';
import CookieService from '../../services/cookieStorage/CookieService';
import CookieProperty from '../../services/stringLiterals/CookieProperty';
import InputCommonInspector from '../../services/validators/InputCommonInspector';
import QuestionnaireConfig from '../../configuration/server/QuestionnaireConfig';

export default function Logout(){
    
    const [ notificationInfo, setNotification ] = useState('');
    const [ isLoggedOut, setLogoutStatus] = useState(false);
    let _countdown = 5;


    useEffect(()=>{
        processDeleteSessionTokenInCookie();
        processUserLogoutSession();
    }, []);

    function processDeleteSessionTokenInCookie(){
        let cookieName =  LocalStorageService.getItemFromLocalStorage(CookieProperty.NAME);
        let cookiePath =  LocalStorageService.getItemFromLocalStorage(CookieProperty.PATH);
        let cookieValue = CookieService.getCookieFromDataStoreByName(cookieName);
        if( InputCommonInspector.stringIsValid( cookieValue) ){
            removeAllSessionInformation(cookieName, cookiePath);
        }
    }

    function removeAllSessionInformation( cookieName, cookiePath ){
        //Session
        CookieService.deleteCookieFromDataStoreByNameAndPath(cookieName, cookiePath);
        LocalStorageService.removeItemFromLocalStorage(CookieProperty.NAME);
        LocalStorageService.removeItemFromLocalStorage(CookieProperty.PATH);
        
        const questionnaireNameDefault = QuestionnaireConfig.MainQuestionnaireName + QuestionnaireConfig.MainQuestionnaireClass;
        const questionnaireNameActive = QuestionnaireConfig.MainQuestionnaireName + QuestionnaireConfig.MainQuestionnaireStatusActive;
        
        const _sectionCounterLocalStorage = QuestionnaireConfig.MainQuestionnaireSectionCounterName;
        const _sectionPageLocalStorage = QuestionnaireConfig.MainQuestionnaireCurrentSectionPage;
        const _questionsAnsweredCounterName = QuestionnaireConfig.MainQuestionnaireQuestionsAnsweredCounter;

        LocalStorageService.removeItemFromLocalStorage(questionnaireNameDefault);
        LocalStorageService.removeItemFromLocalStorage(questionnaireNameActive);

        LocalStorageService.removeItemFromLocalStorage(_sectionCounterLocalStorage);
        LocalStorageService.removeItemFromLocalStorage(_sectionPageLocalStorage);
        LocalStorageService.removeItemFromLocalStorage(_questionsAnsweredCounterName);
    }

    function processUserLogoutSession(){

        let logoutUrl = EnvConfig.PROTOCOL +'://' + EnvConfig.TARGET_URL + ApiEndpointsConfig.apiUserslogoutPathPost;
        let dataModel = { }   
        RequestMethodService.postMethod(logoutUrl, dataModel, logoutUserCallback);
    }


    
    function logoutUserCallback(response){
        MonitorService.capture('logoutUserCallback-response:', response);
        switch(response.status){

            case HttpResponseStatus._200ok:
                let success = NotificationService.logoutSuccess + ' in ' + _countdown + ' seconds.';
                setNotification(success );
                delayRedirect();
            break;

            case HttpResponseStatus._401unauthorized:
                setNotification(NotificationService.logoutUnauthorized);
                delayRedirect();
            break;

            case HttpResponseStatus._403forbidden:
                setNotification(NotificationService.logoutForbidden);
                delayRedirect();
            break;

            case HttpResponseStatus._400badRequest:
                setNotification( NotificationService.logoutFailed );
            break;

            default:
                setNotification( NotificationService.logoutNonProcessable);
            break;
        }

    }

    function delayRedirect(){
        MonitorService.capture('_countdown-BEFORE : ',_countdown);
        let intervalId = setInterval(function(){
        _countdown--;
        MonitorService.capture('_countdown-AFTER : ',_countdown);
            if(_countdown === 0 ){
                setLogoutStatus(true);
                clearInterval(intervalId);
            }

        }, SessionConfig.ONE_SECOND_IN_MILLISECONDS);
    }


    if(isLoggedOut){
        return <Navigate to={RoutePathConfig.loginPath} />
    }

    return(<div className="logoutComponent outerLayout">
    <div className='innerLayout'>

        <div className='header-container'>
            <div className='header-title silverBorder'>
                <div className='topNavigationBar'>
                    <div className='floatLeft margin10'>You are Logged Out</div>
                    <ul className='floatRight'>
                        <li className='inlineBlock btnCreate'> <Link to={RoutePathConfig.loginPath} className="noTextDecoration">Login Again</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div>
        {notificationInfo}
    </div>
</div>)
}