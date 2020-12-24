import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core";

const size = 64;

const CircleButton = withStyles((theme) => ({
    root: {
        borderRadius: '50%',
        maxWidth: size,
        minWidth: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        fontSize: 24
    },
}))(Button);

export default CircleButton;
