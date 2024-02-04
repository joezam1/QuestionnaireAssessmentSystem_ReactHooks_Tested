import React from 'react';
import {Link } from 'react-router-dom';
import RouteConfig from '../configuration/clientRoutes/RoutePathConfig.js';


export default function NavigationBar(){

    return(
    <div className='navigationBarComponent'>
        <div className='flex-layoutRow'>
            <div className="flex-itemRow">
                <Link to={RouteConfig.assessmentPath} 
                data-testid="link-private-assessment-id"
                className='btnCursor btnRedirect'
                > Assessment</Link>
            </div>
            <div className="flex-itemRow borderRounded5">My Journey</div>
            <div className="flex-itemRow borderRounded5">Status</div>
            <div className="flex-itemRow borderRounded5">Community</div>
            </div>
        </div>
    );
}