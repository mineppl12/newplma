import { useState, useEffect, useRef } from 'react';

import DataTable from '~shared/ui/datatable';
import { Card, Button } from 'react-bootstrap';

import './index.scss';

import MySwal from '~shared/ui/sweetalert';

import { getData } from '~shared/scripts/getData';
import axios from 'axios';

function PermissionManager({ accessible, inaccessible, handleChange }) {
    const [accessiblePermissions, setAccessiblePermissions] =
        useState(accessible);
    const [inaccessiblePermissions, setInaccessiblePermissions] =
        useState(inaccessible);
    const [filterAccess, setFilterAccess] = useState('');
    const [filterInaccess, setFilterInaccess] = useState('');
    console.log(accessiblePermissions, inaccessiblePermissions);
    useEffect(() => {
        handleChange({
            accessiblePermissions,
            inaccessiblePermissions,
        });
    }, [accessiblePermissions, inaccessiblePermissions, handleChange]);

    const handleMoveToAccessible = (permission) => {
        setInaccessiblePermissions((prev) =>
            prev.filter((p) => p.id !== permission.id)
        );
        setAccessiblePermissions((prev) => [...prev, permission]);
    };

    const handleMoveToInaccessible = (permission) => {
        setAccessiblePermissions((prev) =>
            prev.filter((p) => p.id !== permission.id)
        );
        setInaccessiblePermissions((prev) => [...prev, permission]);
    };

    const moveAllToAccessible = () => {
        setAccessiblePermissions([
            ...accessiblePermissions,
            ...inaccessiblePermissions,
        ]);
        setInaccessiblePermissions([]);
    };

    const moveAllToInaccessible = () => {
        setInaccessiblePermissions([
            ...inaccessiblePermissions,
            ...accessiblePermissions,
        ]);
        setAccessiblePermissions([]);
    };

    const filteredAccess = accessiblePermissions?.filter(({ id, name }) =>
        name.toLowerCase().includes(filterAccess.toLowerCase())
    );
    const filteredInaccess = inaccessiblePermissions?.filter(({ id, name }) =>
        name.toLowerCase().includes(filterInaccess.toLowerCase())
    );

    return (
        <>
            <div className="container">
                {/* Inaccessible */}
                <div className="permissionWrap">
                    <label>접근 불가</label>
                    <input
                        type="text"
                        placeholder="Filter"
                        value={filterInaccess}
                        onChange={(e) => setFilterInaccess(e.target.value)}
                    />
                    <div className="permissionList">
                        {filteredInaccess.map(({ id, name }) => (
                            <div
                                key={name}
                                onClick={() =>
                                    handleMoveToAccessible({ id, name })
                                }
                            >
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="buttonWrap">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={moveAllToAccessible}
                    >
                        {'>'}
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={moveAllToInaccessible}
                    >
                        {'<'}
                    </Button>
                </div>

                {/* Accessible */}
                <div className="permissionWrap">
                    <label>접근 가능</label>
                    <input
                        type="text"
                        placeholder="Filter"
                        value={filterAccess}
                        onChange={(e) => setFilterAccess(e.target.value)}
                    />
                    <div className="permissionList">
                        {filteredAccess.map(({ id, name }) => (
                            <div
                                key={name}
                                onClick={() =>
                                    handleMoveToInaccessible({ id, name })
                                }
                            >
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

function IAM_Accounts() {
    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);

    const inputsRef = useRef();

    const handleClickEditPermission = async (userId) => {
        const userPermission = await axios
            .get(`/api/iam/users/${userId}/permissions`)
            .then((res) => {
                return res.data;
            })
            .catch((error) => {
                console.error('Error fetching user permissions:', error);
                return null;
            });
        console.log(userPermission);

        if (!userPermission) {
            console.error('User not found in permissions data');
            return;
        }
        MySwal.fire({
            title: 'IAM 권한 수정',
            width: 800,
            html: (
                <PermissionManager
                    accessible={userPermission.accessiblePermissions}
                    inaccessible={userPermission.inaccessiblePermissions}
                    handleChange={(data) => {
                        inputsRef.current = data;
                    }}
                />
            ),
            icon: 'question',
            confirmButtonText: '저장',
            showCancelButton: true,
            cancelButtonText: '취소',
        })
            .then((result) => {
                console.log(inputsRef.current);

                if (result.isConfirmed) {
                    axios
                        .put(
                            `/api/iam/users/${userId}/permissons`,
                            inputsRef.current
                        )
                        .then((res) => {
                            console.log(res);
                            MySwal.fire(
                                '성공적으로 수정되었습니다.',
                                '',
                                'success'
                            );
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                MySwal.fire('권한 수정에 실패했습니다.', '', 'error');
            });
    };

    useEffect(() => {
        async function init() {
            const dataList = await getData('/api/iam').then((res) => {
                console.log(res);
                return res.map((user) => {
                    const { id, stuid, name, grade, num } = user;
                    const className = user.class;

                    return [
                        id,
                        stuid,
                        name,
                        grade,
                        className,
                        num,
                        'PLMA, CLUBS',
                        <>
                            <Button
                                className="rowButton"
                                variant="primary"
                                size="sm"
                            >
                                편집
                            </Button>
                            <Button
                                className="rowButton"
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                    handleClickEditPermission(user.id)
                                }
                            >
                                권한수정
                            </Button>
                            <Button
                                className="rowButton"
                                variant="danger"
                                size="sm"
                            >
                                삭제
                            </Button>
                        </>,
                    ];
                });
            });

            setTableData(dataList);
            setColumns([
                { data: 'ID' },
                { data: '학번' },
                { data: '성명' },
                { data: '학년' },
                { data: '반' },
                { data: '번호' },
                { data: '연결된 서비스' },
                { data: '#', orderable: false },
            ]);
        }

        init();
    }, []);

    return (
        <>
            <div id="iam_accounts">
                <Card>
                    <Card.Header>
                        <Card.Title>전체 계정 관리</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div className="tableWrap">
                            <Card.Text className="label">
                                전체 계정 목록
                            </Card.Text>
                            <DataTable
                                className="pointsApplyTable"
                                data={tableData}
                                columns={columns}
                                order={[1, 'asc']}
                                options={{
                                    language: {
                                        search: '통합검색:',
                                    },
                                }}
                            />
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}

export default IAM_Accounts;
