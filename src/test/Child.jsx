// Filename - Child.js:
 
import { useState } from 'react';
function Child(props) {
    const [input, setinput] = useState("");
 
    return (
        <div style={{ marginTop: "30px" }}>
 
            <div>Child Component</div>
            {/*The input onchange function will set 
            the input state variable*/}
            <input type="text" onChange=
                {(e) => { setinput(e.target.value) }}>
            </input>
 
            {/* This has reference which is 
            sent by Parent as props*/}
            <button ref={props.reference} 
                style={{ display: "none" }}
                onClick={() => { props.setname(input) }} >
            </button>
        </div>
    )
}
export default Child;