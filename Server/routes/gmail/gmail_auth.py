import flask
import google.oauth2.credentials
import google_auth_oauthlib.flow


# OAuth client file downloaded from Google Cloud
# https://developers.google.com/identity/protocols/oauth2/web-server?authuser=19#python_6

CLIENT_SECRETS_FILE = "credentials.json"

# SommelierIQ only needs permission to send email
SCOPES = [
    "https://www.googleapis.com/auth/gmail.send"
]


def authorize():
    # Create flow instance to manage the OAuth 2.0 Authorization Grant Flow.
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file( CLIENT_SECRETS_FILE, scopes=SCOPES)
     # This must exactly match one of the redirect URIs configured
    # in Google Cloud.
    
    flow.redirect_uri = flask.url_for("oauth2callback_route",_external=True)

    authorization_url, state = flow.authorization_url(
        # Allows Google to provide a refresh token so the app
        # can send emails later without asking for permission again.
        access_type="offline",

        # Recommended by Google's example.
        include_granted_scopes="true",

        # Makes sure the consent screen is shown.
        prompt="consent"
    )

    # Store the state so the callback can verify Google's response.
    flask.session["state"] = state

    return flask.redirect(authorization_url)


def oauth2callback():
    # Retrieve the state stored before redirecting to Google.
    state = flask.session["state"]

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        state=state )

    flow.redirect_uri = flask.url_for(
        "oauth2callback_route",
        _external=True )

    # Google's response contains the authorization code.
    authorization_response = flask.request.url

    # Exchange the authorization code for OAuth tokens.
    flow.fetch_token(
        authorization_response=authorization_response
    )

    # Store credentials in the Flask session for now.
    credentials = flow.credentials

    flask.session["google_credentials"] = credentials_to_dict(
        credentials
    )

    return "Gmail authorization successful!"


def credentials_to_dict(credentials):
    return {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "granted_scopes": credentials.granted_scopes
    }