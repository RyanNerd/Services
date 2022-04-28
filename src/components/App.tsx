import {ReactNode} from 'react';
import React, {useGlobal} from 'reactn';

interface IProps {
    children: ReactNode | undefined;
}

/**
 * App entry point
 * @param {IProps} props The props for this component
 */
const App = (props: IProps) => {
    const [errorDetails] = useGlobal('errorDetails');
    const errorTextLine = (text: unknown) => {
        return (
            <>
                {text as ReactNode} <br></br>
            </>
        );
    };

    // If an error has been thrown (errorDetails !== undefined) then show an error page
    if (errorDetails !== undefined) {
        const errorMessage = errorDetails instanceof Error ? 'Message: ' + errorDetails.message : undefined;
        const errorText = 'An error has occurred. See the console for more information';
        const stack =
            errorDetails instanceof Error ? errorDetails?.stack?.split(/\r?\n/) : [JSON.stringify(errorDetails)];

        // eslint-disable-next-line no-console
        console.error('Error Details', errorDetails);

        return (
            <div className="mx-5 mt-5">
                <p>{errorText}</p>
                {errorMessage && <p>{errorMessage}</p>}
                <p>{stack ? 'Stack trace:' : ' '} </p>
                {stack?.map((text) => errorTextLine(text))}
            </div>
        );
    }

    const {children} = props;
    return <div className="mx-2 my-1">{children}</div>;
};

export default App;
