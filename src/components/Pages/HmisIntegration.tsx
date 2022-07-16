import DisabledSpinner from 'components/Pages/DisabledSpinner';
import HmisUpdatedGrid from 'components/Pages/Grids/HmisUpdatedGrid';
import {ClientHmisResponse} from 'providers/fileProvider';
import {Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import React, {useGlobal, useState} from 'reactn';

interface IProps {
    tabKey: string;
}

const HmisIntegration = (props: IProps) => {
    const [providers] = useGlobal('providers');
    const [, setErrorDetails] = useGlobal('errorDetails');
    const fileProvider = providers.fileProvider;
    const [isBusy, setIsBusy] = useState(false);
    const [invalidMaxSize, setInvalidMaxSize] = useState(false);
    const [updatedClients, setUpdatedClients] = useState<null | ClientHmisResponse>(null);
    const [fileValue, setFileValue] = useState<undefined | string>();

    /**
     * Handle when the user clicked the Select a File to Upload component
     * @param {React.ChangeEvent<HTMLInputElement>} fileInputEvent The file InputElement
     * @link https://www.slimframework.com/docs/v4/cookbook/uploading-files.html
     * @returns {Promise<void>}
     */
    const handleFileUpload = async (fileInputEvent: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (fileInputEvent) {
            const target = fileInputEvent.target as HTMLInputElement;
            const files = target.files;
            // Must be only one file
            if (files && files.length === 1) {
                const file = files[0];
                // Max file size is 100MB
                if (file.size <= 104_857_600) {
                    setIsBusy(true);
                    setInvalidMaxSize(false);
                    try {
                        const formData = new FormData();
                        formData.append('single_file', file);
                        setUpdatedClients(await fileProvider.uploadHmisFile(formData));
                    } catch (error) {
                        await setErrorDetails(error);
                    }

                    // We're done with the file upload so no longer busy and we reset the file control
                    setIsBusy(false);
                    setFileValue('');
                } else {
                    setInvalidMaxSize(true);
                }
            }
        }
    };

    // If the client tab isn't active then don't render anything
    if (props.tabKey !== 'hmis-integration') return null;

    return (
        <Form>
            <Form.Group>
                {/* TODO: Actually show instructions */}
                <Button disabled={isBusy}>Click here for instructions on how to generate a HMIS.XML file</Button>
            </Form.Group>

            <Form.Group className="my-4">
                {isBusy && <DisabledSpinner className="mx-1" />}
                <Form.Label>Select a HMIS.XML File to Upload</Form.Label>
                <Form.Control
                    className={invalidMaxSize ? 'is-invalid' : ''}
                    disabled={isBusy}
                    style={{width: '25%'}}
                    id="custom-file"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(event)}
                    onClick={() => setUpdatedClients(null)}
                    type="file"
                    value={fileValue}
                />
                <Form.Control.Feedback type="invalid">File exceeds maximum size allowed</Form.Control.Feedback>
            </Form.Group>

            {updatedClients !== null && !isBusy && (
                <div className="my-3">
                    <HmisUpdatedGrid clientHmisList={updatedClients} />
                </div>
            )}
        </Form>
    );
};

export default HmisIntegration;
