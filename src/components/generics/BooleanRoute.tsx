import React, { useEffect, useState } from 'react';
import { Route, RouteProps, Switch } from 'react-router-dom';

type Props = RouteProps & {
    children: (show: boolean) => React.ReactNode;
};

/**
 * A wrapper for the react Route component which always renders its children but supplies them with a boolean
 * value for whether or not the full path matches.
 */
export default function BooleanRoute({ children, ...routeProps }: Props): JSX.Element {
    const [matches, setMatches] = useState<boolean>(false);

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
                <Route exact {...routeProps}>
                    {() => {
                        return <Setter setter={(mounted) => setMatches(mounted)} />;
                    }}
                </Route>
            </Switch>
            {children(matches)}
        </>
    );
}
