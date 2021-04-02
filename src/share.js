import {bytesToBase64} from "./base64";
import {abStats, enrichAbStats} from "./stats";

function createShareUrl(inResults, config) {
    for (const result of inResults) {
        if (result.userSelections === undefined) {
            return null;
        }
    }
    const results = inResults.map(result => abStats(result.name, result.optionNames, result.userSelections));
    const encodedResults = encodeAbTestResults(results, config);
    const url = new URL(window.location.toString());
    const configUrl = url.searchParams.get('test');
    url.searchParams.delete('test');
    url.searchParams.set('results', encodedResults);
    url.searchParams.set('results', encodedResults);
    url.searchParams.set('test', configUrl);
    return url.toString();
}

function encodeAbTestResults(testResults, config) {
    // Map test names to ordinal numbers
    const testOrd = {};
    for (let i = 0; i < config.tests.length; ++i) {
        testOrd[config.tests[i].name] = i;
    }
    // Map options to ordinal numbers
    const optionOrd = {};
    for (let i = 0; i < Object.keys(config.options).length; ++i) {
        optionOrd[config.options[i].name] = i;
    }
    // Create data array with ordinal numbers
    const data = [];
    for (const result of testResults) {
        // Add ordinal number of the test
        data.push(testOrd[result.name]);
        for (const option of result.options) {
            // Add ordinal number of the option in the test
            data.push(optionOrd[option.name]);
            // Add count
            data.push(option.count);
        }
    }
    // Convert to URI component encoded Base64
    return encodeURIComponent(bytesToBase64(data));
}

function decodeAbTestResults(dataStr, config) {
    let data = decodeURIComponent(dataStr);
    data = Uint8Array.from(atob(data), c => c.charCodeAt(0));

    const testResults = [];
    let i = 0;
    while (i < data.length) {
        const test = Object.assign({}, config.tests[data[i]]);
        // Create stats objects with the count data
        const stats = {options: [], optionNames: []};
        for (let j = i + 1; j < i + 1 + test.options.length * 2; j += 2) {
            stats.options.push({
                name: config.options[data[j]].name,
                count: data[j + 1]
            });
            stats.optionNames.push(config.options[data[j]].name);
        }
        const enrichedStats = enrichAbStats(stats);
        // Add to test results
        testResults.push({
            name: test.name,
            testType: test.testType,
            optionNames: stats.optionNames.slice(),
            stats: enrichedStats
        });
        // Move index to the beginning of the next test in the data array
        i += 1 + test.options.length * 2;
    }
    return testResults;
}

export {createShareUrl, encodeAbTestResults, decodeAbTestResults};
