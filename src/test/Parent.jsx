// Filename - Parent.js:
 
import { useRef, useState } from 'react';
import Child from './Child';
function Parent() {
    const [name, setname] = useState("");
    const childref = useRef();
 
    return (
        <div style={{margin:"20px"}}>
         
            <div>Parent Component</div>
             
            {/* Displayed name which was written in 
            child component input field*/}
            {name !== '' && <div>{name}</div>}
             
            {/* By clicking on this button, the onclick 
            method will click the button in the child 
            component using useRef hook*/}
            <button onClick={() => { childref.current.click() }}
             style={{ margin: "2px" }}>
             Display name
            </button>
             
            {/* Rendering the child component */}
            <Child reference={childref} setname={setname} />
        </div>
    )
}
export default Parent;