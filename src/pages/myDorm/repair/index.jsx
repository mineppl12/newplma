import React, { useState, useEffect } from 'react';
import './index.scss';
import { Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';

import MySwal from '~shared/ui/sweetalert';

function MyDorm_Repair() {
    const [user, setUser] = useState({
        id: 0,
        name: '',
        stuid: '',
        room_id: '',
    });

    const [description, setDescription] = useState('');

    useEffect(() => {
        // Call api to fetch user info by axios
        // axios.get('/api/userInfo').then((res) => {
        //     setUserInfo(res.data);
        // });

        setUser({
            id: 32020,
            name: '강재환',
            stuid: '9999',
            room_id: '501',
        });
    }, []);

    const handleChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Repair Request Submitted:', { ...user, description });

        const formData = new FormData();
        formData.append('id', user.id); // 사용자 id 추가
        formData.append('description', description); // 설명 추가
        formData.append('image', uploadedImage); // 이미지 파일 추가
        //Call api to submit repair request by axios
        axios
            .post('/api/dorm/reports', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => {
                MySwal.fire({
                    title: '신고 완료',
                    text: '신고가 접수되었습니다.',
                    icon: 'success',
                });
                console.log(res);
            })
            .catch((err) => {
                console.error(err);
                MySwal.fire({
                    title: '신고 실패',
                    text: '신고 접수에 실패했습니다.',
                    icon: 'error',
                });
            });
    };

    const [uploadedImage, setUploadedImage] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setUploadedImage(file);
        console.log(file);
    };

    const handleRemoveImage = () => {
        setUploadedImage(null);
    };

    return (
        <>
            <div className="myDorm-repair">
                <Card>
                    <Card.Header>
                        <Card.Title>기숙사 고장 신고</Card.Title>
                    </Card.Header>

                    <Card.Body>
                        <div className="user-info">
                            <p>
                                <strong>이름:</strong> {user.name}
                            </p>
                            <p>
                                <strong>학번:</strong> {user.stuid}
                            </p>
                            <p>
                                <strong>방 번호:</strong> {user.room_id}
                            </p>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formIssue">
                                <Form.Label>문제 설명</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    value={description}
                                    onChange={handleChange}
                                    placeholder="문제를 설명하세요"
                                    rows={3}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formFile">
                                <Form.Label>사진 업로드(필수)</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    value={
                                        uploadedImage
                                            ? `C:\\fakepath\\${uploadedImage.name}`
                                            : ''
                                    }
                                    required
                                />
                                {uploadedImage && (
                                    <div className="uploaded-image-preview">
                                        <p>{uploadedImage.name}</p>
                                        <Button
                                            variant="danger"
                                            onClick={handleRemoveImage}
                                        >
                                            삭제
                                        </Button>
                                    </div>
                                )}
                            </Form.Group>

                            <Button type="submit" variant="primary">
                                제출
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}

export default MyDorm_Repair;
