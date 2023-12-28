import { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function ChevronExpandable(props) {
    const [isChildrenVisible, setIsChildrenVisible] = useState(false);
    const [icon, setIcon] = useState(faChevronDown);

    function toggleChildrenVisibleButton() { 
        setIsChildrenVisible(!isChildrenVisible);

        if(isChildrenVisible) {
            setIcon(faChevronUp);
        }else if(!isChildrenVisible) {
            setIcon(faChevronDown);
        }
    } //flips visibility of children

    return (
        <>
            {props.render(<FontAwesomeIcon onClick={toggleChildrenVisibleButton} className='sidebarExpandableButton' icon={icon}/> )}
            {isChildrenVisible && props.children}
        </>
    )
}