class RequestHelper {
  static getKey() {
    return 'b5d371b3-5e8a-4121-bf07-b76f8f02df8c';
  }

  static sendRequest(url, cb, arg = '') {
    fetch(url)
      .then(response => response.json())
      .then(contents => cb(contents, arg))
      // eslint-disable-next-line no-console
      .catch(() => console.log('Can’t access ' + url + ' response. Blocked by browser?'));
  }

  static sendManyRequests(urls, cb) {
    let requests = urls.map(url => fetch(url));

    Promise.all(requests)
      .then(responses => Promise.all(responses.map(r => r.json())))
      .then(results => cb(results))
      // eslint-disable-next-line no-console
      .catch(() => console.log('Can’t access ' + urls + ' response. Blocked by browser?'));
  }
}

export default RequestHelper;
