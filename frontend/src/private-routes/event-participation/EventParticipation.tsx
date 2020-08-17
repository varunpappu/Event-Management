import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Form, Button, Card, Modal, Image } from 'react-bootstrap';
import * as H from 'history';
import { Executor } from '../../common/controllers/executor';
import { EVENT_ACTIONS } from '../../common/constants/event-routes';

class EventParticipation extends React.Component<RouteComponentProps<{}>, EventViewerState> {
    constructor(props: RouteComponentProps<{}>) {
        super(props);
        this.state = {
            values: {
                isEventNameRequired: false,
                isDescriptionRequired: false,
                isDurationRequired: false,
                isLocationRequired: false,
                isFeesRequired: false,
                isTagsRequired: false,
                isMaxParticipantsRequired: false,
            },
        };
    }

    async componentDidMount() {
        const params = this.props.match.params._id;
        let options = {
            method: 'GET',
            url: `${EVENT_ACTIONS}/${params}/info`,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access"),
                'Content-Type': 'application/json'
            },
        };
        let response: any = await Executor.makeRequest(options);
        if (response.status === 200) {
            const responseData = response.data.details;
            this.setState({
                values: {
                    _objectId: responseData._objectId,
                    isEventNameRequired: responseData.isEventNameRequired,
                    isDescriptionRequired: responseData.isDescriptionRequired,
                    isDurationRequired: responseData.isDurationRequired,
                    isLocationRequired: responseData.isLocationRequired,
                    isFeesRequired: responseData.isFeesRequired,
                    isTagsRequired: responseData.isTagsRequired,
                    isMaxParticipantsRequired: responseData.isMaxParticipantsRequired,
                }
            });
        }
    }

    render() {
        const formikState = Object.assign({
            eventName: "",
            description: "",
            duration: 0,
            location: "",
            fees: 0,
            tags: "",
            detail: "",
            maxParticipants: 0
        }, this.state.values)
        return (
            <Formik
                enableReinitialize
                initialValues={formikState}
                onSubmit={async (values, actions) => {
                    const options = {
                        method: 'POST',
                        url: `${EVENT_ACTIONS}/${this.state.values._objectId}/participate`,
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem("access"),
                            'Content-Type': 'application/json'
                        },
                        data: values,
                    };
                    const response: any = await Executor.makeRequest(options);
                    if (response.status === 201) {
                        window.location.reload();
                    } else if (response.status === 401) {
                        this.props.history.push("/login")
                        localStorage.clear()
                    }
                    else {
                        actions.setErrors(response.data.details);
                        actions.setSubmitting(false);
                    }

                }}
                validationSchema={Yup.object().shape({
                    eventName: Yup.string().when("isEventNameRequired", {
                        is: true,
                        then: Yup.string().required("This field is required.")
                    }),
                    description: Yup.string().when("isDescriptionRequired", {
                        is: true,
                        then: Yup.string().required("This field is required.")
                    }),
                    duration: Yup.number().min(0, 'Invalid number').typeError('Invalid Number')
                        .when("isDurationRequired", {
                            is: true,
                            then: Yup.number().min(0, 'Invalid number').typeError('Invalid Number').required('This field is required')
                        }),
                    location: Yup.string().when("isLocationRequired", {
                        is: true,
                        then: Yup.string().required('This field is required')
                    }),
                    fees: Yup.number().min(0, 'Invalid number').typeError('Invalid Number')
                        .when("isFeesRequired", {
                            is: true,
                            then: Yup.number().min(0, 'Invalid number').typeError('Invalid Number').required('This field is required')
                        }),
                    tags: Yup.string().when("isTagsRequired", {
                        is: true,
                        then: Yup.string().required('This field is required')
                    }),
                    maxParticipants: Yup.number().min(0, 'Invalid number').typeError('Invalid Number')
                        .when("isMaxParticipantsRequired", {
                            is: true,
                            then: Yup.number().min(0, 'Invalid number').typeError('Invalid Number').required('This field is required')
                        }),
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
                                            </Card.Header>
                                            <div className="container" style={{ marginTop: '40px' }}>
                                                <Form onSubmit={handleSubmit as React.FormEventHandler<any>}>
                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm={2}>
                                                            Event Name:
                                                    </Form.Label>
                                                        <Col sm={8}>
                                                            <Form.Control
                                                                id="eventName"
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
                                                    </Form.Group>

                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm={2}>
                                                            Description:
                                                    </Form.Label>
                                                        <Col sm={8}>
                                                            <Form.Control
                                                                id="description"
                                                                as="textarea"
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
                                                    </Form.Group>

                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm={2}>
                                                            Duration:
                                                    </Form.Label>
                                                        <Col sm={8}>
                                                            <Form.Control
                                                                id="duration"
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
                                                    </Form.Group>

                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm={2}>
                                                            Location:
                                                    </Form.Label>
                                                        <Col sm={8}>
                                                            <Form.Control
                                                                id="location"
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
                                                    </Form.Group>

                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm={2}>
                                                            Fees:
                                                    </Form.Label>
                                                        <Col sm={8}>
                                                            <Form.Control
                                                                id="fees"
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
                                                    </Form.Group>

                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm={2}>
                                                            Tags:
                                                    </Form.Label>
                                                        <Col sm={8}>
                                                            <Form.Control
                                                                id="tags"
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
                                                    </Form.Group>

                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm={2}>
                                                            Maximum No. of Participants:
                                                    </Form.Label>
                                                        <Col sm={8}>
                                                            <Form.Control
                                                                id="maxParticipants"
                                                                type="text"
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
                                                    </Form.Group>

                                                    <Form.Group as={Row}>
                                                        <Col md={{ span: 5, offset: 5 }}>
                                                            <Button type="submit" style={{ width: '150px' }}>
                                                                Participate
                                                            </Button>
                                                        </Col>
                                                    </Form.Group>
                                                    <div className="text-center">
                                                        <Form.Text className="text-muted">
                                                            {errors.detail && touched.detail ? (
                                                                <div style={{ color: 'red' }}>{errors.detail}</div>
                                                            ) : null}
                                                        </Form.Text>
                                                    </div>
                                                </Form>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    )}
            />
        );
    }
}

interface EventViewerState {
    values: {
        _objectId?: string,
        maxParticipants?: string,
        isEventNameRequired: boolean,
        isDescriptionRequired: boolean,
        isDurationRequired: boolean,
        isLocationRequired: boolean,
        isFeesRequired: boolean,
        isTagsRequired: boolean,
        isMaxParticipantsRequired: boolean,
    }
}

export default EventParticipation;

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
