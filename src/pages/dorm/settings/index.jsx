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
import axios from 'axios';

import './index.scss';

const GRADES = [
    { name: '1학년', value: 1 },
    { name: '2학년', value: 2 },
    { name: '3학년', value: 3 },
];

function Dorm_Settings() {
    const [grade, setGrade] = useState(1);
    const [selectedCell, setSelectedCell] = useState({
        row: 1,
        col: 1,
    });
    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);

    const usersRef = useRef();
    const [dormUsers, setDormUsers] = useState([]);

    const filteredData = tableData.filter((x) => x[1] == grade);
    const handleChange = (val) => {
        setGrade(val);
    };
    const handleStudentClick = (id) => {
        console.log('student id: ', id);
        if (id == -1) {
            setDormUsers((prev) => {
                const newData = prev.map((item) => ({
                    ...item,
                    users: [...item.users],
                }));
                newData[selectedCell.row].users[selectedCell.col] = 'excluded';
                return newData;
            });

            return;
        }

        const student = usersRef.current.find((student) => student.id == id);
        if (!student) return;
        setDormUsers((prev) => {
            const newData = prev.map((item) => ({
                ...item,
                users: [...item.users],
            }));
            newData[selectedCell.row].users[selectedCell.col] = student;
            return newData;
        });
    };

    ///init
    async function init(allData = false) {
        const data = await getData('/api/dorms', { allData });
        setDormUsers(data);

        // dormUsersRef.current = data;
        const userData = await getData('/api/user', { allData });
        usersRef.current = userData;
        console.log(userData);

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
        init();
    }, []);

    const renderStudentsGrid = () => {
        const rows = [];
        const perRow = 5;

        const students = usersRef.current
            ? usersRef.current.filter(
                  (user) =>
                      user.grade == grade &&
                      user.class == selectedCell.col + 1 &&
                      !dormUsers.some((dorm) => dorm.users.includes(user))
              )
            : [];

        students.unshift({
            id: -1,
            name: <strong>제외</strong>,
            stuid: '',
        });

        // rows.push(
        //     <Button
        //         className="mb-2"
        //         variant={'danger'}
        //         onClick={() => handleStudentClick(-1)}
        //     >
        //         제외
        //     </Button>
        // );

        for (let i = 0; i < students.length; i += perRow) {
            const rowItems = students.slice(i, i + perRow);
            rows.push(
                <Row key={'row_' + i} className="mb-2" xs={5}>
                    {rowItems.map((student) => (
                        <Col
                            key={student.id}
                            onClick={() => handleStudentClick(student.id)}
                        >
                            <Button variant={'light'}>
                                {student.stuid} {student.name}
                            </Button>
                        </Col>
                    ))}
                </Row>
            );
        }

        return rows;
    };

    const handleCellClick = (e) => {
        const cell = e.target.closest('td');

        if (cell) {
            const prevCell = document.querySelector('.selected');
            if (prevCell) prevCell.classList.remove('selected');
            cell.classList.add('selected');
            const rowIndex = cell.parentNode.rowIndex;
            const colIndex = cell.cellIndex;
            // const roomName = dormUsersRef.current[rowIndex - 1].room_name;
            // const studentName =
            //     dormUsersRef.current[rowIndex - 1].users[colIndex - 1]?.name;

            setDormUsers((prev) => {
                const newData = prev.map((item) => ({
                    ...item,
                    users: [...item.users],
                }));
                newData[rowIndex - 1].users[colIndex - 1] = null;
                return newData;
            });

            // setTableData((prev) => {
            //     const newData = prev.map((item) => [...item]);
            //     newData[rowIndex - 1][colIndex + 1] = '';
            //     return newData;
            // });

            setSelectedCell({
                row: rowIndex - 1,
                col: colIndex - 1,
            });
        }
    };

    const handleAssignRandomRooms = () => {
        setDormUsers((prev) => {
            const newData = prev.map((room) => ({
                ...room,
                users: Array.from({ length: 4 }, (_, i) =>
                    room.users[i] ? room.users[i] : null
                ),
            }));

            const availableStudents = usersRef.current.filter(
                (user) =>
                    user.grade === grade &&
                    !newData.some((room) => room.users.includes(user))
            );

            for (let room of newData) {
                if (room.room_grade != grade) continue;
                for (let i = 0; i < room.users.length; i++) {
                    if (room.users[i] === null) {
                        const classIndex = i; // Match index to class (1반 -> 0, 2반 -> 1, etc.)
                        const classStudents = availableStudents.filter(
                            (student) => student.class === classIndex + 1
                        );

                        if (classStudents.length > 0) {
                            const randomIndex = Math.floor(
                                Math.random() * classStudents.length
                            );
                            room.users[i] = classStudents.splice(
                                randomIndex,
                                1
                            )[0];
                            availableStudents.splice(
                                availableStudents.indexOf(room.users[i]),
                                1
                            );
                        }
                    }
                }
            }

            console.log(newData);
            return newData;
        });
    };

    const handleSave = () => {
        const data = dormUsers.map((room) => ({
            room_name: room.room_name,
            users: room.users.map((user) => {
                if (user == 'excluded') return null;
                else if (user == null) return null;
                else return user.id; // Assuming user has an id property
            }),
        }));
        console.log(data);
        axios
            .put('/api/dorms', data)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        setTableData((prev) => {
            const newData = prev.map((row, rowIndex) => {
                const updatedRow = [...row];
                dormUsers[rowIndex].users.forEach((user, colIndex) => {
                    if (user == 'excluded') {
                        updatedRow[colIndex + 2] = <strong>제외</strong>; // Adjusted to match the column index
                    } else if (user == null) {
                        updatedRow[colIndex + 2] = ''; // Adjusted to match the column index
                    } else {
                        updatedRow[colIndex + 2] = user.name; // Adjusted to match the column index
                    }
                });
                return updatedRow;
            });
            return newData;
        });
    }, [dormUsers]);

    return (
        <div id="dorm_settings">
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

                            <div className="tableHeader">
                                남은 제외인원
                                <table className="table table-bordered remainingExcludedTable">
                                    <thead>
                                        <tr>
                                            {['1반', '2반', '3반', '4반'].map(
                                                (className, index) => {
                                                    const remainingExcluded =
                                                        usersRef.current
                                                            ? dormUsers.filter(
                                                                  (dorm) =>
                                                                      dorm.room_grade ==
                                                                      grade
                                                              ).length -
                                                              usersRef.current.filter(
                                                                  (user) =>
                                                                      user.grade ==
                                                                          grade &&
                                                                      user.class ==
                                                                          index +
                                                                              1
                                                              ).length -
                                                              dormUsers.filter(
                                                                  (dorm) =>
                                                                      /// equal class, and user is 'excluded'
                                                                      dorm
                                                                          .users[
                                                                          index
                                                                      ] ==
                                                                      'excluded'
                                                              ).length
                                                            : 0;

                                                    return (
                                                        <th key={index}>
                                                            {className}:{' '}
                                                            <small>
                                                                {
                                                                    remainingExcluded
                                                                }
                                                            </small>
                                                        </th>
                                                    );
                                                }
                                            )}
                                        </tr>
                                    </thead>
                                </table>
                            </div>

                            <DataTable
                                className="dormSettingsTable"
                                columns={columns}
                                data={filteredData}
                                order={[0, 'asc']}
                                options={{
                                    pagination: false,
                                    search: false,
                                }}
                                onClick={handleCellClick}
                            ></DataTable>
                        </div>

                        <div className="m-4 p-3 border rounded border-dark w-100 studentsGrid">
                            {renderStudentsGrid()}
                        </div>
                    </div>

                    <div className="d-flex justify-content-end">
                        <Button
                            variant="primary"
                            className="me-2"
                            onClick={handleSave}
                        >
                            저장
                        </Button>
                        <Button
                            variant="danger"
                            className="me-2"
                            onClick={() =>
                                setDormUsers(
                                    // not void, but empty
                                    dormUsers.map((room) => ({
                                        ...room,
                                        users: Array.from(
                                            { length: 4 },
                                            () => null
                                        ),
                                    }))
                                )
                            }
                        >
                            초기화
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleAssignRandomRooms}
                        >
                            무작위 방배정
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Dorm_Settings;
