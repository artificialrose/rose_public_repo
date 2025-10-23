// formatTime

import moment from 'moment-timezone';

export default defineComponent({
  async run({ steps, $ }) {
    // 1. Get the Zoom meeting start time from your trigger
    const meetingStartTimeUTC = steps.trigger.event.recording_start ; // **REPLACE with your actual trigger variable path!**
    const targetTimeZone = "Asia/Yangon"; // **REPLACE with your desired IANA time zone name!**

    // 2. Parse the UTC meeting start time using moment-timezone in UTC mode
    const meetingStartTimeMomentUTC = moment.utc(meetingStartTimeUTC);

    // 3. Convert to the target time zone
    const meetingStartTimeTargetZone = meetingStartTimeMomentUTC.tz(targetTimeZone);

    // 4. Format the meeting start time in different formats:

    // a) Nicely formatted time in target time zone with timezone abbreviation (e.g., "YYYY-MM-DD HH:mm:ss z")
    const formattedMeetingTimeTargetZone_Nice = meetingStartTimeTargetZone.format('YYYY-MM-DD hh:mm A');

    // b) Different format - e.g., just time and AM/PM in target zone (e.g., "h:mm A z")
    const formattedMeetingTimeTargetZone_TimeOnly = meetingStartTimeTargetZone.format('h:mm A z');

    // c) ISO 8601 UTC-like string, but representing time in target zone (e.g., "YYYY-MM-DDTHH:mm:ssZ")
    const formattedMeetingTimeUTCLike = meetingStartTimeTargetZone.utc().format('YYYY-MM-DDTHH:mm:ssZ');

    // d) Just the date in YYYY-MM-DD format in target zone (e.g., "YYYY-MM-DD")
    const formattedMeetingTimeTargetZone_DateOnly = meetingStartTimeTargetZone.format('YYYY-MM-DD');

    // e) Just the date in ddd (DD MMM, YYYY) format in target zone (e.g., "ddd (DD MMM, YYYY)")
    const formattedMeetingTime_pretty = meetingStartTimeTargetZone.format('ddd (DD MMM, YYYY)');


    return {
      formattedMeetingTime_Nice: formattedMeetingTimeTargetZone_Nice,
      formattedMeetingTime_TimeOnly: formattedMeetingTimeTargetZone_TimeOnly,
      formattedMeetingTime_UTCLike: formattedMeetingTimeUTCLike,
      formattedMeetingTime_DateOnly: formattedMeetingTimeTargetZone_DateOnly,
      formattedMeetingTime_pretty : formattedMeetingTime_pretty,
      targetTimeZoneUsed: targetTimeZone // For reference
      
    };
  },
});


