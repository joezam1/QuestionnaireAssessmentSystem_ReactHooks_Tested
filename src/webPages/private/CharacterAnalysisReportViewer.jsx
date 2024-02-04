import React from 'react';

import BarChart from '../../components/BarChart';
import PieChart from '../../components/PieChart';

export default function CharacterAnalysisReportViewer(){

    console.log('CharacterAnalysisReportViewer-hit');
    return(<div>
        Report Viewer it works!!
        
        <BarChart chartData={{}} />
        <PieChart chartData={{}} />

    </div>);
}