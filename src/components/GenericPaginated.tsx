import React from 'react';
import GenericTable, { GenericTableProps } from './GenericTable';
import { createNotification } from '../notification';
import Loading from './Loading';
import PaginationBar from './PaginationBar';
import * as MiniSignal from 'mini-signals';

/**
 * getValues: A function accepting the current page and records to display per page,
 * returning a promise to a tuple of an array of the records followed by the number of pages.
 */
type Props<Model> = Partial<Pick<GenericTableProps<Model>, 'propertyMappings'>> & {
    table?: (values: Model[]) => React.ReactNode;
    getValues: (currentPage: number, recordsPerPage?: number) => Promise<[Model[], number]>;
    updateSignal?: MiniSignal;
};

type State<Model> = {
    data: Model[];
    currentPage: number;
    numPages: number;
    loaded: boolean;
};

/**
 * A Generic class for managing and displaying a paginated API.
 * Either the table or the propertyMappings prop must be provided in the Props.
 */
export default class GenericPaginated<Model> extends React.Component<Props<Model>, State<Model>> {
    updateBinding: MiniSignal.MiniSignalBinding | undefined;
    constructor(props: Props<Model>) {
        super(props);
        this.state = {
            data: [],
            currentPage: 1,
            numPages: 1,
            loaded: false,
        };
    }

    componentDidMount() {
        this.loadData();
        this.updateBinding = this.props.updateSignal?.add(() => this.loadData());
    }

    componentWillUnmount() {
        this.updateBinding?.detach();
    }

    private loadData(): void {
        this.props
            .getValues(this.state.currentPage)
            .then(([data, numPages]) => {
                this.setState({ ...this.state, data: data, numPages: numPages, loaded: true });
            })
            .catch(() => createNotification({ message: 'Error loading data.', type: 'danger' }));
    }

    render() {
        if (!this.state.loaded) {
            return <Loading />;
        }
        let dataTable: React.ReactNode;
        if (this.props.table) {
            dataTable = this.props.table(this.state.data);
        } else if (this.props.propertyMappings) {
            dataTable = <GenericTable<Model> propertyMappings={this.props.propertyMappings} values={this.state.data} />;
        } else {
            console.error('Either table or propertyMappings needs to be provided to GenericPaginated!');
        }

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
            <>
                {dataTable}
                {paginationBar}
            </>
        );
    }

    setPage(pageNumber: number): void {
        if (this.state.currentPage !== pageNumber) {
            this.setState({ ...this.state, currentPage: pageNumber }, () => this.loadData());
        }
    }
}
