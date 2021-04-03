import React from "react";
import Box from "@material-ui/core/Box";
import ABXStats from "./ABXStats";

class ABXTagStats extends React.Component {
    render() {
        // Create tag groups from all combinations of tags
        if (!this.props.stats || !this.props.stats.length) {
            return null;
        }

        // Compute tag group stats
        const allStats = [];
        let i = 0;
        for (const tagGroupStats of this.props.stats) {
            allStats.push(
                <Box key={i} mb="12px">
                    <ABXStats name={tagGroupStats.name} stats={tagGroupStats} optionNames={tagGroupStats.optionNames} />
                </Box>
            )
            ++i;
        }

        // Render components
        return (
            <Box>
                {allStats}
            </Box>
        )
    }
}

export default ABXTagStats;
