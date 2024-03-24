// /util/fetchWrapper.js
const fetchWrapper = {
  post,
  get,
  put,
  del,
};

async function post(url, body, token) {
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Token: token,
		},
		body: JSON.stringify(body),
	};
	return await fetch(url, requestOptions);
}

async function put(url, body, token) {
	const requestOptions = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Token: token,
		},
		body: JSON.stringify(body),
	};
	return await fetch(url, requestOptions);
}

async function get(url, token) {
	const requestOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Token: token,
		},
	};
	return await fetch(url, requestOptions);
}

async function del(url, body = null, token) {
  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Token: token,
    },
    body: JSON.stringify(body), // Only for bulk delete
  };

  // If no incoming body, then remove body from options
  if (!body) delete requestOptions.body;

  return await fetch(url, requestOptions);
}

export default fetchWrapper;
