import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import moment from "moment";
import DataTable from '~shared/ui/datatable';

import { Card, ToggleButtonGroup, ToggleButton } from "react-bootstrap";

import './index.scss';

const TITLE = import.meta.env.VITE_TITLE;

function Dorm_Settings(){
    const [ grade, setGrade ] = useState(1);
    const [ columns, setColumns ] = useState([])
    const [ tableData, setTableData ] = useState([]);

    const grades = [
        { name: '1학년', value: 1 },
        { name: '2학년', value: 2 },
        { name: '3학년', value: 3 },
    ];

    const handleChange = (val) => {setGrade(val);}

    useEffect(() => {
        const testList = [];

        for (let i = 0; i < 15; i++){
            testList.push([
                `${String(500 + (i + 1))}호`,
                "강재환",
                "신지혜",
                "강재환",
                "신지혜"
            ]);
        }

        setColumns([
            { data: "호실", className: "dt-first", orderable: false },
            { data: "1반", orderable: false },
            { data: "2반", orderable: false },
            { data: "3반", orderable: false },
            { data: "4반", orderable: false }
        ]);
        setTableData(testList);
    }, []);

    return(
        <>
        <div id="dorm_settings">
            <Card>
                <Card.Header><Card.Title>기숙사 관리</Card.Title></Card.Header>
                <Card.Body>
                    <Card.Text className="label">학년 선택</Card.Text>
                    <ToggleButtonGroup  type="radio" name="grade-options"
                                        value={grade}
                                        onChange={handleChange}>
                        {
                            grades.map((x, idx) => {
                                return <ToggleButton
                                            key={idx}
                                            variant={idx + 1 == {grade} ? 'dark' : 'outline-dark'} id={`grade-btn-${idx + 1}`}
                                            value={idx + 1}>
                                            {x.name}
                                        </ToggleButton>
                            })
                        }
                    </ToggleButtonGroup>
                    
                    <div className="tableWrap">
                        <br/>
                        <Card.Text className="label">호실 현황</Card.Text>
                        <DataTable 
                            className="dormSettingsTable"
                            columns={columns}
                            data={tableData}
                            order={[0, 'asc']}
                        />
                    </div>
                </Card.Body>
            </Card>
        </div>
        </>
    )
}

export default Dorm_Settings;