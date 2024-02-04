import React from 'react';
import { Link } from 'react-router-dom';
import SessionInspectorService from '../services/privateWebPagesMediator/SessionInspectorService';

export default function PrivateLinkInspector(props){

    let result = SessionInspectorService.redirectPrivateWebpagesMediator(props.linkTo);
    return <Link to={ result }  className='flex-row-btnReturn btnRedirect noTextDecoration'> {props.linkDescription}</Link>
}