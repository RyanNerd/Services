import {IClientProvider} from 'providers/clientProvider';
import React, {useEffect, useGlobal, useState} from 'reactn';

interface IProps {
    clientProvider: IClientProvider;
    tabKey: string;
}

const ClientPage = (props: IProps) => {
    const clientProvider = props.clientProvider;

    const loadClients = async () => {
        const clientList = await clientProvider.loadList();
    };

    if (props.tabKey !== 'client') return null;

    return <p>Client page</p>;
};

export default ClientPage;
