import React from 'react';
import ReactDOM from 'react-dom';
import TestRunner from "./TestRunner";
import LandingPage from "./LandingPage";
import './index.css';

const config = new URL(window.location.toString()).searchParams.get('test');

ReactDOM.render(
    config ? <TestRunner className="test" config={config} /> : <LandingPage />,
    document.getElementById('root')
);
