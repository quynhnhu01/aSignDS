import React, { Component } from 'react';
import { Modal, Input } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import { DropzoneArea } from 'material-ui-dropzone';
import axios from 'axios';
import CONSTANTS from '../../constants';
import Aux from '../../HOC/auxiliary';
import SaveIcon from '@material-ui/icons/Save';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import { AuthContext } from '../../contexts/auth.context'
function configInstance(instance, file) {
    instance.loadDocument(file, file.filename);
    instance.enableElements(['leftPanel', 'leftPanelButton']);
    const FitMode = instance.FitMode;
    instance.setFitMode(FitMode.Zoom);
    instance.disableTools();
    instance.enableTools(['AnnotationCreateSignature']);
}
const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    icon: {
        margin: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(1),
    },
});
class PDFJSExpressViewer extends Component {
    constructor(props) {
        super(props);
        this.viewer = React.createRef();
        this.state = {
            file: null,
            setShow: false,
            counterpartEmail: '',
            instance: null,
            isLoaded: false,
            uploaded: false,
            showVerify: false,
            verifyCode: ''
        };
        this.instance = null;
        this.docViewer = null;
        this.annotManager = null;
    };
    static contextType = AuthContext;
    componentDidMount() {
    }
    handleFileUpload = files => {
        console.log(files[0]);
        const file = files[0]
        this.setState({ file, uploaded: true });
        if (!this.instance)
            window.WebViewer({
                path: '/lib'
            }, this.viewer.current)
                .then(instance => {
                    console.log("instance", instance);
                    instance.docViewer.on('documentLoaded', () => {
                        this.setState({ isLoaded: true });
                    });
                    instance.setAnnotationUser(this.context.user.username);
                    this.instance = instance;
                    this.docViewer = instance.docViewer;
                    this.annotManager = instance.annotManager;
                    configInstance(instance, file)

                })
                .catch(err => console.log(err));
        else {
            configInstance(this.instance, file);
            this.docViewer.on('documentLoaded', () => {
                this.setState({ isLoaded: true });
            });
        }
    }

    handleClose = () => {
        this.setState({ setShow: false })
    }

    handleShow = () => {
        this.setState({ setShow: true })
    }

    handleShowVerify = () => {
        this.setState({ showVerify: true })
    }

    handleCloseVerify = () => {
        this.setState({ showVerify: false })
    }

    handleChangeEmail = (e) => {
        const email = e.target.value;
        this.setState({ counterpartEmail: email })
        console.log(this.state.counterpartEmail)
    }

    handleChangeVerifyCode = (e) => {
        const code = e.target.value;
        this.setState({ verifyCode: code })
    }

    handleVerify = async (verifyCode) => {
        console.log(verifyCode);
        const response = await axios.post(CONSTANTS.ENDPOINT.VERITY, {
            // file: pdf
        });
        console.log("response: " + JSON.stringify(response));

        this.setState({ showVerify: false })
    }

    handleSave = async (pdf) => {
        if (this.state.isLoaded) {
            const doc = this.docViewer.getDocument();
            // include annotations with the document
            const options = {
                xfdfString: this.annotManager.exportAnnotations()
            };
            doc.getFileData(options).then(data => {
                const arr = new Uint8Array(data);
                const blob = new Blob([arr], { type: 'application/pdf' });
                // upload blob to your server
                console.log("prepared upload", blob);
            });
        }

    };

    handleAddPartner = async (partner) => {
        console.log(partner);
        const response = await axios.post(CONSTANTS.ENDPOINT.ADDPARTNER, {
            // file: pdf
        });
        console.log("response: " + JSON.stringify(response));

        this.setState({ setShow: false })

    };
    handleAddAnother = () => {
        this.instance.closeDocument().then(() => {
            console.log('closeDocument');
            this.setState({ uploaded: false, isLoaded: false });
        })
    }
    render() {
        const { classes } = this.props;
        return (
            <div style={{ width: '100%', height: '100%', display: 'inline-block' }}>
                {/* <input type="file" accept='.pdf' onChange={this.handleFileUpload} /> */}
                {!this.state.uploaded ?
                    <div style={{ padding: '50px', borderRadius: '5px' }}>
                        <DropzoneArea
                            acceptedFiles={['.pdf']} onChange={this.handleFileUpload}
                            dropzoneText='Drag and drop an pdf file here or click'
                            filesLimit={1}
                        />
                    </div> :
                    this.state.isLoaded ?
                        <Aux>
                            <Button
                                className={classes.button}
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                                onClick={() => this.handleAddAnother()}>New
                                 </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                startIcon={<AddIcon />}
                                color="primary"
                                onClick={this.handleShow} >Add Partner
                                 </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                onClick={() => this.handleSave(this.state.file)}
                                color="primary"
                                startIcon={<SaveIcon />}
                            >Save</Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                onClick={this.handleShowVerify}
                                color="primary"
                                startIcon={<VerifiedUserIcon />}
                            >Verify</Button>
                        </Aux>
                        : null}


                <div style={{ height: '85vh' }} ref={this.viewer}> </div>

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
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={this.handleClose}>
                                Close
                        </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.handleAddPartner(this.state.counterpartEmail)}>
                                Save Changes
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className="modal__AddEmail">
                    <Modal show={this.state.showVerify} onHide={this.handleCloseVerify}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add A Verify Code</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Enter Code </p>
                            <input
                                className="email"
                                type="text"
                                placeholder="Example: AB!@#$123"
                                onChange={this.handleChangeVerifyCode}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={this.handleCloseVerify}>
                                Close
                        </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.handleVerify(this.state.verifyCode)}>
                                Verify
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        )
    }
}
export default withStyles(styles)(PDFJSExpressViewer);
