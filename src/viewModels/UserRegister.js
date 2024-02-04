import FormFieldStatus from '../services/enumerations/FormFieldStatus.js';
import JsDataType from '../services/stringLiterals/JsDataType.js';


const UserRegisterViewModel = function(model){
    let firstName ={
        fieldValue: (model.firstName || ''),
        fieldStatus: FormFieldStatus.Required,
        fieldDataType: JsDataType.STRING
    };
    let middleName = {
        fieldValue: (model.middleName || '') ,
        fieldStatus:FormFieldStatus.Optional,
        fieldDataType: JsDataType.STRING
    };
    let lastName = {
        fieldValue: (model.lastName || ''),
        fieldStatus: FormFieldStatus.Required,
        fieldDataType: JsDataType.STRING
    };
    let username = {
        fieldValue: (model.username || ''),
        fieldStatus: FormFieldStatus.Required,
        fieldDataType: JsDataType.STRING
    };
    let email = {
        fieldValue: (model.email || '' ),
        fieldStatus:FormFieldStatus.Required,
        fieldDataType: JsDataType.STRING
    };

    let sex = {
        fieldValue: (model.sex || '' ),
        fieldStatus:FormFieldStatus.Required,
        fieldDataType: JsDataType.NUMBER
    };
    let password = {
        fieldValue: (model.password || ''),
        fieldStatus: FormFieldStatus.Required,
        fieldDataType: JsDataType.STRING
    };
    let confirmPassword = {
        fieldValue: (model.confirmPassword || ''),
        fieldStatus:FormFieldStatus.Required,
        fieldDataType: JsDataType.STRING
    };

    return Object.freeze({
        firstName:firstName,
        middleName:middleName,
        lastName:lastName,
        username:username,
        email:email,
        sex: sex, 
        password:password,
        confirmPassword:confirmPassword
    });

}
export default UserRegisterViewModel;