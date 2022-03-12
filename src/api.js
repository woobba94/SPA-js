const END_POINT = 'http://localhost:4000/product';

export const request = async (url, options = {}) => {
  try {
    const fullUrl = END_POINT + url;
    const response = await fetch(fullUrl, options);

    if (response.ok) {
      return await response.json();
    }
    throw new Error('api 통신 실패');
  } catch (e) {
    alert(e.message);
  }
};
