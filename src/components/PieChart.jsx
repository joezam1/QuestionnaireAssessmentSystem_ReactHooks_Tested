import React from 'react';
import {Pie} from 'react-chartjs-2';


export default function PieChart({chartData, titleText}){

    return(
        <div className="chart-container">
            <h2 className='textCenter' > Pie Chart</h2>
            <Pie 
                data={chartData}
                options={{
                    plugins:{
                        title:{
                            display:true,
                            text:{ titleText }
                        }
                    }
                }}
            />
        </div>
    )
}