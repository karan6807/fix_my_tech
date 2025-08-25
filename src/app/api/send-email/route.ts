import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, type, data } = await request.json();

    if (!to || !subject || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let htmlContent = '';

    if (type === 'engineer_started') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Engineer Assigned - Work Started</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TechService</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Professional Repair Services</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #f97316; margin-top: 0;">🔧 Your Repair Work Has Started!</h2>
            
            <p>Dear ${data.customerName},</p>
            
            <p>Great news! Our qualified engineer has been assigned to your repair request and has <strong>started working</strong> on your device.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
              <h3 style="margin-top: 0; color: #333;">Work Details:</h3>
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${data.bookingId}</p>
              <p style="margin: 5px 0;"><strong>Service Type:</strong> ${data.serviceType}</p>
              <p style="margin: 5px 0;"><strong>Device:</strong> ${data.device}</p>
              <p style="margin: 5px 0;"><strong>Assigned Engineer:</strong> ${data.engineerName}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #f97316; font-weight: bold;">Work In Progress</span></p>
            </div>
            
            <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #0277bd;"><strong>👨‍🔧 ${data.engineerName}</strong> is now working on your ${data.device}. Our experienced technician will ensure your device is repaired to the highest standards.</p>
            </div>
            
            <h3 style="color: #333;">What's happening now?</h3>
            <ul style="padding-left: 20px;">
              <li>Our engineer is diagnosing and repairing your device</li>
              <li>We'll keep you updated on the progress</li>
              <li>You'll be notified once the repair is completed</li>
              <li>Quality testing will be performed before completion</li>
            </ul>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;"><strong>⏱️ Estimated Time:</strong> We'll do our best to complete your repair as quickly as possible while maintaining quality standards.</p>
            </div>
            
            <p>If you have any questions about the repair process, please don't hesitate to contact us.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/dashboard" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Track Progress</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p>Thank you for choosing TechService!</p>
              <p>📧 support@techservice.com | 📞 +1 (555) 123-4567</p>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                This email was sent regarding your repair request #${data.bookingId}. You'll receive another update when the work is completed.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'repair_completed') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Repair Completed Successfully</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TechService</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Professional Repair Services</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #10b981; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 40px;">✓</span>
              </div>
              <h2 style="color: #10b981; margin: 0; font-size: 24px;">🎉 Repair Completed Successfully!</h2>
            </div>
            
            <p>Dear ${data.customerName},</p>
            
            <p>Excellent news! Your device repair has been <strong>completed successfully</strong> by our expert technician. Your ${data.device} is now ready for pickup/delivery!</p>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="margin-top: 0; color: #333;">Repair Summary:</h3>
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${data.bookingId}</p>
              <p style="margin: 5px 0;"><strong>Service Type:</strong> ${data.serviceType}</p>
              <p style="margin: 5px 0;"><strong>Device:</strong> ${data.device}</p>
              <p style="margin: 5px 0;"><strong>Issue:</strong> ${data.issueDescription}</p>
              <p style="margin: 5px 0;"><strong>Completed By:</strong> ${data.engineerName}</p>
              <p style="margin: 5px 0;"><strong>Completion Date:</strong> ${data.completedDate}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">✅ Completed</span></p>
            </div>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af;"><strong>🔧 Quality Assurance:</strong> Your device has been thoroughly tested and quality-checked before completion. All repairs come with our standard warranty.</p>
            </div>
            
            <h3 style="color: #333;">What happens next?</h3>
            <ul style="padding-left: 20px;">
              <li><strong>Pickup/Delivery:</strong> We'll contact you shortly to arrange pickup or delivery</li>
              <li><strong>Quality Check:</strong> Your device has passed all quality tests</li>
              <li><strong>Warranty:</strong> Your repair is covered by our warranty policy</li>
              <li><strong>Support:</strong> Contact us if you have any questions or concerns</li>
            </ul>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>📞 Next Steps:</strong> Our team will contact you within 2 hours to coordinate the pickup/delivery of your repaired device.</p>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #333;">📋 Work Performed:</h4>
              <p style="margin: 5px 0; color: #666;">• Diagnosed and identified the issue: ${data.issueDescription}</p>
              <p style="margin: 5px 0; color: #666;">• Performed necessary repairs and replacements</p>
              <p style="margin: 5px 0; color: #666;">• Conducted comprehensive testing and quality assurance</p>
              <p style="margin: 5px 0; color: #666;">• Verified all functions are working properly</p>
            </div>
            
            <p>Thank you for trusting TechService with your repair needs. We're committed to providing the highest quality service!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/dashboard" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">View Details</a>
              <a href="tel:+15551234567" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Call Us</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p><strong>🌟 Rate Your Experience</strong></p>
              <p>We'd love to hear about your experience with our service!</p>
              <p>📧 support@techservice.com | 📞 +1 (555) 123-4567</p>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Repair completed for booking #${data.bookingId}. This device is ready for pickup/delivery.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'admin_new_booking') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Repair Request - Admin Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TechService Admin</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">New Repair Request Alert</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #dc2626; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 40px;">🔔</span>
              </div>
              <h2 style="color: #dc2626; margin: 0; font-size: 24px;">New Repair Request Received!</h2>
            </div>
            
            <p>Hello Admin,</p>
            
            <p>A new repair request has been submitted and requires your attention for confirmation and assignment.</p>
            
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="margin-top: 0; color: #333;">Request Details:</h3>
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${data.bookingId}</p>
              <p style="margin: 5px 0;"><strong>Customer:</strong> ${data.customerName}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${data.customerEmail}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${data.customerPhone}</p>
              <p style="margin: 5px 0;"><strong>Service Type:</strong> ${data.serviceType}</p>
              <p style="margin: 5px 0;"><strong>Device:</strong> ${data.device}</p>
              <p style="margin: 5px 0;"><strong>Model:</strong> ${data.model}</p>
              <p style="margin: 5px 0;"><strong>Address:</strong> ${data.address}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">Pending Confirmation</span></p>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #333;">Issue Description:</h4>
              <p style="margin: 5px 0; color: #92400e; font-style: italic;">${data.issueDescription}</p>
            </div>
            
            <h3 style="color: #333;">Required Actions:</h3>
            <ul style="padding-left: 20px;">
              <li><strong>Review</strong> the request details carefully</li>
              <li><strong>Confirm</strong> the booking to proceed</li>
              <li><strong>Assign</strong> a qualified engineer</li>
              <li><strong>Contact</strong> customer if clarification needed</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/admin/repair-requests" style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">Review Request</a>
              <a href="tel:${data.customerPhone}" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Call Customer</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p><strong>⚡ Quick Action Required</strong></p>
              <p>Customer is waiting for confirmation. Please review and respond promptly.</p>
              <p>📧 kptestingdw@gmail.com | 📞 +1 (555) 123-4567</p>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                This is an automated notification for booking #${data.bookingId}. Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'engineer_assignment') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Task Assignment - Engineer Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TechService</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Engineer Task Assignment</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #7c3aed; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 40px;">🔧</span>
              </div>
              <h2 style="color: #7c3aed; margin: 0; font-size: 24px;">New Task Assigned to You!</h2>
            </div>
            
            <p>Hello ${data.engineerName},</p>
            
            <p>You have been assigned a new repair task by the admin. Please review the details below and take appropriate action.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
              <h3 style="margin-top: 0; color: #333;">Task Details:</h3>
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${data.bookingId}</p>
              <p style="margin: 5px 0;"><strong>Customer:</strong> ${data.customerName}</p>
              <p style="margin: 5px 0;"><strong>Service Type:</strong> ${data.serviceType}</p>
              <p style="margin: 5px 0;"><strong>Device:</strong> ${data.device}</p>
              <p style="margin: 5px 0;"><strong>Model:</strong> ${data.model}</p>
              <p style="margin: 5px 0;"><strong>Customer Phone:</strong> ${data.customerPhone}</p>
              <p style="margin: 5px 0;"><strong>Address:</strong> ${data.address}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #7c3aed; font-weight: bold;">Assigned to You</span></p>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #333;">Issue Description:</h4>
              <p style="margin: 5px 0; color: #92400e; font-style: italic;">${data.issueDescription}</p>
            </div>
            
            <h3 style="color: #333;">Next Steps:</h3>
            <ul style="padding-left: 20px;">
              <li><strong>Accept</strong> the task in your dashboard</li>
              <li><strong>Contact</strong> the customer to schedule</li>
              <li><strong>Start work</strong> and update status accordingly</li>
              <li><strong>Complete</strong> the repair and submit report</li>
            </ul>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af;"><strong>⏰ Priority:</strong> Please review and accept this task as soon as possible. Customer is waiting for service.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/employee-frontend/my-tasks" style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">View My Tasks</a>
              <a href="tel:${data.customerPhone}" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Call Customer</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p><strong>📋 Task Management</strong></p>
              <p>Use your engineer dashboard to manage tasks and update progress.</p>
              <p>📧 support@techservice.com | 📞 +1 (555) 123-4567</p>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Task assigned for booking #${data.bookingId}. Please log in to your dashboard to manage this task.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'admin_work_started') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Work Started - Admin Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TechService Admin</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Work Progress Update</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #059669; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 40px;">🔧</span>
              </div>
              <h2 style="color: #059669; margin: 0; font-size: 24px;">Engineer Started Work!</h2>
            </div>
            
            <p>Hello Admin,</p>
            
            <p>Good news! The assigned engineer has started working on the repair task. Here are the details:</p>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
              <h3 style="margin-top: 0; color: #333;">Work Progress Update:</h3>
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${data.bookingId}</p>
              <p style="margin: 5px 0;"><strong>Customer:</strong> ${data.customerName}</p>
              <p style="margin: 5px 0;"><strong>Engineer:</strong> ${data.engineerName}</p>
              <p style="margin: 5px 0;"><strong>Service Type:</strong> ${data.serviceType}</p>
              <p style="margin: 5px 0;"><strong>Device:</strong> ${data.device}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Work In Progress</span></p>
              <p style="margin: 5px 0;"><strong>Started At:</strong> ${data.startedAt}</p>
            </div>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af;"><strong>👨‍🔧 ${data.engineerName}</strong> has accepted the task and begun the repair process. The customer has been notified about the work progress.</p>
            </div>
            
            <h3 style="color: #333;">Current Status:</h3>
            <ul style="padding-left: 20px;">
              <li>✅ Task accepted by engineer</li>
              <li>🔧 Repair work in progress</li>
              <li>📧 Customer notified about work start</li>
              <li>⏱️ Progress tracking active</li>
            </ul>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>📊 Tracking:</strong> You can monitor the progress in your admin dashboard. The engineer will update the status upon completion.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/admin/repair-requests" style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">View Dashboard</a>
              <a href="tel:${data.customerPhone}" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Call Customer</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p><strong>📈 Progress Monitoring</strong></p>
              <p>Keep track of all repair progress in your admin dashboard.</p>
              <p>📧 kptestingdw@gmail.com | 📞 +1 (555) 123-4567</p>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Work started notification for booking #${data.bookingId}. You'll receive another update when work is completed.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'admin_work_completed') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Work Completed - Admin Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TechService Admin</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Repair Completion Update</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #10b981; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 40px;">✅</span>
              </div>
              <h2 style="color: #10b981; margin: 0; font-size: 24px;">Repair Completed Successfully!</h2>
            </div>
            
            <p>Hello Admin,</p>
            
            <p>Excellent news! The repair task has been completed successfully by the assigned engineer. Here are the completion details:</p>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="margin-top: 0; color: #333;">Completion Summary:</h3>
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${data.bookingId}</p>
              <p style="margin: 5px 0;"><strong>Customer:</strong> ${data.customerName}</p>
              <p style="margin: 5px 0;"><strong>Engineer:</strong> ${data.engineerName}</p>
              <p style="margin: 5px 0;"><strong>Service Type:</strong> ${data.serviceType}</p>
              <p style="margin: 5px 0;"><strong>Device:</strong> ${data.device}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">✅ Completed</span></p>
              <p style="margin: 5px 0;"><strong>Completed At:</strong> ${data.completedDate}</p>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #333;">📋 Work Performed:</h4>
              <p style="margin: 5px 0; color: #666;">${data.workPerformed}</p>
              ${data.partsUsed && data.partsUsed !== 'None' ? `
              <h4 style="margin-top: 15px; margin-bottom: 5px; color: #333;">🔧 Parts Used:</h4>
              <p style="margin: 5px 0; color: #666;">${data.partsUsed}</p>
              ` : ''}
            </div>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af;"><strong>👨🔧 ${data.engineerName}</strong> has successfully completed the repair. The customer has been notified and the device is ready for pickup/delivery.</p>
            </div>
            
            <h3 style="color: #333;">Next Steps:</h3>
            <ul style="padding-left: 20px;">
              <li>✅ Repair work completed and tested</li>
              <li>📧 Customer notified about completion</li>
              <li>📞 Arrange pickup/delivery with customer</li>
              <li>💰 Process payment if applicable</li>
              <li>⭐ Follow up for customer feedback</li>
            </ul>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>📞 Action Required:</strong> Contact the customer to arrange pickup/delivery of the repaired device.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/admin/repair-requests" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">View Dashboard</a>
              <a href="tel:${data.customerPhone}" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Call Customer</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p><strong>🎉 Task Completed Successfully</strong></p>
              <p>Another satisfied customer! Keep up the excellent work.</p>
              <p>📧 kptestingdw@gmail.com | 📞 +1 (555) 123-4567</p>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Completion notification for booking #${data.bookingId}. Device is ready for customer pickup/delivery.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'admin_task_rejected') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Task Rejected - Admin Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TechService Admin</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Task Rejection Alert</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #dc2626; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 40px;">❌</span>
              </div>
              <h2 style="color: #dc2626; margin: 0; font-size: 24px;">Engineer Rejected Task</h2>
            </div>
            
            <p>Hello Admin,</p>
            
            <p><strong>Alert:</strong> An assigned engineer has rejected a repair task. This requires immediate attention for reassignment.</p>
            
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="margin-top: 0; color: #333;">Rejection Details:</h3>
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${data.bookingId}</p>
              <p style="margin: 5px 0;"><strong>Customer:</strong> ${data.customerName}</p>
              <p style="margin: 5px 0;"><strong>Rejected By:</strong> ${data.engineerName}</p>
              <p style="margin: 5px 0;"><strong>Service Type:</strong> ${data.serviceType}</p>
              <p style="margin: 5px 0;"><strong>Device:</strong> ${data.device}</p>
              <p style="margin: 5px 0;"><strong>Customer Phone:</strong> ${data.customerPhone}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #dc2626; font-weight: bold;">❌ Rejected</span></p>
              <p style="margin: 5px 0;"><strong>Rejected At:</strong> ${data.rejectedAt}</p>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #333;">📋 Original Issue:</h4>
              <p style="margin: 5px 0; color: #92400e; font-style: italic;">${data.issueDescription}</p>
            </div>
            
            <h3 style="color: #333;">⚡ Immediate Actions Required:</h3>
            <ul style="padding-left: 20px;">
              <li><strong>🔄 Reassign</strong> to another available engineer</li>
              <li><strong>📞 Contact</strong> customer about potential delay</li>
              <li><strong>🔍 Review</strong> task complexity and requirements</li>
              <li><strong>⏰ Update</strong> timeline expectations if needed</li>
            </ul>
            
            <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #991b1b;"><strong>⚠️ Customer Impact:</strong> The customer is waiting for service. Please reassign this task promptly to minimize delay.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/admin/repair-requests" style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">Reassign Task</a>
              <a href="tel:${data.customerPhone}" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Call Customer</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p><strong>🚨 Task Reassignment Required</strong></p>
              <p>Please take immediate action to reassign this task to another engineer.</p>
              <p>📧 kptestingdw@gmail.com | 📞 +1 (555) 123-4567</p>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Task rejection notification for booking #${data.bookingId}. Immediate reassignment required.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'admin_work_on_hold') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Work On Hold - Admin Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TechService Admin</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Work Status Update</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #f59e0b; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 40px;">⏸️</span>
              </div>
              <h2 style="color: #f59e0b; margin: 0; font-size: 24px;">Work Put On Hold</h2>
            </div>
            
            <p>Hello Admin,</p>
            
            <p>The assigned engineer has temporarily put the repair work on hold. Please review the details and take appropriate action.</p>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="margin-top: 0; color: #333;">Hold Details:</h3>
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${data.bookingId}</p>
              <p style="margin: 5px 0;"><strong>Customer:</strong> ${data.customerName}</p>
              <p style="margin: 5px 0;"><strong>Engineer:</strong> ${data.engineerName}</p>
              <p style="margin: 5px 0;"><strong>Service Type:</strong> ${data.serviceType}</p>
              <p style="margin: 5px 0;"><strong>Device:</strong> ${data.device}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">⏸️ On Hold</span></p>
              <p style="margin: 5px 0;"><strong>Put On Hold:</strong> ${data.holdDate}</p>
            </div>
            
            <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #333;">📋 Reason for Hold:</h4>
              <p style="margin: 5px 0; color: #991b1b; font-weight: 500;">${data.holdReason}</p>
            </div>
            
            <h3 style="color: #333;">Required Actions:</h3>
            <ul style="padding-left: 20px;">
              <li><strong>🔍 Review</strong> the hold reason and requirements</li>
              <li><strong>📞 Contact</strong> customer about the delay</li>
              <li><strong>🛐 Arrange</strong> necessary resources or parts</li>
              <li><strong>⏰ Update</strong> timeline expectations</li>
              <li><strong>▶️ Resume</strong> work when ready</li>
            </ul>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af;"><strong>📞 Customer Communication:</strong> The customer has been notified about the hold. Please follow up with additional details if needed.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/admin/repair-requests" style="background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">Review & Resume</a>
              <a href="tel:${data.customerPhone}" style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Call Customer</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p><strong>⏸️ Work Temporarily Paused</strong></p>
              <p>Please take action to resolve the hold and resume work.</p>
              <p>📧 kptestingdw@gmail.com | 📞 +1 (555) 123-4567</p>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Hold notification for booking #${data.bookingId}. Action required to resume work.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'customer_work_on_hold') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Repair Work Temporarily On Hold</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TechService</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Repair Status Update</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #f59e0b; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 40px;">⏸️</span>
              </div>
              <h2 style="color: #f59e0b; margin: 0; font-size: 24px;">Repair Work Temporarily On Hold</h2>
            </div>
            
            <p>Dear ${data.customerName},</p>
            
            <p>We wanted to keep you informed about the status of your device repair. Our engineer has temporarily put your repair on hold for the following reason:</p>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="margin-top: 0; color: #333;">Your Repair Details:</h3>
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${data.bookingId}</p>
              <p style="margin: 5px 0;"><strong>Service Type:</strong> ${data.serviceType}</p>
              <p style="margin: 5px 0;"><strong>Device:</strong> ${data.device}</p>
              <p style="margin: 5px 0;"><strong>Engineer:</strong> ${data.engineerName}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">⏸️ Temporarily On Hold</span></p>
            </div>
            
            <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #333;">📋 Reason for Hold:</h4>
              <p style="margin: 5px 0; color: #991b1b; font-weight: 500;">${data.holdReason}</p>
            </div>
            
            <h3 style="color: #333;">What This Means:</h3>
            <ul style="padding-left: 20px;">
              <li>🔧 Your repair is temporarily paused, not cancelled</li>
              <li>📞 We're working to resolve the hold reason</li>
              <li>⏰ We'll resume work as soon as possible</li>
              <li>📧 You'll be notified when work resumes</li>
            </ul>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af;"><strong>📞 We're On It:</strong> Our team is actively working to resolve this hold and will resume your repair as quickly as possible. We appreciate your patience.</p>
            </div>
            
            <p>If you have any questions or concerns about this hold, please don't hesitate to contact us. We're committed to completing your repair with the highest quality standards.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/dashboard" style="background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">Track Progress</a>
              <a href="tel:+15551234567" style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Call Us</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p><strong>🕰️ Temporary Hold - We'll Resume Soon</strong></p>
              <p>Thank you for your patience while we ensure the best possible repair.</p>
              <p>📧 support@techservice.com | 📞 +1 (555) 123-4567</p>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Hold notification for your repair #${data.bookingId}. We'll update you when work resumes.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'customer_work_resumed') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Great News - Repair Work Resumed!</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TechService</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Repair Status Update</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #10b981; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 40px;">▶️</span>
              </div>
              <h2 style="color: #10b981; margin: 0; font-size: 24px;">Great News! Work Resumed</h2>
            </div>
            
            <p>Dear ${data.customerName},</p>
            
            <p>Excellent news! We've resolved the issue that caused your repair to be put on hold, and our engineer is now ready to resume work on your device.</p>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="margin-top: 0; color: #333;">Your Repair Details:</h3>
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${data.bookingId}</p>
              <p style="margin: 5px 0;"><strong>Service Type:</strong> ${data.serviceType}</p>
              <p style="margin: 5px 0;"><strong>Device:</strong> ${data.device}</p>
              <p style="margin: 5px 0;"><strong>Engineer:</strong> ${data.engineerName}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">▶️ Work Resumed</span></p>
              <p style="margin: 5px 0;"><strong>Resumed On:</strong> ${data.resumedDate}</p>
            </div>
            
            <h3 style="color: #333;">What's Happening Now:</h3>
            <ul style="padding-left: 20px;">
              <li>▶️ Work has resumed on your device</li>
              <li>🔧 Our engineer is actively working on the repair</li>
              <li>📞 You'll be updated on progress as needed</li>
              <li>✅ We'll notify you when the repair is completed</li>
            </ul>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af;"><strong>🚀 Back on Track:</strong> Thank you for your patience during the hold. We're now moving forward with your repair and expect to complete it soon.</p>
            </div>
            
            <p>We appreciate your patience while we resolved the temporary hold. Our team is committed to delivering the highest quality repair service for your device.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/dashboard" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">Track Progress</a>
              <a href="tel:+15551234567" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Call Us</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p><strong>▶️ Work Resumed - We're Back!</strong></p>
              <p>Your repair is now back on track. We'll keep you updated on progress.</p>
              <p>📧 support@techservice.com | 📞 +1 (555) 123-4567</p>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Work resumed notification for your repair #${data.bookingId}. Thank you for your patience.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'engineer_work_resumed') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Work Resumed - Continue Task</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TechService</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Task Status Update</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #10b981; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 40px;">▶️</span>
              </div>
              <h2 style="color: #10b981; margin: 0; font-size: 24px;">Work Resumed - Continue Task</h2>
            </div>
            
            <p>Hello ${data.engineerName},</p>
            
            <p>The admin has resolved the hold issue and you can now resume work on the repair task. Please continue with the repair process.</p>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="margin-top: 0; color: #333;">Task Details:</h3>
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${data.bookingId}</p>
              <p style="margin: 5px 0;"><strong>Customer:</strong> ${data.customerName}</p>
              <p style="margin: 5px 0;"><strong>Service Type:</strong> ${data.serviceType}</p>
              <p style="margin: 5px 0;"><strong>Device:</strong> ${data.device}</p>
              <p style="margin: 5px 0;"><strong>Customer Phone:</strong> ${data.customerPhone}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">▶️ Ready to Resume</span></p>
              <p style="margin: 5px 0;"><strong>Resumed On:</strong> ${data.resumedDate}</p>
            </div>
            
            <h3 style="color: #333;">Next Steps:</h3>
            <ul style="padding-left: 20px;">
              <li><strong>▶️ Continue</strong> with the repair work</li>
              <li><strong>📞 Contact</strong> customer if needed</li>
              <li><strong>🔄 Update</strong> status as work progresses</li>
              <li><strong>✅ Complete</strong> the repair and submit report</li>
            </ul>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af;"><strong>📞 Customer Notified:</strong> The customer has been informed that work has resumed. They're expecting progress updates.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/employee-frontend/my-tasks" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">Continue Task</a>
              <a href="tel:${data.customerPhone}" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Call Customer</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p><strong>▶️ Ready to Continue</strong></p>
              <p>Please resume work on this task. Customer is waiting for completion.</p>
              <p>📧 support@techservice.com | 📞 +1 (555) 123-4567</p>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Work resumed for task #${data.bookingId}. Please continue with the repair process.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'admin_unable_to_complete') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Unable to Complete - Admin Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TechService Admin</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Task Completion Issue</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #dc2626; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 40px;">⚠️</span>
              </div>
              <h2 style="color: #dc2626; margin: 0; font-size: 24px;">Engineer Unable to Complete Task</h2>
            </div>
            
            <p>Hello Admin,</p>
            
            <p><strong>Critical Alert:</strong> An engineer has marked a repair task as unable to complete. This requires immediate attention for reassignment or customer communication.</p>
            
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="margin-top: 0; color: #333;">Task Details:</h3>
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${data.bookingId}</p>
              <p style="margin: 5px 0;"><strong>Customer:</strong> ${data.customerName}</p>
              <p style="margin: 5px 0;"><strong>Engineer:</strong> ${data.engineerName}</p>
              <p style="margin: 5px 0;"><strong>Service Type:</strong> ${data.serviceType}</p>
              <p style="margin: 5px 0;"><strong>Device:</strong> ${data.device}</p>
              <p style="margin: 5px 0;"><strong>Customer Phone:</strong> ${data.customerPhone}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #dc2626; font-weight: bold;">⚠️ Unable to Complete</span></p>
              <p style="margin: 5px 0;"><strong>Reported At:</strong> ${data.reportedAt}</p>
            </div>
            
            <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #333;">📋 Reason Unable to Complete:</h4>
              <p style="margin: 5px 0; color: #991b1b; font-weight: 500;">${data.unableReason}</p>
            </div>
            
            <h3 style="color: #333;">🚨 Critical Actions Required:</h3>
            <ul style="padding-left: 20px;">
              <li><strong>📞 Contact</strong> customer immediately about the situation</li>
              <li><strong>🔍 Assess</strong> if another engineer can handle this repair</li>
              <li><strong>🔄 Reassign</strong> to a specialist if possible</li>
              <li><strong>💰 Discuss</strong> refund or alternative solutions</li>
              <li><strong>📝 Document</strong> the case for future reference</li>
            </ul>
            
            <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #991b1b;"><strong>🚨 Customer Impact:</strong> The customer is expecting their device to be repaired. Immediate communication and resolution planning is critical to maintain service quality.</p>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #333;">📋 Original Issue:</h4>
              <p style="margin: 5px 0; color: #92400e; font-style: italic;">${data.issueDescription}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/admin/repair-requests" style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">Take Action</a>
              <a href="tel:${data.customerPhone}" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Call Customer</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p><strong>🚨 Immediate Action Required</strong></p>
              <p>Customer communication and resolution planning needed urgently.</p>
              <p>📧 kptestingdw@gmail.com | 📞 +1 (555) 123-4567</p>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Unable to complete notification for booking #${data.bookingId}. Critical customer service situation.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'request_cancelled') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Repair Request Cancelled</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TechFix Services</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Professional Repair Services</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #dc2626; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 40px;">❌</span>
              </div>
              <h2 style="color: #dc2626; margin: 0; font-size: 24px;">Request Cancelled</h2>
            </div>
            
            <p>Dear ${data.customerName},</p>
            
            <p>We regret to inform you that your repair request has been <strong>cancelled</strong> by our admin team.</p>
            
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="margin-top: 0; color: #333;">Request Details:</h3>
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${data.requestId}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #dc2626; font-weight: bold;">❌ Cancelled</span></p>
            </div>
            
            <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #333;">📋 Reason for Cancellation:</h4>
              <p style="margin: 5px 0; color: #991b1b; font-style: italic;">${data.reason}</p>
            </div>
            
            <p>We apologize for any inconvenience this may cause. If you have any questions or would like to submit a new request, please don't hesitate to contact us.</p>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af;"><strong>💡 Need Help?</strong> Our customer service team is available to assist you with any questions or to help you submit a new repair request.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/book-repair" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">Submit New Request</a>
              <a href="tel:+15551234567" style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Call Us</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p><strong>We're Here to Help</strong></p>
              <p>Thank you for considering TechFix Services for your repair needs.</p>
              <p>📧 support@techfix.com | 📞 +1 (555) 123-4567</p>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Cancellation notification for request #${data.requestId}. If you have questions, please contact our support team.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'status_update') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Repair Request Confirmed</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TechService</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Professional Repair Services</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #f97316; margin-top: 0;">Great News! Your Repair Request is Confirmed</h2>
            
            <p>Dear ${data.customerName},</p>
            
            <p>We're pleased to inform you that your repair request has been <strong>confirmed</strong> and is now being processed by our team.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
              <h3 style="margin-top: 0; color: #333;">Request Details:</h3>
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${data.bookingId}</p>
              <p style="margin: 5px 0;"><strong>Service Type:</strong> ${data.serviceType}</p>
              <p style="margin: 5px 0;"><strong>Device:</strong> ${data.device}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Confirmed</span></p>
            </div>
            
            <h3 style="color: #333;">What happens next?</h3>
            <ul style="padding-left: 20px;">
              <li>Our team will review your request in detail</li>
              <li>We'll assign a qualified technician to your case</li>
              <li>You'll receive updates via email and SMS</li>
              <li>We'll contact you to schedule the repair</li>
            </ul>
            
            <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #0277bd;"><strong>💡 Tip:</strong> Keep your booking ID (#${data.bookingId}) handy for future reference.</p>
            </div>
            
            <p>If you have any questions or need to make changes to your request, please don't hesitate to contact us.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/dashboard" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View My Requests</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #666; font-size: 14px;">
              <p>Thank you for choosing TechService!</p>
              <p>📧 support@techservice.com | 📞 +1 (555) 123-4567</p>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                This email was sent regarding your repair request. If you didn't make this request, please contact us immediately.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    const result = await sendEmail({
      to,
      subject,
      html: htmlContent
    });

    // Log email attempt to database
    if (data && data.bookingId) {
      try {
        // Convert bookingId to proper UUID format if it's shortened
        let bookingUuid = data.bookingId;
        if (typeof bookingUuid === 'string' && bookingUuid.length === 8) {
          // If it's a shortened ID, we need to find the full UUID
          const { data: booking } = await supabaseAdmin
            .from('repair_bookings')
            .select('id')
            .ilike('id', `%${bookingUuid}%`)
            .single();
          bookingUuid = booking?.id || bookingUuid;
        }

        await supabaseAdmin
          .from('repair_email_logs')
          .insert({
            booking_id: bookingUuid,
            recipient_email: to,
            email_type: type,
            subject: subject,
            sent_status: result.success ? 'sent' : 'failed',
            error_message: result.success ? null : result.error
          });
        console.log('Email logged successfully for booking:', bookingUuid);
      } catch (logError) {
        console.error('Failed to log email:', logError);
      }
    }

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}