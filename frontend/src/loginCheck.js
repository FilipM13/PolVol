import { API_ROOT } from "../apiConfig";

async function loginCheck() {
    const res = await fetch(`${API_ROOT}/auth/`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + localStorage.getItem("token"),
        },
    })
    if (res.ok) {
        const data = await res.json();
        return data.username ? true : false;
    } else {
        return false;
    }
}
 export default loginCheck;