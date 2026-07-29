import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch('https://ecommerce-api-p93q.onrender.com/api/v1/auth/login', {
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
