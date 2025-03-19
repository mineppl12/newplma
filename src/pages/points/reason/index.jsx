import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import axios from "axios";

import MySwal from "~shared/ui/sweetalert";

import { Card, Button, Dropdown } from "react-bootstrap";
import DataTable from '~shared/ui/datatable';

import './index.scss';

const TITLE = import.meta.env.VITE_TITLE;

async function getData(url, params = {}){
    const response = await axios.get(`${url}`, {
        params: params
    });

    return response.data;
}

function Points_Reason(){
    const [ columns, setColumns ] = useState([]);
    const [ tableData, setTableData ] = useState([]);

    const dataRef = useRef();
   
    const [ optionList, setOptionList ] = useState([
        {data: "상점", view: true}, {data: "벌점", view: true}, {data: "기타", view: true}
    ]);

    useEffect(() => {
        init();
    }, []);

    async function init(){
        const data = await getData("https://points.jshsus.kr/api/points/reason");

        dataRef.current = data;

        setupTable(data);
    }

    function setupTable(data){
        if (!data) return;

        const reasonList = data.map((x, idx) => {
            const { id, title, plus, minus } = x;
            const delta = plus - minus;

            return [
                id,
                title,
                <>
                    <span className={`type ${delta < 0 ? "bad" : "good"}`}>{delta < 0 ? "벌점" : "상점"}</span>
                    <span className="score">{Math.abs(delta)}점</span>
                </>,
                delta,
                <>
                    <Button className="editButton" variant="primary" size="sm">수정</Button>
                    <Button className="editButton" variant="danger" size="sm">삭제</Button>
                </>
            ];
        });
        
        setColumns([
            { data: "번호" },
            { data: "반영 내용", className: "dt-reason" },
            { data: <Dropdown onClick={optionHandler} autoClose="outside">
                        <Dropdown.Toggle variant="primary" id="dropdown-basic" size="sm">반영 내용</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {optionList.map((x, idx) => (
                                <Dropdown.Item key={idx} active={x.view == true}
                                    onClick={(e) => optionSelect(e, idx, optionList)}>
                                    {x.data}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>, className: "dt-content", orderBase: 3 },
            { hidden: true },
            { data: "#", className:"dt-button" }
        ]);
        
        setTableData(reasonList);
    }
    
    function optionHandler(e){
        e.stopPropagation();
    }

    function optionSelect(e, idx, list){
        e = e || window.event;

        const arr = [...list];
        arr[idx].view = !arr[idx].view;

        const finalData = dataRef.current.filter((data) => {
            const { plus, minus } = data;
            const delta = plus - minus;

            const type = delta < 0 ? 1 : 0;
            
            return arr[type].view;
        });

        setOptionList(arr);
        setupTable(finalData);
    }

    return(
        <>
        <div id="points_reason">
            <Card>
                <Card.Header><Card.Title>사유 관리</Card.Title></Card.Header>
                <Card.Body>
                    <div className="tableWrap">
                        <Card.Text className="label">상벌점 사유 현황</Card.Text>

                        <DataTable
                            className="pointsReasonTable"
                            columns={columns}
                            data={tableData}
                            options={{
                                language: {
                                    search: "사유 검색: "
                                }
                            }}
                        />
                    </div>
                </Card.Body>
            </Card>
        </div>
        </>
    )
}

export default Points_Reason;