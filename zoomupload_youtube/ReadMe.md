# Zoom Recording to YouTube Publisher Workflow 🚀
This project is a Pipedream serverless workflow that automates the publishing of completed Zoom meeting recordings directly to YouTube. The automation handles processing, uploading, playlist organization, and final notification, eliminating manual steps.

## Workflow Goal
The primary goal is to create a robust, event-driven solution to save time and ensure that meeting recordings are quickly and reliably published to a public-facing YouTube channel immediately after the Zoom meeting ends.

## Architecture & Step-by-Step Flow
The automation is structured as a five-step workflow, triggered by a Zoom webhook event.

### Trigger: zoom-recording-completed (Webhook)
Listens for the recording.completed event from a connected Zoom account.
The payload provides the temporary recording file URL, meeting topic, and other essential metadata.

### Code: nodejs20.x (Custom Processing)
Custom Node.js script executed on the Pipedream platform.

### Logic: Extracts and sanitizes the necessary data (title, description, file URL) from the Zoom payload.
Crucial Step: Fetches the actual video file from the temporary Zoom URL and prepares the data object for the subsequent API calls.

### Action: upload_video (YouTube - Upload Video)
Utilizes the YouTube Data API integration to ingest and upload the video file processed in Step 2.
The video is uploaded with the dynamic title and description pulled from the Zoom meeting.



### Action: add_playlist (YouTube - Add Playlist Items)
Immediately adds the newly uploaded video (using the returned Video ID) to a specific, predefined YouTube playlist (e.g., "Weekly Webinars" or "Product Demos").

### Action: send_telegram_message (Notification)
Sends a final notification via a chosen service (e.g., telegram).
Confirms the process is complete and provides a direct link to the published YouTube video.

<img width="298" height="566" alt="image" src="https://github.com/user-attachments/assets/c41edc27-0d92-409b-a920-3b0187de4d90" />



