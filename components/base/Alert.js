import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { muiNonActionButton } from "@/modules/muiStyles";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Alert({alert, setAlert}) {
    const {alert} = useSelector(state => state.alert.value);
    const dispatch = useDispatch();
    return (
        <Dialog className="errorAlert" open={alert.open} onClose={() => dispatch({type:'alert/set', payload: {open: false, title: "", message: ""}})}>
            <DialogTitle>{alert.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {alert.message}
                </DialogContentText>
                <DialogActions>
                    <Button className="errorCloseButton" onClick={() => dispatch({type:'alert/set', payload: {open: false, title: "", message: ""}})} sx={muiNonActionButton}>Close</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}