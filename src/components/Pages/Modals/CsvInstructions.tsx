/* eslint-disable max-len */
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, {useEffect, useState} from 'reactn';
import step1 from 'images/csv/step-1.png';
import step2 from 'images/csv/step-2.png';
import step3 from 'images/csv/step-3.png';
import step4 from 'images/csv/step-4.png';
import step5 from 'images/csv/step-5.png';
import step6 from 'images/csv/step-6.png';

interface IProps {
    show: boolean;
    onClose: () => void;
}

const CsvInstructions = (props: IProps) => {
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

    return (
        <Modal backdrop="static" size="xl" show={show} onHide={() => onClose()} onEnter={() => setTabIndicator(1)}>
            <Modal.Header closeButton>
                <Modal.Title>CSV HMIS Upload Guide</Modal.Title>
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
                            <img src={step1} alt="step 1" width={400} height={60} />
                            <Form.Control
                                className="my-4"
                                style={{fontSize: '17px', fontWeight: 'bold'}}
                                as="textarea"
                                value="Select from the table what services are to be imported and then click on 'Create `batch-upload.csv` file to import into HMIS'. Make a note of where the `batch-upload.csv` was saved as this is the file that will be uploaded into HMIS"
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
                                value={'In HMIS Select Services -> Import Services'}
                                readOnly
                            />
                        </Tab>

                        <Tab disabled={true} eventKey="step3" title="Step 3">
                            <img src={step3} alt="step 3" width={135} height={116} />
                            <Form.Control
                                className="my-4"
                                as="textarea"
                                style={{fontSize: '21px', fontWeight: 'bold'}}
                                value="In the upper right click on the Excel Import button"
                                readOnly
                            />
                        </Tab>

                        <Tab disabled={true} eventKey="step4" title="Step 4">
                            <img src={step4} alt="step 4" width={900} height={450} />
                            <Form.Control
                                className="my-4"
                                as="textarea"
                                style={{fontSize: '21px', fontWeight: 'bold'}}
                                value="Click on the browse button and find the `batch-upload.csv` file you created then click `Import Now`"
                                readOnly
                            />
                        </Tab>

                        <Tab disabled={true} eventKey="step5" title="Step 5">
                            <img src={step5} alt="step 5" width={350} height={375} />
                            <Form.Control
                                className="my-4"
                                as="textarea"
                                style={{fontSize: '21px', fontWeight: 'bold'}}
                                value="Click on `Start/Resume Import"
                                readOnly
                            />
                        </Tab>

                        <Tab disabled={true} eventKey="step6" title="Step 6">
                            <img src={step6} alt="step 6" width={350} height={375} />
                            <Form.Control
                                className="my-4"
                                as="textarea"
                                style={{fontSize: '21px', fontWeight: 'bold'}}
                                value="If there were no errors it will indicate 100% complete and show how many services were imported"
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

export default CsvInstructions;
