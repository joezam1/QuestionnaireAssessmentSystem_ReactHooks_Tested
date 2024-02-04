import React, {useState} from 'react';
import { Link , Navigate} from 'react-router-dom';

import UserLoginViewModel from '../../viewModels/UserLogin';

import MonitorService from '../../services/monitoring/MonitoringService.js';
import ValidationService from '../../services/validators/ValidationService.js';
import InputCommonInspector from '../../services/validators/InputCommonInspector.js';
import EnvConfig from '../../configuration/environment/EnvConfig.js';
import ApiEndpointsConfig from '../../configuration/server/ApiEndpointsConfig.js';
import httpResponseStatus from '../../services/enumerations/httpResponseStatus.js';
import RequestMethodService from '../../services/HttpProtocol/RequestMethodService';
import LocalStorageService from '../../services/localStorage/LocalStorageService.js';
import CookieProperty from '../../services/stringLiterals/CookieProperty';
import CookieService from '../../services/cookieStorage/CookieService';
import RoutePathConfig from '../../configuration/clientRoutes/RoutePathConfig';
import NotificationService from '../../services/notifications/NotificationService';


export default function Login(){

    const [notificationInfo, setNotification] = useState('');
    const [isLoggedIn, setUserLogin] = useState(false);
    const [emailErrors, setEmailErrors] = useState('');
    const [passwordErrors, setPasswordErrors] = useState('');


    let userInfo = null;


    
    function loginUserCallback(response) {
        MonitorService.capture('loginUserCallback-response', response);

        switch (response.status) {
            case httpResponseStatus._200ok:
            case httpResponseStatus._201created:
                let data = response.result;
                let name = data.session.fieldValue.name;
                let value = data.session.fieldValue.value;
                let properties = data.session.fieldValue.properties;
                LocalStorageService.setItemInLocalStorage(CookieProperty.NAME, name);
                LocalStorageService.setItemInLocalStorage(CookieProperty.PATH, properties.path);
                let resultCookieStorage = CookieService.insertCookieInDataStore(name, value, properties);
                let cookieExpiryUTCDate = CookieService.getCookieExpiryUTCDate();
                console.log('cookieExpiryUTCDate : ', cookieExpiryUTCDate);
                MonitorService.capture('resultCookieStorage', resultCookieStorage)
                
                setUserLogin(true);

                break;

            case httpResponseStatus._401unauthorized:
                let responseObj = (typeof response.result === 'object')
                if (responseObj) {
                    setNotification(NotificationService.errorsInForm);
                    MonitorService.capture('userInfo: ', userInfo);
                    
                    let errorMessagesReport = ValidationService.buildErrorMessagesReport(response.result, userInfo);
                    setAllErrorMessages(errorMessagesReport);
                    break;
                }
                setNotification(response.result);
                break;

            case httpResponseStatus._400badRequest:
                MonitorService.capture('LOGIN: Failure Error: ', response);
                setNotification(NotificationService.loginFailed);
                break;

            default:
                setNotification(NotificationService.loginNonProcessable);
                break;
        }
    }


    function processUserLoginSession() {
        setNotification('');

        let form = document.getElementById('loginClientForm');
        if (form !== null) {
            MonitorService.capture('processUserRegistration-form', form);
            const UserLoginDataModel = {
                email : (InputCommonInspector.objectIsValid(form[0])) ? form[0].value : '',
                password : (InputCommonInspector.objectIsValid(form[1])) ? form[1].value : ''
            };
            const userLogin = new UserLoginViewModel(UserLoginDataModel);
            MonitorService.capture('processUserRegistration-userLogin', userLogin);
            userInfo = userLogin;
            if (!inputsAreValid(userLogin)) { return; }

            MonitorService.capture('UserLoginDataModel:', UserLoginDataModel);
            const loginUrl = EnvConfig.PROTOCOL + '://' + EnvConfig.TARGET_URL + ApiEndpointsConfig.apiUsersLoginPathPost;
            
            RequestMethodService.postMethod(loginUrl, UserLoginDataModel, loginUserCallback);
        }
    }

    
    function inputsAreValid(objModel) {
        let errorsReport = ValidationService.resolveUserFormValidation(objModel);
        if (!InputCommonInspector.objectIsNullOrEmpty(errorsReport)) {
            setNotification(NotificationService.errorsInForm);
            let errorMessagesReport = ValidationService.buildErrorMessagesReport(errorsReport, objModel);
            setAllErrorMessages(errorMessagesReport);
            return false;
        }

        return true;
    } 

    
    function setAllErrorMessages(errorsReport) {
        setEmailErrors(errorsReport.emailAllErrors);
        setPasswordErrors(errorsReport.passwordAllErrors);
    }

    if (isLoggedIn) {
        MonitorService.capture('LOGIN-PAGE-isLoggedIn', isLoggedIn);
       return <Navigate to={RoutePathConfig.homePath} />
    }

    return(<div className='registerComponent outerLayout'>
        <div className='innerLayout'>
        
            <p>{notificationInfo}</p>

            <div className='header-container'>
                <div className='header-title silverBorder'>
                    <div className='topNavigationBar'>
                        <div className='floatLeft margin10'>Login</div>                       
                    </div>
                </div>
            </div>

            <form action="/api/login" method="post" id="loginClientForm" className="form">

                <input type="email" name="enail" placeholder="Email" className="inputForm" onFocus={() => { setEmailErrors(''); }} />
                <div className='textLeft margin10 danger'>
                    <span dangerouslySetInnerHTML={{ __html: emailErrors }}></span>
                </div>

                <input type="password" name="password" placeholder="Password" className="inputForm" onFocus={() => { setPasswordErrors(''); }} />
                <div className='textLeft margin10 danger'>
                    <span dangerouslySetInnerHTML={{ __html: passwordErrors }}></span>
                </div>

                <button type="button" name="button" onClick={() => { processUserLoginSession(); }} value="submit" className="inputForm btnCreate ">Login</button>
            </form>

            <div className='textLeft margin10'> Not Registered yet? Please <Link to={RoutePathConfig.registerPath}  data-testid="link-login-id" className='noTextDecoration'> Register </Link>
            </div>
        </div>
    </div>);
}