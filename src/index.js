import React from 'react';
import ReactDOM from 'react-dom';
import TestRunner from "./TestRunner";
import './index.css';

// https://www.dropboxforum.com/t5/Dropbox-files-folders/public-links-to-raw-files/td-p/110391
const config = {
    title: 'EQ Reqularization AB Test',
    description: 'Series of ABC listening tests for equalizer regularization',
    thankYou: {
        title: 'Thank you for participating!',
        description: 'Your results have been submitted.'
    },
    tests: [{
        type: 'AB',
        title: 'AB Test',
        description: 'Select the most preferred option',
        options: [
            'https://dl.dropbox.com/s/wjsrxo46abwzvkx/bells-tibetan-daniel_simon.wav',
            'https://dl.dropbox.com/s/jo4qol1fkl5j0x7/tolling-bell_daniel-simion.wav',
            'https://dl.dropbox.com/s/w3r33kl2c0ee3op/cartoon-birds-2_daniel-simion.wav'
        ]
    }, {
        type: 'AB',
        title: 'AB Test 2',
        description: 'Select the most preferred option',
        options: [
            'https://dl.dropbox.com/s/wjsrxo46abwzvkx/bells-tibetan-daniel_simon.wav',
            'https://dl.dropbox.com/s/jo4qol1fkl5j0x7/tolling-bell_daniel-simion.wav',
            //'https://dl.dropbox.com/s/w3r33kl2c0ee3op/cartoon-birds-2_daniel-simion.wav'
        ]
    }]
};



ReactDOM.render(
    <TestRunner className="test" config={config} />,
    document.getElementById('root')
);
