import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { muiNonActionButton } from "@/modules/muiStyles";

export default function Alert({alert, setAlert}) {
    return (
        <Dialog className="errorAlert" open={alert.open} onClose={() => setAlert({open: false, title: "", message: ""})}>
            <DialogTitle>{alert.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {alert.message}
                </DialogContentText>
                <DialogActions>
                    <Button className="errorCloseButton" onClick={() => setAlert({open: false, title: "", message: ""})} sx={muiNonActionButton}>Close</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}