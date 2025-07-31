import { useState } from "react";
import { useEffect } from "react";

export function TimeboxingBackground(props) {
    let listOfColors = ["#606EFE", "#3AFFB0", "#DC5EFB", "#86FB80", "#AF79FB", "#7BFF59", "#639D5E", "#4AF9FF"];
    const todoActions = [
    "Buy groceries",
    "Schedule appointment",
    "Call mom",
    "Pay bills",
    "Clean inbox",
    "Update resume",
    "Book flight",
    "Service car",
    "Submit report",
    "Water plants",
    "Pickup cleaning",
    "Renew license",
    "Organize desk",
    "Buy gift",
    "Schedule exam",
    "Cancel subscriptions",
    "Backup files",
    "Research apartments",
    "Fix faucet",
    "Return books",
    "Update profile",
    "Plan trip",
    "Take photos",
    "Meal prep",
    "Review budget",
    "Join yoga",
    "Order lenses",
    "Clean garage",
    "Write notes",
    "Research camps",
    "Schedule meeting",
    "Buy shoes",
    "File taxes",
    "Update contacts",
    "Get quotes",
    "Renew insurance",
    "Plan date",
    "Research investments",
    "Schedule maintenance",
    "Buy charger",
    "Create plan",
    "Update will",
    "Research programs",
    "Schedule inspection",
    "Buy presents",
    "Clean bathroom",
    "Update backup",
    "Plan reunion",
    "Get shot",
    "Research insurance",
    "Organize photos",
    "Buy coat",
    "Schedule exam",
    "Plan retirement",
    "Update security",
    "Research destinations",
    "Cut hair",
    "Buy bedsheets",
    "Schedule cleaning",
    "Update supplies",
    "Research daycare",
    "Plan routine",
    "Get estimates",
    "Buy appliances",
    "Schedule service",
    "Update settings",
    "Plan garden",
    "Get mammogram",
    "Research plans",
    "Buy clothes",
    "Schedule cleaning",
    "Update inventory",
    "Plan celebration",
    "Get bloodwork",
    "Research savings",
    "Buy curtains",
    "Schedule cleaning",
    "Update beneficiaries",
    "Plan itinerary",
    "Get screening",
    "Research providers",
    "Buy chair",
    "Schedule pumping",
    "Update passwords",
    "Plan dates",
    "Get checkup",
    "Research rates",
    "Buy equipment",
    "Schedule sealing",
    "Update address",
    "Plan activities",
    "Get test",
    "Research rates",
    "Buy case",
    "Schedule replacement",
    "Update forms",
    "Plan review",
    "Get check",
    "Research services",
    "Buy boots",
    "Schedule washing",
    "Update information",
    "Plan party",
    "Check cholesterol",
    "Research options"
    ];
    const [forShowTimeboxes, setForShowTimeboxes] = useState([]);
    useEffect(() => {
        function generateForShowTimeboxes() {
            let arrayOfArrayOfTimeboxes = [];
            let windowHeight = window.innerHeight;
            let windowWidth = window.innerWidth;
            let amountOfTimeboxesNeededForVertical = Math.ceil(windowHeight / 50);
            let amountOfTimeboxesNeededForHorizontal = Math.ceil(windowWidth / 200);
            for (let i = 0; i < amountOfTimeboxesNeededForHorizontal; i++) {
                let arrayOfTimeboxes = [];
                for (let j = 0; j < amountOfTimeboxesNeededForVertical; j++) {
                    let randomTitle = todoActions[Math.floor(Math.random() * 100)];
                    let randomColor = listOfColors[Math.floor(Math.random() * (listOfColors.length-1))];
                    if(Math.random() < 0.1) {
                        randomTitle = "";
                        randomColor = "white";
                    }
                    arrayOfTimeboxes.push({title: randomTitle, color: randomColor});
                }
                arrayOfArrayOfTimeboxes.push(arrayOfTimeboxes);
            }
            setForShowTimeboxes(arrayOfArrayOfTimeboxes);
        }
        generateForShowTimeboxes();

        window.addEventListener('resize', generateForShowTimeboxes);
        return () => window.removeEventListener('resize', generateForShowTimeboxes);
    }, []);
    let randomTitle = todoActions[Math.floor(Math.random() * 100)];
    let randomColor = listOfColors[Math.floor(Math.random() * (listOfColors.length-1))];
    <div style={{backgroundColor: randomColor}} className="timeboxForShow">{randomTitle}</div>
    return (<>
    <div className="timeboxingBackground">
            <div className="timeboxingColumns">
                {forShowTimeboxes.map((arrayOfTimeboxes, index) => (
                    <div key={index} className="timeboxingColumn">
                        {arrayOfTimeboxes.map((timebox, index2) => (
                            <div key={index2} className="timeboxForShow" style={{backgroundColor: timebox.color}}>{timebox.title}</div>
                        ))}
                    </div>
                ))}
            </div>
    </div>
    {props.children}
    </>
    )
}