import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import axios from 'axios';
import moment from 'moment';

import DataTable from '~shared/ui/datatable';
import MySwal from '~shared/ui/sweetalert';

import './index.scss';

import { Card, Button, Dropdown, Form } from 'react-bootstrap';

const TITLE = import.meta.env.VITE_TITLE;

async function getData(url, params = {}) {
  const response = await axios.get(`${url}`, {
    params: params,
  });

  return response.data;
}

function Points_History() {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);

  const dataRef = useRef();

  const [dataLoading, setDataLoading] = useState(false);

  const [optionList, setOptionList] = useState([
    { data: '상점', view: true },
    { data: '벌점', view: true },
    { data: '기타', view: true },
  ]);

  useEffect(() => {
    init();
  }, []);

  async function init(allData = false) {
    const data = await axios.get('/api/points/history', { allData });

    dataRef.current = data;
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
            onClick={removeHandler}
          >
            수정
          </Button>
          <Button
            className="rowButton"
            variant="danger"
            size="sm"
            onClick={removeHandler}
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
            <Dropdown.Toggle variant="primary" id="dropdown-basic" size="sm">
              반영 내용
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {optionList.map((x, idx) => (
                <Dropdown.Item
                  key={idx}
                  active={x.view == true}
                  onClick={(e) => optionSelect(e, idx, optionList)}
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

  function removeHandler() {
    MySwal.fire({
      title: '정말 회수 하시겠습니까?',
      icon: 'question',
      confirmButtonText: '확인',
      showCancelButton: true,
      cancelButtonText: '취소',
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
