import axios from "../Axios/axios";

export const saveWorkFlow = async (data) => {
  const result = await axios.post("saveWorkFlow", data);
  return result;
};

export const getWorkFlows = async () => {
  const result = await axios.get("getWorkFlows");
  return result;
};

export const updateWorkFlows = async (data) => {
  let payload = {
    graphJSONData: data.data,
  };
  let result = await axios.put(`updateWorkFlow/${data.id}`, payload);
  return result;
};

export const getWorkFlowSelected = async(data) => {
    let result = await axios.get(`getWorkFlow/${data}`);
    return result;
}

export const getHeaders = async (payload) => {
  const formData = new FormData();
  formData.append("file", payload, payload.name);
  const result = await axios.post("sendFile", formData, {
    headers: {
      "Accept": "application/json, multipart/form-data",
      "Content-Type": "multipart/form-data",
    },
  });
  return result;
};

export const runJob = async(payload) => {
  let file = payload.file;
  const formData = new FormData();
  formData.append("file", file, file.name);
  const result = await axios.post(`runJob/${payload.flow.id}`, formData, {
    headers: {
      "Accept": "application/json, multipart/form-data",
      "Content-Type": "multipart/form-data",
    },
  });
  return result;
}

export const downloadProducts = async(payload) => {
  let result = await axios.post('downloadProducts',payload);
  return result;
}