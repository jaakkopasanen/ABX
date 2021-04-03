import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core";

export default function CircleButton(props) {
    const rootStyles = {
        borderRadius: '50%',
        maxWidth: props.diameter,
        minWidth: props.diameter,
        height: props.diameter,
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        fontSize: 24,
        position: 'absolute',
        top: props.top,
        left: props.left,
    };
    if (props.color === 'black') {
        rootStyles.backgroundColor = 'black';
        rootStyles.color = 'white';
        rootStyles['&:hover'] = {
            backgroundColor: 'black'
        }
    }
    const classes = makeStyles(theme => ({
        root: rootStyles
    }))();
    const { children, color, ...other } = props;
    const muiSupportedColors = ['default', 'inherit', 'primary', 'secondary']
    return (
        <Button
            className={classes.root}
            color={muiSupportedColors.find(c => c === color) ? color : 'default'}
            {...other}
        >
            {children}
        </Button>
    )
};
