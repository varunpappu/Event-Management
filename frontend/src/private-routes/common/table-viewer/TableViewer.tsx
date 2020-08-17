import * as React from 'react';
import { TableBuilder } from './TableBuilder';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { TableSearch } from './TableSearch';
import { Executor } from '../../../common/controllers/executor';
import { SupportedFieldTypes } from '../../typings/typings';
import * as H from 'history';

class TableViewer extends React.Component<TableViewerProps, TableViewerState> {
    private tableBuilder: TableBuilder;
    private _mounted: boolean;
    constructor(props: TableViewerProps) {
        super(props);
        this.state = {
            updated: false,
        };
        this._mounted = true;
        this.tableBuilder = new TableBuilder(this.props.rootPath, this.props.supportedFields);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    fetchTableData = async (value: TableState) => {
        const options = {
            method: 'GET',
            url: this.tableBuilder.getRoute(value),
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access"),
                'Content-Type': 'application/json',
            },
        };
        const response: any = await Executor.makeRequest(options);
        if (response.status === 200) {
            this.updateTableData(value, response);
            if (this._mounted) {
                this.setState({
                    updated: !this.state.updated,
                });
            }
        } else if (response.status === 401) {
            if (this.props.history) {
                this.props.history.push("/login")
                localStorage.clear()
            }
        }
        else {
            this.resetTable();
            if (this._mounted) {
                this.setState({
                    updated: !this.state.updated,
                });
            }
        }
    };

    componentWillUnmount() {
        this._mounted = false;
    }

    updateTableData = (value, response) => {
        const responseData = response.data;
        const previousData = this.tableBuilder.getData();
        const updatedData = {
            tableData: {
                columns: previousData.tableData.columns,
                data: responseData.results,
                totalCount: responseData.count,
                next: responseData.next,
                previous: responseData.previous,
            },
            pageData: {
                sizePerPage: value.sizePerPage,
                currentPage: value.page,
            },
            searchText: value.searchText,
        };
        this.tableBuilder.setData(updatedData);
    };

    resetTable = () => {
        this.tableBuilder = new TableBuilder(this.props.rootPath, this.props.supportedFields);
    };

    handleSort = (tableState: TableState) => {
        if (tableState.sortField === 'asc' || tableState.sortField === 'desc') {
            return;
        }
        if (tableState.sortOrder === 'desc') {
            tableState.sortField = `-${tableState.sortField}`;
        }
        this.fetchTableData(tableState);
    };

    handlePageSize = (tableState: TableState) => {
        this.fetchTableData(tableState);
    };

    handlePageChange = (tableState: TableState) => {
        let doesPageExist = false;
        const currentData = this.tableBuilder.getData();
        const pageData = currentData.pageData;
        const tableData = currentData.tableData;

        if (tableState.page > pageData.currentPage) {
            if (tableData.next !== null) {
                doesPageExist = true;
            }
        } else {
            if (tableData.previous !== null) {
                doesPageExist = true;
            }
        }
        if (doesPageExist) this.fetchTableData(tableState);
    };

    handleRowEvents = {
        onDoubleClick: (e, row, rowIndex) => {
            if (this.props.handleRowClick) {
                this.props.handleRowClick(row);
            }
            e.stopPropagation();
            e.preventDefault();
        },
    };

    handleTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
        const currentData = this.tableBuilder.getData();
        const tableInfo: TableState = { page, sizePerPage, sortField, sortOrder, searchText: currentData.searchText };
        setTimeout(async () => {
            //Handle Page Change
            if (page !== currentData.pageData.currentPage) {
                this.handlePageChange(tableInfo);
            }

            // Handle Size Per Page
            if (sizePerPage !== currentData.pageData.sizePerPage) {
                this.handlePageSize(tableInfo);
            }

            // Handle column sort
            if (sortOrder === 'asc') {
                this.handleSort(tableInfo);
            }
            if (sortOrder === 'desc') {
                this.handleSort(tableInfo);
            }
        }, 1000);
    };

    handleSearch = (searchText: string) => {
        const currentData = this.tableBuilder.getData();
        const defaultSorted = this.tableBuilder.getDefaultSorted();
        const tableInfo: TableState = {
            page: currentData.pageData.currentPage,
            sizePerPage: currentData.pageData.sizePerPage,
            sortField: defaultSorted['dataField'],
            sortOrder: defaultSorted['order'],
            searchText,
        };
        this.fetchTableData(tableInfo);
    };

    render() {
        const currentData = this.tableBuilder.getData();
        return (
            <ToolkitProvider
                keyField="id"
                data={currentData.tableData.data}
                columns={currentData.tableData.columns}
                search
            >
                {props => (
                    <div>
                        <div style={{ marginBottom: '10px', float: 'right' }}>
                            <TableSearch {...props.searchProps} onHandleSearch={this.handleSearch} />
                        </div>
                        {currentData.tableData.columns.length ? (
                            <div>
                                <BootstrapTable
                                    {...props.baseProps}
                                    bootstrap4={true}
                                    condensed={true}
                                    bordered={false}
                                    noDataIndication="No Records Found"
                                    remote
                                    pagination={paginationFactory({
                                        page: currentData.pageData.currentPage,
                                        sizePerPage: currentData.pageData.sizePerPage,
                                        totalSize: currentData.tableData.totalCount,
                                    })}
                                    rowEvents={this.handleRowEvents}
                                    onTableChange={this.handleTableChange}
                                    defaultSorted={[this.tableBuilder.getDefaultSorted()]}
                                />
                            </div>
                        ) : null}
                    </div>
                )}
            </ToolkitProvider>
        );
    }
}

export default TableViewer;

interface TableViewerProps {
    rootPath: string;
    supportedFields: SupportedFieldTypes[];
    handleRowClick?: (rowValues) => void;
    history?: H.History;
}

interface TableViewerState {
    updated: boolean;
}

interface TableState {
    page: number;
    sizePerPage: number;
    sortField: string;
    sortOrder: string;
    searchText: string;
}
