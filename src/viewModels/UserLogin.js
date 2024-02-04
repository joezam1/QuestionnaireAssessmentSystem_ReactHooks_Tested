import FormFieldStatus from '../services/enumerations/FormFieldStatus.js';
import JsDataType from '../services/stringLiterals/JsDataType.js';


let UserLoginViewModel = function(model){

    let email = {
        fieldValue: (model.email || ''),
        fieldStatus: FormFieldStatus.Required,
        fieldDataType: JsDataType.STRING
    };

    let password = {
        fieldValue: (model.password || ''),
        fieldStatus: FormFieldStatus.Required,
        fieldDataType: JsDataType.STRING
    };

    return Object.freeze({
        email:email,
        password:password
    });
}
export default UserLoginViewModel;