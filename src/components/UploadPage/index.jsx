import React, { Component } from 'react';
import PDFJSExpressViewer from '../PDFViewer';

export default class UploadPage extends Component {
    render() {
        return (
            <div className="UploadPage">
                <PDFJSExpressViewer className="UploadPage__PDF" />
            </div>
        )
    }
}
