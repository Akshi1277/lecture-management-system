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
