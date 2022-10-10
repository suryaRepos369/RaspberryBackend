require("dotenv").config();

console.log("The value for JWT is:", process.env.JWT_STR);
process.env.USER_ID; // "239482"
console.log("process.env.USER_ID:", process.env.USER_ID);
process.env.USER_KEY; // "foobar"
