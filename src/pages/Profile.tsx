import { useEffect, useState } from "react";
import { getProfile } from "../api/users";
import LogoutButton from "../components/LogoutButton";

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getProfile()
      .then((res) => setUser(res.data))
      .catch(() => alert("Unauthorized"));
  }, []);
  return (
    <>
      <LogoutButton />
      <br />
      <h2>Profile</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
}
