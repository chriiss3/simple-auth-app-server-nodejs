import Mailgun from "mailgun.js";
import formData from "form-data";
import { MAILGUN_API_KEY, MAILGUN_USERNAME } from "./env";

const mailgun = new Mailgun(formData);

const mg = mailgun.client({ username: MAILGUN_USERNAME, key: MAILGUN_API_KEY });

export default mg;
