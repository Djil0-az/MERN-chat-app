// wrapper class for logic handling in the chat 


export const isSameSenderMargin = (messages, m, i, userId) => {
  var margin;

  // align other user(s) messages to the left and user's own messages to the right 
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
   
  ){
    margin = 33;
    return margin;
  }
 
 
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  ){
    margin = 0;
    return margin;
  }
    
  else{
    margin = 'auto';
    return margin;
  } 
};
//  check if message is being sent by other user 
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      // id of user who sent the last message  is not equal to the id of the current user
      messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
// get name 
export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};
// get full sender info including pic
export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};