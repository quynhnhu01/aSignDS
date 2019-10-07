import React, { Component } from 'react';
import axios from 'axios';
import Aux from '../HOC/auxiliary';
export default class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    };
    componentDidMount() {

    };
    render() {
        return (
            <Aux>
                <div>
                    lorem ipsum dolor sit amet, consectetuer adip
                </div>
            </Aux>
        )
    }
}