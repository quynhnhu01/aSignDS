import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export const DefaultLayout = props => {
    return (
        <React.Fragment>
            <NavBar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        {props.children}
                    </div>
                </div>

            </div>
            <Footer />
        </React.Fragment>
    )
}