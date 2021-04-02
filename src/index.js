import React from 'react';
import ReactDOM from 'react-dom';
import TestRunner from "./TestRunner";
import LandingPage from "./LandingPage";
import SharedResults from "./SharedResults";
import './index.css';

const url = new URL(window.location.toString())
const config = url.searchParams.get('test');
const results = url.searchParams.get('results');

let component;
if (config && results) {
    component = <SharedResults config={config} results={results} />
} else if (config) {
    component = <TestRunner className="test" config={config} />
} else {
    component = <LandingPage />
}

ReactDOM.render(
    component,
    document.getElementById('root')
);
