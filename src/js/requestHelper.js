class RequestHelper {
  static API_KEY = 'b5d371b3-5e8a-4121-bf07-b76f8f02df8c';

  static sendRequest(url, cb, arg = '') {
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    fetch(proxyurl + url)
      .then(response => response.json())
      .then(contents => cb(contents, arg))
      .catch(() => console.log('Can’t access ' + url + ' response. Blocked by browser?'));
  }

  static sendManyRequests(urls, cb){
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    let requests = urls.map(url => fetch(proxyurl + url));

    Promise.all(requests)
      .then(responses => Promise.all(responses.map(r => r.json())))
      .then(results => cb(results))
      .catch(() => console.log('Can’t access ' + urls + ' response. Blocked by browser?'));
  }

}

export default RequestHelper;
