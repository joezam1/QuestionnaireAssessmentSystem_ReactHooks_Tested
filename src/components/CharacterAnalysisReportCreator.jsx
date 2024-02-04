import React , {useState} from 'react';
import { Navigate } from 'react-router-dom';

const uuidV4 = require('uuid');
const uuid = uuidV4.v4;


import QuestionnaireConfig from '../configuration/server/QuestionnaireConfig.js';
import QuestionnaireStorageMediatorService from '../services/localStorage/QuestionnaireStorageMediatorService.js';
import EnvConfig from '../configuration/environment/EnvConfig.js';
import ApiEndpointsConfig from '../configuration/server/ApiEndpointsConfig.js';
import RequestMethodService from '../services/HttpProtocol/RequestMethodService.js';
import InputCommonInspector from '../services/validators/InputCommonInspector.js';
import RoutePathConfig from '../configuration/clientRoutes/RoutePathConfig.js';
import httpResponseStatus from '../services/enumerations/httpResponseStatus.js';
import LocalStorageService from '../services/localStorage/LocalStorageService.js';
import JsonInspector from '../services/validators/JSonInspector.js'; 
import MonitorService from '../services/monitoring/MonitoringService.js';

export default function CharacterAnalysisReport(props){
    const [reportIsReceived, setReportReceived] = useState(false);
    const [userIsAuthorized , setAuthorization] = useState(true);
    const _questionnaireNameActive = QuestionnaireConfig.MainQuestionnaireName + QuestionnaireConfig.MainQuestionnaireStatusActive;
    const _questionnaireReportAssessmentResult = QuestionnaireConfig.MainQuestionnaireReportAssessmentResultName;
    function characterReportCallback(response) {
        console.log('characterReportCallback-response', response);
        switch (response.status) {
            case httpResponseStatus._201created: 
            case httpResponseStatus._200ok:     
                MonitorService.capture('loginUserCallback-response', response);
                console.log("HTTP_response:",response);
                let objString = JSON.stringify(response.result);
                if(JsonInspector.isValidJson(objString)){

                    LocalStorageService.setItemInLocalStorage(_questionnaireReportAssessmentResult, objString);

                    setReportReceived(true);
                }
            break;

            case httpResponseStatus._401unauthorized:    
            setAuthorization(false);  
            break;

        }
    }

    if(reportIsReceived){
        return <Navigate to={RoutePathConfig.reportViewerPath} /> 
    }
    if(!userIsAuthorized){
        return <Navigate to={RoutePathConfig.logoutPath} /> 
    }

    function createReport(){
        const reportDataModel = QuestionnaireStorageMediatorService.getQuestionnaireFromLocalStorage(_questionnaireNameActive);
        if(!InputCommonInspector.stringIsValid(reportDataModel.ResponseStatementId)){
            reportDataModel.ResponseStatementId = uuid();            
            QuestionnaireStorageMediatorService.resolveSaveQuestionnaireToLocalStorage(reportDataModel, _questionnaireNameActive);
        }
        
        console.log('reportDataModel', reportDataModel);
        const responseStatementSaveUrl = EnvConfig.PROTOCOL + '://' + EnvConfig.TARGET_URL + ApiEndpointsConfig.apiResponseStatementSave;
        RequestMethodService.postMethod(responseStatementSaveUrl,reportDataModel, characterReportCallback);

    }

    return(<div className={'CharacterReportComponent innerLayoutCenter ' + props.displayCharacterReport }>
            Get your Character Report
        <div className="flex-layoutRow marginBottom20">
            <div className="flex-itemRow arrowBack">
                <button onClick={()=>{ createReport(); }}>Create Report</button>
            </div>
        </div>              
    </div>) 
}