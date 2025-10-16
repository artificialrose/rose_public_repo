# Zoom Recording to YouTube Publisher Workflow 🚀
This project is a Pipedream serverless workflow that automates the publishing of completed Zoom meeting recordings directly to YouTube. The automation handles processing, uploading, playlist organization, and final notification, eliminating manual steps.

## Workflow Goal
The primary goal is to create a robust, event-driven solution to save time and ensure that meeting recordings are quickly and reliably published to a public-facing YouTube channel immediately after the Zoom meeting ends.

## Architecture & Step-by-Step Flow
The automation is structured as a five-step workflow, triggered by a Zoom webhook event.

### Trigger: zoom-recording-completed (Webhook)
Zoom --> Recording Completed
Listens for the recording.completed event from a connected Zoom account.
The payload provides the temporary recording file URL, meeting topic, and other essential metadata.

### Custom Code: nodejs20.x (Custom Processing)
Custom Node.js script executed on the Pipedream platform.
given in formatTime.js 


### Action: upload_video (YouTube - Upload Video)
Youtube Data --> Upload Video
Utilizes the YouTube Data API integration to ingest and upload the video file processed in Step 2.
The video is uploaded with the dynamic title and description pulled from the Zoom meeting.
```
//title
{{steps.code.$return_value.formattedMeetingTime_Nice}}, {{steps.trigger.event.meeting_topic}}

//Description
{{steps.code.$return_value.formattedMeetingTime_Nice}}

//file path
{{steps.trigger.event.download_url}}
```


### Action: add_playlist (YouTube - Add Playlist Items)
Youtube Data --> Add Playlist Items
Immediately adds the newly uploaded video (using the returned Video ID) to a specific, predefined YouTube playlist (e.g., "Weekly Webinars" or "Product Demos").

```
//videoID
{{steps.upload_video.$return_value.id}}
```


### Action: send_telegram_message (Notification)
Sends a final notification via a chosen service (e.g., telegram).
Confirms the process is complete and provides a direct link to the published YouTube video.

```
// Text
{{steps.code.$return_value.formattedMeetingTime_pretty}}
{{steps.trigger.event.meeting_topic}}

https://www.youtube.com/watch?v={{steps.upload_video.$return_value.id}}
```

# Workflow

<img width="298" height="566" alt="image" src="https://github.com/user-attachments/assets/c41edc27-0d92-409b-a920-3b0187de4d90" />



