import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const bookingId = formData.get('bookingId') as string;
    const engineerId = formData.get('engineerId') as string;
    const workPerformed = formData.get('workPerformed') as string;
    const partsUsed = formData.get('partsUsed') as string;

    if (!bookingId || !engineerId || !workPerformed) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save completion report without changing status
    const { data: completionReport, error: reportError } = await supabaseAdmin
      .from('repair_completion_reports')
      .insert({
        booking_id: bookingId,
        engineer_id: engineerId,
        work_performed: workPerformed,
        parts_used: partsUsed || null,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (reportError) {
      console.error('Error saving completion report:', reportError);
      return NextResponse.json(
        { error: 'Failed to save completion report' },
        { status: 500 }
      );
    }

    // Handle proof images upload
    const proofImages = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('proofImage_') && value instanceof File) {
        proofImages.push(value);
      }
    }

    // Upload proof images if any
    if (proofImages.length > 0) {
      for (const image of proofImages) {
        const imageKey = `${bookingId}_${Date.now()}_${image.name}`;
        const { error: uploadError } = await supabaseAdmin.storage
          .from('repair-images')
          .upload(imageKey, image);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
        } else {
          // Get public URL
          const { data: publicUrl } = supabaseAdmin.storage
            .from('repair-images')
            .getPublicUrl(imageKey);

          // Save image record
          await supabaseAdmin
            .from('repair_proof_images')
            .insert({
              repair_completion_id: completionReport.id,
              image_url: publicUrl.publicUrl,
              image_key: imageKey,
              file_name: image.name,
              file_size: image.size,
              mime_type: image.type
            });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Completion report saved successfully'
    });

  } catch (error) {
    console.error('Error in save-completion-report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}