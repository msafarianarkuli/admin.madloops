import http from '../Interceptor/Interceptor';
const MainURL = process.env.REACT_APP_PUBLIC_API_URL;

export const AddArticle = async (articleData) => {
  const result = await http.post(`${MainURL}news`, articleData);

  return result.data;
};
