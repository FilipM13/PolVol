import Loading from "../shared/Loading";
import Error from "../shared/Error";
import Success from "../shared/Success";
import Panel from "../shared/Panel";
import H from "../shared/H";
import Tile from "../shared/Tile";
import { useState, useEffect } from "react";
import { myDetails } from "../loginCheck";
import { API_ROOT } from "../../apiConfig";
import delete_user from "../assets/delete_user.png";

const authMap = {
  admin: 4,
  data_analyst: 3,
  data_provider: 2,
  guest: 1,
};

const statuses = ["approved", "not_approved"];

function UserList() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [users, setUsers] = useState([
    { username: "aaa", authorization: "guest" },
  ]);

  async function getDetails() {
    setLoading(true);
    var u = await myDetails();
    setUser(u);
    setLoading(false);
  }

  async function getUsers() {
    setLoading(true);
    const res = await fetch(`${API_ROOT}/auth/users`);
    if (res.ok) {
      setUsers(await res.json());
    } else {
      setError(res.text());
    }
    setLoading(false);
  }

  async function updateUserStatus(uid, status) {
    const res = await fetch(`${API_ROOT}/auth/update-status/${uid}/${status}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (res.ok) {
      setSuccess(`User ${uid} updated to status ${status}.`);
    } else {
      setError(`Can't update user ${uid} with status ${status}.`);
    }
  }

  async function deleteUser(uid) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch(`${API_ROOT}/auth/delete/${uid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (res.ok) {
      setSuccess(`User ${uid} deleted.\nRefresh to see changes.`);
    } else {
      setError(`Can't delete user ${uid}.`);
    }
  }

  useEffect(() => {
    getUsers();
    getDetails();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!user) return <Error message="You are not loged in." />;

  return (
    <Panel>
      <H level={2}>Users</H>
      {success && <Success message={success} />}
      {error && <Error message={success} />}
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Authorization</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr
              key={i}
              style={{
                background:
                  authMap[u.authorization] >= authMap[user.authorization]
                    ? "var(--bg1)"
                    : "var(--bg2",
              }}
            >
              <td>
                {u.username} {u.id === user.id ? "(you)" : null} (ID: {u.id})
              </td>
              <td>{u.authorization}</td>
              <td>
                {authMap[u.authorization] >= authMap[user.authorization] ? (
                  u.status
                ) : (
                  <select
                    onChange={(e) => updateUserStatus(u.id, e.target.value)}
                    defaultValue={u.status}
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      borderRadius: "8px",
                      border: "1px solid #e0d7fa",
                    }}
                  >
                    {statuses.map((v, i) => (
                      <option key={i} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                )}
              </td>
              <td>
                {authMap[u.authorization] >= authMap[user.authorization] ? (
                  "Not permited"
                ) : (
                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <img
                      src={delete_user}
                      alt="delete"
                      title="remove user"
                      onClick={() => deleteUser(u.id)}
                      style={{
                        position: "absolute",
                        margin: "auto",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                      }}
                    />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export default UserList;
