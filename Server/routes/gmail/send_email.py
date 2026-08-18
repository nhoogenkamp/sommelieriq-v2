import json
import base64

import flask
import google.oauth2.credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from email.message import EmailMessage
from email.utils import formataddr

from routes.gmail.gmail_auth import CLIENT_SECRETS_FILE


# Google OAuth 2.0 for Web Server Applications:
# https://developers.google.com/identity/protocols/oauth2/web-server?authuser=19#python_6
# Gmail API - Create and send email messages:
# https://developers.google.com/workspace/gmail/api/guides/sending


def send_email(recipient, subject=None, content=None):
    """This code will call Gmail.Send API"""

    # Check if Gmail has been authorized.
    if "google_credentials" not in flask.session:
        return False

    # Load client secrets from the server-side file.
    with open(CLIENT_SECRETS_FILE, "r") as f:
        client_config = json.load(f)["web"]

    # Load user-specific credentials from session storage.
    session_credentials = flask.session["google_credentials"]

    # Reconstruct the credentials object.
    credentials = google.oauth2.credentials.Credentials(
        refresh_token=session_credentials.get("refresh_token"),
        scopes=session_credentials.get("granted_scopes"),
        token=session_credentials.get("token"),
        client_id=client_config.get("client_id"),
        client_secret=client_config.get("client_secret"),
        token_uri=client_config.get("token_uri")
    )

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

        # Save credentials back to the session in case
        # the access token was refreshed.
        flask.session["google_credentials"] = {
            "token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "granted_scopes": credentials.granted_scopes
        }

        return True

    except HttpError as e:
        print(f"Error occurred: {e}")
        return False