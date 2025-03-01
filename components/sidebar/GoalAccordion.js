import { Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GoalProgressIndicator from '../goal/GoalProgressIndicator';

export default function GoalAccordion(props) {
    
    return (
        <Accordion sx={{backgroundColor: '#C5C27C',
            '&.MuiAccordion-root.Mui-expanded': {
                marginTop: '0px',
                marginBottom: '0px',
            }}}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            >   
                <GoalProgressIndicator goal={props.goal}></GoalProgressIndicator>            
                <Typography component="span">{props.goal.title}</Typography>
            </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </AccordionDetails>
      </Accordion>)
}