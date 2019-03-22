import React from "react";

const Message = ({ chat, user }) => (
  <li
    className={`chat ${user === chat.userID ? "right" : "left"}`}
    style={{ backgroundColor: `${chat.isRead ? "" : "lightpink"}` }}
  >
    <p style={{ color: "green" }}>{chat.username}</p>
    {chat.content}
    {/* <p>{chat.isRead.toString()}</p> */}
  </li>
);

export default Message;

// style={{ backgroundColor: "blue" }}
