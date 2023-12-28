import { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function ChevronExpandable(props) {
    const [isChildrenVisible, setIsChildrenVisible] = useState(false);
    const [icon, setIcon] = useState(faChevronDown);
    {isAddGoalVisible && <FontAwesomeIcon onClick={toggleAddGoalButton} className='sidebarExpandableButton' icon={faChevronUp}/> 

    function toggleChildrenVisibleButton() { setIsChildrenVisible(!isChildrenVisible); } //flips visibility of children

    return (
        <>
            {isChildrenVisible && props.children}
        </>
    )
}