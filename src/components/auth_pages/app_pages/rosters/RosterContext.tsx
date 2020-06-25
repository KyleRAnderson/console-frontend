import React from 'react';
import Roster from '../../../../models/Roster';
import { RouteComponentProps } from 'react-router-dom';
import { ROSTER_ID_PARAM } from '../../../../routes/AppPaths';
import RosterLoading, { Props as LoaderProps } from './RosterLoading';
import RosterDashboard, { Props as RosterDashboardProps } from './RosterDashboard';

type Props = RouteComponentProps<{ [ROSTER_ID_PARAM]: string }> & {
    /** The roster to be used in the context. Either a fully loaded roster, or a string id. */
    roster?: Roster;
    /** Function to be called if this component ends up loading the roster.  */
    onLoadRoster: LoaderProps['onLoad'];
    dashboardProps: Omit<RosterDashboardProps, 'roster'>;
};

/**
 *
 * @param props React props
 */
export default function RosterContext(props: Props): JSX.Element {
    const { roster, dashboardProps, onLoadRoster, ...routeProps } = props;
    // Stop here if the roster cannot load.
    if (!roster) {
        return <RosterLoading {...routeProps} onLoad={onLoadRoster} />;
    }
    return <RosterDashboard roster={roster} {...dashboardProps} {...routeProps} />;
}
