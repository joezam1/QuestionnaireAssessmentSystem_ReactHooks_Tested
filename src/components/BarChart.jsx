import React from "react";
import {Bar } from 'react-chartjs-2';


export default function BarChart({chartData, titleText}){

    return(<div className="chart-container">
        <h2 className="textCenter"> Bar Chart</h2>
        <Bar
            data={chartData}
            options={{
                plugins:{
                    title:{
                        display:true,
                        text:{titleText}
                    },
                    legend:{
                        display:false
                    }
                }
            }} />

    </div>);
}


