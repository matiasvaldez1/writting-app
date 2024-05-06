import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

type ResponseData = {
  message: string;
};

export function GET(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    console.log(req)
  NextResponse.json({ message: "Hello from Next.js!" });
}
