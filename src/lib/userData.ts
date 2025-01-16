import { useState } from "react";
import { decodeJWT } from "@/lib/decodeJWT";

export type Account = {
  id: number;
  name: string;
  password: string;
  permission: string;
};
export function useGetLoggedInUser({
  UserListJson,
}: {
  UserListJson: Account[];
}) {
  const [account, setAccount] = useState<Account | undefined>();
  const token = localStorage.getItem("jwt-token: ");

  if (!token) {
    // alert("未登入");
    // router.push("/login");
  } else {
    const decodedPayload = decodeJWT(token);
    const name = decodedPayload?.username;
    if (!name) {
      console.log("noname");
    } else {
      const temp: Account | undefined = UserListJson?.find(
        (item) => item.name === name,
      );
      setAccount(temp);
    }
  }
  return account;
}
