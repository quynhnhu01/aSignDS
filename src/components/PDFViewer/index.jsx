import React, { Component } from 'react';
import { Modal, Input } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import { DropzoneArea } from 'material-ui-dropzone';
import axios from 'axios';
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
                        })
                        .catch(error => console.log(error));
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
                console.log("response update annotations", response.data);
            }
        }
        else {
            alert("Doc is loading");
            return;
        }
    };

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
