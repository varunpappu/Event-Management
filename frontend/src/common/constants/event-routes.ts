export const URL = 'http://localhost:8000/public';

export const USER_REGISTRATION = URL + '/v1/user/register';
export const USER_LOGIN = URL + '/v1/user/login';
export const REFRESH_TOKEN = URL + '/v1/user/token/refresh';

export const EVENT_CREATION = URL + '/v1/event-management/event';
export const EVENT_LIST = URL + '/v1/event-management/event-list';
export const EVENT_ACTIONS = URL + '/v1/event-management/events';

export const PARTICIPABLE_EVENT = URL + '/v1/event-management/participable-events';
export const EVENT_PARTICIPANTS = URL + '/v1/event-management/event-participants';

export const EVENT_NOTIFICATIONS = 'ws://127.0.0.1:8000/notifications/';