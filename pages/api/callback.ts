import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (!req.query.code) {
		return;
	}

	res.status(200);

	console.log("Hello")
	const axiosResponse = axios({
		method: "POST",
		url: "https://accounts.spotify.com/api/token",
		params: {
			code: req.query.code,
			redirect_uri: "https://spotify-overlay-site.vercel.app",
			grant_type: "authorization_code",
		},
		headers: {
			Authorization: `Basic ${Buffer.from(
				SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
			).toString("base64")}`,
			"Content-Type": "application/x-www-form-urlencoded"
		},
	})
	axiosResponse.catch((err) => {console.error(err)})

	const response = await axiosResponse;

	res.send(response.data.refresh_token);
};
