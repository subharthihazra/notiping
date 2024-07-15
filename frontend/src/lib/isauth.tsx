"use client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setLoading, setUser } from "@/lib/slices/user";
import axios from "axios";

export default function Isauth({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_PATH}/auth/isauth`, {}, {
          withCredentials: true,
        })
        .then((res: any) => {
          console.log(res.data.data.email);
          dispatch(
            setUser({
              name: res.data?.data?.name,
              email: res.data?.data?.email,
            })
          );
        })
        .finally(() => {
          dispatch(setLoading({ isLoading: false }));
        });
    } catch (err: any) {}
  }, [dispatch]);

  return children;
}
