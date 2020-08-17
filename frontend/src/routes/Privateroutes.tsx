import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { REFRESH_TOKEN } from '../common/constants/event-routes';
import { Executor } from '../common/controllers/executor';
import * as H from 'history';
import NavDrawer from '../private-routes/menu-management/NavDrawer';

class PrivateRoute extends React.Component<RouteComponentProps<{}>, MyState> {
    constructor(props: RouteComponentProps<{}>) {
        super(props);
        this.state = {
            redirectToRenderer: null,
            loading: true,
            refresh: false,
        };
    }

    async componentDidMount() {
        const options = {
            method: 'POST',
            url: REFRESH_TOKEN,
            headers: { 'Content-Type': 'application/json' },
            data: {
                refresh: localStorage.getItem("refresh")
            }
        };
        const response: any = await Executor.makeRequest(options);
        if (response.status === 200) {
            localStorage.setItem("access", response.data.access)
            this.setState({
                redirectToRenderer: routeComponent(this.props),
                loading: false,
            });
        } else {
            localStorage.clear();
            this.setState({
                redirectToRenderer: loginPage(),
                loading: false,
            });

        }
    }

    render() {
        return this.state.loading ? (
            <div>
                <h1>loading</h1>
            </div>
        ) : (
                this.state.redirectToRenderer
            );
    }
}
export default PrivateRoute;

interface MyState {
    redirectToRenderer: any;
    loading: boolean;
    refresh: boolean;
}

export interface RouteComponentProps<P> {
    location?: H.Location;
    history?: H.History;
    exact?: boolean;
    path: string;
    component: any;
}

const routeComponent = (props) => {
    const { component: Component, ...rest } = props;
    return (
        <div>
            <NavDrawer {...rest} />
            <Route
                {...rest}
                render={routeProps => {
                    return <Component {...routeProps} />;
                }}
            />{' '}
        </div>
    );
};

const loginPage = () => {
    return <Redirect to="/login" />;
};
