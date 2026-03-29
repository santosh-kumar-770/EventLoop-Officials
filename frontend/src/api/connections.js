import api from "./axios";

export const sendConnectionRequest = (receiverId) => {
  return api.post("connections/send/", {
    receiver: receiverId
  });
};

export const acceptConnection = (connectionId) => {
  return api.post("connections/accept/", {
    connection_id: connectionId
  });
};

export const rejectConnection = (connectionId) => {
  return api.post("connections/reject/", {
    connection_id: connectionId
  });
};