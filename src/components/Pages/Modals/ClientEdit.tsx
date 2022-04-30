import dayjs from 'dayjs';
import {IClientProvider} from 'providers/clientProvider';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import React, {useEffect, useRef, useState} from 'reactn';
import {ClientRecord} from 'types/RecordTypes';
import {SearchKeys} from 'types/SearchTypes';
import clientFullName from './../../../utilities/clientFullName';
import getFormattedDate from './../../../utilities/getFormattedDate';

interface IProps {
    clientInfo: ClientRecord;
    clientProvider: IClientProvider;
    onClose: (r: ClientRecord | null) => void;
    show: boolean;
}

/**
 * Edit Modal for Client
 * @param {IProps} props Props for the component
 */
const ClientEdit = (props: IProps): JSX.Element | null => {
    const clientProvider = props.clientProvider;
    const onClose = props.onClose;

    const [isDupe, setIsDupe] = useState(false);
    const [isDobValid, setIsDobValid] = useState(false);
    const focusReference = useRef<HTMLInputElement>(null);

    const [clientInfo, setClientInfo] = useState<ClientRecord>(props.clientInfo);
    useEffect(() => {
        setClientInfo({...props.clientInfo});
    }, [props.clientInfo]);

    const [show, setShow] = useState(props.show);
    useEffect(() => {
        setShow(props.show);
    }, [props.show]);

    const [canSave, setCanSave] = useState(true);
    useEffect(() => {
        const noInvalid = document.querySelectorAll('.is-invalid')?.length === 0;
        const now = dayjs();
        const day = clientInfo.DOB_DAY as number;
        const month = (clientInfo.DOB_MONTH as number) - 1;
        const year = clientInfo.DOB_YEAR as number;
        const dob = new Date(year, month, day);
        const dobCompare = dob.getFullYear() > 1900 && dob.getFullYear() <= now.year() && dob.getMonth() === month;
        setIsDobValid(dobCompare);
        setCanSave(noInvalid && dobCompare);
    }, [clientInfo, clientInfo.DOB_DAY, clientInfo.DOB_MONTH, clientInfo.DOB_YEAR]);

    /**
     * Fires when a text field or checkbox is changing.
     * @param {React.KeyboardEvent<HTMLElement>} changeEvent Keyboard event object
     */
    const handleOnChange = (changeEvent: React.ChangeEvent<HTMLElement>) => {
        const target = changeEvent.target as HTMLInputElement;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        clientInfo[name] = value;
        setClientInfo({...clientInfo});
        if (isDupe) setIsDupe(false);
    };

    /**
     * Called before saving
     * @returns {boolean} true if there are dupes, false otherwise
     */
    const checkForDuplicates = async () => {
        const searchCriteria = {
            where: [
                ['FirstName', '=', clientInfo.FirstName],
                ['LastName', '=', clientInfo.LastName],
                ['DOB_YEAR', '=', clientInfo.DOB_YEAR],
                ['DOB_MONTH', '=', clientInfo.DOB_MONTH],
                ['DOB_DAY', '=', clientInfo.DOB_DAY],
                ['Id', '<>', clientInfo.Id]
            ],
            withTrashed: true
        } as Record<SearchKeys, (string | number)[][] | boolean>;
        const dupe = await clientProvider.search(searchCriteria);
        setIsDupe(dupe.length > 0);
        return dupe.length > 0;
    };

    /**
     * Fires when the user clicks on save or cancel
     * @param {boolean} shouldSave Set to true if the user clicked the save button, otherwise false
     */
    const handleHide = async (shouldSave: boolean) => {
        if (shouldSave) {
            if (!(await checkForDuplicates())) {
                // We do some hokey-pokey because we are using soft delete as a marker for non-resident clients
                if (clientInfo.Id !== null) await clientProvider.restore(clientInfo.Id);
                const savedClient = await clientProvider.update({...clientInfo});
                if (savedClient.deleted_at === null || clientInfo.Id == null)
                    await clientProvider.delete(savedClient.Id as number);
                onClose({...savedClient});
                setShow(false);
            }
        } else {
            onClose(null);
            setShow(false);
        }
    };

    // Prevent render if there is no data
    if (!clientInfo) return null;

    return (
        <Modal
            backdrop="static"
            centered
            onEntered={() => focusReference?.current?.focus()}
            onHide={() => handleHide(false)}
            show={show}
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {clientInfo.Id ? 'Edit ' : 'Add '}
                    <span style={{backgroundColor: 'yellow'}}>{clientFullName(clientInfo)}</span>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form noValidate>
                    <Form.Group as={Row} controlId="resident-first_name" className="my-1">
                        <Form.Label column sm="2">
                            First Name
                        </Form.Label>
                        <Col sm="7">
                            <Form.Control
                                autoComplete="off"
                                className={clientInfo.FirstName !== '' ? '' : 'is-invalid'}
                                name="FirstName"
                                onChange={(changeEvent) => handleOnChange(changeEvent)}
                                ref={focusReference}
                                required
                                type="text"
                                value={clientInfo.FirstName}
                            />
                            <Form.Control.Feedback type="invalid">First name can not be blank.</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="resident-last_name" className="my-1">
                        <Form.Label column sm="2">
                            Last Name
                        </Form.Label>
                        <Col sm="7">
                            <Form.Control
                                autoComplete="off"
                                className={clientInfo.LastName !== '' ? '' : 'is-invalid'}
                                name="LastName"
                                onChange={(changeEvent) => handleOnChange(changeEvent)}
                                required
                                type="text"
                                value={clientInfo.LastName}
                            />
                            <Form.Control.Feedback type="invalid">Last name can not be blank.</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="client-nickname" className="my-1">
                        <Form.Label column sm="2">
                            Nickname
                        </Form.Label>
                        <Col sm="7">
                            <Form.Control
                                autoComplete="off"
                                name="Nickname"
                                onChange={(changeEvent) => handleOnChange(changeEvent)}
                                required
                                type="text"
                                value={clientInfo.Nickname}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="my-1">
                        <Form.Label column sm="2">
                            <span className={isDobValid ? '' : 'is-invalid'}>DOB</span>
                            <Form.Control.Feedback type="invalid">Invalid Date of Birth</Form.Control.Feedback>
                        </Form.Label>
                        <Form.Label column sm={1}>
                            Month
                        </Form.Label>
                        <Col sm="2">
                            <Form.Control
                                autoComplete="off"
                                className={clientInfo.DOB_MONTH >= 1 && clientInfo.DOB_MONTH <= 12 ? '' : 'is-invalid'}
                                name="DOB_MONTH"
                                onChange={(changeEvent) => handleOnChange(changeEvent)}
                                required
                                type="number"
                                value={clientInfo.DOB_MONTH}
                            />
                            <Form.Control.Feedback type="invalid">Enter the month (1-12).</Form.Control.Feedback>
                        </Col>

                        <Form.Label column sm={1}>
                            Day
                        </Form.Label>
                        <Col sm="2">
                            <Form.Control
                                autoComplete="off"
                                className={clientInfo.DOB_DAY > 0 && clientInfo.DOB_DAY <= 31 ? '' : 'is-invalid'}
                                name="DOB_DAY"
                                onChange={(changeEvent) => handleOnChange(changeEvent)}
                                required
                                type="number"
                                value={clientInfo.DOB_DAY}
                            />
                            <Form.Control.Feedback type="invalid">Enter a valid day.</Form.Control.Feedback>
                        </Col>
                        <Form.Label column sm={1}>
                            Year
                        </Form.Label>
                        <Col sm="2">
                            <Form.Control
                                autoComplete="off"
                                className={
                                    clientInfo.DOB_YEAR > 1900 && clientInfo.DOB_YEAR <= dayjs().year()
                                        ? ''
                                        : 'is-invalid'
                                }
                                name="DOB_YEAR"
                                onChange={(changeEvent) => handleOnChange(changeEvent)}
                                required
                                type="number"
                                value={clientInfo.DOB_YEAR}
                            />
                            <Form.Control.Feedback type="invalid">Enter a valid birth year.</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="my-1">
                        <Form.Label column sm="2">
                            HMIS #
                        </Form.Label>
                        <Col sm="4">
                            <Form.Control
                                autoComplete="off"
                                type="text"
                                name="HMIS"
                                onChange={(changeEvent) => handleOnChange(changeEvent)}
                                value={clientInfo.HMIS}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">
                            Notes
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                as="textarea"
                                className={clientInfo?.Notes?.trim().length > 500 ? 'is-invalid' : ''}
                                name="Notes"
                                onChange={(changeEvent) => handleOnChange(changeEvent)}
                                rows={4}
                                value={clientInfo.Notes}
                            />
                            <Form.Control.Feedback type="invalid">
                                Notes can only be 500 characters long. length={clientInfo?.Notes?.trim().length}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <span style={{paddingRight: '40%'}}>
                    Updated: {clientInfo.Updated ? getFormattedDate(clientInfo.Updated) : null}
                </span>
                <Button onClick={() => handleHide(false)} variant="secondary">
                    Cancel
                </Button>

                <Button
                    className={isDupe ? 'is-invalid' : ''}
                    disabled={!canSave}
                    onClick={async () => await handleHide(true)}
                    style={{cursor: canSave ? 'pointer' : 'not-allowed'}}
                    variant="primary"
                >
                    Save changes
                </Button>
                <Form.Control.Feedback type="invalid" style={{textAlign: 'right'}}>
                    This client already exists
                </Form.Control.Feedback>
            </Modal.Footer>
        </Modal>
    );
};

export default ClientEdit;
