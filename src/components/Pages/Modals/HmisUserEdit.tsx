import {Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Modal from 'react-bootstrap/Modal';
import React, {useEffect, useRef, useState} from 'reactn';
import {HmisUserRecord} from 'types/RecordTypes';

interface IProps {
    onClose: (hmisUserRecord: HmisUserRecord | null) => void;
    hmisUserInfo: HmisUserRecord;
    show: boolean;
}

const HmisUserEdit = (props: IProps) => {
    const [canSave, setCanSave] = useState(false);

    const hmisUserNameReference = useRef<HTMLInputElement>(null);
    const [show, setShow] = useState(props.show);
    useEffect(() => {
        setShow(props.show);
    }, [props.show]);
    const onClose = props.onClose;

    const [hmisUserInfo, setHmisUserInfo] = useState(props.hmisUserInfo);
    useEffect(() => {
        if (props.hmisUserInfo) {
            const info = {...props.hmisUserInfo};
            setHmisUserInfo(info);
        }
    }, [props.hmisUserInfo]);

    useEffect(() => {
        setCanSave(document.querySelectorAll('.is-invalid')?.length === 0);
    }, [hmisUserInfo]);

    if (!hmisUserInfo) return null;

    return (
        <Modal
            backdrop="static"
            show={show}
            onHide={() => onClose(null)}
            onEnter={() => hmisUserNameReference?.current?.focus()}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {hmisUserInfo.Id !== null ? 'Edit ' + hmisUserInfo.HmisUserName : 'Add New HMIS User'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate>
                    <FloatingLabel label="HMIS User Name" controlId="hmisUserName" className="mb-3">
                        <Form.Control
                            autoComplete="off"
                            autoFocus
                            className={hmisUserInfo.HmisUserName.trim() !== '' ? '' : 'is-invalid'}
                            type="text"
                            onChange={(changeEvent) =>
                                setHmisUserInfo({...hmisUserInfo, HmisUserName: changeEvent.target.value})
                            }
                            ref={hmisUserNameReference}
                            placeholder="hmis-user-name"
                            required
                            value={hmisUserInfo.HmisUserName}
                        />
                        <Form.Control.Feedback type="invalid">User Name cannot be blank.</Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel label="HMIS User ID" controlId="hmis-user-id" className="mb-3">
                        <Form.Control
                            autoComplete="off"
                            className={hmisUserInfo.HmisUserId.trim() !== '' ? '' : 'is-invalid'}
                            onChange={(changeEvent) =>
                                setHmisUserInfo({...hmisUserInfo, HmisUserId: changeEvent.target.value})
                            }
                            placeholder="hmis-number"
                            required
                            type="text"
                            value={hmisUserInfo.HmisUserId}
                        />
                        <Form.Control.Feedback type="invalid">HMIS # can not be blank.</Form.Control.Feedback>
                    </FloatingLabel>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {hmisUserInfo.Id !== null && (
                    <Button
                        className="mx-5"
                        onClick={() => {
                            setShow(false);
                            const info = {...hmisUserInfo};
                            info.Id = -(info.Id as number);
                            onClose(info);
                        }}
                        variant="danger"
                    >
                        Delete HMIS User
                    </Button>
                )}

                <Button
                    onClick={() => {
                        setShow(false);
                        onClose(null);
                    }}
                    variant="secondary"
                >
                    Cancel
                </Button>

                <Button
                    disabled={!canSave}
                    onClick={() => {
                        setShow(false);
                        onClose(hmisUserInfo);
                    }}
                    style={{cursor: canSave ? 'pointer' : 'not-allowed'}}
                    variant="primary"
                >
                    Save changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default HmisUserEdit;
