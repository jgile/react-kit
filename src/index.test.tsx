import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { useForm } from './forms';

let container: any = null;

function TestComponent() {
    const { data, post, setData } = useForm({ a: 'b' });

    return (
        <div>
            <button id="changeValueButton" onClick={() => setData('a', 'c')}>
                Click
            </button>
            <button id="postButton" onClick={() => post('/')}>
                Post
            </button>
            <div id="data">{data.a}</div>
        </div>
    );
}

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

// @ts-ignore
it('changes value when clicked', () => {
    act(() => {
        render(<TestComponent />, container);
    });
    const data = document.getElementById('data');
    const button = document.getElementById('changeValueButton');

    // @ts-ignore
    expect(data.innerHTML).toBe('b');

    act(() => {
        // @ts-ignore
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    // @ts-ignore
    expect(data.innerHTML).toBe('c');
});
