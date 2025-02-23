export default function Alert({alert, setAlert}) {
    return (
        <Dialog open={alert.open} onClose={() => setAlert({open: false, title: "", message: ""})}>
            <DialogTitle>{alert.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {alert.message}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}