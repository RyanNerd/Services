import {Authenticated, IAuthenticationProvider} from 'providers/authenticationProvider';
import {Alert, Button, Image} from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import React, {useEffect, useGlobal, useRef, useState} from 'reactn';
import Waiter from './../../styles/waiter.svg';

interface IProps {
    authenticationProvider: IAuthenticationProvider;
    onLogin: (authenticated: Authenticated) => void;
}

const LoginPage = (props: IProps) => {
    const authenticationProvider = props.authenticationProvider;
    const onLogin = props.onLogin;
    const [, setErrorDetails] = useGlobal('errorDetails');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const inputFocus = useRef<HTMLInputElement>(null);

    const [invalidPassword, setInvalidPassword] = useState(false);
    useEffect(() => {
        if (username.length === 0 || invalidPassword) inputFocus?.current?.focus();
    }, [invalidPassword, username.length]);

    // Fires when the user is trying to log in
    const authenticate = async () => {
        try {
            const authResponse = await authenticationProvider.authenticate({
                username,
                password
            });

            if (authResponse.success) {
                onLogin(authResponse);
            } else {
                setInvalidPassword(true);
                inputFocus?.current?.focus();
            }
        } catch (authenticateError) {
            await setErrorDetails(authenticateError);
        }
    };

    return (
        <Form>
            <Form.Group>
                {/* compress SVG images using https://jakearchibald.github.io/svgomg/ */}
                <Image src={Waiter} height="165px" width="135px" />
                <span style={{color: '#6c757d', fontSize: '.950rem'}}>Log into Drop-in Services</span>
                <Image src={Waiter} height="165px" width="135px" />
            </Form.Group>

            <FloatingLabel label="Username" controlId="userLogin" className="mb-3 mx-5">
                <Form.Control
                    autoComplete="off"
                    autoFocus
                    onChange={(changeEvent) => setUsername(changeEvent.target.value)}
                    onKeyUp={() => setInvalidPassword(false)}
                    placeholder="username"
                    ref={inputFocus}
                    style={{width: '320px'}}
                    type="text"
                    value={username}
                />
                {invalidPassword && <Form.Text muted>Password or username is invalid</Form.Text>}
            </FloatingLabel>

            <FloatingLabel controlId="userPassword" label="Password" className="mb-3 mx-5">
                <Form.Control
                    onChange={(changeEvent) => setPassword(changeEvent.target.value)}
                    onKeyUp={async (keyboardEvent: React.KeyboardEvent<HTMLElement>) => {
                        setInvalidPassword(false);
                        if (keyboardEvent.key === 'Enter') await authenticate();
                    }}
                    placeholder="Password"
                    style={{width: '320px'}}
                    type="password"
                    value={password}
                />
                {invalidPassword && <Form.Text muted>Password or username is invalid</Form.Text>}
            </FloatingLabel>

            <Button
                className="mx-5"
                disabled={username.length === 0 || password.length === 0}
                onClick={async () => await authenticate()}
            >
                Login
            </Button>

            <Alert variant="warning" show={invalidPassword} className="my-3 mx-5" style={{width: '20%'}}>
                The Username or Password is invalid
            </Alert>
        </Form>
    );
};

export default LoginPage;
