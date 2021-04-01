import { setCookie, clearCookie } from "../../util/cookies";
import querystring from "querystring";
import { NextApiResponse, NextApiRequest } from "next";
import { AUTHORIZE_URL, REDIRECT_URI, SCOPE } from "../../constant";

const { CLIENT_ID } = process.env;

const POSSIBLE_CHARACTERS =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const generateRandomString = (length: number) => {
	let text = "";

	for (let i = 0; i < length; i++) {
		text += POSSIBLE_CHARACTERS.charAt(
			Math.floor(Math.random() * POSSIBLE_CHARACTERS.length)
		);
	}
	return text;
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
	const state = generateRandomString(16);

	res.statusCode = 200;
	setCookie(res, "spotify_auth_state", state, {
		path: "/",
		encode: (value) => value,
	});
	res.redirect(
		AUTHORIZE_URL +
			"?" +
			querystring.stringify({
				response_type: "code",
				client_id: CLIENT_ID,
				redirect_uri: REDIRECT_URI,
				state: state,
				scope: SCOPE,
			})
	);
};

export default handler;
