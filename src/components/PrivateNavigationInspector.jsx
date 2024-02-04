import React from 'react';
import { Navigate } from 'react-router-dom';
import SessionInspectorService from '../services/privateWebPagesMediator/SessionInspectorService';

export default function PrivateNavigationInspector(props){

    let result = SessionInspectorService.redirectPrivateWebpagesMediator(props.navigateTo);
    return <Navigate to={result} />;
}