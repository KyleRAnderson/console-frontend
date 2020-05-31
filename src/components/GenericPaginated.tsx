import React from 'react';
import GenericTable, { GenericTableProps } from './GenericTable';
import Notifications from '../notification';
import Loading from './Loading';
import PaginationBar from './PaginationBar';

type Props<Model> = Partial<Pick<GenericTableProps<Model>, 'propertyMappings'>> & {
    table?: (values: Model[]) => JSX.Element;
    getValues: (currentPage: number, recordsPerPage?: number) => Promise<[Model[], number]>;
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
    }

    private loadData() {
        this.props
            .getValues(this.state.currentPage)
            .then(([data, numPages]) => {
                this.setState({ ...this.state, data: data, numPages: numPages, loaded: true });
            })
            .catch(() => Notifications.createNotification({ message: 'Error loading data.', type: 'danger' }));
    }

    render() {
        if (!this.state.loaded) {
            return <Loading />;
        }
        let dataTable: JSX.Element | undefined;
        if (this.props.table) {
            dataTable = this.props.table(this.state.data);
        } else if (this.props.propertyMappings) {
            dataTable = <GenericTable<Model> propertyMappings={this.props.propertyMappings} values={this.state.data} />;
        } else {
            console.error('Either table or propertyMappings needs to be provided to GenericPaginated!');
        }

        return (
            <>
                {dataTable}
                <PaginationBar
                    numPages={this.state.numPages}
                    includeFirstLast
                    onSetPage={(number) => this.setPage(number)}
                />
            </>
        );
    }

    setPage(pageNumber: number): void {
        this.setState({ ...this.state, currentPage: pageNumber }, () => this.loadData());
    }
}
