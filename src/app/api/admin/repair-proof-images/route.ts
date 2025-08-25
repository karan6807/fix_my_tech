import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // First get the completion report ID for this booking
    const { data: completionReport, error: reportError } = await supabaseAdmin
      .from('repair_completion_reports')
      .select('id')
      .eq('booking_id', bookingId)
      .single();

    if (!completionReport) {
      return NextResponse.json({
        success: true,
        images: []
      });
    }

    // Get proof images by repair_completion_id
    let { data: images, error: imagesError } = await supabaseAdmin
      .from('repair_proof_images')
      .select('*')
      .eq('repair_completion_id', completionReport.id)
      .order('created_at', { ascending: true });

    // If no images found, try to find images that might be linked to other completion reports for this booking
    if (!images || images.length === 0) {
      const { data: allImages } = await supabaseAdmin
        .from('repair_proof_images')
        .select('*')
        .like('image_key', `%${bookingId}%`)
        .order('created_at', { ascending: true });
      
      images = allImages || [];
    }


    if (imagesError) {
      console.error('Error fetching proof images:', imagesError);
      return NextResponse.json(
        { success: true, images: [] }
      );
    }

    // Handle case where no images found
    if (!images || images.length === 0) {
      console.log('No images found for booking:', bookingId);
      return NextResponse.json({
        success: true,
        images: []
      });
    }

    // Get public URLs for images and format response
    const formattedImages = await Promise.all(images.map(async (img: any) => {
      const { data: publicUrl } = supabaseAdmin.storage
        .from('repair-images')
        .getPublicUrl(img.image_key);
      
      return {
        id: img.id,
        imageUrl: publicUrl.publicUrl,
        fileName: img.file_name,
        fileSize: img.file_size,
        uploadedAt: img.created_at
      };
    }));


    return NextResponse.json({
      success: true,
      images: formattedImages
    });

  } catch (error) {
    console.error('Error in repair-proof-images API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}