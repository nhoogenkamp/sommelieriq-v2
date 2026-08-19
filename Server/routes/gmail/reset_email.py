import logging
import traceback
import os

from routes.gmail.send_email import send_email
from routes.gmail.reset_token import generate_token


# Password reset token reference: https://mailtrap.io/blog/flask-email-verification/
# Gmail API - sending email: https://developers.google.com/workspace/gmail/api/guides/sending
# Environment variables:https://www.newline.co/@goatandsheep/python-dotenv-managing-your-environment-variables-with-ease--ce4fb62d

FRONTEND_URL = os.environ.get("FRONTEND_URL")


def send_reset_email(to):
    """Generate the password reset token and send the reset email with a secure link."""

    try:
        # Generate password reset token.
        token = generate_token(to)
        # Create password reset URL.
        reset_url = f"{FRONTEND_URL}/reset-password?token={token}"
        subject = "Set Your SommelierIQ Password"
        content = f"""
        Click the link below to set your password:

        {reset_url}

        This link will expire after 24 hours.

        If you did not expect this request, ignore this email.
        """

        send_email(
            to,
            subject,
            content
        )

        logging.info(f"Password reset email sent to {to}.")

    except Exception as e:
        logging.error(f"Failed to send email to {to}: {str(e)}")
        logging.error(f"Traceback for {to}:\n{traceback.format_exc()}")
        logging.warning(
            "Possible causes: Gmail authorization issues, network issues, or Gmail API errors."
        )



def send_forgot_password(to):
    """Generate the password reset token and send the reset email with a secure link."""

    try:
        # Generate password reset token.
        token = generate_token(to)
        # Create password reset URL.
        reset_url = f"{FRONTEND_URL}/reset-password?token={token}"
        subject = "Reset your SommelierIQ password"
        content = f"""
        A password reset was requested for your SommelierIQ account.

        Please use the link below to reset your password:

        {reset_url}

        This link will expire in 24 hours.

        If you did not request a password reset, you can ignore this email.
        """

        send_email(
            to,
            subject,
            content
        )

        logging.info(f"Password reset email sent to {to}.")

    except Exception as e:
        logging.error(f"Failed to send email to {to}: {str(e)}")
        logging.error(f"Traceback for {to}:\n{traceback.format_exc()}")
        logging.warning(
            "Possible causes: Gmail authorization issues, network issues, or Gmail API errors."
        )

   