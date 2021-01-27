class Routing {
  static setUrl(urlAddition, params, state) {
    // eslint-disable-next-line no-restricted-globals
    let url = new URL(`${location.href}`);

    // eslint-disable-next-line guard-for-in
    for (let key in params) {
      url.searchParams.set(key, params[key]);
    }

    // eslint-disable-next-line no-restricted-globals
    history.pushState(state, null, url.href);
  }

  static parseUrl(str) {
    let url = new URL(str);
    let params = {};
    if (url.searchParams.get('from')) {
      params.from = url.searchParams.get('from');
      params.to = url.searchParams.get('to');
      params.date = url.searchParams.get('date');
      params.transport = url.searchParams.get('transport');
    }
    return params;
  }
}

export default Routing;
