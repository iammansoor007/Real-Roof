import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Submission from "@/models/Submission";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, date, time, serviceType, notes } = body;

    await connectToDatabase();

    const submission = new Submission({
      name,
      email,
      phone,
      subject: `Booking Request: ${serviceType}`,
      message: notes || "No additional notes provided.",
      type: "Booking",
      source: "Website Calendar",
      extraData: {
        date,
        time,
        serviceType
      }
    });

    await submission.save();

    return NextResponse.json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    console.error("Booking API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit booking" },
      { status: 500 }
    );
  }
}
