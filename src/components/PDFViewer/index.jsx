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
import Axios from 'axios';
function configInstance(instance, file, isSigned) {
    instance.loadDocument(file, file.filename);
    instance.enableElements(['leftPanel', 'leftPanelButton']);
    const FitMode = instance.FitMode;
    instance.setFitMode(FitMode.Zoom);
    instance.disableTools();
    !isSigned ? instance.enableTools(['AnnotationCreateSignature']) : void 0;
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
            verifyCode: '',
            isSigned: false
        };
        this.instance = null;
        this.docViewer = null;
        this.annotManager = null;
    };
    static contextType = AuthContext;
    componentDidMount() {
        const file = this.props.location.state && this.props.location.state.file;
        file ? this.setState({ uploaded: true }) : void 0;
        console.log("file from location", file);
        window.WebViewer({
            path: '/lib',
        }, this.viewer.current).then(instance => {
            this.instance = instance;
            this.docViewer = instance.docViewer;
            this.annotManager = instance.annotManager;
            instance.docViewer.on('documentLoaded', () => {
                this.setState({ isLoaded: true });
            });
            this.instance.setAnnotationUser(this.context.user.username);
            if (file) {
                configInstance(instance, file);
            }
            this.annotManager.on("annotationChanged", (event, annotations, action) => {
                const annots = this.annotManager.getAnnotationsList()
                if (annots.length > 0) {
                    this.setState({ isSigned: true });
                    this.instance.disableTools();
                }
                const SignatureAnnotations = annotations.filter(annotation => annotation.Subject === 'Signature')
                console.log("event annotationChanged", SignatureAnnotations);
                if (SignatureAnnotations.length > 0 && SignatureAnnotations.length < 3) {
                    if (action === 'add') {
                        this.setState({ isSigned: true });
                        this.instance.disableTools();
                    }
                    else if (action === 'delete') {
                        this.setState({ isSigned: false });
                        this.instance.enableTools(['AnnotationCreateSignature']);
                    }
                }
            })
        })
        if (file) this.setState({ file });
    }
    handleFileUpload = files => {
        console.log(files[0]);
        const file = files[0];
        console.log("File upload", file);

        this.setState({ file, uploaded: true });
        configInstance(this.instance, file);
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
        if (this.state.isLoaded && this.state.isSigned) {
            const doc = this.docViewer.getDocument();
            const options = {
                xfdfString: this.annotManager.exportAnnotations()
            };
            doc.getFileData(options).then(data => {
                const arr = new Uint8Array(data);
                const blob = new Blob([arr], { type: 'application/pdf' });
                // upload blob to your server
                console.log("prepared upload", blob);
                const formData = new FormData();
                formData.append('contract', blob);
                Axios.post(`${CONSTANTS.ENDPOINT.CONTRACT}`, formData, {
                    headers: {
                        authorization: `Bearer ${this.context.user.token}`
                    }
                })
                    .then(response => {
                        console.log("save blob pdf", response.data);
                    })
                    .catch(error => console.log(error));
            });
        }
        else {
            alert("Please provide signature");
            return;
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
