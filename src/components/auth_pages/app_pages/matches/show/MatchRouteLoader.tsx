import React, { useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import Match from "../../../../../models/Match";
import { createNotification } from "../../../../../notification";
import {
  matchesPath,
  MATCH_NUMBER_PARAM,
} from "../../../../../routes/AppPaths";
import MatchLoader, { Props as MatchLoaderProps } from "./MatchLoader";

export type Props = Pick<MatchLoaderProps, "hunt"> & {
  onLoaded: (match: Match) => void;
  children: React.ReactNode;
  isLoaded: boolean;
  /** Function to call when reload is necessary. */
  onReload: () => void;
};

/** Component to facilitate loading a match from a URL parameter. */
export default function MatchRouteLoader({
  onLoaded,
  hunt,
  children,
  isLoaded,
  onReload,
}: Props): JSX.Element {
  const { [MATCH_NUMBER_PARAM]: matchNumber } = useParams<{
    [MATCH_NUMBER_PARAM]?: string;
  }>();

  useEffect(() => {
    onReload();
  }, [matchNumber, onReload]);

  if (!matchNumber) {
    createNotification({ type: "danger", message: "Error loading match..." });
    return <Redirect to={matchesPath(hunt)} />;
  }

  return (
    <MatchLoader
      onLoaded={(match) => {
        onLoaded(match);
      }}
      isLoaded={isLoaded}
      hunt={hunt}
      matchNumber={matchNumber}
    >
      {children}
    </MatchLoader>
  );
}
