import { useState } from "react";
import { getMaxNumberOfGoals } from "@/modules/coreLogic";
import GoalTreeNode from "./GoalTreeNode";
import AddGoalToTree from "./AddGoalToTree";

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

export function GoalTree(props) {
    const [currentLine, setCurrentLine] = useState(1);
    
    const {goalsCompleted} = useSelector(state => state.goalStatistics.value);
    const goalsInLine = props.data.goals.filter((item) => item.partOfLine === currentLine);
    const maxNumberOfGoals = getMaxNumberOfGoals(goalsCompleted);
    const addNonActiveGoal = goalsInLine.length === 0;

    function moveLeft() {
        if(currentLine > 1) {
            setCurrentLine(currentLine - 1);
        } else if(currentLine === 1) {
            setCurrentLine(maxNumberOfGoals);
        }
    }

    function moveRight() {
        if(currentLine < maxNumberOfGoals) {
            setCurrentLine(currentLine + 1);
        } else if(currentLine === maxNumberOfGoals) {
            setCurrentLine(1);
        }
    }

    return (
        <Dialog 
            open={true} 
            onClose={props.close}
            fullWidth
            maxWidth="md"
            PaperProps={{
                style: {
                    backgroundColor: 'white',
                    borderRadius: '15px'
                }
            }}
            BackdropProps={{
                style: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'none'
                }
            }}
        >
            <DialogTitle 
                sx={{ 
                    background: 'white',
                    padding: '20px',
                    textAlign: 'center',
                }}
            >
                <Typography 
                    sx={{ 
                        fontFamily: 'Kameron, serif', 
                        fontSize: '35px', 
                        color: 'black',
                        marginTop: '10px',
                        display: 'inline-block'
                    }}
                >
                    Goal Tree
                </Typography>
                <IconButton 
                    onClick={props.close}
                    sx={{ marginTop: '5px', float: 'inline-end' }}
                    className="closeGoalTree"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 20px',
                    textAlign: 'center'
                }}
            >
                {maxNumberOfGoals > 1 && (
                    <IconButton onClick={moveLeft}>
                        <ArrowLeftIcon />
                    </IconButton>
                )}
                <Typography 
                    sx={{ 
                        fontFamily: 'Kameron, serif', 
                        fontSize: '25px', 
                        color: 'black',
                        margin: '15px 0'
                    }}
                >
                    Goal {currentLine}
                </Typography>
                {maxNumberOfGoals > 1 && (
                    <IconButton onClick={moveRight}>
                        <ArrowRightIcon />
                    </IconButton>
                )}
            </Box>
            
            <DialogContent 
                sx={{ 
                    background: 'white',
                    overflowY: 'auto',
                    padding: '0 20px 20px 20px',
                    maxHeight: '60vh'
                }}
            >
                {goalsInLine.map((goal, index) => (
                    <GoalTreeNode 
                        key={index} 
                        line={currentLine} 
                        goal={goal} 
                    />
                ))}
                <AddGoalToTree 
                    goals={props.data.goals} 
                    line={currentLine} 
                    addNonActiveGoal={addNonActiveGoal} 
                />
            </DialogContent>
        </Dialog>
    );
}