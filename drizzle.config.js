/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://ai-interview-mocker_owner:tL7cPVwMl0fn@ep-lingering-thunder-a5vx7dk6.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require',
    }
};