import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import logo from 'images/swe-logo.png';
import 'App.css';

class SeamaSidebar extends Component {
  renderLinks() {
    const currentPath = this.props.location.pathname;
    const dashboardRoutes = [
      {
        path: '/',
        name: 'Users',
        icon: 'glyphicon-user'
      },
      {
        path: '/products',
        name: 'Products',
        icon: 'glyphicon-shopping-cart'
      },
      {
        path: '#',
        name: 'Kiosks',
        icon: 'glyphicon-home'
      },
      {
        path: '/daily_production',
        name: 'Daily Production',
        icon: 'glyphicon-scale'
      }
    ];
    return (
      <ul className="nav nav-sidebar">
        {dashboardRoutes.map(route => (
          <li
            key={route.name}
            className={route.path === currentPath ? 'active' : ''}
          >
            <Link to={route.path}>
              <i
                className={`glyphicon ${route.icon}`}
                style={{ paddingRight: '20px' }}
              />
              {route.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    return (
      <div>
        <div>{<img src={logo} alt="logo" />}</div>
        {this.renderLinks()}
      </div>
    );
  }
}

export default withRouter(SeamaSidebar);
