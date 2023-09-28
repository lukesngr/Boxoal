import Image from 'next/image';
import '../styles/navbar.scss';

export default function SignedInNav(props) {
    return (
        <nav className="navbar navbar-expand-lg boxNavbar">
            <Image src="/icon.png" width={80} height={75} alt="BoxAlc Icon" priority></Image>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapsibleContent" aria-controls="navbarCollapsibleContent" aria-expanded="false" aria-label="Collapse content">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapsibleContent">
                <ul className="nav navbar-nav me-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/myschedules">Timeboxes</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/view">View</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/export">Export</a>
                    </li>
                </ul>
                <ul className="nav navbar-nav pr-1">
                    <li className="nav-item" id="userButton">
                        <img src={props.session.user.image} alt="User Image" width={30} height={30}></img>
                        <p>{props.session.user.email}</p>
                    </li>
                </ul>
            </div>
        </nav>
    )
}