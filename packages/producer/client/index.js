const URLS = {
  root: '/',
  analyticsEvent: 'analytics/event',
};

/**
 * Returns current url.
 * @returns {string}
 */
function getCurrentUrl() {
  return window.location.href;
}

/**
 * Sends an analytics event to server.
 * @param {{targetId?: string, type: 'click' | 'load' | 'focus', url: string, timestamp: number}} event
 * @returns {Promise<Response>}
 */
function postAnalyticsEvent(event) {
  const url = `${URLS.root}${URLS.analyticsEvent}`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  }).then((res) => {
    console.log('Request complete! response:', res);
  });
}

/**
 * Creates an object of analytics event.
 * @param {'click' | 'load' | 'focus'} type
 * @param {string?} targetId
 * @returns {{targetId?: string, type: 'click' | 'load' | 'focus', url: string, timestamp: number}}
 */
function createAnalyticsEvent(type, targetId) {
  return {
    type: type,
    url: getCurrentUrl(),
    targetId,
    timestamp: new Date().getTime(),
  };
}

window.addEventListener('load', () => {
  const analyticsEvent = createAnalyticsEvent('load');
  postAnalyticsEvent(analyticsEvent);
});

document.addEventListener('focusin', (event) => {
  console.log('focusin');
  console.log(event);
  const analyticsEvent = createAnalyticsEvent('focus', event.target.id);
  postAnalyticsEvent(analyticsEvent);
});

document.addEventListener('click', (event) => {
  console.log('click');
  console.log(event);
  const analyticsEvent = createAnalyticsEvent('click', event.target.id);
  postAnalyticsEvent(analyticsEvent);
});
