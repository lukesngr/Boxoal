import { Dialog, DialogTitle, DialogContent, DialogContentText } from "@mui/material";

export default function Alert({alert, setAlert}) {
    return (
        <Dialog className="errorAlert" open={alert.open} onClose={() => setAlert({open: false, title: "", message: ""})}>
            <DialogTitle>{alert.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {alert.message}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}