import React, { useState } from "react";
import './sideMenu.css'

const SideMenu = ({setSelectedMenu,name,sectionList,logout}) => {
    const [selected, setSelected] = useState<string>(sectionList[0]);

    const handleSelectedButton = (buttonName: string) => {
        setSelected(buttonName);
        setSelectedMenu(buttonName);
    }
    return(
        <>
            <div className="main-wrapper">
                {name !== undefined ? <h3>Hello, {name}</h3> : <h2>Hello</h2>}
                <ul>
                    {sectionList.map((section) => (
                        <li key={section}>
                            <button className={selected === section ? 'selected' : ''}
                            onClick={() => handleSelectedButton(section)}>
                                {section}</button>
                        </li>
                    ))}
                   
                </ul>
                <ul >
                    <li>
                        <button className='logout' onClick={logout}>Log out</button>
                    </li>
                </ul>
                
            </div>
        </>
    );
}
export default SideMenu