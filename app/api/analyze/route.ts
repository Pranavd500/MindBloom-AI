import { NextRequest, NextResponse } from 'next/server';
import { checkInSchema } from '@/lib/validators/checkin';
import { analyzeCheckIn, detectPatterns } from '@/lib/ai/analyzer';
import { DailyCheckIn, HistoricalPattern } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = checkInSchema.safeParse(body.checkIn);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const checkIn = body.checkIn as DailyCheckIn;
    const historicalData = body.historicalData as DailyCheckIn[] | undefined;

    // Perform AI analysis
    const analysis = await analyzeCheckIn(checkIn, historicalData);

    // If there are enough historical entries, detect patterns
    let patterns: HistoricalPattern[] = [];
    if (historicalData && historicalData.length >= 3) {
      patterns = await detectPatterns([checkIn, ...historicalData]);
    }

    return NextResponse.json({
      success: true,
      analysis,
      patterns,
    });

  } catch (error) {
    console.error('Analysis API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to analyze check-in', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'MindBloom AI Analysis API' });
}
