import React from 'react';
import { Navbar } from 'react-bootstrap';
import * as H from 'history';
import { withRouter } from 'react-router';
import DropDownMenuSelect from 'react-nested-menu-selector';
import { dashboardMenu, eventMenu } from './menu-items';
import Notifications from '../notifications/Notifications';

class NavDrawer extends React.Component<RouteComponentProps<{}>, NavDrawerState> {
    constructor(props: RouteComponentProps<{}>) {
        super(props);
        this.state = {
            dropdownAnchor: false,
        };
        this.handleNavDrawer = this.handleNavDrawer.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleNavDrawer = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            dropdownAnchor: !this.state.dropdownAnchor,
        });
    };

    handleOnClick = path => {
        this.props.history.push(path);
    };

    render() {            
        return (
            <div>
                <div id="childnav">
                    <Navbar variant="dark" style={{ backgroundColor: '#4E73DF' }}>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <div style={{ marginRight: '25px' }}>
                            <DropDownMenuSelect values={dashboardMenu} handleOnClick={this.handleOnClick} />
                        </div>
                        <div style={{ marginRight: '25px' }}>
                            <DropDownMenuSelect values={eventMenu} handleOnClick={this.handleOnClick} />
                        </div>
                    </Navbar>
                </div>
                <Notifications />
            </div>
        );
    }
}
export default withRouter(NavDrawer);

interface NavDrawerState {
    dropdownAnchor: boolean;
}

interface RouteComponentProps<P> {
    match: match<P>;
    location: H.Location;
    history: H.History;
    staticContext?: any;
}

interface match<P> {
    params: P;
    isExact: boolean;
    path: string;
    url: string;
}