import {bytesToBase64} from "./base64";
import {abStats, abxStats, enrichAbStats, enrichAbxStats} from "./stats";

function createShareUrl(inResults, config) {
    for (const result of inResults) {
        if (result.userSelections === undefined && result.userSelectionsAndCorrects === undefined) {
            return null;
        }
    }
    const results = inResults.map(result => {
        if (result.testType.toLowerCase() === 'ab') {
            return abStats(result.name, result.optionNames, result.userSelections);
        } else {
            return abxStats(result.name, result.optionNames, result.userSelectionsAndCorrects);
        }

    });
    // const encodedResults = encodeAbTestResults(results, config);
    const encodedResults = encodeTestResults(results, config);
    const url = new URL(window.location.toString());
    const configUrl = url.searchParams.get('test');
    url.searchParams.delete('test');
    url.searchParams.set('results', encodedResults);
    url.searchParams.set('results', encodedResults);
    url.searchParams.set('test', configUrl);
    return url.toString();
}

function encodeTestResults(testResults, config) {
    // Map test names to ordinal numbers
    const testOrd = {};
    const testTypes = {};
    for (let i = 0; i < config.tests.length; ++i) {
        testOrd[config.tests[i].name] = i;
        testTypes[config.tests[i].name] = config.tests[i].testType;
    }

    // Map options to ordinal numbers
    const optionOrd = {};
    for (let i = 0; i < Object.keys(config.options).length; ++i) {
        optionOrd[config.options[i].name] = i;
    }

    // Create data array with ordinal numbers
    const data = [Math.floor(Math.random() * 256)];  // One random byte to confuse users XD
    for (const result of testResults) {
        // Add ordinal number of the test
        data.push(testOrd[result.name]);

        if (testTypes[result.name].toLowerCase() === 'ab') {
            for (const option of result.options) {
                // Add ordinal number of the option in the test
                data.push(optionOrd[option.name]);
                // Add count
                data.push(option.count);
            }

        } else if (testTypes[result.name].toLowerCase() === 'abx') {
            for (const row of result.rows) {
                // Add ordinal number of the correct option
                data.push(optionOrd[row.correctOption]);
                // Add counts
                for (const name of Object.keys(row.counts)) {
                    // Add ordinal number of the selected option
                    data.push(optionOrd[name]);
                    // Add count of the selected option
                    data.push(row.counts[name]);
                }
            }
        } else {
            throw new Error(`Unsupported test type ${test.testType}`);
        }
    }

    // Convert to URI component encoded Base64
    return encodeURIComponent(bytesToBase64(data));
}

function decodeTestResults(dataStr, config) {
    let data = decodeURIComponent(dataStr);
    data = Uint8Array.from(atob(data), c => c.charCodeAt(0));

    const testResults = [];
    let i = 1;  // Skip the random byte added by encoder
    while (i < data.length) {
        const test = Object.assign({}, config.tests[data[i]]);

        if (test.testType.toLowerCase() === 'ab') {
            // Create AB stats objects with the count data
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

        } else if (test.testType.toLowerCase() === 'abx') {
            // Create ABX stats objects with the row data
            const stats = {rows: [], optionNames: []};
            let ix = i + 1;  // Running index, starts from first byte after test indicator byte
            for (let j = 0; j < test.options.length; ++j) {
                // There's one row per option since data has been enriched
                const row = {correctOption: config.options[data[ix]].name, counts: {}};
                stats.optionNames.push(row.correctOption);
                ++ix;  // Move on to the first count pair byte
                for (let k = 0; k < test.options.length; ++k) {
                    // There's one byte pair per option since data has been enriched
                    // Read the selected option and it's count
                    row.counts[config.options[data[ix]].name] = data[ix + 1];
                    ix += 2;
                }
                stats.rows.push(row);
            }
            const enrichedStats = enrichAbxStats(stats);
            testResults.push({
                name: test.name,
                testType: test.testType,
                optionNames: stats.optionNames.slice(),
                stats: enrichedStats,
            })
            i += ix;

        } else {
            throw new Error(`Unsupported test type ${test.testType}`);
        }
    }
    return testResults;
}

export {createShareUrl, encodeTestResults, decodeTestResults};
