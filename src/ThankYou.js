import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

class ThankYou extends React.Component {
    render() {
        const results = [];
        for (let i = 0; i < this.props.results.length; ++i) {
            const repeats = [];
            for (let j = 0; j < this.props.results[i].length; ++j) {
                repeats.push(
                    <Box key={j}>
                        <Typography>
                            {this.props.results[i][j].name}
                        </Typography>
                    </Box>
                )
            }
            results.push(
                <Box key={i}>
                    <Typography variant="h4">{i}</Typography>
                    {repeats}
                </Box>
            )
        }
        return (
            <Box display="flex" flexDirection="column">
                <Typography variant="h2">{this.props.title || 'Thank you!'}</Typography>
                <Typography>{this.props.description}</Typography>
                <Typography variant="h3">Your answers</Typography>
                {results}
            </Box>
        )
    }
}

export default ThankYou;