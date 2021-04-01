export default function Index() {
	return (
		<div
			style={{
				display: "grid",
				placeItems: "center",
				width: "100vw",
				height: "100vh",

				padding: "0px",
				margin: "0px",
			}}
		>
			<a
				href="/api/weblogin"
				style={{
					fontSize: "1rem",
					fontWeight: 700,
					color: "rgba(255,255,255,1)",
				}}
			>
				login
			</a>
		</div>
	);
}
