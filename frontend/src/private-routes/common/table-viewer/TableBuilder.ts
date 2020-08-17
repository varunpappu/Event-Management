import * as _ from 'lodash';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { SupportedFieldTypes } from '../../typings/typings';

export class TableBuilder {
    private rootRoute: string;
    private supportedFields: SupportedFieldTypes[];
    private data: Data;

    constructor(rootRoute: string, supportedFields: SupportedFieldTypes[]) {
        this.rootRoute = rootRoute;
        this.supportedFields = supportedFields;
        this.data = {
            tableData: {
                columns: this.getColumnHeaders(),
                data: [],
                next: null,
                previous: null,
                totalCount: 0,
            },
            pageData: {
                currentPage: 1,
                sizePerPage: 10,
            },
            searchText: '',
        };
    }

    getFieldsToBeSorted() {
        return this.supportedFields.filter(fieldsToBeSorted => fieldsToBeSorted.sort);
    }

    getAvailbeField(column) {
        return this.getFieldsToBeSorted().findIndex((supportedField: SupportedFieldTypes) => {
            return supportedField.field === column;
        });
    }

    getColumnHeaders() {
        const columnKeys = this.supportedFields.map(availableField => availableField.field);
        const columnHeaders: Array<TableColumns> = [];
        columnKeys.forEach((column, index) => {
            columnHeaders.push({
                text: _.startCase(_.camelCase(column)),
                dataField: column,
                sort: this.getAvailbeField(column) !== -1 ? true : false,
            });
        });
        return columnHeaders;
    }

    getDefaultSorted() {
        let defaultSortField = {};
        this.supportedFields.forEach(supportedField => {
            if (supportedField.order === 'asc') {
                defaultSortField = {
                    dataField: supportedField.field,
                    order: supportedField.order,
                };
            }
        });
        return defaultSortField;
    }

    getRootRoute() {
        return this.rootRoute;
    }

    setData(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

    getRoute(value: TableState) {
        const searchText = value.searchText;
        const rootPath = this.getRootRoute();

        return `${rootPath}/${value.sizePerPage}?page=${value.page}&ordering=${value.sortField}&search=${searchText}`;
    }
}

interface TableColumns {
    dataField: string;
    text: string;
    sort: boolean;
    onSort?: (field, order) => void;
    filter?: any;
}

interface Data {
    tableData: {
        next: string | null;
        previous: string | null;
        columns: Array<TableColumns>;
        data: Array<any>;
        totalCount: number;
    };
    pageData: {
        currentPage: number;
        sizePerPage: number;
    };
    searchText: string;
}

interface TableState {
    page: number;
    sizePerPage: number;
    sortField: string;
    sortOrder: string;
    searchText: string;
}
