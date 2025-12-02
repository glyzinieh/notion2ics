import { List } from "./type";

const NOTION_TOKEN = PropertiesService.getScriptProperties().getProperty('NOTION_TOKEN');
const NOTION_DATABASE_ID = PropertiesService.getScriptProperties().getProperty('NOTION_DATABASE_ID');
const NOTION_URL = `https://api.notion.com/v1/data_sources/${NOTION_DATABASE_ID}/query`;

const OPTIONS = {
    method: "post" as GoogleAppsScript.URL_Fetch.HttpMethod,
    headers: {
        "Authorization": `Bearer ${NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2025-09-03",
    },
    payload: JSON.stringify(
        {
            filter: {
                and: [
                    {
                        property: "日時", date: { is_not_empty: true }
                    },
                    {
                        or: [
                            { property: "オンライン", checkbox: { equals: false } },
                            {
                                and: [
                                    { property: "オンライン", checkbox: { equals: true } },
                                    { property: "完了", checkbox: { equals: false } }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    ),
};

function formatDatetimeToICS(datetime: string): string {
    return datetime.replace(/[-:]/g, '').replace('T', 'T').split('+')[0] + 'Z';
}

function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.TextOutput {
    const response = UrlFetchApp.fetch(NOTION_URL, OPTIONS);
    const data: List = JSON.parse(response.getContentText());

    let icsText = 'BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\n';

    data.results.forEach(item => {
        const props = item.properties;
        console.log(props);

        const name = props['名前'].title[0]?.plain_text || null;
        const datetime_start = props['日時'].date?.start || null;
        const datetime_end = props['日時'].date?.end || datetime_start || null;

        if (name === null || datetime_start === null) {
            return;
        }

        const dtStart = formatDatetimeToICS(datetime_start);
        const dtEnd = formatDatetimeToICS(datetime_end);
        const dtStamp = formatDatetimeToICS(item.created_time);
        icsText +=
            `BEGIN:VEVENT
UID:${item.id}
SUMMARY:${name}
DTSTAMP:${dtStamp}
DTSTART:${dtStart}
DTEND:${dtEnd}
DESCRIPTION:${item.url}
END:VEVENT
`;
    });

    icsText += 'END:VCALENDAR';

    return ContentService
        .createTextOutput(icsText)
        .setMimeType(ContentService.MimeType.ICAL);
}

(globalThis as any).doGet = doGet;
