import { useState, useEffect, useRef } from 'react';

import DataTable from '~shared/ui/datatable';

import {
    Card,
    ToggleButtonGroup,
    ToggleButton,
    Container,
    Tabs,
    Tab,
    Row,
    Col,
    Button,
} from 'react-bootstrap';
import { getData } from '~shared/scripts/getData';

import './index.scss';

const GRADES = [
    { name: '1학년', value: 1 },
    { name: '2학년', value: 2 },
    { name: '3학년', value: 3 },
];

const filteredStudents = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice' },
    { id: 4, name: 'Bob Brown' },
];

function Dorm_Settings() {
    const [grade, setGrade] = useState(1);
    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);
    const dormUsersRef = useRef();
    const filteredData = tableData.filter((x) => x[1] == grade);
    const handleChange = (val) => {
        setGrade(val);
    };
    const handleStudentClick = (id) => {};
    const [students, setStudents] = useState(filteredStudents);

    ///init
    async function init(allData = false) {
        const data = await getData('/api/dorms', { allData });
        dormUsersRef.current = data;
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

    const renderStudentGrid = () => {
        const rows = [];
        const perRow = 5;

        for (let i = 0; i < students.length; i += perRow) {
            const rowItems = students.slice(i, i + perRow);
            rows.push(
                <Row key={i} className="mb-2">
                    {rowItems.map((student) => (
                        <Col
                            key={student.id}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={2}
                            xl={2}
                        >
                            <Button
                                variant={'light'}
                                className={
                                    'w-100 border border-dark rounded text-center py-2 px-1 cursor-pointer'
                                }
                                onClick={() => handleStudentClick(student.id)}
                            >
                                {student.name}
                            </Button>
                        </Col>
                    ))}
                </Row>
            );
        }

        return rows;
    };

    return (
        <div id="dorm_status">
            <Card>
                <Card.Header>
                    <Card.Title>기숙사 관리</Card.Title>
                </Card.Header>
                <Card.Body>
                    {/* <Tabs
                            id="grade-tabs"
                            activeKey={grade}
                            onSelect={(k) => setGrade(k)}
                            className="mb-3"
                        >
                            <Tab eventKey="1" title="1학년"></Tab>
                            <Tab eventKey="2" title="2학년"></Tab>
                            <Tab eventKey="3" title="3학년"></Tab>
                        </Tabs> */}

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

                    <div className="d-flex flex-row mt-4 align-items-start">
                        <div className="tableWrap">
                            <Card.Text className="label">호실</Card.Text>
                            <br />
                            <DataTable
                                className="dormStatusTable"
                                columns={columns}
                                data={filteredData}
                                order={[0, 'asc']}
                                options={{
                                    pagination: false,
                                    search: false,
                                }}
                            />
                        </div>

                        <div className="m-4 p-3 border rounded border-dark w-100">
                            {renderStudentGrid()}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Dorm_Settings;
