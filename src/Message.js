import React from 'react';

const Message = ({chat, user}) => (
    <li className={`chat ${user === chat.userID ? "right" : "left"}`}>
        <p style={{color:"green"}}>{chat.username}</p>
        {chat.content}
        <p>{chat.isRead.toString()}</p>
    </li>
);

export default Message;
