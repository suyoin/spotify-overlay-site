import axios from "axios";
import querystring from "querystring";

const { CLIENT_ID, CLIENT_SECRET } = process.env;

export const getAccessToken = async (refresh_token: string) => {
	try {
		const response = await axios({
			method: "post",
			url: "https://accounts.spotify.com/api/token",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Basic ${Buffer.from(
					CLIENT_ID + ":" + CLIENT_SECRET
				).toString("base64")}`,
			},
			data: querystring.stringify({
				grant_type: "refresh_token",
				refresh_token: refresh_token,
			}),
		});

		return response.data.access_token;
	} catch (err) {
		console.error(err);
	}
};
