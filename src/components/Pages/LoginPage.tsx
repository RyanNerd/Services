import {Authenticated, IAuthenticationProvider} from 'providers/authenticationProvider';
import {Button} from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import React, {useEffect, useGlobal, useRef, useState} from 'reactn';

interface IProps {
    authenticationProvider: IAuthenticationProvider;
    onLogin: (authenticated: Authenticated) => void;
}

const LoginPage = (props: IProps) => {
    const authenticationProvider = props.authenticationProvider;
    const [, setErrorDetails] = useGlobal('errorDetails');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invalidPassword, setInvalidPassword] = useState(false);

    const inputFocus = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (username.length === 0 || invalidPassword) inputFocus?.current?.focus();
    }, [invalidPassword, username.length]);

    const authenticate = async () => {
        try {
            const authResponse = await authenticationProvider.authenticate({
                username,
                password
            });

            if (authResponse.success) {
                props.onLogin(authResponse);
            } else {
                setInvalidPassword(true);
            }
        } catch (authenticateError) {
            await setErrorDetails(authenticateError);
        }
    };

    return (
        <Form>
            <FloatingLabel label="Username" controlId="userLogin" className="mb-3">
                <Form.Control
                    autoFocus
                    autoComplete="off"
                    type="text"
                    placeholder="username"
                    onChange={(changeEvent) => setUsername(changeEvent.target.value)}
                    onKeyUp={() => setInvalidPassword(false)}
                    ref={inputFocus}
                    style={{width: '320px'}}
                    value={username}
                />
                {invalidPassword && <Form.Text muted>Password or username is invalid</Form.Text>}
            </FloatingLabel>

            <FloatingLabel controlId="userPassword" label="Password" className="mb-3">
                <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(changeEvent) => setPassword(changeEvent.target.value)}
                    onKeyUp={async (keyboardEvent: React.KeyboardEvent<HTMLElement>) => {
                        setInvalidPassword(false);
                        if (keyboardEvent.key === 'Enter') await authenticate();
                    }}
                    style={{width: '320px'}}
                    value={password}
                />
                {invalidPassword && <Form.Text muted>Password or username is invalid</Form.Text>}
            </FloatingLabel>
            <Button disabled={username.length === 0 || password.length === 0} onClick={() => authenticate()}>
                Login
            </Button>
        </Form>
    );
};

export default LoginPage;
