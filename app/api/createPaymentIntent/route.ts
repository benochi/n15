import { NextRequest } from "next/server";
const strip = require("stripe")(process.env.STRIPE_SECRET_KEY);


export async function POST(request: NextRequest){

}