import React from 'react';
import { Link } from 'react-router-dom';
import RoutePathConfig from '../../configuration/clientRoutes/RoutePathConfig.js';

export default function Assessment(){

    return(<div className="assessmentComponent outerLayout">
                <div className='flex-layoutRow'>
                 
                    <Link to={RoutePathConfig.homePath} data-testid="link-private-home-id"
                        className='flex-row-btnReturn btnRedirect'> Back Home
                    </Link>      
                    <h3 className='flex-row-titleSection'>Assessment</h3>
                    <div className='flex-row-emptySection'></div>
                </div>                   
              
                <div className='innerLayoutLeft'>
                    <div className='flex-contentAlignLeft'>
                        <div className='flex-itemColumn'>Completed Assessments : 0</div>
                        <div className='flex-itemColumn'>Take your assessment NOW!</div>
                        <div className='flex-itemColumn'>
                        <Link to={RoutePathConfig.questionnairePath} >
                             Start Questionnaire</Link>
                        </div>
                       
                    </div>
                   
                    
                </div>          
           </div>
    );
}