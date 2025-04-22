import { useState, useEffect } from 'react';

import DataTable from '~shared/ui/datatable';

import { Card, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

import './index.scss';

function MyDorm_View() {
    return (
        <>
            <div id="mydorm_view">
                <Card>
                    <Card.Header>
                        <Card.Title>내 기숙사 현황</Card.Title>
                    </Card.Header>
                    {/* use ul / li, 표시될 정보: 이름(학번), 호실, 침대위치 */}
                    <Card.Body>
                        <article className="dormInfo">
                            <h3>기숙사 정보</h3>
                            <ul>
                                <li>이름(학번): 홍길동(20230001)</li>
                                <li>배정현황: 송죽관 101호</li>
                                <li>침대위치: 상단</li>
                            </ul>
                        </article>
                        <article className="rommateInfo">
                            <h3>룸메이트 정보</h3>
                            <ul>
                                <li>김성찬(2103): 010-7153-1021</li>
                                <li>김동원(2101): 010-1234-5678</li>
                            </ul>
                        </article>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}

export default MyDorm_View;
