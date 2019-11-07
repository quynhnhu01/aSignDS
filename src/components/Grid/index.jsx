import React, { Component } from "react";
import classnames from "classnames";
import GridComponent from "./GridComponent";
import AlertMessage from "../AlertMessage";
import GreyBox from "../../images/GreyBox.svg";
import styles from "./grid.module.css";
import CONSTANTS from "../../constants";

export default class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gridTextAssets: [{ description: "", header: "", id: 0 }],
            MessageOpen: false,
            MessageText: ""
        };

        this.handleClose = this.handleClose.bind(this);
    }

    // Get the text sample data from the back end
    componentDidMount() {
        fetch(CONSTANTS.ENDPOINT.GRID)
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then(result => this.setState({ gridTextAssets: result }))
            .catch(error =>
                this.setState({
                    MessageOpen: true,
                    MessageText: `Request to get grid text failed: ${error}`
                })
            );
    }

    handleClose() {
        this.setState({
            MessageOpen: false,
            MessageText: ""
        });
    }

    handleButtonUploadClick = evt => {
        alert("Upload button clicked");
    }

    render() {
        const {
            gridTextAssets,
            MessageOpen,
            MessageText
        } = this.state;
        return (
            <main id="mainContent">
                <div className={classnames("text-center", styles.header, styles.gradientGrid)}>
                    <h1>aSignDS</h1>
                    <p>Auto Sign with Digital Signature and Manage your document.</p>
                    <button className="btn btn-primary my-2" onClick={(e) => this.handleButtonUploadClick(e)}>Upload Your Document</button>
                </div>

                <div className="container">
                    <div className="row justify-content-center py-5">
                        <h1>Features</h1>
                    </div>

                    <div className="row justify-content-around text-center pb-5">
                        {gridTextAssets.map(textAssets => (
                            <GridComponent
                                key={textAssets.id}
                                header={textAssets.title}
                                description={textAssets.shortDescription}
                                image={GreyBox}
                            />
                        ))}
                    </div>
                </div>
                <AlertMessage
                    open={MessageOpen}
                    text={MessageText}
                    onClose={this.handleClose}
                    type='warning'
                />
            </main>
        );
    }
}
