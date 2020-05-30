import React from 'react';
import GenericTable, { GenericTableProps } from './GenericTable';
import Notifications from '../notification';
import Loading from './Loading';
import PaginationBar from './PaginationBar';

type Props<Model> = Pick<GenericTableProps<Model>, 'propertyMappings'> & {
    table?: (values: Model[]) => JSX.Element;
    getValues: (currentPage: number, recordsPerPage?: number) => Promise<[Model[], number]>;
};

type State<Model> = {
    data: Model[];
    currentPage: number;
    numPages: number;
    loaded: boolean;
};

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
        let dataTable: JSX.Element = this.props.table ? (
            this.props.table(this.state.data)
        ) : (
            <GenericTable<Model> propertyMappings={this.props.propertyMappings} values={this.state.data} />
        );

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
