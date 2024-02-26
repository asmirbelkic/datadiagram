<main>

	<div class="container">
			<h1>✨ Create your account</h1>
			<p>If you already have an account, you will be signed in automatically.</p>
			<button class="action" style="margin-top: 8px;">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<g clip-path="url(#clip0_441_37)">
							<path d="M15.04 8.16601C15.04 7.64602 14.9934 7.14602 14.9066 6.66602H8V9.50601H11.9466C11.7734 10.4194 11.2534 11.1926 10.4734 11.7126V13.5594H12.8534C14.24 12.2794 15.04 10.3994 15.04 8.16601Z" fill="#161616"/>
							<path d="M7.99979 15.3338C9.97976 15.3338 11.6398 14.6804 12.8531 13.5604L10.4731 11.7138C9.81976 12.1538 8.98648 12.4204 7.99979 12.4204C6.09312 12.4204 4.47312 11.1338 3.89312 9.40039H1.45312V11.2938C2.65979 13.687 5.13312 15.3338 7.99979 15.3338Z" fill="#161616"/>
							<path d="M3.89464 9.39289C3.74797 8.95289 3.6613 8.48625 3.6613 7.99955C3.6613 7.51289 3.74797 7.04623 3.89464 6.60623V4.71289H1.45464C0.954638 5.69955 0.667969 6.81289 0.667969 7.99955C0.667969 9.18625 0.954638 10.2995 1.45464 11.2862L3.35464 9.80625L3.89464 9.39289Z" fill="#161616"/>
							<path d="M7.99979 3.58602C9.07976 3.58602 10.0398 3.95935 10.8065 4.67935L12.9065 2.57935C11.6331 1.39268 9.97976 0.666016 7.99979 0.666016C5.13312 0.666016 2.65979 2.31268 1.45312 4.71268L3.89312 6.60602C4.47312 4.87268 6.09312 3.58602 7.99979 3.58602Z" fill="#161616"/>
							</g>
							<defs>
							<clipPath id="clip0_441_37">
							<rect width="16" height="16" fill="white"/>
							</clipPath>
							</defs>
					</svg>
					Continue with Google
			</button>
	</div>
</main>

<style>
	main {
		display: grid;
		place-content: center;
		width: 100%;
		height: 100%;
		background-image: radial-gradient(#363841 1px, transparent 0);
		background-size: 15px 15px;
		background-position: 11px 11px;
	}

	div.container {
			display: flex;
			flex-direction: column;
			gap: 8px;

			box-sizing: content-box;
			width: 333px;
			height: fit-content;

			padding: 24px;
			border-radius: 12px;

			z-index: 100;
	}

	h1, p {
			width: 100%;
			height: fit-content;

			word-wrap: break-word;
	}

	h1 {
			font-family: 'Inter';
			font-style: normal;
			font-weight: 700;
			font-size: 14px;
			line-height: 17px;

			color: #EDEDED;
	}

	p {
			font-family: 'Inter';
			font-style: normal;
			font-weight: 400;
			font-size: 14px;
			line-height: 17px;

			color: #A0A0A0;
	}

	button.action {
			width: 100%;
			height: 48px;

			background: #EDEDED;
			border-radius: 12px;

			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			padding: 10px;
			gap: 6px;

			font-family: 'Inter';
			font-style: normal;
			font-weight: 600;
			font-size: 14px;
			line-height: 17px;

			color: #161616;

			outline: none;
			border: none;
			cursor: pointer;
			transition: transform 0.1s ease-in-out;
	}
</style>