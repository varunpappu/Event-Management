import * as React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { USER_LOGIN } from '../../common/constants/event-routes';
import { Executor } from '../../common/controllers/executor';

class UserLogin extends React.Component<UserLoginProps, {}> {
    constructor(props: UserLoginProps) {
        super(props);
    }

    render() {
        return (
            <Formik
                initialValues={{ username: '', password: '', detail: '' }}
                onSubmit={async (values, actions) => {
                    const options = {
                        method: 'POST',
                        withCredentials: true,
                        url: USER_LOGIN,
                        headers: { 'Content-Type': 'application/json' },
                        data: {
                            username: values.username,
                            password: values.password,
                        },
                    };
                    const response: any = await Executor.makeRequest(options);
                    if (response.status === 200) {
                        localStorage.setItem("access", response.data.access);
                        localStorage.setItem("refresh", response.data.refresh);

                        this.props.history.push('/dashboard');
                    } else {
                        actions.setErrors(response.data.details);
                        actions.setSubmitting(false);
                    }
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string()
                        .email('The field must be a valid email Address')
                        .required('This field is required.'),
                    password: Yup.string().required('This field is required.'),
                })}
                render={({ values, touched, handleChange, handleBlur, errors, dirty, isSubmitting, handleSubmit }) => (
                    <Container>
                        <Row style={{ marginTop: '40px' }}>
                            <Col md={{ span: 3, offset: 4 }}>
                                <Form onSubmit={handleSubmit as React.FormEventHandler<any>}>
                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            id="username"
                                            type="email"
                                            autoComplete="username"
                                            name="username"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.username}
                                            className={
                                                errors.username && touched.username ? 'text-input error' : 'text-input'
                                            }
                                        />
                                        <Form.Text className="text-muted">
                                            {errors.username && touched.username ? (
                                                <div style={{ color: 'red' }}> {errors.username}</div>
                                            ) : null}
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            id="password"
                                            type="password"
                                            autoComplete="password"
                                            name="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                            className={
                                                errors.password && touched.password ? 'text-input error' : 'text-input'
                                            }
                                        />
                                        <Form.Text className="text-muted">
                                            {errors.password && touched.password ? (
                                                <div style={{ color: 'red' }}> {errors.password}</div>
                                            ) : null}
                                        </Form.Text>
                                    </Form.Group>
                                    <Button variant="primary" type="submit" style={{ width: '100%' }} disabled={!dirty}>
                                        Login
                                    </Button>
                                    <div className="text-center">
                                        <Form.Text className="text-muted">
                                            {errors.detail && touched.detail ? (
                                                <div style={{ color: 'red' }}>{errors.detail}</div>
                                            ) : null}
                                        </Form.Text>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                )}
            />
        );
    }
}

interface UserLoginProps {
    userLoginDispatcher?: any;
    userSession?: any;
    detail: string;
    history: any;
    classes: any;
}

export default UserLogin;
