import HmisUserEdit from 'components/Pages/Modals/HmisUserEdit';
import {Card, ListGroup} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, {useGlobal, useState} from 'reactn';
import {HmisUserRecord, newHmisUserRecord} from 'types/RecordTypes';
import {IProviders} from 'utilities/getInitialState';

interface IProps {
    providers: IProviders;
    tabKey: string;
}

const HmisUsersPage = (props: IProps) => {
    const hmisUsersProvider = props.providers.hmisUsersProvider;
    const tabKey = props.tabKey;
    const [hmisUserList, setHmisUserList] = useGlobal('hmisUsersList');
    const [showHmisUserEdit, setShowHmisUserEdit] = useState<HmisUserRecord | null>(null);

    if (tabKey !== 'hmis-users') return null;

    return (
        <>
            <Card border="info" style={{width: '35%'}} as={Form}>
                <Card.Header>
                    {'HMIS User List'}
                    <Button
                        className="mx-2"
                        onClick={(mouseEvent) => {
                            mouseEvent.preventDefault();
                            setShowHmisUserEdit({...newHmisUserRecord});
                        }}
                        size="sm"
                        variant="info"
                    >
                        + Add New HMIS User
                    </Button>
                </Card.Header>
                <Card.Body>
                    <ListGroup>
                        {hmisUserList.map((hmisUser) => {
                            return (
                                <ListGroup.Item
                                    action
                                    id={`hmis-users-list-item-${hmisUser.Id}`}
                                    key={`hmis-users-list-item-${hmisUser.Id}`}
                                    onClick={(mouseEvent) => {
                                        mouseEvent.preventDefault();
                                        setShowHmisUserEdit({...hmisUser});
                                    }}
                                >
                                    <Form.Group>
                                        <span>{`${hmisUser.HmisUserName} - HMIS User ID: ${hmisUser.HmisUserId}`}</span>
                                    </Form.Group>
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                </Card.Body>
            </Card>

            <HmisUserEdit
                onClose={async (hmisUserRecord) => {
                    setShowHmisUserEdit(null);
                    if (hmisUserRecord !== null) {
                        // If the hmisUserRecord.Id is negative then it indicates the record should be destroyed
                        await (hmisUserRecord.Id === null || hmisUserRecord.Id > 0
                            ? hmisUsersProvider.update(hmisUserRecord)
                            : hmisUsersProvider.delete(Math.abs(hmisUserRecord.Id as number)));
                        await setHmisUserList(await hmisUsersProvider.load());
                    }
                }}
                hmisUserInfo={showHmisUserEdit as HmisUserRecord}
                show={showHmisUserEdit !== null}
            />
        </>
    );
};

export default HmisUsersPage;
