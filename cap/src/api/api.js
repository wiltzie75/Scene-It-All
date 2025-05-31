
const API = '/api';  // Always use relative path since everything runs on same service
console.log('API URL:', API, 'NODE_ENV:', process.env.NODE_ENV);
export default API;

// const API = process.env.NODE_ENV === 'production'    
//   ? '/api'  // Use relative path in production   
//   : 'http://localhost:3000/api';  // Use localhost in development  

// console.log('API URL:', API, 'NODE_ENV:', process.env.NODE_ENV); // Add for debugging

// export default API;