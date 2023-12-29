import { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ChevronExpandable(props) {
    const [isChildrenVisible, setIsChildrenVisible] = useState(false);
    const [icon, setIcon] = useState(faChevronDown);

    function toggleChildrenVisibleButton() { 
        setIsChildrenVisible(!isChildrenVisible);

        if(!isChildrenVisible) {
            setIcon(faChevronUp);
        }else {
            setIcon(faChevronDown);
        }
    } //flips visibility of children

    return (
        <>
            <div className='sidebarExpandableButtons'>
                {props.render(<FontAwesomeIcon onClick={toggleChildrenVisibleButton} className='sidebarExpandableButton' icon={icon}/> )}
            </div>
            {isChildrenVisible && props.children}
        </>
    )
}