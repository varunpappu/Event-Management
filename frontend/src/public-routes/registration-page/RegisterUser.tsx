import * as React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Form } from 'react-bootstrap';

import { USER_REGISTRATION } from '../../common/constants/event-routes';
import { Executor } from '../../common/controllers/executor';

class RegisterUser extends React.Component<RegisterUserProps, {}> {
    constructor(props: RegisterUserProps) {
        super(props);
    }

    render() {
        return (
            <Formik
                enableReinitialize
                initialValues={{
                    firstName: '',
                    emailAddress: '',
                    password: '',
                    detail: '',
                }}
                onSubmit={async (values, actions) => {
                    const options = {
                        method: 'POST',
                        url: USER_REGISTRATION,
                        headers: { 'Content-Type': 'application/json' },
                        data: {
                            firstName: values.firstName,
                            emailAddress: values.emailAddress,
                            password: values.password,
                        },
                    };
                    const response: any = await Executor.makeRequest(options);
                    if (response.status === 201) {
                        this.props.history.push('/login');
                    } 
                    else {
                        actions.setErrors(response.data.details);
                        actions.setSubmitting(false);
                    }
                }}
                validationSchema={Yup.object().shape({
                    firstName: Yup.string().required('This field is required.'),
                    emailAddress: Yup.string()
                        .required('This field is required.')
                        .email('Enter a valid email address.'),
                    password: Yup.string().required('This field is required.'),
                    detail: Yup.string(),
                })}
                render={({
                    values,
                    touched,
                    handleChange,
                    handleBlur,
                    errors,
                    handleSubmit,
                    isSubmitting,
                    dirty,
                    resetForm,
                }) => (
                        <div className="container" style={{ marginTop: '40px' }}>
                            <div className="row justify-content-md-center">
                                <div className="col col-lg-4">
                                    <Form onSubmit={handleSubmit as React.FormEventHandler<any>}>
                                        <Form.Group>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                id="firstName"
                                                type="text"
                                                autoComplete="firstName"
                                                name="firstName"
                                                placeholder="Valid name"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.firstName}
                                                className={
                                                    errors.firstName && touched.firstName
                                                        ? 'text-input error'
                                                        : 'text-input'
                                                }
                                            />
                                            <Form.Text className="text-muted">
                                                {errors.firstName && touched.firstName ? (
                                                    <div style={{ color: 'red' }}> {errors.firstName}</div>
                                                ) : null}
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Email Address</Form.Label>
                                            <Form.Control
                                                id="emailAddress"
                                                type="email"
                                                autoComplete="emailAddress"
                                                name="emailAddress"
                                                placeholder="Valid email address"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.emailAddress}
                                                className={
                                                    errors.emailAddress && touched.emailAddress
                                                        ? 'text-input error'
                                                        : 'text-input'
                                                }
                                            />
                                            <Form.Text className="text-muted">
                                                {errors.emailAddress && touched.emailAddress ? (
                                                    <div style={{ color: 'red' }}> {errors.emailAddress}</div>
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
                                                placeholder="Password"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.password}
                                                className={
                                                    errors.password && touched.password
                                                        ? 'text-input error'
                                                        : 'text-input'
                                                }
                                            />
                                            <Form.Text className="text-muted">
                                                {errors.password && touched.password ? (
                                                    <div style={{ color: 'red' }}> {errors.password}</div>
                                                ) : null}
                                            </Form.Text>
                                        </Form.Group>

                                        <div className="text-center">
                                            <Button
                                                className="text-center"
                                                variant="primary"
                                                type="submit"
                                                disabled={!dirty}
                                            >
                                                Register
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    )}
            />
        );
    }
}

interface RegisterUserProps {
    userLoginDispatcher?: any;
    userSession?: any;
    detail: string;
    history: any;
    classes: any;
}


export default RegisterUser;
