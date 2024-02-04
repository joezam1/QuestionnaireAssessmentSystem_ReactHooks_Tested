import React from 'react';


export default function QuestionChoiceHtml({questionIndex, choices ,onCheckedInputCallback}){       

    console.log('onCheckedInputCallback', onCheckedInputCallback)
    return(<ul className='margin0'>                   
            {choices.map(function(choice){
                return( <li key={'QuestionChoiceId_'+ choice.QuestionChoiceId} className='flex-choiceDisplayColumnLeftAlign'>
                <div className='margin5'>
                    <input type="radio" 
                           id={'QuestionChoiceId_'+choice.QuestionChoiceId} 
                           name={questionIndex} 
                           value={choice.ChoiceObj.Value} 
                           defaultChecked={choice.Selected}
                           onChange={()=>{ onCheckedInputCallback(choice);}}                               
                    />
                    { choice.ChoiceObj.Name}
                  
                </div> 
                </li>)
            })}          
    </ul>);
}  
