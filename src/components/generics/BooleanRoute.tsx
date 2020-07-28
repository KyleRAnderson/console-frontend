import React, { useEffect, useState } from 'react';
import { Route, RouteProps, Switch } from 'react-router-dom';

/** Regex that matches leading and trailing slashes. */
const REPLACE_REGEX = /(^\/|\/)/g;

type Props = {
    children: (show: boolean) => React.ReactNode;
    /** The end of the path to match. */
    pathExtension: string;
} & Omit<RouteProps, 'path'>;

/**
 * A wrapper for the react Route component which always renders its children but supplies them with a boolean
 * value for whether or not the full path matches.
 */
export default function BooleanRoute({ children, pathExtension, ...routeProps }: Props): JSX.Element {
    const [matches, setMatches] = useState<boolean>(false);

    pathExtension = pathExtension.replace(REPLACE_REGEX, '');

    function Setter({ setter }: { setter: (mount: boolean) => void }): JSX.Element {
        useEffect(() => {
            setter(true);
            return () => {
                setter(false);
            };
        }, []);

        return <></>;
    }

    return (
        <>
            <Switch>
                <Route exact {...routeProps} path={`*/${pathExtension}`}>
                    {() => {
                        return <Setter setter={(mounted) => setMatches(mounted)} />;
                    }}
                </Route>
            </Switch>
            {children(matches)}
        </>
    );
}
