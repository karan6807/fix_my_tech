import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { customerEmail, customerName, reason, requestId } = await request.json();

    if (!customerEmail || !customerName || !reason || !requestId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email content
    const emailSubject = 'Repair Request Cancelled - TechFix Services';
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545;">
          <h2 style="color: #dc3545; margin-top: 0;">Request Cancelled</h2>
          <p>Dear ${customerName},</p>
          
          <p>We regret to inform you that your repair request (ID: <strong>${requestId}</strong>) has been cancelled by our admin team.</p>
          
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Reason for Cancellation:</h3>
            <p style="color: #6c757d; font-style: italic;">${reason}</p>
          </div>
          
          <p>We apologize for any inconvenience this may cause. If you have any questions or would like to submit a new request, please don't hesitate to contact us.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; color: #6c757d; font-size: 14px;">
              Best regards,<br>
              <strong>TechFix Services Team</strong><br>
              Email: support@techfix.com<br>
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </div>
      </div>
    `;

    // Here you would integrate with your email service (SendGrid, Nodemailer, etc.)
    // For now, we'll just log the email content
    console.log('=== CANCELLATION EMAIL ===');
    console.log('To:', customerEmail);
    console.log('Subject:', emailSubject);
    console.log('Body:', emailBody);
    console.log('=== END EMAIL ===');

    // Simulate email sending success
    return NextResponse.json({
      success: true,
      message: 'Cancellation email sent successfully'
    });

  } catch (error) {
    console.error('Send cancellation email error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}