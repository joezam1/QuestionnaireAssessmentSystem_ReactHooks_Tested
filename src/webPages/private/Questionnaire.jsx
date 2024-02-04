import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import RoutePathConfig from '../../configuration/clientRoutes/RoutePathConfig.js';
import LocalStorageService from '../../services/localStorage/LocalStorageService.js';
import QuestionnaireConfig from '../../configuration/server/QuestionnaireConfig.js';
import JsonInspector from '../../services/validators/JSonInspector.js';
import InputCommonInspector from '../../services/validators/InputCommonInspector.js';
import QuestionnaireStorageMediatorService from '../../services/localStorage/QuestionnaireStorageMediatorService.js';

import Carousel from '../../components/Carousel.jsx';
import QuestionHtml from '../../components/QuestionHtml.jsx';
import CharacterAnalysisReport from '../../components/CharacterAnalysisReportCreator.jsx';


export default function Questionnaire(){
    
    const[_currentSectionPage, setCurrentSectionPage] = useState(1);
    const[_totalSectionPages, setTotalSectionPages] = useState();
    const[_sectionDescription, setSectionDescription] = useState();
    const[_questionsBatchArray , setQuestionsBatchArray] = useState([]);
    const[_displayCharacterReport, setDisplayCharacterReport] = useState('hide');

    let _currentSectionCounterValueStorage = 0;
    const _initialSectionCounterValue = 0;

    let _currentSectionPageValueStorage = 1;
    const _initialSectionPageValue = 1;

    let _questionsAnsweredCounterValueStorage = 0;
    const _initialQuestionsAnsweredCounterValue = 0;


    const _questionnaireNameDefault = QuestionnaireConfig.MainQuestionnaireName + QuestionnaireConfig.MainQuestionnaireClass;
    const _questionnaireNameActive = QuestionnaireConfig.MainQuestionnaireName + QuestionnaireConfig.MainQuestionnaireStatusActive;
    const _sectionCounterLocalStorage = QuestionnaireConfig.MainQuestionnaireSectionCounterName;
    const _sectionPageLocalStorage = QuestionnaireConfig.MainQuestionnaireCurrentSectionPage;
    const _questionsAnsweredCounterName = QuestionnaireConfig.MainQuestionnaireQuestionsAnsweredCounter;

    useEffect(()=>{
        let questionnaire = {};
        const questionnaireDefault = QuestionnaireStorageMediatorService.getQuestionnaireFromLocalStorage(_questionnaireNameDefault);
        const questionnaireActive = QuestionnaireStorageMediatorService.getQuestionnaireFromLocalStorage(_questionnaireNameActive);

        if(!InputCommonInspector.objectIsValid(questionnaireActive)){ 
            questionnaire = questionnaireDefault ; 
        }
        else{
            questionnaire = questionnaireActive;
        }

        if(InputCommonInspector.objectIsValid(questionnaire)){
            _currentSectionCounterValueStorage = QuestionnaireStorageMediatorService.getCurrentElementFromLocalStorage(_sectionCounterLocalStorage , _initialSectionCounterValue);

            QuestionnaireStorageMediatorService.resolveSaveElementToLocalStorage(_sectionCounterLocalStorage, _currentSectionCounterValueStorage )
            
            QuestionnaireStorageMediatorService.resolveSaveQuestionnaireToLocalStorage(questionnaire, _questionnaireNameActive);
            let currentSection = getCurrentSection(questionnaire, _currentSectionCounterValueStorage);
            resolveSetCurrentSection(currentSection);
            _currentSectionPageValueStorage = QuestionnaireStorageMediatorService.getCurrentElementFromLocalStorage(_sectionPageLocalStorage ,_initialSectionPageValue );
            setCurrentSectionPage(_currentSectionPageValueStorage);

            resolveCreateAndSet_SectionQuestionsBatchHtmlArray(currentSection.Questions, _currentSectionPageValueStorage);
        }

    },[]);

    //#REGION Private Methods


    function resolveSetCurrentSection(selectedSection){  
        setSectionDescription(selectedSection.Description);
        let totalSectionPages = Math.ceil( selectedSection.Questions.length / QuestionnaireConfig.MainQuestionnaireBatchQuestionsPerPage);
        setTotalSectionPages(totalSectionPages);
    }


    function getCurrentSection(questionnaireObj, currentSectionCounter){
        if(currentSectionCounter >= 0 && currentSectionCounter < questionnaireObj.Sections.length){
            return questionnaireObj.Sections[currentSectionCounter];
        }
        return null;
    }


    function resolveCreateAndSet_SectionQuestionsBatchHtmlArray(questions, currentSectionPage){        
        let questionsBatchArray = getSectionQuestionsBatch( questions, currentSectionPage);  
        setQuestionsBatchArray(questionsBatchArray);
    }


    
    function getCurrentSectionQuestionsBatch(questionnaire){

        _currentSectionCounterValueStorage = QuestionnaireStorageMediatorService.getCurrentElementFromLocalStorage(_sectionCounterLocalStorage , _initialSectionCounterValue);
        const currentSection = getCurrentSection(questionnaire, _currentSectionCounterValueStorage);    
        _currentSectionPageValueStorage = QuestionnaireStorageMediatorService.getCurrentElementFromLocalStorage(_sectionPageLocalStorage ,_initialSectionPageValue );
        const questionsBatchArray = getSectionQuestionsBatch( currentSection.Questions, _currentSectionPageValueStorage); 
        return questionsBatchArray;
    }
  

    function getSectionQuestionsBatch(questionsArray, currentPage){
        let questions = [];
        let startingIndex = QuestionnaireConfig.MainQuestionnaireBatchQuestionsPerPage *(currentPage - 1);
        let endingIndex = QuestionnaireConfig.MainQuestionnaireBatchQuestionsPerPage *(currentPage);
        for(let a = startingIndex; a < endingIndex; a++)
        {
            let selectedQuestion = questionsArray[a];
            if(selectedQuestion != undefined){
                questions.push(questionsArray[a]);
            }            
        }
        return questions;
    }


    function onCheckedInput(selectedChoice){
        selectedChoice.Selected = true;
        console.log('onCheckedInput-selectedChoice', selectedChoice);
        _currentSectionCounterValueStorage = QuestionnaireStorageMediatorService.getCurrentElementFromLocalStorage(_sectionCounterLocalStorage , _initialSectionCounterValue);

        console.log('_currentSectionCounterValueStorage', _currentSectionCounterValueStorage);
        
        let activeQuestionnaireStr = LocalStorageService.getItemFromLocalStorage(_questionnaireNameActive);
        const dynamicQuestionnaire = JsonInspector.safeJsonParse(activeQuestionnaireStr);
        if(InputCommonInspector.objectIsValid(dynamicQuestionnaire)){   
            resolveInputValidationOnCheckedInput(selectedChoice ,dynamicQuestionnaire );
            resolveDisplayCharacterAnalysisReportComponent(dynamicQuestionnaire);
            // console.log('INITIAL_dynamicQuestionnaire: ' , dynamicQuestionnaire);    
            // let questionsArray = dynamicQuestionnaire.Sections[_currentSectionCounterValueStorage].Questions;
            // let questionFound = questionsArray.find((question)=>{
            //     return (question.QuestionId === selectedChoice.QuestionId);
            // });
            // console.log('QuestionFound ?? _', questionFound);
            // if(questionFound !== undefined){
            //     questionFound.Answered = true;
            //     questionFound.ClassName = 'hide';

            //     for(let b = 0; b< questionFound.Choices.length; b++){
            //         if(questionFound.Choices[b].QuestionChoiceId === selectedChoice.QuestionChoiceId){
            //             questionFound.Choices[b].Selected = true;

            //             console.log(' questionFound.Choices[b].Selected = true; QuestionChoiceId' , questionFound.Choices[b].QuestionChoiceId);
            //         }else{
            //             questionFound.Choices[b].Selected = false;
            //         }
            //     }
            // }

            //update HTML map  
            const currentSection = getCurrentSection(dynamicQuestionnaire, _currentSectionCounterValueStorage);     
            _currentSectionPageValueStorage = QuestionnaireStorageMediatorService.getCurrentElementFromLocalStorage(_sectionPageLocalStorage ,_initialSectionPageValue );       
            resolveCreateAndSet_SectionQuestionsBatchHtmlArray(currentSection.Questions, _currentSectionPageValueStorage);
            QuestionnaireStorageMediatorService.resolveSaveQuestionnaireToLocalStorage(dynamicQuestionnaire, _questionnaireNameActive);
            console.log('ENDING_dynamicQuestionnaire: ' , dynamicQuestionnaire);    
        }   
    }

    function resolveInputValidationOnCheckedInput(selectedChoice, dynamicQuestionnaire){
        console.log('INITIAL_dynamicQuestionnaire: ' , dynamicQuestionnaire);    
        let questionsArray = dynamicQuestionnaire.Sections[_currentSectionCounterValueStorage].Questions;

        let questionFound = questionsArray.find((question)=>{
            return (question.QuestionId === selectedChoice.QuestionId);
        });
        console.log('QuestionFound ?? _', questionFound);
        
        if(questionFound !== undefined){
            questionFound.Answered = true;
            questionFound.ClassName = 'hide';

            for(let b = 0; b< questionFound.Choices.length; b++){
                if(questionFound.Choices[b].QuestionChoiceId === selectedChoice.QuestionChoiceId){
                    questionFound.Choices[b].Selected = true;

                    console.log(' questionFound.Choices[b].Selected = true; QuestionChoiceId' , questionFound.Choices[b].QuestionChoiceId);
                }else{
                    questionFound.Choices[b].Selected = false;
                }
            }
        }
    }

    function getUnansweredQuestionsCount(selectedQuestionsBatchArray){
        let unansweredQuestions = 0;
        for(let a = 0; a < selectedQuestionsBatchArray.length; a++){
            if(!selectedQuestionsBatchArray[a].Answered){
                selectedQuestionsBatchArray[a].ClassName = '';
                unansweredQuestions++;
            }
        }
        return unansweredQuestions;
    }

    function resolveOnButtonNextClick(){
      
        const dynamicQuestionnaire = QuestionnaireStorageMediatorService.getQuestionnaireFromLocalStorage(_questionnaireNameActive);
        if(InputCommonInspector.objectIsValid(dynamicQuestionnaire)){   
            if(!questionsInSectionAreAllResponded(dynamicQuestionnaire)){
                return;
            }
            _currentSectionCounterValueStorage = QuestionnaireStorageMediatorService.getCurrentElementFromLocalStorage(_sectionCounterLocalStorage , _initialSectionCounterValue);
            
            _currentSectionPageValueStorage = QuestionnaireStorageMediatorService.getCurrentElementFromLocalStorage(_sectionPageLocalStorage ,_initialSectionPageValue );   
    
            //===============
            //===============
            //===============
            // let currentCount = QuestionnaireStorageMediatorService.getCurrentElementFromLocalStorage(_questionsAnsweredCounterName , _initialQuestionsAnsweredCounterValue);

            // //NOTE : Here we need to remove the batch of 5 and replace it for the number 1, then place it with the 
            // //function onCheckedInput which will count one by one each question answered before we can see the display of the button
            // //to get the report
            // _questionsAnsweredCounterValueStorage = currentCount + QuestionnaireConfig.MainQuestionnaireBatchQuestionsPerPage;
            // QuestionnaireStorageMediatorService.resolveSaveElementToLocalStorage(_questionsAnsweredCounterName, _questionsAnsweredCounterValueStorage );
            // if(dynamicQuestionnaire.TotalQuestions <= _questionsAnsweredCounterValueStorage ){
            //     //SET visible THE CREATE REPORT button to create the characters report button
            //     setDisplayCharacterReport('show');
            // }
            // else{
            //     setDisplayCharacterReport('hide');
            // }
            //===============
            //===============
            //===============
            
            
            
            let nextPage = _currentSectionPageValueStorage + 1;
            if(nextPage > _totalSectionPages){
                //Resolve set the next section               
                let nextSectionCounter = _currentSectionCounterValueStorage + 1;            
                let newSection = getCurrentSection(dynamicQuestionnaire, nextSectionCounter);
                if(newSection === null){
                    return;
                }
                nextPage = 1;
                QuestionnaireStorageMediatorService.resolveSaveElementToLocalStorage(_sectionCounterLocalStorage ,nextSectionCounter );
                resolveSetCurrentSection(newSection);

                QuestionnaireStorageMediatorService.resolveSaveElementToLocalStorage(_sectionPageLocalStorage, nextPage);
                setCurrentSectionPage(nextPage);
                resolveCreateAndSet_SectionQuestionsBatchHtmlArray(newSection.Questions, nextPage);
                return;
            }
            QuestionnaireStorageMediatorService.resolveSaveElementToLocalStorage(_sectionPageLocalStorage, nextPage);
            setCurrentSectionPage(nextPage);
            const currentSection = getCurrentSection(dynamicQuestionnaire, _currentSectionCounterValueStorage); 
            resolveCreateAndSet_SectionQuestionsBatchHtmlArray(currentSection.Questions, nextPage);
        }
    }
    
    function resolveDisplayCharacterAnalysisReportComponent(dynamicQuestionnaire){

        if(InputCommonInspector.objectIsValid(dynamicQuestionnaire)){   
            let currentCount = QuestionnaireStorageMediatorService.getCurrentElementFromLocalStorage(_questionsAnsweredCounterName , _initialQuestionsAnsweredCounterValue);

            //NOTE : Here we need to remove the batch of 5 and replace it for the number 1, then place it with the 
            //function onCheckedInput which will count one by one each question answered before we can see the display of the button
            //to get the report
            let singleChoice = 1;
            //let questionsBatch = QuestionnaireConfig.MainQuestionnaireBatchQuestionsPerPage;
            _questionsAnsweredCounterValueStorage = currentCount + singleChoice;
            QuestionnaireStorageMediatorService.resolveSaveElementToLocalStorage(_questionsAnsweredCounterName, _questionsAnsweredCounterValueStorage );
            if(dynamicQuestionnaire.TotalQuestions <= _questionsAnsweredCounterValueStorage ){
                //SET visible THE CREATE REPORT button to create the characters report button
                setDisplayCharacterReport('show');
            }
            else{
                setDisplayCharacterReport('hide');
            }
        }
    }

    function questionsInSectionAreAllResponded(questionnaire){
        console.log('INITIAL_dynamicQuestionnaire: ' , questionnaire);  

        const questionsBatchArray = getCurrentSectionQuestionsBatch(questionnaire);
        const unansweredQuestionsCount = getUnansweredQuestionsCount(questionsBatchArray);
      
        if(unansweredQuestionsCount > 0){
            setQuestionsBatchArray(questionsBatchArray);  
            QuestionnaireStorageMediatorService.resolveSaveQuestionnaireToLocalStorage(questionnaire, _questionnaireNameActive);

            return false;
        }
        return true;
    }

    function resolveOnButtonBackClick(){

        const activeQuestionnaireStr = LocalStorageService.getItemFromLocalStorage(_questionnaireNameActive);
        const dynamicQuestionnaire = JsonInspector.safeJsonParse(activeQuestionnaireStr);
        if(InputCommonInspector.objectIsValid(dynamicQuestionnaire)){   

            if(!questionsInSectionAreAllResponded(dynamicQuestionnaire)){
                return;
            }        
            _currentSectionCounterValueStorage =QuestionnaireStorageMediatorService.getCurrentElementFromLocalStorage(_sectionCounterLocalStorage , _initialSectionCounterValue);
            _currentSectionPageValueStorage = QuestionnaireStorageMediatorService.getCurrentElementFromLocalStorage(_sectionPageLocalStorage ,_initialSectionPageValue ); 
        
            let priorPage = _currentSectionPageValueStorage - 1;
            if(priorPage < 1 && _currentSectionCounterValueStorage === 0){
                return;
            }

            //Resolve set prior section
            if(priorPage < 1 && _currentSectionCounterValueStorage >0){
                
                let priorSectionCounter = _currentSectionCounterValueStorage - 1;
                
                let newSection = getCurrentSection(dynamicQuestionnaire, priorSectionCounter);
                if(newSection === null){
                    return;
                }
                priorPage = Math.ceil( newSection.Questions.length / QuestionnaireConfig.MainQuestionnaireBatchQuestionsPerPage);

                QuestionnaireStorageMediatorService.resolveSaveElementToLocalStorage(_sectionPageLocalStorage, priorPage);
                QuestionnaireStorageMediatorService.resolveSaveElementToLocalStorage(_sectionCounterLocalStorage ,priorSectionCounter );
                setCurrentSectionPage(priorPage);
                resolveSetCurrentSection(newSection);
                
                resolveCreateAndSet_SectionQuestionsBatchHtmlArray(newSection.Questions, priorPage);
                return;
            }
            
            QuestionnaireStorageMediatorService.resolveSaveElementToLocalStorage(_sectionPageLocalStorage, priorPage);
            setCurrentSectionPage(priorPage);
            const currentSection = getCurrentSection(dynamicQuestionnaire, _currentSectionCounterValueStorage);
            resolveCreateAndSet_SectionQuestionsBatchHtmlArray(currentSection.Questions, priorPage);
        }
    }

    //#ENDREGION Private Methods

    return(<div className="questionnaireComponent outerLayout">
                 <div className='flex-layoutRow'>
                <Link to={RoutePathConfig.assessmentPath} data-testid="link-private-assessment-id"
                        className='flex-row-btnReturn btnRedirect'> Back Assessment
                    </Link>      
                    <h3 className='flex-row-titleSection'>Questionnaire</h3>
                    <div className='flex-row-emptySection'></div>
                </div>      
               
                <div className='questionnaireBody'>
                    <h3>{_sectionDescription}</h3>
                   
                    <QuestionHtml questionsArray={_questionsBatchArray} onCheckedInputCallback={onCheckedInput} />
                </div>
               <div>
                <CharacterAnalysisReport displayCharacterReport ={_displayCharacterReport}/>
               </div>
                <div className='innerLayoutCenter'>
                    <Carousel CurrentPageNumber={_currentSectionPage} totalPagesCount={_totalSectionPages} onButtonBackClick={()=>{resolveOnButtonBackClick();}} onButtonNextClick={()=>{resolveOnButtonNextClick();}}/>
                </div>
           </div>
    );
}