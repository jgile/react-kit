import React from 'react';
import ReactDOM from 'react-dom';
import {HelloWorld} from "@repo/components";

function App() {
    return (
        <div>
            <HelloWorld/>
        </div>
    );
}

ReactDOM.render(<App/>, document.getElementById('root'));