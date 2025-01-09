import { AccountRequest } from "@/context/Account";

export const signInApi = async ({ account, password }: AccountRequest) => {
  const response = await fetch("/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ account, password }),
  });
  if (!response.ok) {
    alert("登入失敗");
    console.log(response);
    const data = await response.json();
    throw new Error(data.error);
  }
  const data = await response.json();
  return data;
};

export const signUpApi = async ({
  account,
  password,
  permission,
}: AccountRequest) => {
  const response = await fetch("api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ account, password, permission }),
  });
  if (!response.ok) {
    alert("註冊失敗");
    console.log(response);
    const data = await response.json();
    throw new Error(data.error);
  }
  const data = await response.json();
  return data;
};
