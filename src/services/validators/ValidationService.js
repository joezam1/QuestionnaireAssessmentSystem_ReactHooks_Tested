import ObjectModelInspector from './ObjectModelInspector.js';
import Helpers from '../common/Helpers.js';
import InputCommonInspector from './InputCommonInspector.js';


//Test: DONE
const resolveUserFormValidation = function(userModel){
    let reportInputLength = ObjectModelInspector.inspectInputLength(userModel);
    let reportInputType = ObjectModelInspector.inspectInputType(userModel);
    let reportInputValue = ObjectModelInspector.inspectInputValue(userModel);

    let errorsReport = Object.assign({},reportInputType,reportInputLength,reportInputValue);
    return errorsReport;
}
//Test:DONE
const buildErrorMessagesReport = function(errorsReportForTargetObject, targetObject){
    let errorsSectionObjReport = {};
    let errors = errorsReportForTargetObject;
    for(let targetObjKey in targetObject){
        if(targetObject.hasOwnProperty(targetObjKey)){
            let errorSection = { objKey : '', objValue: '' };
            for(let errorKey in errors){
                if(errors.hasOwnProperty(errorKey)){
                    if(InputCommonInspector.errorKeyAndTargetKeyAreEqual(errorKey, targetObjKey)){
                        errorSection.objKey = targetObjKey + 'AllErrors';
                        let value = errors[errorKey];
                        errorSection.objValue += Helpers.getmessageFormatForDisplay(value) + Helpers.getHtmlBreakSeparator(value)
                    }
                }
            }
            if(!InputCommonInspector.stringIsNullOrEmpty(errorSection.objValue)){
                errorsSectionObjReport[errorSection.objKey] = errorSection.objValue;
            }
        }
    }
    return errorsSectionObjReport;
}

const ValidationService = Object.freeze({
    resolveUserFormValidation : resolveUserFormValidation,
    buildErrorMessagesReport : buildErrorMessagesReport
});

export default ValidationService;

//#REGION Private Functions

//#ENDREGION Private Functions