const jsonHeaders = {
    Accept: "application/json",
    "Content-type": "application/json",
  };
  
  function joinURL(baseURL, url) {
    return `${baseURL}/${url}`;
  }
  
  class Service {
    constructor() {
      this.domain = process.env.REACT_APP_BACKEND_URL;
    }
  
    request(url, method = "POST", data = null) {
      url = joinURL(this.domain, url);
  
      const options = {
        method,
        headers: {},
      };
  
      if (data) {
        // ⭐ IMPORTANT FIX
        const isFormData = data instanceof FormData;
  
        if (isFormData) {
          // DO NOT set content-type manually
          options.body = data;
        } else {
          options.headers = jsonHeaders;
          options.body = JSON.stringify({ ...data });
        }
      } else {
        options.headers = jsonHeaders;
      }
  
      return fetch(url, options);
    }
  
    post(url, data) {
      const method = "POST";
      return this.request(url, method, data).then((res) => {
        if (!res.ok) throw Error("Could Not Fetch Data from Resource");
        return res.json();
      });
    }
  
    get(url) {
      const method = "GET";
      return this.request(url, method).then((res) => {
        if (!res.ok) throw Error("Could Not Fetch Data from Resource");
        return res.json();
      });
    }
  
    delete(url) {
      const method = "DELETE";
      return this.request(url, method, null).then((res) => res.json());
    }
  
    put(url, data) {
      const method = "PUT";
      return this.request(url, method, data).then((res) => {
        if (!res.ok) throw Error("Could Not Fetch Data from Resource");
        return res.json();
      });
    }
  }
  
  export default Service;
  