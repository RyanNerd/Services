import {Form} from 'react-bootstrap';
import React, {useGlobal, useState} from 'reactn';

interface IProps {
    tabKey: string;
}

const FileUpload = (props: IProps) => {
    const [providers] = useGlobal('providers');
    const [, setErrorDetails] = useGlobal('errorDetails');
    const fileProvider = providers.fileProvider;
    const [isBusy, setIsBusy] = useState(false);
    const [invalidMaxSize, setInvalidMaxSize] = useState(false);

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
                        await fileProvider.uploadHmisFile(formData);
                    } catch (error) {
                        await setErrorDetails(error);
                    }
                    setIsBusy(false);
                } else {
                    setInvalidMaxSize(true);
                }
            }
        }
    };

    // If the client tab isn't active then don't render anything
    if (props.tabKey !== 'import') return null;

    return (
        <Form>
            <Form.Group>
                <Form.Label>Select a File to Upload</Form.Label>
                <Form.Control
                    className={invalidMaxSize ? 'is-invalid' : ''}
                    disabled={isBusy}
                    style={{width: '25%'}}
                    id="custom-file"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(event)}
                    type="file"
                />
                <Form.Control.Feedback type="invalid">File exceeds maximum size allowed</Form.Control.Feedback>
            </Form.Group>
        </Form>
    );
};

export default FileUpload;
