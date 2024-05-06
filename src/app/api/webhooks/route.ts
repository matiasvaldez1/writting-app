import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export function GET(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body, req.statusMessage, req.url)
  return NextResponse.json({message: 'Hello!'})
}
