import logging
import re
from flask import current_app
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature

# Reference:
# https://mailtrap.io/blog/flask-email-verification/

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

TOKEN_EXPIRATION_SECONDS = 86400  # 24 hours

def generate_token(email):
    """Generate a time-limited token for password reset."""

    s = URLSafeTimedSerializer( current_app.config["SECRET_KEY"])

    return s.dumps(
        email,
        salt="password-reset"
    )

def confirm_token(token, expiration=TOKEN_EXPIRATION_SECONDS):
    """Validate the token and extract the email if valid."""

    s = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])

    try:
        return s.loads(
            token,
            salt="password-reset",
            max_age=expiration
        )

    except SignatureExpired:
        logging.warning("Password reset token expired. Ask the user to request a new password reset email.")
        return False

    except BadSignature:
        logging.warning("Invalid password reset token.")
        return False


def is_valid_email(email):
    """Simple email validation function"""
    email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return re.match(email_regex, email)