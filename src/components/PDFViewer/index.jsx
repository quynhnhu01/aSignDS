import React, { Component } from 'react';
export default class PDFJSExpressViewer extends Component {
    constructor(props) {
        super(props);
        this.viewer = React.createRef();
        this.state = {
            file: null
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
                instance.loadDocument(file, file.filename);
                const docViewer = instance.docViewer;
                docViewer.FitMode.FitWidth();
            })
            .catch(err => console.log(err));
    }
    render() {
        return (
            <div style={{ width: '100%', height: '100%', display: 'inline-block' }}>
                <input type="file" accept='.pdf' onChange={this.handleFileUpload} />
                <div ref={this.viewer}> </div>
            </div>
        )
    }
}