import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

class ThankYou extends React.Component {
    render() {
        return (
            <Box display="flex" flexDirection="column">
                <Typography variant="h2">{this.props.title || 'Thank you!'}</Typography>
                <Typography>{this.props.description}</Typography>
            </Box>
        )
    }
}

export default ThankYou;