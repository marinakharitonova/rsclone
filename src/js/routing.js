class Routing {
  static setUrl(urlAddition, params, state) {
    let url = new URL(`${location.origin}`);

    for (let key in params) {
      url.searchParams.set(key, params[key]);
    }

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
