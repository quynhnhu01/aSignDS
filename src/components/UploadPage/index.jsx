import "../UploadPage/index.scss"
import React, { Component } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
class UploadPage extends Component {
    state = {
        selectedFile: null,
        numPages: null,
        pageNumber: 1,
    };

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    fileChangedHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })

    }

    goToPrevPage = () =>
        this.setState(state => ({ pageNumber: state.pageNumber - 1 }));
    goToNextPage = () =>
        this.setState(state => ({ pageNumber: state.pageNumber + 1 }));


    render() {
        const { pageNumber, numPages, selectedFile } = this.state;


        return (
            <div className="App">
               <div className="App__document">
               <input type="file" name="avatar" accept='.pdf' onChange={this.fileChangedHandler} />
                <div>
                    <Document
                        file={selectedFile}
                        onLoadSuccess={this.onDocumentLoadSuccess}
                    >
                        <Page pageNumber={pageNumber} />
                    </Document>
                    <p>Page {pageNumber} of {numPages}</p>
                </div>
                <nav>
                    <button onClick={this.goToPrevPage}>Prev</button>
                    <button onClick={this.goToNextPage}>Next</button>
                </nav>
               </div>
                <div className="App__signature">
                    <input type="file" accept=".jepg"/>
                    
                </div>
            </div>
        );
    }
}

export default UploadPage;