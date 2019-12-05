import React from 'react';
import PDFJSExpressViewer from '../PDFViewer';

export default function UploadPage(props) {
    return (
        <div className="UploadPage">
            <PDFJSExpressViewer className="UploadPage__PDF" {...props} />
        </div>
    )
}