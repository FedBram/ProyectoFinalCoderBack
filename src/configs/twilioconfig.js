import twilio from 'twilio';

import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_TOKEN

const client = twilio(accountSid, authToken)

export default client