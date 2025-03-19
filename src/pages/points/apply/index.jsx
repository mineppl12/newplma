import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import './index.scss'

import {
  Card,
  Button,
  Form,
  InputGroup,
  Row,
  Col,
  Dropdown,
} from "react-bootstrap";
import DataTable from "~shared/ui/datatable";

import getData from "~shared/scripts/getData";

function Points_Apply() {
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [users, setUsers] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [userSearchKeyword, setUserSearchKeyword] = useState("");
  const [reasonSearchKeyword, setReasonSearchKeyword] = useState("");
  const [inputs, setInputs] = useState({
    grade: 1,
    classNum: 1,
    studentNum: 1,
    name,
    reason: 0,
    plusPoints: 0,
    minusPoints: 0,
    act_date: new Date().toISOString().split("T")[0], // 오늘 날짜로 초기화
  });

  const reasonCaption = reasons[inputs.reason]?.title || "";

  const handleSearch = (e) => {
    if (e.target.name == "user") setUserSearchKeyword(e.target.value);
    else if (e.target.name == "reason") setReasonSearchKeyword(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchKeyword) ||
      user.stuid.toString().includes(userSearchKeyword)
  );

  const filteredReasons = reasons.filter((reason) =>
    reason.title.toLowerCase().includes(reasonSearchKeyword)
  );

    const handleChange = (e) => {
        const { name, value } = e.target // name 속성 가져오기

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

    const handleClick = (e) => {
        const { grade, classNum, studentNum } = inputs
        // const stuid = `${grade}${classNum}${studentNum}`;
    }

  const handleSelectUser = (e) => {
    const name = e.target.getAttribute("name");
    const value = e.target.getAttribute("value");

    const grade = Math.floor(value / 1000);
    const classNum = Math.floor((value % 1000) / 100);
    const studentNum = value % 100;

    setInputs((prev) => ({
      ...prev,
      grade,
      classNum,
      studentNum,
      name,
    }));
  };

  const handleSelectReason = (e) => {
    const value = e.target.getAttribute("value");
    console.log(value);
    setInputs((prev) => ({
      ...prev,
      reason: parseInt(value),
    }));
  };

    const handleSubmit = (e) => {
        e.preventDefault() // 폼의 기본 제출 동작 방지
    }

    useEffect(() => {
        init()
    }, [])

  async function init() {
    const users = await getData("https://points.jshsus.kr/api2/user");
    const reasons = await getData("https://points.jshsus.kr/api2/reason");
    setUsers(users);
    setReasons(reasons);

    setTableData([]);
    setColumns([
      { data: "번호" },
      { data: "일자" },
      { data: "학년" },
      { data: "반" },
      { data: "번호" },
      { data: "성명 (학번)" },
      { data: "발급할 상점" },
      { data: "발급할 벌점" },
      { data: "처리 후 합계" },
      { data: "사유코드" },
      { data: "사유" },
    ]);
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
              <Dropdown className="mb-3">
                <Dropdown.Toggle variant="">
                  {inputs.name} ({inputs.grade}
                  {inputs.classNum}
                  {inputs.studentNum.toString().padStart(2, "0")})
                </Dropdown.Toggle>

                <Dropdown.Menu
                  style={{ maxHeight: "200px", overflowY: "auto", padding: 0 }}
                >
                  {/* 옵션 목록 */}
                  <Form.Control
                    type="text"
                    name="user"
                    onChange={handleSearch}
                    style={{
                      position: "sticky",
                      top: "0px",
                      backgroundColor: "white",
                      borderBottom: "1px solid #ddd",
                      zIndex: "10",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  />

                  {filteredUsers.map((user) => (
                    <Dropdown.Item
                      key={user.stuid}
                      name={user.name}
                      value={user.stuid}
                      onClick={handleSelectUser}
                    >
                      {user.name} ({user.stuid})
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              {/* 학년 입력 */}
              <Row className="g-2 mb-3">
                <Col md>
                  <InputGroup>
                    <InputGroup.Text className="bg-light text-dark">
                      학년
                    </InputGroup.Text>{" "}
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
            <Row className="g-2 mb-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="bg-light text-dark">
                    기준 규정
                  </InputGroup.Text>

                  <Dropdown className="mb-3">
                    <Dropdown.Toggle variant="">
                      {reasonCaption || "사유 선택"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                        padding: 0,
                      }}
                    >
                      {/* 옵션 목록 */}
                      <Form.Control
                        type="text"
                        name="reason"
                        onChange={handleSearch}
                        style={{
                          position: "sticky",
                          top: "0px",
                          backgroundColor: "white",
                          borderBottom: "1px solid #ddd",
                          zIndex: "10",
                          outline: "none",
                          boxShadow: "none",
                        }}
                      />

                      {filteredReasons.map((reason, idx) => (
                        <Dropdown.Item
                          key={idx}
                          value={reason.id - 1}
                          onClick={handleSelectReason}
                        >
                          {reason.title}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
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
                    value={reasonCaption}
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
              <Card.Text className="label">발급할 상벌점 목록</Card.Text>
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
  );
}

export default Points_Apply
