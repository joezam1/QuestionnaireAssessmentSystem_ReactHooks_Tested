import React, {useEffect , useState} from 'react'
import { Link, Navigate } from 'react-router-dom';
import RequestMethodService from '../../services/HttpProtocol/RequestMethodService.js';
import EnvConfig from '../../configuration/environment/EnvConfig.js';
import ApiEndpointsConfig from '../../configuration/server/ApiEndpointsConfig.js';
import QuestionnaireConfig from '../../configuration/server/QuestionnaireConfig.js';
import LocalStorageService from '../../services/localStorage/LocalStorageService.js';
import InputCommonInspector from '../../services/validators/InputCommonInspector.js';
import JsonInspector from '../../services/validators/JSonInspector.js';

import NavigationBar from '../../components/NavigationBar.jsx';
import RoutePathConfig from '../../configuration/clientRoutes/RoutePathConfig.js';
import httpResponseStatus from '../../services/enumerations/httpResponseStatus.js';
import MonitorService from '../../services/monitoring/MonitoringService.js';


export default function Home(){
    const [userIsAuthorized, setAuthorization] = useState(true);
    const questionnaireNameDefault = QuestionnaireConfig.MainQuestionnaireName + QuestionnaireConfig.MainQuestionnaireClass;
    
    
    useEffect(()=>{
        const questionnaireObj = LocalStorageService.getItemFromLocalStorage(questionnaireNameDefault);
        if(InputCommonInspector.objectIsNullOrEmpty(questionnaireObj)){
            const questionnaireUrl = EnvConfig.PROTOCOL + '://' + EnvConfig.TARGET_URL + ApiEndpointsConfig.apiQuestionnaireIndex + '/'+ QuestionnaireConfig.MainQuestionnaireIndex;
            RequestMethodService.getMethod(questionnaireUrl, homeResourcesCallback);
        }   
          
    }, []);
    function homeResourcesCallback(response) {
        switch (response.status) {
            case httpResponseStatus._201created: 
            case httpResponseStatus._200ok:     
                MonitorService.capture('loginUserCallback-response', response);
                console.log("HTTP_response:",response);
                let objString = JSON.stringify(response.result);
                if(JsonInspector.isValidJson(objString)){
                    LocalStorageService.setItemInLocalStorage(questionnaireNameDefault, objString);  
                }
            break;

            case httpResponseStatus._401unauthorized:    
            setAuthorization(false);  
            break;
        }
    }

    if(!userIsAuthorized){
        return <Navigate to={RoutePathConfig.logoutPath} /> 
    }

    return (
        <div className='homeComponent outerLayout'>
            <div className='innerLayout'>
                <h3>Dashboard</h3>
                <ul className='floatRight'>
                    <li className='inlineBlock btnCreate'>                       
                        <Link to={RoutePathConfig.logoutPath } className="noTextDecoration">Logout</Link>
                    </li>
                </ul>
                <NavigationBar/>
            </div>            
        </div>
    );
}