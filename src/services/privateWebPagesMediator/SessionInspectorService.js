import {Navigate, useNavigate} from 'react-router-dom';
import RoutePathConfig from '../../configuration/clientRoutes/RoutePathConfig';
import CookieProperty from '../stringLiterals/CookieProperty';
import CookieService from '../cookieStorage/CookieService.js';
import LocalStorageService from '../localStorage/LocalStorageService.js';
import inputCommonInspector from '../validators/InputCommonInspector';

    //Test:DONE
    const redirectPrivateWebpagesMediator = function(redirectTo){
       
        let cookieName = LocalStorageService.getItemFromLocalStorage(CookieProperty.NAME);
        let sessionToken = CookieService.getCookieFromDataStoreByName(cookieName);

        if(!inputCommonInspector.stringIsNullOrEmpty(sessionToken)){          
            return redirectTo;
        }
        //if Not valid or does not exist, then sent result: to logout.

        return RoutePathConfig.logoutPath;
    }

const SessionInspectorService= Object.freeze( {
        redirectPrivateWebpagesMediator : redirectPrivateWebpagesMediator,
    });


export default SessionInspectorService;
