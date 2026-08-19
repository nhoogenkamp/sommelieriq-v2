import base64
import os.path
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.auth.transport.requests import Request
from email.message import EmailMessage
from email.utils import formataddr
from routes.gmail.gmail_auth import SCOPES



# Google OAuth 2.0 for Web Server Applications:
# https://developers.google.com/identity/protocols/oauth2/web-server?authuser=19#python_6
# Gmail API - Create and send email messages:
# https://developers.google.com/workspace/gmail/api/guides/sending
# https://developers.google.com/workspace/gmail/api/quickstart/python


def send_email(recipient, subject=None, content=None):
    """This code will call Gmail.Send API"""

    credentials = None

    # Load saved Gmail authorization.
    if os.path.exists("token.json"):
        credentials = Credentials.from_authorized_user_file(
            "token.json",
            SCOPES
        )

    # Gmail has not been authorized yet.
    if not credentials:
        return False

    # Refresh the access token if needed.
    if credentials.expired and credentials.refresh_token:
        credentials.refresh(Request())

        # Save refreshed credentials.
        with open("token.json", "w") as token:
            token.write(credentials.to_json())
    # Call Gmail API.
    try:
        service = build(
            "gmail",
            "v1",
            credentials=credentials
        )

        # Prepare a message.
        message = EmailMessage()

        if subject is not None:
            message["Subject"] = str(subject)
        else:
            message["Subject"] = "SommelierIQ Email"

        if content is not None:
            message.set_content(str(content))
        else:
            message.set_content(
                "This is a test message sent from SommelierIQ."
            )

        message["To"] = recipient

        message["From"] = formataddr(
            (
                "SommelierIQ",
                "sommelieriq@gmail.com"
            )
        )

        # Encode the message.
        encoded_message = base64.urlsafe_b64encode(
            message.as_bytes()
        ).decode()

        create_message = {
            "raw": encoded_message
        }

        # Send the email using Gmail API.
        service.users().messages().send(
            userId="me",
            body=create_message
        ).execute()

        return True

    except HttpError as e:
        print(f"Error occurred: {e}")
        return False