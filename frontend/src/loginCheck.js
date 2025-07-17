import { API_ROOT } from "../apiConfig";

async function loginCheck() {
  if (!localStorage.getItem("token")) {
    console.log("no token");
    return false;
  }
  const res = await fetch(`${API_ROOT}/auth/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  if (res.ok) {
    const data = await res.json();
    return data.username ? true : false;
  } else {
    return false;
  }
}

async function myDetails() {
  if (!localStorage.getItem("token")) {
    return null;
  }
  const res = await fetch(`${API_ROOT}/auth/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  if (res.ok) {
    const data = await res.json();
    return data ? data : null;
  } else {
    return null;
  }
}

export { myDetails };
export default loginCheck;
