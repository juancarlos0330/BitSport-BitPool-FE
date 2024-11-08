import { useRouter } from "next/router";
import React, { useEffect } from "react";

const AirDropPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/referral");
  }, []);
  return <div></div>;
};

export default AirDropPage;
