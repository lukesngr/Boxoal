import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { muiNonActionButton } from "@/modules/muiStyles";
import { useDispatch, useSelector } from "react-redux";

export default function Alert() {
    const alert = useSelector(state => state.alert.value);
    const dispatch = useDispatch();
    return (
        <Dialog className="errorAlert" open={alert.open} onClose={() => dispatch({type:'alert/set', payload: {open: false, title: "", message: ""}})}
            PaperProps={{
                style: {
                    backgroundColor: '#875F9A',
                    borderRadius: '0px',
                    position: 'absolute',
                }
            }}>
            <DialogTitle className='dialogTitle'>{alert.title}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ color: 'white' }}>
                {alert.message}
                </DialogContentText>
                <DialogActions>
                    <Button className="errorCloseButton" onClick={() => dispatch({type:'alert/set', payload: {open: false, title: "", message: ""}})} sx={muiNonActionButton}>Close</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}