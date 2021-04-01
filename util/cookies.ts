import { serialize, CookieSerializeOptions } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export const setCookie = (
	res: NextApiResponse,
	name: string,
	value: unknown,
	options: CookieSerializeOptions = {}
) => {
	const stringValue =
		typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

	if ("maxAge" in options) {
		options.expires = new Date(Date.now() + options.maxAge);
		options.maxAge /= 1000;
	}

	res.setHeader("Set-Cookie", serialize(name, String(stringValue), options));
};

export const clearCookie = (
	res: NextApiResponse,
	name: string,
	options: any = {}
) => {
	setCookie(res, name, "", { ...options, maxAge: -1 });
};
