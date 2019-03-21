import React from 'react';

const Message = ({chat, user}) => (
    <li className={`chat ${user === chat.username ? "right" : "left"}`}>
        <p style={{color:"green"}}>{chat.username}</p>
        {chat.content}
    </li>
);

export default Message;