import React from 'react';
import Websocket from 'react-websocket';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EVENT_NOTIFICATIONS } from '../../common/constants/event-routes';

class Notifications extends React.Component<{}, {}> {

    constructor(props) {
        super(props);
    }

    handleData(data) {
        const result = JSON.parse(data);
        toast(result.message, {
            position: "top-right",
            autoClose: 5000,
            type: result.event === "delete" ? "warning" : "info",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    render() {
        const userToken = localStorage.getItem("access")
        return (
            <div>
                <Websocket url={`${EVENT_NOTIFICATIONS}`}
                    onMessage={this.handleData.bind(this)} />
                <ToastContainer />
            </div>
        );
    }
}

export default Notifications;