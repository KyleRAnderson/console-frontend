import React from 'react';
import { createNotification } from '../../notification';
import Loading from '../Loading';
import PaginationBar from '../PaginationBar';
import * as MiniSignal from 'mini-signals';
import BlockLoader from './BlockLoader';

/**
 * getValues: A function accepting the current page and records to display per page,
 * returning a promise to a tuple of an array of the records followed by the number of pages.
 */
export type Props<Model> = {
    /** A function called when this component has loaded the records. */
    updateValues: (values: Model[]) => void;
    /** The table (or other element) to be used to display the records that this component loads. */
    table: React.ReactNode;
    /** A function that fetches the paginated values by current page and the number of records per page. */
    getValues: (currentPage: number, recordsPerPage?: number) => Promise<[Model[], number]>;
    /** A signal that should be fired when the table needs to be reloaded. */
    updateSignal?: MiniSignal;
};

type State = {
    currentPage: number;
    numPages: number;
    loaded: boolean;
};

/**
 * A Generic class for managing and displaying a paginated API.
 */
export default class PaginatedLoader<Model> extends React.Component<Props<Model>, State> {
    updateBinding: MiniSignal.MiniSignalBinding | undefined;
    constructor(props: Props<Model>) {
        super(props);
        this.state = {
            currentPage: 1,
            numPages: 1,
            loaded: false,
        };
    }

    componentDidMount() {
        this.updateBinding = this.props.updateSignal?.add(() => this.setState({ ...this.state, loaded: false }));
    }

    componentWillUnmount() {
        this.updateBinding?.detach();
    }

    private onLoaded([data, numPages]: [Model[], number]): void {
        this.props.updateValues?.(data);
        this.setState({ ...this.state, numPages: numPages, loaded: true });
    }

    private onError(): void {
        createNotification({ message: 'Error loading data.', type: 'danger' });
    }

    render() {
        const paginationBar: React.ReactNode =
            this.state.numPages > 1 ? (
                <PaginationBar
                    numPages={this.state.numPages}
                    includeFirstLast
                    onSetPage={(pageNum) => this.setPage(pageNum)}
                    currentPage={this.state.currentPage}
                />
            ) : null;

        return (
            <BlockLoader<[Model[], number]>
                isLoaded={this.state.loaded}
                loadFunction={() => this.props.getValues(this.state.currentPage)}
                onLoaded={(data) => this.onLoaded(data)}
                onError={() => this.onError()}
            >
                {this.props.table}
                {paginationBar}
            </BlockLoader>
        );
    }

    private setPage(pageNumber: number): void {
        if (this.state.currentPage !== pageNumber) {
            this.setState({ ...this.state, currentPage: pageNumber, loaded: false });
        }
    }
}
