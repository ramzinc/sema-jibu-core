import React, { Component } from 'react';
import 'App.css';
import 'css/SeamaSales.css';

class SeamaSales extends Component {
    constructor(props, context) {
        super(props, context);
        console.log("SeamaSales - Constructor");
    }

    render() {
        return this.showSales();
    }

    showSales(){
        return (
            <div className="Sales">
                <h2 style={{textAlign:"center", color:"white"}}>Not Yet Implemented</h2>
            </div>
        );

    }
}

export default SeamaSales;
