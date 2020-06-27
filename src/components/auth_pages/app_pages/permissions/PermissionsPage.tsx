import React, { useRef } from 'react';
import PermissionsAdapter, { Props as AdapterProps } from './PermissionsAdapter';
import CreatePermission from './CreatePermission';
import { ROSTER_ID_PARAM } from '../../../../routes/AppPaths';
import * as MiniSignal from 'mini-signals';

export default function PermissionsPage(props: AdapterProps): JSX.Element {
    const updateSignal = useRef<MiniSignal>(new MiniSignal());

    return (
        <>
            <PermissionsAdapter updateSignal={updateSignal.current} {...props} />
            <CreatePermission
                rosterId={props.match.params[ROSTER_ID_PARAM]}
                onCreate={(permission) => updateSignal.current.dispatch(permission)}
            />
        </>
    );
}
