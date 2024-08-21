import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
const Page = async () => {
  const { getUser, isAuthenticated } = await getKindeServerSession();
  const user = await getUser();
  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");
  return (
    <>
      <div>{user?.email}</div>
      <h1>Hello from dashboard</h1>
    </>
  );
};
export default Page;
