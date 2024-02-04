import React, {useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';
import LocalStorageService from '../services/localStorage/LocalStorageService';
import CookieProperty from '../services/stringLiterals/CookieProperty';
import CookieService from '../services/cookieStorage/CookieService';
import InputCommonInspector from '../services/validators/InputCommonInspector';
import RoutePathConfig from '../configuration/clientRoutes/RoutePathConfig';


const PrivateRoute = (props) =>{

    function getSessionToken(){
        const cookieName = LocalStorageService.getItemFromLocalStorage(CookieProperty.NAME);
        const sessionToken = CookieService.getCookieFromDataStoreByName(cookieName);
        return sessionToken; 
    }

    const sessionToken = getSessionToken(); 

    if(InputCommonInspector.stringIsValid(sessionToken)){
        return props.children;
    }
    else{
        return <Navigate to={RoutePathConfig.loginPath}/>;
    }     
} 

export default PrivateRoute;
