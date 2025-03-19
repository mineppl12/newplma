import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import './index.scss'

import { Card, Button, Form, InputGroup, Row, Col } from 'react-bootstrap'
import DataTable from '~shared/ui/datatable'

import getData from '~shared/scripts/getData'

const REASONS = [
    { id: 0, reason: '' },
    { id: 1, reason: '사유 1' },
    { id: 2, reason: '사유 2' },
    { id: 3, reason: '사유 3' },
    { id: 4, reason: '사유 4' },
    { id: 5, reason: '사유 5' },
    { id: 6, reason: '사유 6' },
    { id: 7, reason: '사유 7' },
    { id: 8, reason: '사유 8' },
    { id: 9, reason: '사유 9' },
    { id: 10, reason: '사유 10' },
    { id: 11, reason: '사유 11' },
    { id: 12, reason: '사유 12' },
    { id: 13, reason: '사유 13' },
    { id: 14, reason: '사유 14' },
    { id: 15, reason: '사유 15' },
]

function Points_Apply() {
    const [columns, setColumns] = useState([])
    const [tableData, setTableData] = useState([])
    const [users, setUsers] = useState([])

    const [inputs, setInputs] = useState({
        grade: 1,
        classNum: 1,
        studentNum: 1,
        reason: 0,
        plusPoints: 0,
        minusPoints: 0,
        act_date: new Date().toISOString().split('T')[0], // 오늘 날짜로 초기화
    })
    const reasonCaption = () => REASONS[inputs.reason].reason

    const handleChange = (e) => {
        const { name, value } = e.target // name 속성 가져오기

        alert(value)
        setInputs((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleClick = (e) => {
        const { grade, classNum, studentNum } = inputs
        // const stuid = `${grade}${classNum}${studentNum}`;
    }

    const handleSelect = (e) => {
        const { value } = e.target // name 속성 가져오기
        const grade = parseInt(value.substring(0, 1))
        const classNum = parseInt(value.substring(1, 2))
        const studentNum = parseInt(value.substring(2))

        setInputs((prev) => ({
            ...prev,
            grade,
            classNum,
            studentNum,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault() // 폼의 기본 제출 동작 방지
    }

    useEffect(() => {
        init()
    }, [])

    async function init() {
        const data = await getData('/api/points/user')
        setUsers(data)
        console.log(data)

        setTableData([])
        setColumns([
            { data: '번호' },
            { data: '일자' },
            { data: '학년' },
            { data: '반' },
            { data: '번호' },
            { data: '성명 (학번)' },
            { data: '발급할 상점' },
            { data: '발급할 벌점' },
            { data: '처리 후 합계' },
            { data: '사유코드' },
            { data: '사유' },
        ])
    }

    return (
        <>
            <div id="points_apply">
                <Card>
                    <Card.Header>
                        <Card.Title>상벌점 부여</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text className="label">학생 정보 입력</Card.Text>

                        <Form onSubmit={handleSubmit}>
                            {/* Select 박스 (상단에 위치) */}
                            <Form.Group className="mb-3">
                                <Form.Label>선택</Form.Label>
                                <Form.Select
                                    name="selectedOption"
                                    value={inputs.selectedOption}
                                    onChange={handleSelect}
                                >
                                    <option value="">학번 찾기</option>
                                    {/* <option value="option1">옵션 1</option> */}
                                </Form.Select>
                            </Form.Group>

                            {/* 학년 입력 */}
                            <Row className="g-2">
                                <Col md>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-light text-dark">
                                            학년
                                        </InputGroup.Text>{' '}
                                        {/* 옅은 회색 배경으로 수정 */}
                                        <Form.Control
                                            type="number"
                                            name="grade"
                                            value={inputs.grade}
                                            onChange={handleChange}
                                            placeholder="학년"
                                            min="1"
                                            max="3"
                                        />
                                    </InputGroup>
                                </Col>

                                {/* 반 입력 */}
                                <Col md>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-light text-dark">
                                            반
                                        </InputGroup.Text>{' '}
                                        {/* 옅은 회색 배경으로 수정 */}
                                        <Form.Control
                                            type="number"
                                            name="classNum"
                                            value={inputs.classNum}
                                            onChange={handleChange}
                                            placeholder="반"
                                            min="1"
                                            max="4"
                                        />
                                    </InputGroup>
                                </Col>

                                {/* 번호 입력 */}
                                <Col md>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-light text-dark">
                                            번호
                                        </InputGroup.Text>{' '}
                                        <Form.Control
                                            type="number"
                                            name="studentNum"
                                            value={inputs.studentNum}
                                            onChange={handleChange}
                                            placeholder="번호"
                                            min="1"
                                            max="21"
                                        />
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Form>

                        <Card.Text className="label">발급 내용 입력</Card.Text>
                        <Row className="g-2">
                            <Col md={6}>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light text-dark">
                                        기준 규정
                                    </InputGroup.Text>
                                    <Form.Select
                                        name="reason"
                                        // value={inputs.reason}
                                        onChange={handleChange}
                                    >
                                        {REASONS.map((reason) => (
                                            <option
                                                key={reason.id}
                                                value={reason.id}
                                            >
                                                {reason.reason}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </InputGroup>
                            </Col>

                            {/* 상점 입력 */}
                            <Col md={3}>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light text-dark">
                                        상점
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        name="plusPoints"
                                        value={inputs.plusPoints}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </InputGroup>
                            </Col>

                            {/* 벌점 입력 */}
                            <Col md={3}>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light text-dark">
                                        벌점
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        name="minusPoints"
                                        value={inputs.minusPoints}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Card.Text className="label">임의 표시 정보</Card.Text>
                        <Row className="g-2">
                            {/* 기준 일자 */}
                            <Col md={6}>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light text-dark">
                                        기준 일자
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="date"
                                        name="act_date"
                                        value={inputs.act_date}
                                        onChange={handleChange}
                                    />
                                </InputGroup>
                            </Col>

                            {/* 부여 사유 */}
                            <Col md={6}>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light text-dark">
                                        부여 사유
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="reasonCaption"
                                        value={reasonCaption()}
                                        onChange={handleChange}
                                        disabled
                                        placeholder=""
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        {/* 제출 버튼 */}
                        <Button
                            className="mt-3"
                            variant="primary"
                            type="button"
                            onClick={handleClick}
                        >
                            추가
                        </Button>
                        <div className="tableWrap">
                            <br />
                            <Card.Text className="label">
                                발급할 상벌점 목록
                            </Card.Text>
                            <DataTable
                                className="pointsApplyTable"
                                data={tableData}
                                columns={columns}
                            />
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default Points_Apply
