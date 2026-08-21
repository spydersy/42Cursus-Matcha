"""Hand-written email delivery helpers via standard smtplib.

Sends HTML & plaintext multipart emails to the configured SMTP server
(Mailpit in development).
"""

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from flask import current_app


def _send_email(to_email: str, subject: str, text_body: str, html_body: str) -> bool:
    """Send an email using smtplib to the configured mail host."""
    mail_host = current_app.config["MAIL_HOST"]
    mail_port = current_app.config["MAIL_PORT"]
    mail_from = current_app.config["MAIL_FROM"]

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = mail_from
    msg["To"] = to_email

    part_text = MIMEText(text_body, "plain", "utf-8")
    part_html = MIMEText(html_body, "html", "utf-8")

    msg.attach(part_text)
    msg.attach(part_html)

    try:
        with smtplib.SMTP(mail_host, mail_port) as server:
            server.sendmail(mail_from, [to_email], msg.as_string())
        return True
    except Exception as exc:
        current_app.logger.error("Failed to send email to %s: %s", to_email, exc)
        return False


def send_verification_email(to_email: str, username: str, token: str) -> bool:
    """Send an account verification email with a timed token link."""
    frontend_url = current_app.config["FRONTEND_URL"].rstrip("/")
    verification_link = f"{frontend_url}/verify-email?token={token}"

    subject = "🍵 Verify your Matcha account"
    text_body = f"""Hi {username},

Welcome to Matcha! Please verify your email address by clicking the link below:

{verification_link}

This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.

Best regards,
The Matcha Team
"""
    html_body = f"""<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #333; line-height: 1.6; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
    <h2 style="color: #e11d48; margin-top: 0;">Welcome to Matcha, {username}! 🍵</h2>
    <p>Thank you for registering. Please confirm your email address to activate your account:</p>
    <div style="margin: 30px 0; text-align: center;">
      <a href="{verification_link}" style="background-color: #e11d48; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify My Email</a>
    </div>
    <p style="font-size: 13px; color: #666;">Or copy and paste this URL into your browser:<br><a href="{verification_link}" style="color: #e11d48;">{verification_link}</a></p>
    <p style="font-size: 12px; color: #999; margin-top: 30px;">This link will expire in 24 hours. If you did not create an account, please ignore this email.</p>
  </div>
</body>
</html>"""

    return _send_email(to_email, subject, text_body, html_body)


def send_password_reset_email(to_email: str, username: str, token: str) -> bool:
    """Send a password reset email with a timed token link."""
    frontend_url = current_app.config["FRONTEND_URL"].rstrip("/")
    reset_link = f"{frontend_url}/reset-password?token={token}"

    subject = "🍵 Reset your Matcha password"
    text_body = f"""Hi {username},

We received a request to reset your Matcha password. You can set a new password by visiting:

{reset_link}

This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.

Best regards,
The Matcha Team
"""
    html_body = f"""<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #333; line-height: 1.6; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
    <h2 style="color: #e11d48; margin-top: 0;">Reset Your Password 🔐</h2>
    <p>Hi {username}, we received a request to reset your password. Click the button below to choose a new password:</p>
    <div style="margin: 30px 0; text-align: center;">
      <a href="{reset_link}" style="background-color: #e11d48; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
    </div>
    <p style="font-size: 13px; color: #666;">Or copy and paste this URL into your browser:<br><a href="{reset_link}" style="color: #e11d48;">{reset_link}</a></p>
    <p style="font-size: 12px; color: #999; margin-top: 30px;">This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
  </div>
</body>
</html>"""

    return _send_email(to_email, subject, text_body, html_body)
