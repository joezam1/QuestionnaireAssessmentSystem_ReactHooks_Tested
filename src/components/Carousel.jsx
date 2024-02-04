import React from "react";

export default function Carousel(props){
    return(
        <div className="flex-layoutRow marginBottom20">
            <div className="flex-itemRow arrowBack">
                <button onClick={props.onButtonBackClick}>Back</button></div>
            <div className="flex-itemRow currentPage">Page {props.CurrentPageNumber} of {props.totalPagesCount} Pages</div>
            <div className="flex-itemRow arrowNext">
                <button onClick={props.onButtonNextClick}>Next</button>
                </div>
        </div>
    );
}