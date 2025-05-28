// // import axios from "axios";

// const API = "http://localhost:3000/api";

// export default API;

const API = process.env.NODE_ENV === 'production' 
  ? '/api'  // Use relative path in production
  : 'http://localhost:3000/api';  // Use localhost in development

export default API;