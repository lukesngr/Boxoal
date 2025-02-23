import { useState } from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import CreateScheduleForm from "../form/CreateScheduleForm";

import '../../styles/cardInMiddle.scss';

export default function Welcome() {
    const [modalOpen, setModalOpen] = useState(false);
    

    return (
    <div className="backgroundForCard">
        <Card 
            sx={{ 
                backgroundColor: 'white', 
                margin: '10px', 
                marginTop: '50px',
                mx: 'auto',
                height: 'fit-content',
            }} 
            elevation={3}
        >
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <InfoIcon />
                    </Avatar>
                }
                title="Welcome to Boxoal"
                subheader="Tutorial video"
            />
            <CardContent>
                <div
                    style={{
                        width: '600px',
                        height: '400px',
                        backgroundColor: 'black',
                    }}
                />
            </CardContent>
            <CardHeader
                title="Instructions"
                subheader="Create a schedule to get started"
            />
            <CardActions>
                <Button 
                    variant="contained" 
                    onClick={() => setModalOpen(true)}
                >
                    Create Schedule
                </Button>
            </CardActions>
        </Card>

        <CreateScheduleForm open={modalOpen} onClose={() => setModalOpen(false)}/>
    </div>
    );
}