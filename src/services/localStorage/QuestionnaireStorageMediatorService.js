import LocalStorageService from "./LocalStorageService.js";
import JsonInspector from '../validators/JSonInspector.js';
import Helpers from '../common/Helpers.js';


const getQuestionnaireFromLocalStorage = function(questionnaireName){
    const questionnaireStr = LocalStorageService.getItemFromLocalStorage(questionnaireName);
    const questionnaire = JsonInspector.safeJsonParse(questionnaireStr);
    return questionnaire;
}

const resolveSaveQuestionnaireToLocalStorage = function(updatedQuestionnaire , questionnaireName){       
    LocalStorageService.removeItemFromLocalStorage(questionnaireName);
    const questionnaireString =JSON.stringify(updatedQuestionnaire);
    LocalStorageService.setItemInLocalStorage(questionnaireName, questionnaireString);
}



const getCurrentElementFromLocalStorage = function(itemName , defaultValue){
    const itemStr = LocalStorageService.getItemFromLocalStorage(itemName);
    if(itemStr === null){
        return defaultValue;
    }
    const value = Helpers.convertStringValueToNumber(itemStr);
    if(isNaN(value)){
        return defaultValue;
    }
    return value;
}



const resolveSaveElementToLocalStorage = function(itemKey, itemValue){
    LocalStorageService.removeItemFromLocalStorage(itemKey);
    const itemStr = (itemValue).toString();
    LocalStorageService.setItemInLocalStorage(itemKey, itemStr);
}


const QuestionnaireStorageMediatorService = Object.freeze({
    getQuestionnaireFromLocalStorage : getQuestionnaireFromLocalStorage,
    resolveSaveQuestionnaireToLocalStorage : resolveSaveQuestionnaireToLocalStorage,
    getCurrentElementFromLocalStorage : getCurrentElementFromLocalStorage,
    resolveSaveElementToLocalStorage : resolveSaveElementToLocalStorage
});


export default QuestionnaireStorageMediatorService;