import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import CONSTANTS from '../../constants';
export default class PDFJSExpressViewer extends Component {
    constructor(props) {
        super(props);
        this.viewer = React.createRef();
        this.state = {
            file: null,
            setShow: false,
            counterpartEmail: '',
            instance: null,
            isLoaded: false
        }
    };
    componentDidMount() {

    }
    handleFileUpload = event => {
        const file = event.target.files[0];
        this.setState({ file });
        window.WebViewer({
            path: '/pdfjsexpress'
        }, this.viewer.current)
            .then(instance => {
                console.log("instance", instance);
                this.setState({ instance });
                instance.enableElements(['leftPanel', 'leftPanelButton']);
                instance.loadDocument(file, file.filename);
                const docViewer = instance.docViewer;
                const FitMode = instance.FitMode;
                instance.setFitMode(FitMode.Zoom);
                docViewer.on('documentLoaded', () => {
                    this.setState({ isLoaded: true });
                });
                var Feature = instance.Feature;
                instance.enableFeatures([Feature.Download]);
                instance.disableFeatures([Feature.Copy]);
                instance.disableTools();
                instance.enableTools(['AnnotationCreateSignature']);
            })
            .catch(err => console.log(err));
    }

    handleClose = () => {
        this.setState({ setShow: false })
        // console.log(this.state.id)
    }

    handleShow = () => {
        console.log('a')
        this.setState({ setShow: true })
        // console.log(this.state.id)
    }

    handleChangeEmail = (e) => {
        const email = e.target.value;
        this.setState({ counterpartEmail: email })
        console.log(this.state.counterpartEmail)
    }

    handleUpload = async (pdf) => {
        console.log(pdf);
        if (this.state.isLoaded)
            this.state.instance.downloadPdf(false);
            // console.log(this.state.instance.downloadPdf);

    };

    handleAddPartner = async (partner) => {
        console.log(partner);
        const response = await axios.post(CONSTANTS.ENDPOINT.ADDPARTNER, {
            // file: pdf
        });
        console.log("response: " + JSON.stringify(response));

        this.setState({ setShow: false })

    };

    render() {
        return (
            <div style={{ width: '100%', height: '100%', display: 'inline-block' }}>
                <input type="file" accept='.pdf' onChange={this.handleFileUpload} />
                <div style={{ height: '80vh' }} ref={this.viewer}> </div>
                <Button onClick={this.handleShow} >Add Partner</Button>
                <Button onClick={() => this.handleUpload(this.state.file)} >Save</Button>
                <div className="modal__AddEmail">
                    <Modal show={this.state.setShow} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add A Counterpart</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Enter Couterpart Email</p>
                            <input
                                className="email"
                                type="text"
                                placeholder="Example: abc@gmail.com"
                                onChange={this.handleChangeEmail}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                        </Button>
                            <Button variant="primary" onClick={() => this.handleAddPartner(this.state.counterpartEmail)}>
                                Save Changes
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        )
    }
}