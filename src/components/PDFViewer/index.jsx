import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { DropzoneArea } from 'material-ui-dropzone';
import CONSTANTS from '../../constants';
import Aux from '../../HOC/auxiliary';
import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import { AuthContext } from '../../contexts/auth.context'
import Axios from 'axios';
import AlertMessage from '../AlertMessage';
import ModalAdder from '../Modal/ModalAdd';
import If from '../../helpers/If';
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
            isLoaded: false,
            uploaded: false,
            showVerify: false,
            isSigned: false,
            contract: null,
            MessageType: 'warning',
            MessageText: '',
            MessageOpen: false,
        };
        this.instance = null;
        this.docViewer = null;
        this.annotManager = null;
    };
    static contextType = AuthContext;
    componentDidMount() {
        let file, contract;
        if (this.props.location.state) {
            file = this.props.location.state.file;
            contract = this.props.location.state.contract;
            file && contract && this.setState({ uploaded: true, contract });
        }
        console.log("contract from location", contract);
        window.WebViewer({
            path: '/lib',
        }, this.viewer.current).then(instance => {
            this.instance = instance;
            this.docViewer = instance.docViewer;
            this.annotManager = instance.annotManager;
            instance.docViewer.on('documentLoaded', () => {
                this.setState({ isLoaded: true });
                const { contract } = this.state;
                contract && this.annotManager.importAnnotations(contract.annotations);
            });
            this.annotManager.setCurrentUser(this.context.user.username);
            if (file) {
                configInstance(instance, file);
            }
        })
        if (file) this.setState({ file });
    }
    handleFileUpload = files => {
        const file = files[0];
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
    handleSave = async (pdf) => {
        if (this.state.isLoaded) {
            const doc = this.docViewer.getDocument();
            const xfdfString = await this.annotManager.exportAnnotations()
            console.log(xfdfString);
            if (!this.state.contract) { //create new contract - upload file & create annotations
                doc.getFileData().then(data => {
                    const arr = new Uint8Array(data);
                    const blob = new Blob([arr], { type: 'application/pdf' });
                    // upload blob to your server
                    const formData = new FormData();
                    formData.append('contract', blob);
                    formData.append('annotations', xfdfString);
                    Axios.post(`${CONSTANTS.ENDPOINT.CONTRACT}`, formData, {
                        headers: {
                            authorization: `Bearer ${this.context.user.token}`
                        }
                    })
                        .then(response => {
                            console.log("response save contract", response.data);
                            this.setState({
                                MessageOpen: true,
                                MessageText: "Successfully saved",
                                MessageType: 'success',
                                contract: response.data.data
                            });

                        })
                        .catch(error => {
                            console.log(error);
                            this.setState({ MessageOpen: true, MessageText: "Error saving contract", MessageType: 'warning' });
                        });
                });
            }
            else { // update annotations for contract 
                const { contract } = this.state;
                const response = await Axios.put(`${CONSTANTS.ENDPOINT.CONTRACT}/${contract._id}`, {
                    annotations: xfdfString
                }, {
                    headers: {
                        authorization: `Bearer ${this.context.user.token}`
                    }
                });
                if (response.data)
                    this.setState({
                        MessageOpen: true,
                        MessageText: "Successfully saved",
                        MessageType: 'success',
                    });
            }
        }
        else {
            alert("Doc is loading");
            return;
        }
    };
    createStamped = () => {
        const stampAnnot = new this.instance.Annotations.StampAnnotation();
        stampAnnot.PageNumber = 1;
        stampAnnot.X = 0;
        stampAnnot.Y = 0;
        stampAnnot.Width = 100;
        stampAnnot.Height = 100;
        // put your data URI here
        stampAnnot.ImageData = 'data:image/png;base64,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';
        stampAnnot.Author = this.annotManager.getCurrentUser();
        stampAnnot.Locked = true;
        this.annotManager.addAnnotation(stampAnnot);
        this.annotManager.redrawAnnotation(stampAnnot);
    }
    handleAddAnother = () => {
        this.instance.closeDocument().then(() => {
            console.log('closeDocument');
            this.setState({ uploaded: false, isLoaded: false, contract: null });
        })
    }
    handleCloseAlert = () => {
        this.setState({ MessageOpen: false, MessageText: '' })
    }
    onAdd = async (contractId, email) => {
        try {
            console.log("call add user to contract", contractId, email);
            const response = await Axios.get(`${CONSTANTS.ENDPOINT.MAIL}/invite/${contractId}&${email}`, {
                headers: {
                    authorization: `Bearer ${this.context.user.token}`,
                }
            });
            if (response.data) {
                this.setState({ MessageOpen: true, MessageText: response.data.message, MessageType: 'success' });
            }
        } catch (error) {
            console.log("error add", error);
            this.setState({ MessageOpen: true, MessageText: error.response.data.message });
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <div style={{ width: '100%', height: '100%', display: 'inline-block' }}>
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
                            {this.state.contract && <Button
                                className={classes.button}
                                variant="contained"
                                startIcon={<AddIcon />}
                                color="primary"
                                onClick={this.handleShow} >Add Partner
                            </Button>}
                            <Button
                                className={classes.button}
                                variant="contained"
                                onClick={() => this.handleSave(this.state.file)}
                                color="primary"
                                startIcon={<SaveIcon />}
                            >Save</Button>
                        </Aux>
                        : null}
                <Button
                    className={classes.button}
                    variant="contained"
                    onClick={() => this.createStamped()}>New
                </Button>
                <If condition={this.state.setShow} component={ModalAdder} props={{
                    show: this.state.setShow,
                    data: this.state.contract,
                    onHide: this.handleClose,
                    onAdd: this.onAdd
                }} />
                <div style={{ height: '85vh' }} ref={this.viewer}> </div>
                <AlertMessage
                    open={this.state.MessageOpen}
                    text={this.state.MessageText}
                    onClose={this.handleCloseAlert}
                    type={this.state.MessageType}
                />
            </div>
        )
    }
}
export default withStyles(styles)(PDFJSExpressViewer);
