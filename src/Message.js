import React from "react";

const Message = ({ chat, user }) => (
  <li
    className={`chat ${user === chat.userID ? "right" : "left"}`}
    style={{ backgroundColor: `${chat.isRead ? "" : "lightpink"}` }}
  >
    <p style={{ color: "green" }}>
      {chat.username} {chat.chatMessageID}
    </p>
    {chat.content}
    {console.log(chat.chatMessageID)}
    {/* <p>{chat.isRead.toString()}</p> */}
  </li>
);

export default Message;

// style={{ backgroundColor: "blue" }}
