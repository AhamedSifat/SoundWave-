import axios from 'axios';

const useAxios = axios.create({
  baseURL: 'http://localhost:4000/api', // Replace with your API base URL
});

export default useAxios;
