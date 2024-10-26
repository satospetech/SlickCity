import { NextResponse } from "next/server";

export const response = <T>(status: number, message: string, data?: T) => {
  const res_object: {
    status: number;
    message: string;
    data?: T;
    success: boolean;
  } = {
    status,
    message,
    success: status.toString().charAt(0) === "2" ? true : false,
  };

  if (data) res_object.data = data;
  return new NextResponse(JSON.stringify(res_object), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};


export const response2 = <T>(status: number, message: string, data?: T) => {
  const res_object: {
    status: number;
    message: string;
    data?: T;
    success: boolean;
  } = {
    status,
    message,
    success: status.toString().charAt(0) === "2" ? true : false,
  };

  if (data) res_object.data = data;
  return new NextResponse(JSON.stringify(res_object), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

