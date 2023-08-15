import Image from 'next/image';
import '../styles/navbar.css';

export default function SignedOutNav() {
    return (
        <nav className="navbar navbar-expand-lg boxNavbar">
            <Image src="/icon.png" width={80} height={75} alt="BoxAlc Icon"></Image>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapsibleContent" aria-controls="navbarCollapsibleContent" aria-expanded="false" aria-label="Collapse content">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapsibleContent" data-testid="collapsible-content">
                <ul className="nav navbar-nav me-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/">Home</a>
                    </li>
                </ul>
                <ul className="nav navbar-nav pr-1">
                    <li className="nav-item" id="signInButton">
                        <a className="nav-link" href="/signin">Sign In</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}