import React from "react";
import QuestionChoiceHtml from "./QuestionChoiceHtml";



export default function QuestionHtml(props){
    console.log('QuestionHtml_PROPS', props)
    console.log('questionsArray', props.questionsArray)
    let result = props.questionsArray.map(function(questionObj){
        console.log('questionObj', questionObj)

        for(let a = 0; a < questionObj.Choices.length; a++){
            if( questionObj.Choices[a].ChoiceObj.Name.toLowerCase().includes('_value')){                  
                questionObj.Choices[a].ChoiceObj.Name = 'Yes';
            }
            else if( questionObj.Choices[a].ChoiceObj.Name.toLowerCase().includes('_neutral')){                 
                questionObj.Choices[a].ChoiceObj.Name = 'No';
            }
        }

        let questionIndex = questionObj.Index + 1;
        return(<div key={'QuestionId_'+ questionObj.QuestionId} className='flex-questionDisplayColumnLeftAlign'>
           
            <div className='flex-directionRow'>
                <p className='margin10'>{questionIndex} -</p>
                <p className='margin10'>{questionObj.Text}</p> 
            </div>  
            <div className='flex-directionRow'>
                <p className={'margin10 messageWarning '+ questionObj.ClassName} >Please select an Option</p>
            </div>
            <QuestionChoiceHtml questionIndex ={ questionIndex } choices={ questionObj.Choices} onCheckedInputCallback={ props.onCheckedInputCallback }  />
            </div> );
    });
    return result;
}

