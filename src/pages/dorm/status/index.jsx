import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import moment from 'moment';
import DataTable from '~shared/ui/datatable';
import axios from 'axios';

import { Card, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { getData } from '~shared/scripts/getData';

import './index.scss';

const GRADES = [
    { name: '1학년', value: 1 },
    { name: '2학년', value: 2 },
    { name: '3학년', value: 3 },
];

function Dorm_Status() {
    const [grade, setGrade] = useState(1);
    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);
    const dataRef = useRef();
    const filteredData = tableData.filter((x) => x[1] == grade);
    const handleChange = (val) => {
        setGrade(val);
    };

    ///init
    async function init(allData = false) {
        const data = await getData('/api/dorms', { allData });
        dataRef.current = data;
        console.log(data);

        const dataList = [];

        for (let i = 0; i < data.length; i++) {
            dataList.push([
                `${String(data[i].room_name)}호`,
                data[i].room_grade,
                data[i].users[0] ? data[i].users[0].name : '',
                data[i].users[1] ? data[i].users[1].name : '',
                data[i].users[2] ? data[i].users[2].name : '',
                data[i].users[3] ? data[i].users[3].name : '',
            ]);
        }

        setColumns([
            { data: '호실', className: 'dt-first', orderable: false },
            { data: 'grade', hidden: true },
            { data: '1반', orderable: false },
            { data: '2반', orderable: false },
            { data: '3반', orderable: false },
            { data: '4반', orderable: false },
        ]);
        setTableData(dataList);
    }

    useEffect(() => {
        // const testList = [];

        // for (let i = 0; i < 15; i++) {
        //     testList.push([
        //         `${String(500 + (i + 1))}호`,
        //         '강재환',
        //         '강재환',
        //         '강재환',
        //         '강재환',
        //     ]);
        // }

        // setColumns([
        //     { data: '호실', className: 'dt-first', orderable: false },
        //     { data: '1반', orderable: false },
        //     { data: '2반', orderable: false },
        //     { data: '3반', orderable: false },
        //     { data: '4반', orderable: false },
        // ]);
        // setTableData(testList);

        /// get list from api(dorms/
        init();
    }, []);

    return (
        <>
            <div id="dorm_status">
                <Card>
                    <Card.Header>
                        <Card.Title>기숙사 관리</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text className="label">학년 선택</Card.Text>
                        <ToggleButtonGroup
                            type="radio"
                            name="grade-options"
                            value={grade}
                            onChange={handleChange}
                        >
                            {GRADES.map((x, idx) => {
                                return (
                                    <ToggleButton
                                        key={idx}
                                        variant={
                                            idx + 1 == { grade }
                                                ? 'dark'
                                                : 'outline-dark'
                                        }
                                        id={`grade-btn-${idx + 1}`}
                                        value={idx + 1}
                                    >
                                        {x.name}
                                    </ToggleButton>
                                );
                            })}
                        </ToggleButtonGroup>

                        <div className="tableWrap">
                            <br />
                            <Card.Text className="label">호실 현황</Card.Text>
                            <DataTable
                                className="dormStatusTable"
                                columns={columns}
                                data={filteredData}
                                order={[0, 'asc']}
                                options={{
                                    pagination: true,
                                }}
                            />
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}

export default Dorm_Status;
