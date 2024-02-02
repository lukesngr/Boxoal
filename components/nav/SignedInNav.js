import Image from 'next/image';
import '../../styles/navbar.scss';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function SignedInNav(props) {
    const [userCardDisplayed, setUserCardDisplayed] = useState(false);

    return (
        <nav className="navbar navbar-expand-lg boxNavbar">
            <a href="/">
                <Image src="/icon.png" width={80} height={75} alt="BoxAlc Icon" priority></Image>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapsibleContent" aria-controls="navbarCollapsibleContent" aria-expanded="false" aria-label="Collapse content">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapsibleContent">
                <ul className="nav navbar-nav me-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/myschedules">Timeboxes</a>
                    </li>
                </ul>
                <ul className="nav navbar-nav pr-1">
                    {userCardDisplayed && 
                        <div className="userCard">
                            <div>
                                <h5>{props.session.user.email}</h5>
                                <button className="closeUserCard" onClick={() => setUserCardDisplayed(false)}><FontAwesomeIcon icon={faCircleXmark} /></button>
                            </div>
                            <button onClick={() => signOut()} className="signOutButton">Sign Out</button>
                        </div>
                    }
                    <li className="nav-item" id="userButton" onClick={() => setUserCardDisplayed(!userCardDisplayed)}>
                        <img src={props.session.user.image} alt="User Image" width={45} height={45}></img>
                        <a className='nav-link accountImageAlt'>Account</a>
                    </li>
                </ul>
            </div>
            
        </nav>
    )
}