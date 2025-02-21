const glitchFont = localFont({src: '../public/BlueScreen.ttf'});

export default function LandingPage(props) {
    let {setComponentDisplayed} = props;
    return (
    <div className="text-center animatedText">
        <h1 className={glitchFont.className}>Timeboxing For The Everyman</h1>
        <button className="signInButton" onClick={() => setComponentDisplayed('signIn')}>Join Us</button>
    </div>
    )
}