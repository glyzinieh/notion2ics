export interface List {
    object: 'list';
    results: Page[];
    next_cursor: string | null;
    has_more: boolean;
}

interface Page {
    object: 'page';
    id: string;
    created_time: string;
    created_by: User;
    last_edited_time: string;
    last_edited_by: User;
    archived: boolean;
    in_trash: boolean;
    // icon: File | Emoji | null;
    // cover: File | null;
    properties: { [key: string]: PropertyValue };
    parent: Parent;
    url: string;
    public_url?: string;
}

interface User {
    object: 'user';
    id: string;
    type: 'person' | 'bot';
    name?: string;
    avatar_url?: string;
}

interface PropertyValue {
    id: string;
    type: 'checkbox' |
        'created_by' |
        'created_time' |
        'date' |
        'email' |
        'files' |
        'formula' |
        'last_edited_by' |
        'last_edited_time' |
        'multi_select' |
        'number' |
        'people' |
        'phone_number' |
        'relation' |
        'rollup' |
        'rich_text' |
        'select' |
        'status' |
        'title' |
        'url' |
        'unique_id' |
        'verification';
    [key: string]: any;
}

interface Parent {
    type: 'database_id' ;
    database_id: string;
}
