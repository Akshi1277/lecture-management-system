import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

/**
 * Sends an enrollment email to a newly registered user.
 * 
 * @param {string} to Receiver email
 * @param {string} name User's name
 * @param {string} password Temporary password
 * @param {string} role 'student' or 'teacher'
 */
export const sendEnrollmentEmail = async (to, name, password, role) => {
    const mailOptions = {
        from: `"EduSync Admin" <${process.env.MAIL_USER}>`,
        to,
        subject: `Welcome to EduSync - Your ${role === 'student' ? 'Student' : 'Faculty'} Account is Ready`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; border-top: 8px solid #06b6d4;">
                <h1 style="color: #0f172a; margin-bottom: 24px;">Welcome to EduSync, ${name}!</h1>
                <p style="color: #334155; font-size: 16px; line-height: 1.6;">Your account has been successfully created by the administrator. You can now access the platform using the credentials provided below.</p>
                <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 24px 0;">
                    <p style="margin: 0; font-size: 14px; color: #64748b;">Login Email:</p>
                    <p style="margin: 4px 0 16px 0; font-size: 18px; font-weight: bold; color: #020617;">${to}</p>
                    <p style="margin: 0; font-size: 14px; color: #64748b;">Temporary Password:</p>
                    <p style="margin: 4px 0; font-size: 18px; font-weight: bold; color: #020617;">${password}</p>
                </div>
                <p style="color: #475569; font-size: 14px;">For security reasons, we recommend that you change your password immediately after your first login.</p>
                <div style="text-align: center; margin-top: 32px;">
                    <a href="http://localhost:3000/login" style="background-color: #06b6d4; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Login to EduSync</a>
                </div>
                <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
                <p style="font-size: 12px; color: #94a3b8; text-align: center;">This is an automated message. Please do not reply directly to this email.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Enrollment email sent to ${to}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        // We don't throw the error so registration can still complete even if email fails
        // but we'll return it so we can track it.
        return error;
    }
};

/**
 * Sends a password reset email with a verification OTP.
 * 
 * @param {string} to Receiver email
 * @param {string} name User's name
 * @param {string} otp 6-digit verification code
 */
export const sendPasswordResetEmail = async (to, name, otp) => {
    const mailOptions = {
        from: `"EduSync Support" <${process.env.MAIL_USER}>`,
        to,
        subject: `Reset Your EduSync Password`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; border-top: 8px solid #f43f5e;">
                <h1 style="color: #0f172a; margin-bottom: 24px;">Password Reset Request</h1>
                <p style="color: #334155; font-size: 16px; line-height: 1.6;">Hello ${name},</p>
                <p style="color: #334155; font-size: 16px; line-height: 1.6;">We received a request to reset your password. Use the verification code below to proceed:</p>
                <div style="background-color: #fff1f2; padding: 24px; border-radius: 12px; margin: 32px 0; text-align: center; border: 1px solid #fecdd3;">
                    <p style="margin: 0; font-size: 14px; color: #e11d48; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
                    <p style="margin: 12px 0 0 0; font-size: 36px; font-weight: 900; color: #020617; letter-spacing: 12px; font-family: 'Courier New', monospace;">${otp}</p>
                </div>
                <p style="color: #475569; font-size: 14px;">This code is valid for 1 hour. If you didn't request a password reset, move this email to trash.</p>
                <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
                <p style="font-size: 12px; color: #94a3b8; text-align: center;">This is an automated security notification. Do not share this code with anyone.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${to}`);
    } catch (error) {
        console.error(`Failed to send password reset email to ${to}:`, error);
        return error;
    }
};

/**
 * Sends an attendance warning email to the parent.
 * 
 * @param {string} to Parent email
 * @param {string} studentName Student's name
 * @param {number} percentage Current attendance percentage
 * @param {number} threshold Required percentage
 */
export const sendAttendanceWarningEmail = async (to, studentName, percentage, threshold) => {
    const mailOptions = {
        from: `"EduSync Admin" <${process.env.MAIL_USER}>`,
        to,
        subject: `ATTENTION: Low Attendance Warning for ${studentName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; border-top: 8px solid #ef4444;">
                <h1 style="color: #0f172a; margin-bottom: 24px;">Attendance Notification</h1>
                <p style="color: #334155; font-size: 16px; line-height: 1.6;">Dear Parent/Guardian,</p>
                <p style="color: #334155; font-size: 16px; line-height: 1.6;">This is to inform you that the current attendance of <strong>${studentName}</strong> has fallen below the required threshold of <strong>${threshold}%</strong>.</p>
                
                <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #fee2e2;">
                    <p style="margin: 0; font-size: 14px; color: #991b1b;">Current Attendance:</p>
                    <p style="margin: 4px 0; font-size: 32px; font-weight: bold; color: #dc2626;">${percentage.toFixed(2)}%</p>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #b91c1c;">Required: ${threshold}%</p>
                </div>

                <p style="color: #475569; font-size: 14px; line-height: 1.6;">Consistent attendance is crucial for academic success and understanding practical laboratory sessions. We encourage you to discuss this with your child to ensure they meet the minimum requirements.</p>
                
                <div style="text-align: center; margin-top: 32px;">
                    <a href="http://localhost:3000/login" style="background-color: #0f172a; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">View Detailed Report</a>
                </div>
                
                <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
                <p style="font-size: 12px; color: #94a3b8; text-align: center;">This is an automated academic notification from EduSync Management System.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Attendance warning email sent to ${to} for student ${studentName}`);
    } catch (error) {
        console.error(`Failed to send attendance warning email to ${to}:`, error);
        return error;
    }
};

