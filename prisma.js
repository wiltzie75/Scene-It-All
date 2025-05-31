// prisma.js - Create this file in your root directory (same level as server.js)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;