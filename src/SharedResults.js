import React from 'react';
import {Box, Button, Link, Container} from "@material-ui/core";
import {parseConfig} from "./config";
import Results from "./Results";
import {decodeTestResults} from "./share";


class SharedResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: null,
            results: null,
        };
    }

    componentDidMount() {
        parseConfig(this.props.config).then(config => {
            const results = decodeTestResults(this.props.results, config);
            this.setState({
                config: Object.assign({}, config),
                results: results
            })
        });
    }

    render() {
        if (!this.state.config || !this.state.results) {
            return null;
        }
        let url = new URL(window.location.toString());
        url.searchParams.delete('results');
        url = url.toString();
        return (
            <Box className="greyBg" pt={2} pb={2}>
                <Container maxWidth="sm">
                    <Box mb={2}>
                        <Link href="/" target="_blank">
                            <img src="abx-logo-192x109.png" height="64px" alt="ABX logo" />
                        </Link>
                    </Box>
                    <Results
                        description={this.state.config.results ? this.state.config.results.description : ''}  // TODO
                        results={this.state.results}
                        config={this.state.config}
                    />
                    <Box className="centerText" mt={3}>
                        <Link href={url} target="_blank">
                            <Button variant="contained" color="secondary" size="large">Take the test</Button>
                        </Link>
                    </Box>
                </Container>
            </Box>
        );
    }
}

export default SharedResults;
