import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import SeamaToolbar from './SeamaToolbar';
import Routes from './Routes';
import SeamaSidebar from './SeamaSidebar';
import { version } from '../../package.json';

export const Page = ({ component: Component, ...rest }) => (
  <div>
    <SeamaToolbar Version={version} />
    <Grid fluid>
      <Row>
        <Col md={2} sm={3} className="sidebar">
          <SeamaSidebar />
        </Col>
        <Col md={10} sm={9} smOffset={3} mdOffset={2} className="main">
          <Routes />
        </Col>
      </Row>
    </Grid>
  </div>
);
