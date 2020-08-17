import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Form, Button, Card, Modal, Image } from 'react-bootstrap';
import * as H from 'history';
import { Executor } from '../../common/controllers/executor';
import { EVENT_ACTIONS } from '../../common/constants/event-routes';
import EventParticipants from './EventParticipants';

class EventViewer extends React.Component<RouteComponentProps<{}>, EventViewerState> {
    constructor(props: RouteComponentProps<{}>) {
        super(props);
        this.state = {
            values: {
                eventName: '',
                isEventNameRequired: false,
                description: '',
                isDescriptionRequired: false,
                duration: '',
                isDurationRequired: false,
                location: '',
                isLocationRequired: false,
                fees: '',
                isFeesRequired: false,
                tags: '',
                isTagsRequired: false,
                maxParticipants: '',
                isMaxParticipantsRequired: false,
            },
            confirmDelete: false,
            editStatus: false,
        };
        this.deleteEvent = this.deleteEvent.bind(this);
    }

    async componentDidMount() {
        const params = this.props.match.params._id;
        let options = {
            method: 'GET',
            url: `${EVENT_ACTIONS}/${params}`,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access"),
                'Content-Type': 'application/json'
            },
        };
        let response: any = await Executor.makeRequest(options);
        if (response.status === 200) {
            const responseData = response.data.details;
            this.setState({
                values: responseData,
            });
        }
    }

    confirmDeleteModal = () => {
        return (
            <Modal show={this.state.confirmDelete}>
                <Modal.Header>
                    <Modal.Title>{this.state.values.eventName}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Are you sure you want to delete?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            this.setState({
                                confirmDelete: false,
                            });
                        }}
                    >
                        No
                    </Button>
                    <Button variant="primary" onClick={() => this.deleteEvent()}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    deleteEvent = async () => {
        const options = {
            method: 'DELETE',
            url: `${EVENT_ACTIONS}/${this.state.values._objectId}`,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access"),
                'Content-Type': 'application/json'
            },
            data: {},
        };
        const response: any = await Executor.makeRequest(options);
        if (response.status === 200) {
            this.props.history.push('/event/view');
        }
        if (response.status === 401) {
            this.props.history.push("/login")
            localStorage.clear()
        }
    };

    render() {
        return (
            <Formik
                enableReinitialize
                initialValues={this.state.values}
                onSubmit={async (values, actions) => {
                    if (this.state.editStatus) {
                        const options = {
                            method: 'PUT',
                            url: `${EVENT_ACTIONS}/${this.state.values._objectId}`,
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem("access"),
                                'Content-Type': 'application/json'
                            },
                            data: values,
                        };
                        const response: any = await Executor.makeRequest(options);
                        if (response.status === 200) {
                            location.reload()
                        } else if (response.status === 401) {
                            this.props.history.push("/login")
                            localStorage.clear()
                        }
                        else {
                            actions.setErrors(response.data.details);
                            actions.setSubmitting(false);
                        }
                    } else {
                        this.setState({
                            editStatus: true,
                        });
                    }
                }}
                validationSchema={Yup.object().shape({
                    eventName: Yup.string().required('This field is required'),
                    description: Yup.string().required('This field is required'),
                    duration: Yup.number().min(0, 'Invalid number').typeError('Invalid Number').required('This field is required'),
                    location: Yup.string().required('This field is required'),
                    fees: Yup.number().min(0, 'Invalid number').typeError('Invalid Number').required('This field is required'),
                    tags: Yup.string().required('This field is required'),
                    maxParticipants: Yup.number().min(0, 'Invalid number').typeError('Invalid Number').required('This field is required')
                })}
                render={({
                    values,
                    touched,
                    handleChange,
                    handleBlur,
                    errors,
                    resetForm,
                    dirty,
                    isSubmitting,
                    setFieldValue,
                    handleSubmit,
                    setFieldTouched,
                }) => (
                        <Container>
                            <Row className="justify-content-md-center" style={{ marginTop: '40px' }}>
                                <Col xs lg="12">
                                    <Card>
                                        <Card.Body>
                                            <Card.Header>
                                                Event Viewer
                                                <Image
                                                    style={{ float: 'right' }}
                                                    alt="delete"
                                                    src="../../../public/assests/images/delete.png"
                                                    width="30"
                                                    height="30"
                                                    className="d-inline-block align-top"
                                                    onClick={() => {
                                                        this.setState({
                                                            confirmDelete: true,
                                                        });
                                                    }}
                                                />
                                            </Card.Header>
                                            {this.confirmDeleteModal()}
                                            <div className="container" style={{ marginTop: '40px' }}>
                                                <Form onSubmit={handleSubmit as React.FormEventHandler<any>}>
                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm={2}>
                                                            Event Name:
                                                    </Form.Label>
                                                        <Col sm={4}>
                                                            <Form.Control
                                                                id="eventName"
                                                                readOnly={!this.state.editStatus}
                                                                type="text"
                                                                autoComplete="eventName"
                                                                name="eventName"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.eventName}
                                                                className={
                                                                    errors.eventName && touched.eventName
                                                                        ? 'text-input error'
                                                                        : 'text-input'
                                                                }
                                                            />
                                                            <Form.Text className="text-muted">
                                                                {errors.eventName && touched.eventName ? (
                                                                    <div style={{ color: 'red' }}> {errors.eventName}</div>
                                                                ) : null}
                                                            </Form.Text>
                                                        </Col>
                                                        <Form.Label column sm={2}>
                                                            Is Field Mandatory:
                                                    </Form.Label>
                                                        <Col sm={4}>
                                                            <Form.Check
                                                                id="isEventNameRequired"
                                                                type="switch"
                                                                name="isEventNameRequired"
                                                                label="True"
                                                                disabled={!this.state.editStatus}
                                                                onChange={handleChange}
                                                                checked={values.isEventNameRequired}
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm={2}>
                                                            Description:
                                                    </Form.Label>
                                                        <Col sm={4}>
                                                            <Form.Control
                                                                id="description"
                                                                as="textarea"
                                                                readOnly={!this.state.editStatus}
                                                                name="description"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                rows={5}
                                                                value={values.description}
                                                                className={
                                                                    errors.description && touched.description
                                                                        ? 'text-input error'
                                                                        : 'text-input'
                                                                }
                                                            />
                                                            <Form.Text className="text-muted">
                                                                {errors.description && touched.description ? (
                                                                    <div style={{ color: 'red' }}> {errors.description}</div>
                                                                ) : null}
                                                            </Form.Text>
                                                        </Col>
                                                        <Form.Label column sm={2}>
                                                            Is Field Mandatory:
                                                    </Form.Label>
                                                        <Col sm={4}>
                                                            <Form.Check
                                                                id="isDescriptionRequired"
                                                                type="switch"
                                                                name="isDescriptionRequired"
                                                                label="True"
                                                                disabled={!this.state.editStatus}
                                                                onChange={handleChange}
                                                                checked={values.isDescriptionRequired}
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm={2}>
                                                            Duration:
                                                    </Form.Label>
                                                        <Col sm={4}>
                                                            <Form.Control
                                                                id="duration"
                                                                readOnly={!this.state.editStatus}
                                                                type="text"
                                                                autoComplete="duration"
                                                                name="duration"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.duration}
                                                                className={
                                                                    errors.duration && touched.duration
                                                                        ? 'text-input error'
                                                                        : 'text-input'
                                                                }
                                                            />
                                                            <Form.Text className="text-muted">
                                                                {errors.duration && touched.duration ? (
                                                                    <div style={{ color: 'red' }}> {errors.duration}</div>
                                                                ) : null}
                                                            </Form.Text>
                                                        </Col>
                                                        <Form.Label column sm={2}>
                                                            Is Field Mandatory:
                                                    </Form.Label>
                                                        <Col sm={4}>
                                                            <Form.Check
                                                                id="isDurationRequired"
                                                                type="switch"
                                                                name="isDurationRequired"
                                                                label="True"
                                                                disabled={!this.state.editStatus}
                                                                onChange={handleChange}
                                                                checked={values.isDurationRequired}
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm={2}>
                                                            Location:
                                                    </Form.Label>
                                                        <Col sm={4}>
                                                            <Form.Control
                                                                id="location"
                                                                readOnly={!this.state.editStatus}
                                                                type="text"
                                                                autoComplete="location"
                                                                name="location"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.location}
                                                                className={
                                                                    errors.location && touched.location
                                                                        ? 'text-input error'
                                                                        : 'text-input'
                                                                }
                                                            />
                                                            <Form.Text className="text-muted">
                                                                {errors.location && touched.location ? (
                                                                    <div style={{ color: 'red' }}> {errors.location}</div>
                                                                ) : null}
                                                            </Form.Text>
                                                        </Col>
                                                        <Form.Label column sm={2}>
                                                            Is Field Mandatory:
                                                    </Form.Label>
                                                        <Col sm={4}>
                                                            <Form.Check
                                                                id="isLocationRequired"
                                                                type="switch"
                                                                name="isLocationRequired"
                                                                label="True"
                                                                disabled={!this.state.editStatus}
                                                                onChange={handleChange}
                                                                checked={values.isLocationRequired}
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm={2}>
                                                            Fees:
                                                    </Form.Label>
                                                        <Col sm={4}>
                                                            <Form.Control
                                                                id="fees"
                                                                readOnly={!this.state.editStatus}
                                                                type="text"
                                                                autoComplete="fees"
                                                                name="fees"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.fees}
                                                                className={
                                                                    errors.fees && touched.fees
                                                                        ? 'text-input error'
                                                                        : 'text-input'
                                                                }
                                                            />
                                                            <Form.Text className="text-muted">
                                                                {errors.fees && touched.fees ? (
                                                                    <div style={{ color: 'red' }}> {errors.fees}</div>
                                                                ) : null}
                                                            </Form.Text>
                                                        </Col>
                                                        <Form.Label column sm={2}>
                                                            Is Field Mandatory:
                                                    </Form.Label>
                                                        <Col sm={4}>
                                                            <Form.Check
                                                                id="isFeesRequired"
                                                                type="switch"
                                                                name="isFeesRequired"
                                                                label="True"
                                                                disabled={!this.state.editStatus}
                                                                onChange={handleChange}
                                                                checked={values.isFeesRequired}
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm={2}>
                                                            Tags:
                                                    </Form.Label>
                                                        <Col sm={4}>
                                                            <Form.Control
                                                                id="tags"
                                                                readOnly={!this.state.editStatus}
                                                                as="textarea"
                                                                autoComplete="tags"
                                                                name="tags"
                                                                rows={5}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.tags}
                                                                className={
                                                                    errors.tags && touched.tags
                                                                        ? 'text-input error'
                                                                        : 'text-input'
                                                                }
                                                            />
                                                            <Form.Text className="text-muted">
                                                                {errors.tags && touched.tags ? (
                                                                    <div style={{ color: 'red' }}> {errors.tags}</div>
                                                                ) : null}
                                                            </Form.Text>
                                                        </Col>
                                                        <Form.Label column sm={2}>
                                                            Is Field Mandatory:
                                                    </Form.Label>
                                                        <Col sm={4}>
                                                            <Form.Check
                                                                id="isTagsRequired"
                                                                type="switch"
                                                                disabled={!this.state.editStatus}
                                                                name="isTagsRequired"
                                                                label="True"
                                                                onChange={handleChange}
                                                                checked={values.isTagsRequired}
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm={2}>
                                                            Maximum No. of Participants:
                                                    </Form.Label>
                                                        <Col sm={4}>
                                                            <Form.Control
                                                                id="maxParticipants"
                                                                type="text"
                                                                readOnly={!this.state.editStatus}
                                                                autoComplete="maxParticipants"
                                                                name="maxParticipants"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.maxParticipants}
                                                                className={
                                                                    errors.maxParticipants && touched.maxParticipants
                                                                        ? 'text-input error'
                                                                        : 'text-input'
                                                                }
                                                            />
                                                            <Form.Text className="text-muted">
                                                                {errors.maxParticipants && touched.maxParticipants ? (
                                                                    <div style={{ color: 'red' }}> {errors.maxParticipants}</div>
                                                                ) : null}
                                                            </Form.Text>
                                                        </Col>
                                                        <Form.Label column sm={2}>
                                                            Is Field Mandatory:
                                                    </Form.Label>
                                                        <Col sm={4}>
                                                            <Form.Check
                                                                id="isMaxParticipantsRequired"
                                                                type="switch"
                                                                disabled={!this.state.editStatus}
                                                                name="isMaxParticipantsRequired"
                                                                label="True"
                                                                onChange={handleChange}
                                                                checked={values.isMaxParticipantsRequired}
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row}>
                                                        <Col md={{ span: 5, offset: 5 }}>
                                                            <Button type="submit" style={{ width: '150px' }}>
                                                                {this.state.editStatus ? 'Update' : 'Edit'}
                                                            </Button>
                                                        </Col>
                                                    </Form.Group>
                                                </Form>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            <EventParticipants eventId={this.props.match.params._id} />
                        </Container>
                    )}
            />
        );
    }
}

interface EventViewerState {
    values: {
        _objectId?: string,
        eventName: string,
        isEventNameRequired: boolean,
        description: string,
        isDescriptionRequired: boolean,
        duration: string,
        isDurationRequired: boolean,
        location: string,
        isLocationRequired: boolean,
        fees: string,
        isFeesRequired: boolean,
        tags: string,
        isTagsRequired: boolean,
        maxParticipants: string,
        isMaxParticipantsRequired: boolean,
    }
    confirmDelete: boolean
    editStatus: boolean,
}

export default EventViewer;

interface RouteComponentProps<P> {
    match: match<P>;
    location: H.Location;
    history: H.History;
    staticContext?: any;
}

interface match<P> {
    params: {
        _id: string;
    };
    isExact: boolean;
    path: string;
    url: string;
}
