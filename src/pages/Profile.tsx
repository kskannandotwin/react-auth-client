import { useEffect, useState } from "react";
import { getProfile } from "../api/users";

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getProfile()
      .then((res) => setUser(res.data))
      .catch(() => alert("Unauthorized"));
  }, []);
  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
