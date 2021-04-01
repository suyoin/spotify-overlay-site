import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "../../util/getAccessToken";

const getPlaying = async (access_token: string) => {
	try {
		const response = await axios({
			method: "GET",
			url: "https://api.spotify.com/v1/me/player/currently-playing",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`,
			},
		});

		return response;
	} catch (err) {
		console.error(err);
	}
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	return new Promise((resolve, reject) => {
		const { refresh_token, currently_playing_id } = req.query;

		getAccessToken(refresh_token as string)
			.then((access_token) => {
				if (!access_token) {
					res.status(405);
					res.send("No access token");
					return resolve(access_token);
				}

				getPlaying(access_token).then((playing) => {
					if (playing) {
						res.status(200);

						if (currently_playing_id === playing.data?.item?.id) {
							res.send({
						    		same_track: true,
						    		progress_ms: playing.data.progress_ms,
						    	});
						} else {
							res.send(playing.data);
						}

						return resolve(playing.data);
					} else {
						res.status(405);
						res.send("No playing");
						return resolve("No playing");
					}
				});
			})
			.catch((err) => {
				res.json(err);
				res.status(405).end();
			});
	});
};
