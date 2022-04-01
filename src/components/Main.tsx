import {ReactNode} from 'react';
import React from 'reactn';

interface IProps {
    children: ReactNode | undefined;
    callback: () => void;
}

const Main = (props: IProps) => {
    const {children} = props;
    return <div className="mx-2 my-1">{children}</div>;
};

export default Main;
