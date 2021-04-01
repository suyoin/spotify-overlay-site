import cookie from "cookie";

export default function parseCookies(req) {
	return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

export const deleteAuthCookies = () => {
	document.cookie =
		"refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
	document.cookie =
		"spotify_auth_state=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};
