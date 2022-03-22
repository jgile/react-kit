import React from 'react';
import ReactDOM from 'react-dom';
import {useData} from "@react-kit/form";

function App() {
    const {data, setData, reset} = useData({a: 'b'});

    setTimeout(() => {
        setData('a', 'asdf');
        setTimeout(() => reset(), 2000)
    }, 2000)

    return (
        <div>
            {data.a}
        </div>
    );
}

ReactDOM.render(<App/>, document.getElementById('app'));