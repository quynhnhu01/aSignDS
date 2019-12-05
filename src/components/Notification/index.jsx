import React, { Component } from "react";
import { MDBNotification, MDBContainer } from "mdbreact";
import "./index.scss";

class Notification extends Component {
    state = {
        showNotification: false
    };

    handleNotification = () => {
        const notification = this.state.showNotification;
        if (notification) {
            this.setState({ showNotification: false });
        } else {
            this.setState({ showNotification: true });
        }
    };
    render() {
        const { showNotification } = this.state;
        return (
            <div>
                <img
                    onClick={this.handleNotification}
                    className="notification"
                    src="https://cdn0.iconfinder.com/data/icons/ui-fill-glyphs/20/bell-512.png"
                    alt="bell"
                />
                {showNotification ? (
                    <MDBContainer
                        style={{
                            width: "auto",
                            position: "fixed",
                            top: "70px",
                            right: "10px",
                            zIndex: 9999,
                        }}
                        className="notificationContainer"
                    >
                        <MDBNotification
                            show
                            fade
                            iconClassName="text-primary"
                            title="Bootstrap"
                            message="See? Just like this."
                            text="just now"
                        />
                        <MDBNotification
                            show
                            fade
                            iconClassName="text-danger"
                            title="Bootstrap"
                            message="Heads up, toasts will stack automatically"
                            text="2 seconds ago"
                        />
                    </MDBContainer>
                ) : null
                }
            </div>
        );
    }
}

export default Notification;
