import { useEffect, useRef, useState } from "react";
import Router from "next/router";
import parseCookies, { deleteAuthCookies } from "../util/parseWebCookies";
import { getCurrentlyPlaying } from "../util/spotifyOAuth2";
import Image from "../components/Image";

export default function Overlay({ refresh_token }) {
	const [
		currentlyPlaying,
		setCurrentlyPlaying,
	] = useState<SpotifyCurrentlyPlayingTrack>();

	const intervalHandle = useRef<NodeJS.Timeout>();

	useEffect(() => {
		if (intervalHandle.current) {
			clearInterval(intervalHandle.current);
			intervalHandle.current = null;
		}

		console.log("Starting fetch interval");
		let secondsElapsed = 4;
		const effect = () => {
			secondsElapsed += 1;

			if (secondsElapsed >= 4) {
				secondsElapsed = 0;
				getCurrentlyPlaying(refresh_token, currentlyPlaying?.item?.id)
					.then((response) => {
						switch (response.response_type) {
							case "new": {
								setCurrentlyPlaying(response);
								break;
							}
							case "same_track": {
								setCurrentlyPlaying({
									...currentlyPlaying,
									progress_ms: response.progress_ms,
								});
								break;
							}
						}
					})
					.catch(() => {
						deleteAuthCookies();
						Router.push("/");
					});
			} else if (currentlyPlaying !== undefined) {
				setCurrentlyPlaying({
					...currentlyPlaying,
					progress_ms: currentlyPlaying.progress_ms + 1000,
				});
			}
		};

		intervalHandle.current = setInterval(effect, 1000);

		effect();

		return () => {
			if (intervalHandle.current) {
				clearInterval(intervalHandle.current);
				intervalHandle.current = null;
			}
		};
	}, []);

	if (!currentlyPlaying) {
		return <div />;
	}

	return (
		<div
			style={{
				position: "absolute",
				left: "0.5rem",
				bottom: "0.5rem",

				width: "20rem",
				height: "6rem",
				borderRadius: ".375rem",
				overflow: "hidden",
				overflowX: "hidden",
				overflowY: "hidden",
			}}
		>
			<Image
				src={currentlyPlaying?.item?.album?.images[0]?.url || ""}
				containerStyle={{
					width: "100vw",
					height: "100vh",
				}}
				imageClass={
					currentlyPlaying?.is_playing ? `normal-img` : `grayscale-img`
				}
				imageStyle={{
					position: "absolute",
					height: "100%",
					width: "100%",
					objectFit: "cover",
				}}
			/>
			<div
				style={{
					position: "absolute",
					left: 0,
					top: 0,
					display: "flex",
					justifyContent: "flex-start",
					alignItems: "center",

					width: "100%",
					height: "100%",

					overflow: "hidden",

					boxSizing: "border-box",

					backgroundImage:
						"linear-gradient(to right, rgba(25,25,25,1), rgba(25,25,25,0.7) 50%, transparent, rgba(25,25,25,0))",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",

						boxSizing: "border-box",
						paddingBottom: ".25rem",
						marginLeft: "1rem",
					}}
				>
					<p
						style={{
							marginBottom: "-1rem",

							backgroundSize: "100%",
							WebkitTextFillColor: "transparent",
							WebkitFontSmoothing: "antialiased",
							WebkitBackgroundClip: "text",

							backgroundImage:
								"linear-gradient(90deg,#fff 10rem,transparent 11rem)",

							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							color: "rgba(255,255,255,1)",

							lineHeight: "1.75rem",
							fontSize: "1.125rem",
							fontWeight: 800,

							boxSizing: "border-box",
						}}
					>
						{currentlyPlaying?.item?.name}
					</p>
					<p
						style={{
							marginTop: "-rem",

							backgroundSize: "100%",
							WebkitTextFillColor: "transparent",
							WebkitFontSmoothing: "antialiased",
							WebkitBackgroundClip: "text",

							backgroundImage:
								"linear-gradient(90deg, #fff 10rem, transparent 11rem)",

							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							color: "rgba(255,255,255,1)",

							lineHeight: "1.5rem",
							fontSize: "1rem",
							fontWeight: 700,
						}}
					>
						{currentlyPlaying?.item
							? currentlyPlaying.item.artists.map((v) => v.name).join(", ")
							: ""}
					</p>
				</div>
				<div style={{
						position: "absolute",
						width: `${(currentlyPlaying?.progress_ms || 0)/(currentlyPlaying?.item?.duration_ms || 1)}%`,
						height: "0.4rem",
						bottom: 0,

						backgroundColor: "rgba(98,205,98,1)",
					}}
				/>
			</div>
		</div>
	);
}

Overlay.getInitialProps = ({ req }) => {
	const { refresh_token } = parseCookies(req);

	return {
		refresh_token: refresh_token,
	};
};
