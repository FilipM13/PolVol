import Loading from "../shared/Loading";
import Error from "../shared/Error";
import Panel from "../shared/Panel";
import H from "../shared/H";
import Tile from "../shared/Tile";
import { useState, useEffect } from "react";
import { myDetails } from "../loginCheck";
import { API_ROOT } from "../../apiConfig";

const authMap = {
  admin: 4,
  data_analyst: 3,
  data_provider: 2,
  guest: 1,
};

function UserList() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Authorization</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              <td>
                {u.username} {u.id === user.id ? "(you)" : null}
              </td>
              <td>{u.authorization}</td>
              <td>
                {authMap[u.authorization] >= authMap[user.authorization]
                  ? "Not permited"
                  : "Permited"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export default UserList;
