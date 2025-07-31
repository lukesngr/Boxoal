import "../styles/homecard.scss";
import Button from '@mui/material/Button';
import Image from 'next/image';

export default function LandingPage(props) {
    const {setComponentDisplayed} = props;
    return (
            <div className="signInCard animatedText">
                <Image src="/icon2.png" className='logo' width={80} height={75} alt="BoxAlc Icon" priority></Image>
                <h1 className="firstLine">Make Every</h1>
                <h1 className="secondLine">Second Work </h1>
                <h1 className="thirdLine">For</h1>
                <h1 className="fourthLine">Your Dreams</h1>
                <Button className="signInButton" onClick={() => setComponentDisplayed('signIn')}>Get Started Timeboxing</Button>
            </div>
        )
}