import { setCookie, clearCookie } from "../../util/cookies";
import querystring from "querystring";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const code = req.query.code || null;
	const state = req.query.state || null;
	const storedState = req.cookies ? req.cookies["spotify_auth_state"] : null;

	res.statusCode = 200;
	if (state === null || state !== storedState) {
		res.redirect(
			"/#" +
				querystring.stringify({
					error: "state_mismatch",
				})
		);
	} else {
		clearCookie(res, "spotify_auth_state", { path: "/" });

		const response = await axios({
			method: "POST",
			url: "/api/callback",
			params: {
				code,
			},
		});

		if (response.status === 200) {
			const refresh_token = response.data;

			setCookie(res, "refresh_token", refresh_token, {
				maxAge: 604800000,
				httpOnly: false,
				path: "/",
			});

			res.redirect("/");
		} else {
			res.redirect("/#" + querystring.stringify({ error: "invalid_token" }));
		}
	}
};

export default handler;
