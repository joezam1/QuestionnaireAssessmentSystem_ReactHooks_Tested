import React, {useState, useEffect} from 'react';
import { Link, Navigate} from 'react-router-dom';

import MonitorService from '../../services/monitoring/MonitoringService.js';
import InputCommonInspector from '../../services/validators/InputCommonInspector.js';
import Role from '../../services/enumerations/Role.js';
import UserRegisterViewModel from '../../viewModels/UserRegister.js';
import SexType from '../../services/enumerations/SexType.js';

import ValidationService from '../../services/validators/ValidationService.js';
import NotificationService from '../../services/notifications/NotificationService.js';

import EnvConfig from '../../configuration/environment/EnvConfig.js';
import ApiEndpointsConfig from '../../configuration/server/ApiEndpointsConfig.js';
import RoutePathConfig from '../../configuration/clientRoutes/RoutePathConfig.js';  
import RequestMethodService from '../../services/HttpProtocol/RequestMethodService.js';
import httpResponseStatus from '../../services/enumerations/httpResponseStatus.js';

export default function Register(){

    const [notificationInfo, setNotification] = useState('');
    const [isRegistered, setRegisterStatus] = useState(false);
    const [firstNameErrors, setFirstNameErrors] = useState('');
    const [middleNameErrors, setMiddleNameErrors] = useState('');
    const [lastNameErrors, setLastNameErrors] = useState('');
    const [usernameErrors, setUsernameErrors] = useState('');
    const [emailErrors, setEmailErrors] = useState('');
    const [sexErrors, setSexErrors] = useState('');
    const [passwordErrors, setPasswordErrors] = useState('');
    const [confirmPasswordErrors, setConfirmPasswordErrors] = useState('');
    const [sexTypeOptions, setSexTypeOptions] = useState([]);


    let userInfo = null;

    useEffect(()=>{

        let allSexTypesArray = getSexTypeArray();
        let allOptionsArray = allSexTypesArray.map((sexType, index)=>{
            return <option key={index} id={index} index={index} value={sexType}>{sexType}</option>
        });
        setSexTypeOptions(allOptionsArray);

    }, []);


    const getSexTypeArray = function(){
        let sexTypeArray = [];
        for(let key in SexType){
            if(SexType.hasOwnProperty(key)){
                let value = SexType[key];   
                 
                if( key > 0 ){
                    sexTypeArray.push(value);
                }
            }
        }
        return sexTypeArray;
    }

    const registerUserCallback = (response) => {
        console.log('RegisterUserCallback-response', response);
        MonitorService.capture('RegisterUserCallback-response', response);
        switch (response.status) {
            case httpResponseStatus._201created:     
            case httpResponseStatus._200ok:                
                setNotificationPromise(NotificationService.registrationSuccess)
                .then(setRegisterStatusPromise(true));
                break;

            case httpResponseStatus._401unauthorized:
                let responseObj = (typeof response.result === 'object')
                if (responseObj) {
                    setNotification(NotificationService.errorsInForm);
                    MonitorService.capture('userInfo', userInfo);
                    let errorMessagesReport = ValidationService.buildErrorMessagesReport(response.result, userInfo);
                    setAllErrorMessages(errorMessagesReport);
                    break;
                }
                setNotification(response.result);
                break;

            case httpResponseStatus._400badRequest:
                setNotification(NotificationService.registrationFailed);
                break;

            default:
                setNotification(NotificationService.registrationNonProcessable);
                break;
        }
    }

    function setNotificationPromise(message) {
        let promise = new Promise(function (resolve, reject) {
            resolve(setNotification(message));
        });
        return promise;
    }

    function setRegisterStatusPromise(status) {
        let promise = new Promise(function (resolve, reject) {
            //NOTE: Wait 5 seconds to display the SUCCESS registering the account,
            //Then redirect the user to the Login Page
            setTimeout(function () { resolve(setRegisterStatus(status)); }, 3000);
        })
        return promise;
    }

    function processUserRegistration(){
        setAllErrorMessages({});
        setNotification('');
        var form = document.getElementById('registerClientForm');
        if (form !== null) {
            console.log(form);          
            MonitorService.capture('processUserRegistration-form', form);

            let dataModel = {
                firstName: (InputCommonInspector.objectIsValid(form[0])) ? form[0].value : '',
                middleName: '',
                lastName: (InputCommonInspector.objectIsValid(form[1])) ? form[1].value : '',
                username: (InputCommonInspector.objectIsValid(form[2])) ? form[2].value : '',
                email: (InputCommonInspector.objectIsValid(form[3])) ? form[3].value : '',
                sex: (InputCommonInspector.selectedSexOptionIsValid(form[4])) ? SexType[form[4].value] : '',
                password: (InputCommonInspector.objectIsValid(form[5])) ? form[5].value : '',
                confirmPassword: (InputCommonInspector.objectIsValid(form[6])) ? form[5].value : '',
                userRole: Role.BaseClient
            }
            const userRegisterViewModel = new UserRegisterViewModel(dataModel);
            MonitorService.capture('processUserRegistration-userRegisterViewModel', userRegisterViewModel);

            userInfo = userRegisterViewModel;
           
            if (!inputsAreValid(userRegisterViewModel)) { return; }

            const registerUrl = EnvConfig.PROTOCOL + '://' + EnvConfig.TARGET_URL + ApiEndpointsConfig.apiUsersRegisterPathPost;
            console.log('registerUrl: ', registerUrl);

            RequestMethodService.postMethod(registerUrl, dataModel, registerUserCallback);
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

    function adaptSexErrorsReport(inputReport){
        const errorsReport = inputReport.replace('of type number', 'selected');
        return errorsReport;
    }

    function setAllErrorMessages(errorsReportObj) {

        let firstNameAllErrors = InputCommonInspector.objectIsValid(errorsReportObj) ? errorsReportObj.firstNameAllErrors : '' ;
        let lastNameAllErrors = InputCommonInspector.objectIsValid(errorsReportObj) ? errorsReportObj.lastNameAllErrors : '' ;
        let usernameAllErrors = InputCommonInspector.objectIsValid(errorsReportObj) ? errorsReportObj.usernameAllErrors : '' ;
        let emailAllErrors = InputCommonInspector.objectIsValid(errorsReportObj) ? errorsReportObj.emailAllErrors : '' ;
        let sexAllErrors = InputCommonInspector.objectIsValid(errorsReportObj) ? errorsReportObj.sexAllErrors : '' ;
        sexAllErrors = adaptSexErrorsReport(sexAllErrors);
        let passwordAllErrors = InputCommonInspector.objectIsValid(errorsReportObj) ? errorsReportObj.passwordAllErrors : '' ;
        let confirmPasswordAllErrors = InputCommonInspector.objectIsValid(errorsReportObj) ? errorsReportObj.confirmPasswordAllErrors : '' ;


        setFirstNameErrors(firstNameAllErrors);
        setLastNameErrors(lastNameAllErrors);
        setUsernameErrors(usernameAllErrors);
        setEmailErrors(emailAllErrors);
        setSexErrors(sexAllErrors);
        setPasswordErrors(passwordAllErrors);
        setConfirmPasswordErrors(confirmPasswordAllErrors);
    }

    if (isRegistered) {
        return <Navigate to={RoutePathConfig.loginPath} />
     
    }

    return(<div className='registerComponent outerLayout'>
         <div className='innerLayout'>
         <p className='textLeft margin10'>{notificationInfo}</p>
            <h3>Register</h3>
            <form action="/api/register" method="post" id="registerClientForm" className="form">
                <input type="text" name="firstName" placeholder="First Name" className="inputForm" onFocus={() => { setFirstNameErrors(''); setNotification('');}} />
                <div className='textLeft margin10 danger'>
                    <span dangerouslySetInnerHTML={{ __html: firstNameErrors }}></span>
                </div>
                <input type="text" name="lastName" placeholder="Last Name" className="inputForm" onFocus={() => { setLastNameErrors(''); setNotification('');}} />
                <div className='textLeft margin10 danger'>
                    <span dangerouslySetInnerHTML={{ __html: lastNameErrors }}></span>
                </div>
                <input type="text" name="username" placeholder="Username" className="inputForm" onFocus={() => { setUsernameErrors(''); setNotification('');}} />
                <div className='textLeft margin10 danger'>
                    <span dangerouslySetInnerHTML={{ __html: usernameErrors }}></span>
                </div>
                <input type="email" name="enail" placeholder="Email" className="inputForm" onFocus={() => { setEmailErrors(''); setNotification('');}} />
                <div className='textLeft margin10 danger'>
                    <span dangerouslySetInnerHTML={{ __html: emailErrors }}></span>
                </div>

                <div>
                    <label htmlFor="sex">Sex:</label>
                    <select name="sex" id="sex" onFocus={() => { setSexErrors(''); setNotification('');}}>
                        <option value="select">Select an Option</option>
                        {sexTypeOptions}
                    </select>
                    <div className='textLeft margin10 danger'>
                        <span dangerouslySetInnerHTML={{ __html: sexErrors }}></span>
                    </div>
                </div>

                <input type="password" name="password" placeholder="Password" className="inputForm" onFocus={() => { setPasswordErrors(''); setNotification('');}} />
                <div className='textLeft margin10 danger'>
                    <span dangerouslySetInnerHTML={{ __html: passwordErrors }}></span>
                </div>
                <input type="password" name="confirmPassword" placeholder="Confirm Password" className="inputForm" onFocus={() => { setConfirmPasswordErrors(''); setNotification('');}} />
                <div className='textLeft margin10 danger'>
                    <span dangerouslySetInnerHTML={{ __html: confirmPasswordErrors }}></span>
                </div>

                <button type="button" name="button" onClick={() => { processUserRegistration(); }} value="Register" className="inputForm btnCreate " data-testid="register-customer-form-id">Register</button>
            </form>
           
            <div className='textLeft margin10'> Already Registered? Please <Link to={RoutePathConfig.loginPath}  data-testid="link-login-id" className='noTextDecoration'> LogIn </Link> </div>
        </div>            
    </div>);
}