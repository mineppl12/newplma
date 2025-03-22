import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import axios from 'axios';
import moment from 'moment';

import DataTable from '~shared/ui/datatable';
import MySwal from '~shared/ui/sweetalert';

import './index.scss';

import { getData } from '~shared/scripts/getData';

import { Card, Button, Dropdown, Form, Row, Col } from 'react-bootstrap';

const TITLE = import.meta.env.VITE_TITLE;

function Points_History() {
    const [tableData, setTableData] = useState([]);
    const [columns, setColumns] = useState([]);

    const dataRef = useRef();
    const reasonsRef = useRef([]);

    const [dataLoading, setDataLoading] = useState(false);

    const [optionList, setOptionList] = useState([
        { data: '상점', view: true },
        { data: '벌점', view: true },
        { data: '기타', view: true },
    ]);

    const [inputs, setInputs] = useState({
        pointType: 'good',
        point: 0,
        reason: '',
        date: '',
        reasonCaption: '',
    });

    useEffect(() => {
        init();
    }, []);

    async function init(allData = false) {
        const data = await getData('/api/points/history', { allData });
        const reasonData = await getData('/api/reason');

        dataRef.current = data;
        reasonsRef.current = reasonData;
        setupTable(data);
    }

    function setupTable(data) {
        if (!data) return;

        const dataList = data.map((x, idx) => {
            const {
                id,
                date,
                act_date,
                teacher,
                user,
                reason_caption,
                beforeplus,
                beforeminus,
                afterplus,
                afterminus,
            } = x;
            const delta = afterplus - beforeplus - (afterminus - beforeminus);

            return [
                <Form.Check type="checkbox">
                    <Form.Check.Input type="checkbox" isValid />
                </Form.Check>,
                id,
                moment(date).format('YYYY-MM-DD'),
                teacher.name,
                <a href={`/points/user_history/${user.id}`}>
                    {user ? user.name : ''} ({user ? user.stuid : ''})
                </a>,
                user.name,
                <>
                    <span className={`type ${delta < 0 ? 'bad' : 'good'}`}>
                        {delta < 0 ? '벌점' : '상점'}
                    </span>
                    <span className="score">{Math.abs(delta)}점</span>
                </>,
                delta,
                reason_caption.length > 30
                    ? reason_caption.substring(0, 30) + '...'
                    : reason_caption,
                moment(act_date).format('YYYY-MM-DD'),
                <>
                    <Button
                        className="rowButton"
                        variant="primary"
                        size="sm"
                        onClick={() => handleClickEdit(x)}
                    >
                        수정
                    </Button>
                    <Button
                        className="rowButton"
                        variant="danger"
                        size="sm"
                        onClick={() => handleClickDelete(x)}
                    >
                        삭제
                    </Button>
                </>,
            ];
        });

        setColumns([
            { data: '선택', orderable: false },
            { data: 'ID', className: 'dt-id' },
            { data: '기준일자' },
            { data: '권한자' },
            { data: '성명 (학번)', className: 'dt-link', searchBase: 5 },
            { hidden: true },
            {
                className: 'dt-content',
                data: (
                    <Dropdown onClick={optionHandler} autoClose="outside">
                        <Dropdown.Toggle
                            variant="primary"
                            id="dropdown-basic"
                            size="sm"
                        >
                            반영 내용
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {optionList.map((x, idx) => (
                                <Dropdown.Item
                                    key={idx}
                                    active={x.view == true}
                                    onClick={(e) =>
                                        optionSelect(e, idx, optionList)
                                    }
                                >
                                    {x.data}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                ),
                orderBase: 7,
            },
            { hidden: true },
            { data: '사유', className: 'dt-reason' },
            { data: '반영일시' },
            { data: '#', orderable: false },
        ]);
        setTableData(dataList);
    }

    function optionHandler(e) {
        e.stopPropagation();
    }

    function optionSelect(e, idx, list) {
        e = e || window.event;

        const arr = [...list];
        arr[idx].view = !arr[idx].view;

        const finalData = dataRef.current.filter((data) => {
            const { beforeplus, beforeminus, afterplus, afterminus } = data;
            const delta = afterplus - beforeplus - (afterminus - beforeminus);

            const type = delta < 0 ? 1 : 0;

            return arr[type].view;
        });

        setOptionList(arr);
        setupTable(finalData);
    }

    function handleSelectReason(e) {
        const reasonId = e.target.value;
        const reasons = reasonsRef.current;
        const reason = reasons.find((x) => x.id == reasonId);

        setInputs((prevState) => ({
            ...prevState,
            reason: reasonId,
            reasonCaption: reason.title,
        }));
    }

    async function refreshData() {
        if (dataLoading) return;

        setDataLoading(true);
        await init();
        setDataLoading(false);
    }

    async function allData() {
        if (dataLoading) return;

        setDataLoading(true);
        await init(true);
        setDataLoading(false);
    }

    function handleClickDelete(x) {
        MySwal.fire({
            title: '정말 삭제하시겠습니까?',
            icon: 'question',
            confirmButtonText: '확인',
            showCancelButton: true,
            cancelButtonText: '취소',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/points/history/${x.id}`).then((res) => {
                    if (res.ok) {
                        MySwal.fire('삭제되었습니다.', '', 'success');
                        refreshData();
                    } else {
                        MySwal.fire('삭제에 실패했습니다.', '', 'error');
                    }
                });
            }
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target; // name 속성 가져오기

        setInputs((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    function handleClickEdit(x) {
        const {
            id,
            date,
            act_date,
            teacher,
            user,
            reason,
            reason_caption,
            beforeplus,
            beforeminus,
            afterplus,
            afterminus,
        } = x;
        const delta = afterplus - beforeplus - (afterminus - beforeminus);
        setInputs({
            pointType: delta < 0 ? 'bad' : 'good',
            point: Math.abs(delta),
            reason,
            date: act_date,
            reasonCaption: reason_caption,
        });
        console.log('수정할 데이터:', x);
        console.log(inputs);

        const modalContent = (
            <Form id="editForm" className="p-3">
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="pointType">
                            <Form.Label>상벌점 유형</Form.Label>
                            <Form.Select
                                value={inputs.pointType}
                                name="pointType"
                                onChange={handleChange}
                            >
                                <option value="good">상점</option>
                                <option value="bad">벌점</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="point">
                            <Form.Label>점수</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="점수를 입력하세요"
                                min="0"
                                value={inputs.point}
                                name="point"
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="reason">
                            <Form.Label>기준 규정</Form.Label>
                            <Form.Select
                                value={inputs.reason}
                                onChange={handleSelectReason}
                                name="reason"
                            >
                                {reasonsRef.current.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.title}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="act_date">
                            <Form.Label>기준일자</Form.Label>
                            <Form.Control
                                type="date"
                                value={inputs.date}
                                name="act_date"
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="reasonCaption" className="mb-3">
                    <Form.Label>사유</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="사유를 입력하세요"
                        value={inputs.reasonCaption}
                        onChange={handleChange}
                        name="reasonCaption"
                    />
                </Form.Group>
            </Form>
        );

        MySwal.fire({
            title: '상벌점 수정',
            html: modalContent,
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
            preConfirm: () => {
                const {
                    pointType: type,
                    point,
                    reason,
                    date,
                    reasonCaption,
                } = inputs;

                if (!type || !point || !reason || !date || !reasonCaption) {
                    MySwal.showValidationMessage('모든 필드를 입력해주세요.');
                    return false;
                }

                return { type, point, reason, date, reasonCaption };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const { type, reason, reasonCaption, point, date } =
                    result.value;
                console.log('수정된 데이터:', {
                    type,
                    reason,
                    reasonCaption,
                    point,
                    date,
                });
                // 여기에 수정된 데이터를 서버로 전송하는 로직 추가
            }
        });
    }

    return (
        <>
            <div id="points_history">
                <Card>
                    <Card.Header>
                        <Card.Title>상벌점 기록</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div className="tableWrap">
                            <Card.Text className="label">상벌점 기록</Card.Text>
                            <DataTable
                                className="historyTable"
                                columns={columns}
                                data={tableData}
                                order={[1, 'desc']}
                                options={{
                                    language: {
                                        search: '통합 검색: ',
                                    },
                                    button: [
                                        <Button
                                            className="tableButton"
                                            onClick={refreshData}
                                            disabled={dataLoading}
                                            variant="primary"
                                        >
                                            새로고침
                                        </Button>,
                                        <Button
                                            className="tableButton"
                                            onClick={allData}
                                            disabled={dataLoading}
                                            variant="primary"
                                        >
                                            전체 기록 조회
                                        </Button>,
                                    ],
                                }}
                            />
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}

export default Points_History;
