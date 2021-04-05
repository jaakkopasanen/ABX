import yaml from "js-yaml";

const parseConfig = async function(inConfig) {
    return fetchConfig(inConfig).then(config => {
        for (let i = 0; i < config.options.length; ++i) {
            // Make URLs downloadable link and create Audio objects
            config.options[i].audioUrl = rawLink(config.options[i].audioUrl);
        }
        for (let i = 0; i < config.tests.length; ++i) {
            // Repeat defaults to 1
            if (!config.tests[i].repeat) {
                config.tests[i].repeat = 10;
            }
            // Create option objects by querying the options with the given names
            config.tests[i].options = config.tests[i].options.map((name) => {
                const option = config.options.find(option => option.name === name);
                return {
                    name: name,
                    audioUrl: option.audioUrl,
                    tag: option.tag
                }
            });
        }
        return config;
    });
}

const fetchConfig = async function(url) {
    /* Downloads config YAML file */
    const content = await fetch(rawLink(url)).then(res => res.text());
    return yaml.load(content);
}

const rawLink = function(urlStr) {
    /* Turns Dropbox share links to download links for which Dropbox serves correct content types */
    const dropboxPattern = new RegExp(/^(https?:\/\/)?(www\.)?dropbox.com/);
    if (dropboxPattern.test(urlStr)) {
        let url = new URL(urlStr);
        url.searchParams.delete('dl');
        url.host = url.host.replace(dropboxPattern, 'dl.dropboxusercontent.com')
        return url.toString();
    }
    return urlStr;
}

export { parseConfig, fetchConfig, rawLink };
