import React from 'react';
import ReactDOM from 'react-dom';
import TestRunner from "./TestRunner";
import './index.css';

const config = new URL(window.location.toString()).searchParams.get('test');

ReactDOM.render(
    <TestRunner className="test" config={config} />,
    document.getElementById('root')
);
