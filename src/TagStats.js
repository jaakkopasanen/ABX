import React from "react";
import Box from "@material-ui/core/Box";
import { tagStats } from "./stats";
import ABStats from "./ABStats";

class TagStats extends React.Component {
    render() {
        // Create tag groups from all combinations of tags
        const tagGroups = tagStats(this.props.results, this.props.config).tagGroups;

        // Compute tag group stats
        const allStats = [];
        let i = 0;
        for (const [name, tagGroup] of Object.entries(tagGroups)) {
            const stats = (
                <ABStats
                    name={name}
                    optionNames={tagGroup.optionNames}
                    userSelections={tagGroup.userSelections}
                />
            )
            allStats.push(
                <Box key={i} mb="12px">
                    {stats}
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

export default TagStats;
