import { NextRequest, NextResponse } from "next/server";

function isValidPolishNumber(number: string): boolean {
  const digits = number.replace(/\D/g, "");

  if (digits.startsWith("48")) {
    const phoneNumber = digits.slice(2);
    return phoneNumber.length === 9;
  }

  if (digits.length === 9) {
    const firstDigit = digits[0];
    return ["1", "2", "3", "4", "5", "6", "7", "8"].includes(firstDigit);
  }

  return false;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  const { number } = await params;

  if (number && number.length > 0) {
    const cleanNumber = number.replace(/\D/g, "");

    if (!isValidPolishNumber(number)) {
      return NextResponse.json(
        { error: "Nieprawidłowy numer telefonu polskiego." },
        { status: 400 }
      );
    }

    // Format with +48 if not already present
    const formattedNumber = cleanNumber.startsWith("48")
      ? cleanNumber
      : `48${cleanNumber}`;
    return NextResponse.redirect(`tel:+${formattedNumber}`, 307);
  }

  return NextResponse.json(
    { error: "Brak numeru telefonu w URL." },
    { status: 400 }
  );
}
