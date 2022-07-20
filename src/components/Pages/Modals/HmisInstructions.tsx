/* eslint-disable max-len */
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, {useEffect, useState} from 'reactn';
import step1 from 'images/step-1.png';
import step2 from 'images/step-2.png';
import step3 from 'images/step-3.png';
import step4 from 'images/step-4.png';
import step5 from 'images/step-5.png';
import step6 from 'images/step-6.png';

interface IProps {
    show: boolean;
    onClose: () => void;
}

const HmisInstructions = (props: IProps) => {
    const [tabIndicator, setTabIndicator] = useState(1);

    const [key, setKey] = useState('step' + tabIndicator);
    useEffect(() => {
        setKey('step' + tabIndicator);
    }, [tabIndicator]);

    const [show, setShow] = useState(props.show);
    useEffect(() => {
        setShow(props.show);
    }, [props.show]);
    const onClose = props.onClose;

    const step2Text =
        'In the Clients in Programs Report set the Date Range to this year, and make sure the Organization(s) has Switchpoint checkmarked';

    return (
        <Modal backdrop="static" size="xl" show={show} onHide={() => onClose()} onEnter={() => setTabIndicator(1)}>
            <Modal.Header closeButton>
                <Modal.Title>HMIS Integration Guide</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {tabIndicator !== 6 && (
                        <Button
                            size="sm"
                            className="my-3"
                            disabled={tabIndicator === 6}
                            onClick={() => setTabIndicator(tabIndicator + 1)}
                            variant="primary"
                        >
                            Next
                        </Button>
                    )}

                    <Tabs activeKey={key} onSelect={(key) => setKey(key || 'step1')}>
                        <Tab disabled={true} eventKey="step1" title="Step 1">
                            <img src={step1} alt="step 1" width={1000} height={100} />
                            <Form.Control
                                className="my-4"
                                style={{fontSize: '21px', fontWeight: 'bold'}}
                                as="textarea"
                                value="In HMIS use the search box and search for 'Clients in Programs'"
                                readOnly
                            />
                        </Tab>

                        <Tab disabled={true} eventKey="step2" title="Step 2">
                            <img src={step2} alt="step 2" width={1000} height={350} />
                            <Form.Control
                                className="my-4"
                                style={{fontSize: '21px', fontWeight: 'bold'}}
                                as="textarea"
                                rows={3}
                                plaintext
                                value={step2Text}
                                readOnly
                            />
                        </Tab>

                        <Tab disabled={true} eventKey="step3" title="Step 3">
                            <img src={step3} alt="step 3" width={300} height={75} />
                            <Form.Control
                                className="my-4"
                                as="textarea"
                                style={{fontSize: '21px', fontWeight: 'bold'}}
                                value="Click the Report button at the bottom"
                                readOnly
                            />
                        </Tab>

                        <Tab disabled={true} eventKey="step4" title="Step 4">
                            <img src={step4} alt="step 4" width={900} height={450} />
                            <Form.Control
                                className="my-4"
                                as="textarea"
                                style={{fontSize: '21px', fontWeight: 'bold'}}
                                value="Once the report finishes running you should see something like this"
                                readOnly
                            />
                        </Tab>

                        <Tab disabled={true} eventKey="step5" title="Step 5">
                            <img src={step5} alt="step 5" width={800} height={350} />
                            <Form.Control
                                className="my-4"
                                as="textarea"
                                style={{fontSize: '21px', fontWeight: 'bold'}}
                                value="At the top of the report click on the disk icon dropdown and select Excel Data"
                                readOnly
                            />
                        </Tab>

                        <Tab disabled={true} eventKey="step6" title="Step 6">
                            <img src={step6} alt="step 6" width={300} height={25} />
                            <Form.Control
                                className="my-4"
                                as="textarea"
                                style={{fontSize: '21px', fontWeight: 'bold'}}
                                value="This will create and download a file called ClientTrackExport.xml Make note where this downloaded as this is the file that needs to be uploaded in the services app."
                                readOnly
                            />
                        </Tab>
                    </Tabs>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {tabIndicator !== 6 && (
                    <Button
                        disabled={tabIndicator === 6}
                        onClick={() => setTabIndicator(tabIndicator + 1)}
                        variant="primary"
                    >
                        Next
                    </Button>
                )}

                <Button
                    onClick={() => {
                        setShow(false);
                        onClose();
                    }}
                    variant="secondary"
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default HmisInstructions;
