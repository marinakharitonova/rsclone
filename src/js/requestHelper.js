class RequestHelper {
  static sendRequest(url, date, cb) {
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    fetch(proxyurl + url)
      .then(response => response.json())
      .then(contents => cb(contents, date))
      .catch(() => console.log('Can’t access ' + url + ' response. Blocked by browser?'));
  }
}

export default RequestHelper;
