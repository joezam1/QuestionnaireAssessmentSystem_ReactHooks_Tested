import React, {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import "./scss/StyleImporter.scss";

import PrivateRoute from './components/PrivateRoute';

//All Routes 
import RoutePathConfig from './configuration/clientRoutes/RoutePathConfig';
//Public WebPages Components
import Register from './webPages/public/Register';
import Login from './webPages/public/Login';
import Logout from './webPages/public/Logout';


//Private WebPages Components
import Home from '../src/webPages/private/Home.jsx';
import Assessment from '../src/webPages/private/Assessment.jsx';
import Questionnaire from '../src/webPages/private/Questionnaire.jsx';
import CharacterAnalysisReportViewer from '../src/webPages/private/CharacterAnalysisReportViewer.jsx';


export default function App(){ 

    console.log('Application-App component hit');
    return(
        <div className="app">
            <BrowserRouter >
                <Routes>   
                    <Route index element={<Navigate to={RoutePathConfig.registerPath} replace />} />
                    <Route path={RoutePathConfig.registerPath} element={<Register />} />
                    <Route path={RoutePathConfig.loginPath} element={<Login/>}/>
                    <Route path={RoutePathConfig.logoutPath} element={<Logout/>} />
                    <Route path={RoutePathConfig.homePath} element={
                        <PrivateRoute children={ <Home/>}/>                        
                    } />
                    <Route path={RoutePathConfig.assessmentPath} element={
                        <PrivateRoute>
                           <Assessment />
                        </PrivateRoute>                  
                    } />
                    <Route path={RoutePathConfig.questionnairePath} element={
                        <PrivateRoute children={ <Questionnaire/>} />                          
                    } />

                    <Route path={RoutePathConfig.reportViewerPath} element={
                        <PrivateRoute>
                            <CharacterAnalysisReportViewer/>
                        </PrivateRoute>
                    }/>
                  
                </Routes>
            </BrowserRouter>
        </div>
    );
}