import React from 'react';
import { EditMatchErrorResponse } from '../../../../api/matchAPI';

export type Props = {
    errors?: EditMatchErrorResponse;
};

export default function MatchCreateErrors({ errors }: Props): JSX.Element {
    if (!errors) {
        return <></>;
    }

    return (
        <span className="error error-large">
            <ul>
                {errors.messages.map((message, i) => {
                    return <li key={i}>{message}</li>;
                })}
            </ul>
        </span>
    );
}
