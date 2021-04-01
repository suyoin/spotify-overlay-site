export default function Index() {
	return (
		<div
			style={{
				display: "grid",
				placeItems: "center",
				width: "100%",
				height: "100%",
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
