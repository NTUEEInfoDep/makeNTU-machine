import { useState } from "react";
// import { useRouter } from "next/navigation";

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
  function decodeJWT(token: string): Record<string, any> | null {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null; // Invalid JWT format
    }
    const payload = Buffer.from(parts[1], "base64").toString("utf-8");
    return JSON.parse(payload);
  }
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
