import React from 'react';
import Roster from '../../../../models/Roster';
import RosterDashboard, { Props as RosterDashboardProps } from './RosterDashboard';
import RosterLoading, { Props as LoaderProps } from './RosterLoading';

type Props = {
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
