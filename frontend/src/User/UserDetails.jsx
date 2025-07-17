import { myDetails } from "../loginCheck";
import Panel from "../shared/Panel";
import H from "../shared/H";
import Success from "../shared/Success";
import Error from "../shared/Error";
import Loading from "../shared/Loading";
import { useState, useEffect } from "react";

function UserDetails() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getDetails() {
    setLoading(true);
    var u = await myDetails();
    setUser(u);
    setLoading(false);
  }

  useEffect(() => {
    getDetails();
  }, []);

  if (loading) return <Loading />;
  if (!user) return <Error message="You are not loged in." />;

  return (
    <Panel size="large">
      <H level={2}>User Details</H>
      <div>
        <strong>name:</strong> {user.username}{" "}
      </div>
      <div>
        <strong>id:</strong> {user.id}{" "}
      </div>
      <div>
        <strong>authorization:</strong> {user.authorization}{" "}
      </div>
      <div>
        <strong>password:</strong> {user.password}{" "}
      </div>
    </Panel>
  );
}

export default UserDetails;
