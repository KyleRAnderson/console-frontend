import React, { useEffect } from 'react';
import Loading from '../Loading';

type Props<Record> = {
    loadFunction: () => Promise<Record>;
    onLoaded: (record: Record) => void;
    onError?: (reason: unknown) => void;
};

export default function GenericLoader<Record>(props: Props<Record>): JSX.Element {
    useEffect(() => {
        props
            .loadFunction()
            .then((record) => {
                props.onLoaded(record);
            })
            .catch((reason) => props.onError?.(reason));
    }, []);

    return <Loading />;
}
