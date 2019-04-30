import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import 'App.css';

// import logo from 'images/swe-sidebar-logo.png';

import {sideBarLogo} from "../Branding"

const SeamaListStyleActive = {
    textAlign:"left",
    paddingLeft:"20px",
    backgroundColor:"rgb(24,55,106)",
    color:"white"
};


const ImageStyle = {
    resize:"both",
    width:'100%',
    height:'100%',
	maxWidth: '100%',
	marginBottom: '5px'
};


function CustomComponent1({ children }) {
    return (
        <li className="list-group-item" style={SeamaListStyleActive}>
            {children}
        </li>
    );
}


class SemaSidebar extends Component {
    render() {
        return (
            <div className="SeamaNavSidebar" style={this.getStyle()}>
                <div>
					{/*{<img src={require('images/swe-sidebar-logo.png')} alt="logo" style={ImageStyle} />}*/}
					{<img src={sideBarLogo} alt="logo" style={ImageStyle} />}
                </div>
                <ListGroup>
					<CustomComponent1><i className="glyphicon glyphicon-map-marker" style={{paddingRight:"15px"}}/>
						<Link to='/'>Water operations</Link></CustomComponent1>
					<CustomComponent1><i className="glyphicon glyphicon-shopping-cart" style={{paddingRight:"15px"}}/>
						<Link to='/Sales'>Sales</Link></CustomComponent1>
					<CustomComponent1><i className="glyphicon glyphicon-tint" style={{paddingRight:"15px"}}/>
                        <Link to='/Volumes'>Volumes</Link></CustomComponent1>
                    <CustomComponent1><i className="glyphicon glyphicon-user" style={{paddingRight:"15px"}}/>
                        <Link to='/Demographics'>Demographics</Link></CustomComponent1>
                    <CustomComponent1><i className="glyphicon glyphicon-download" style={{paddingRight:"15px"}}/>
                        <Link to='/DataExport'>Data Export</Link></CustomComponent1>
                    {/*<CustomComponent1><i className="glyphicon glyphicon-globe" style={{paddingRight:"15px"}}/>*/}
                        {/*<Link to='/DistributionMap'>Distribution Map</Link></CustomComponent1>*/}
                    {/*<CustomComponent1><i className="glyphicon glyphicon-time" style={{paddingRight:"15px"}}/>*/}
                        {/*<Link to='/DeliverySchedule'>Delivery Schedule</Link></CustomComponent1>*/}
                    {/*<CustomComponent1><i className="glyphicon glyphicon-inbox" style={{paddingRight:"15px"}}/>*/}
                        {/*<Link to='/InventoryManagement'>Inventory Management</Link></CustomComponent1>*/}
                    {/*<CustomComponent1><i className="glyphicon glyphicon-usd" style={{paddingRight:"15px"}}/>*/}
                        {/*<Link to='/Financials'>Financials</Link></CustomComponent1>*/}
                </ListGroup>
            </div>
        );
    }
	getStyle(){
		let windowHeight = window.innerHeight;
		// TODO 52px is the height of the toolbar. (Empirical)
		windowHeight -= 52;
		let height = windowHeight.toString()+'px';
		return {
			background:"rgb(24,55,106)",
			width:"240px",
			height:height}
	}

}


export default SemaSidebar;
