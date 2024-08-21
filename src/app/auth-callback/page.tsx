"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { useEffect } from "react";
import { TRPCClientError } from "@trpc/client";
import { Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  const result= trpc.sayHi.useQuery();
  console.log("res from page.tsx of authCallback"+ result);

  const { data, isLoading, isError, error } = trpc.authCallback.useQuery(undefined,{
    retry: true,
    retryDelay: 500
  });
  console.log("the data "+data);

  useEffect(() => {
    if (!isLoading) {
      if (isError) {
        if (error instanceof TRPCClientError && error.data?.code === "UNAUTHORIZED") {
          console.error("Unauthorized access:", error);
          // Redirect to login page or show an unauthorized message
          router.push("/sign-in"); // Assuming you have a login page
        } else { 
          console.error("Error during authentication callback:", error);
        }
      } else if (data?.success) {
        console.log(data+" was in useEFfect"+" "+isLoading+" err "+isError);
        router.push(origin ? `/${origin}` : "/dashboard");
      }
    }
  }, [isLoading, isError, data, error, origin, router]);
  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800"/>
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically</p>
      </div>
    </div>
  )
};

export default Page;
