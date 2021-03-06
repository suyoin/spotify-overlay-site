import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { REDIRECT_URI } from "../../constant";

const { CLIENT_ID, CLIENT_SECRET } = process.env;

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (!req.query.code) {
		return;
	}

	res.status(200);

	const response = await axios({
		method: "POST",
		url: "https://accounts.spotify.com/api/token",
		params: {
			code: req.query.code,
			redirect_uri: REDIRECT_URI,
			grant_type: "authorization_code",
		},
		headers: {
			Authorization: `Basic ${Buffer.from(
				CLIENT_ID + ":" + CLIENT_SECRET
			).toString("base64")}`,
		},
	});

	res.send(response.data.refresh_token);
};
