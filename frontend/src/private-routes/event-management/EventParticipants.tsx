import * as React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import * as H from 'history';
import TableViewer from '../common/table-viewer/TableViewer';
import { EVENT_PARTICIPANTS } from '../../common/constants/event-routes';
import { SupportedFieldTypes } from '../typings/typings';

class EventParticipants extends React.Component<RouteComponentProps<{}>, {}> {
    constructor(props: RouteComponentProps<{}>) {
        super(props);
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
            { field: 'participant', type: 'text', sort: false },

        ];
    };

    render() {
        return (
            <Container>
                <Row className="justify-content-md-center" style={{ marginTop: '40px' }}>
                    <Col xs lg="12">
                        <Card>
                            <Card.Body>
                                <Card.Header>Event Participants</Card.Header>
                                <div style={{ marginTop: '25px' }}>
                                    <TableViewer
                                        {...this.props}
                                        rootPath={`${EVENT_PARTICIPANTS}/${this.props.eventId}/participants`}
                                        supportedFields={this.supportedFields()}                                        
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

export default EventParticipants;


interface RouteComponentProps<P> {
    match?: match<P>;
    location?: H.Location;
    history?: H.History;
    staticContext?: any;
    eventId: string | undefined;
}


interface match<P> {
    params: P;
    isExact: boolean;
    path: string;
    url: string;
}
