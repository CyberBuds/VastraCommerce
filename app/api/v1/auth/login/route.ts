import { NextRequest, NextResponse } from 'next/server';

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1').replace(/\/$/, '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Error in login proxy route:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to connect to authentication server',
      },
      { status: 500 }
    );
  }
}
