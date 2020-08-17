import * as React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import * as H from 'history';
import TableViewer from '../common/table-viewer/TableViewer';
import { PARTICIPABLE_EVENT } from '../../common/constants/event-routes';
import { SupportedFieldTypes } from '../typings/typings';

class EventDashboard extends React.Component<RouteComponentProps<{}>, {}> {
    constructor(props: RouteComponentProps<{}>) {
        super(props);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleCreateEvent = this.handleCreateEvent.bind(this);
    }

    supportedFields = (): SupportedFieldTypes[] => {
        return [
            { field: 'eventName', type: 'text', sort: true, order: 'asc' },
            { field: 'description', type: 'text', sort: false },
            { field: 'duration', type: 'text', sort: true },
            { field: 'location', type: 'text', sort: true },
            { field: 'fees', type: 'number', sort: true },
            { field: 'tags', type: 'text', sort: false },
            { field: 'maxParticipants', type: 'number', sort: true },

        ];
    };

    handleRowClick(rowValues: any) {
        this.props.history.push({
            pathname: `/event/${rowValues._objectId}/participate`,
            state: rowValues,
        });
    }

    handleCreateEvent() {
        this.props.history.push({
            pathname: `/event/create`,
        });
    }

    render() {
        return (
            <Container>
                <Row className="justify-content-md-center" style={{ marginTop: '40px' }}>
                    <Col xs lg="12">
                        <Card>
                            <Card.Body>
                                <Card.Header>Participable Event List</Card.Header>
                                <div style={{ marginTop: '25px' }}>
                                    <Button onClick={this.handleCreateEvent} >Create Event</Button>
                                </div>
                                <div style={{ marginTop: '25px' }}>
                                    <TableViewer
                                        {...this.props}
                                        rootPath={PARTICIPABLE_EVENT}
                                        supportedFields={this.supportedFields()}
                                        handleRowClick={this.handleRowClick}
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

        );
    }
}

export default EventDashboard;


interface RouteComponentProps<P> {
    match: match<P>;
    location: H.Location;
    history: H.History;
    staticContext?: any;
    values: any;
}

interface match<P> {
    params: P;
    isExact: boolean;
    path: string;
    url: string;
}
