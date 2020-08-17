import React from 'react';

export function TableSearch(props) {
    let input;
    function handleClick(e) {
        if (e.key === 'Enter') {
            props.onHandleSearch(input.value);
        }
    }
    return (
        <div>
            <input placeholder="Search.." ref={n => (input = n)} type="text" onKeyDown={handleClick} />
        </div>
    );
}
