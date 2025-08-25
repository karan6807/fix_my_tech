import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const bookingId = formData.get('bookingId') as string;
    const engineerId = formData.get('engineerId') as string;
    const workPerformed = formData.get('workPerformed') as string;
    const partsUsed = formData.get('partsUsed') as string;
    const timeSpent = formData.get('timeSpent') as string;
    const completionNotes = formData.get('completionNotes') as string;
    const customerInstructions = formData.get('customerInstructions') as string;
    
    // Get uploaded images
    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('proofImage_') && value instanceof File) {
        imageFiles.push(value);
      }
    }

    if (!bookingId || !engineerId || !workPerformed || imageFiles.length === 0) {
      return NextResponse.json(
        { error: 'Booking ID, Engineer ID, Work Performed, and at least one proof image are required' },
        { status: 400 }
      );
    }

    // Upload images to Supabase Storage
    const uploadedImages = [];
    
    for (const imageFile of imageFiles) {
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${randomUUID()}.${fileExtension}`;
      const filePath = `repair-proofs/${bookingId}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('repair-images')
        .upload(filePath, imageFile, {
          contentType: imageFile.type,
          metadata: {
            'original-name': imageFile.name,
            'booking-id': bookingId,
            'engineer-id': engineerId
          }
        });
      
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image: ' + uploadError.message },
          { status: 500 }
        );
      }
      
      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('repair-images')
        .getPublicUrl(filePath);
      
      uploadedImages.push({
        imageKey: filePath,
        imageUrl: urlData.publicUrl,
        fileName: imageFile.name,
        fileSize: imageFile.size,
        mimeType: imageFile.type
      });
    }

    // Create completion report
    const { data: completionReport, error: reportError } = await supabaseAdmin
      .from('repair_completion_reports')
      .insert({
        booking_id: bookingId,
        engineer_id: engineerId,
        work_performed: workPerformed,
        parts_used: partsUsed || null,
        payment_amount: null, // Removed payment amount
        time_spent: timeSpent ? parseInt(timeSpent) : null,
        completion_notes: completionNotes || null,
        customer_instructions: customerInstructions || null
      })
      .select()
      .single();

    if (reportError) {
      console.error('Error creating completion report:', reportError);
      return NextResponse.json(
        { error: 'Failed to create completion report: ' + reportError.message },
        { status: 500 }
      );
    }

    // Store image metadata in database
    const imageRecords = uploadedImages.map(img => ({
      repair_completion_id: completionReport.id,
      image_url: img.imageUrl,
      image_key: img.imageKey,
      file_name: img.fileName,
      file_size: img.fileSize,
      mime_type: img.mimeType
    }));

    const { error: imagesError } = await supabaseAdmin
      .from('repair_proof_images')
      .insert(imageRecords);

    if (imagesError) {
      console.error('Error storing image metadata:', imagesError);
      // Continue anyway, images are uploaded to S3
    }

    // Update booking status to completed and get user details
    const { data: updatedBooking, error: bookingError } = await supabaseAdmin
      .from('repair_bookings')
      .update({ status: 'completed' })
      .eq('id', bookingId)
      .select(`
        *,
        users!repair_bookings_user_id_fkey (
          name,
          email
        )
      `)
      .single();

    if (bookingError) {
      console.error('Error updating booking status:', bookingError);
      return NextResponse.json(
        { error: 'Failed to update booking status: ' + bookingError.message },
        { status: 500 }
      );
    }

    // Send completion email to customer and admin
    if (updatedBooking.users?.email) {
      try {
        // Send email to customer
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: updatedBooking.users.email,
            subject: 'Repair Completed - Your Device is Ready! - TechService',
            type: 'repair_completed',
            data: {
              customerName: updatedBooking.users.name,
              serviceType: updatedBooking.service_type,
              device: updatedBooking.device_type,
              bookingId: updatedBooking.id, // Pass full UUID for logging
              issueDescription: updatedBooking.issue_description,
              engineerName: updatedBooking.assigned_engineer || 'TechService Engineer',
              completedDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              workPerformed: workPerformed,
              partsUsed: partsUsed || 'None'
            }
          })
        });

        // Send email to admin
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'kptestingdw@gmail.com',
            subject: `Repair Completed - ${updatedBooking.service_type} #${updatedBooking.id.slice(-8).toUpperCase()}`,
            type: 'admin_work_completed',
            data: {
              bookingId: updatedBooking.id,
              customerName: updatedBooking.users.name,
              engineerName: updatedBooking.assigned_engineer || 'TechService Engineer',
              serviceType: updatedBooking.service_type,
              device: updatedBooking.device_type,
              customerPhone: updatedBooking.contact_phone,
              workPerformed: workPerformed,
              partsUsed: partsUsed || 'None',
              completedDate: new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          })
        });
        console.log('Completion emails sent successfully');
      } catch (emailError) {
        console.error('Failed to send completion email:', emailError);
        // Don't fail the API if email fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Repair completed successfully',
      completionReport,
      updatedBooking
    });

  } catch (error) {
    console.error('Error in complete repair API:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}