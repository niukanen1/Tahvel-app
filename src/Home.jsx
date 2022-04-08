import React from "react";

import { useState, useEffect } from "react";
function Home() {
	const [username, setUsername] = useState("");
	const [showPass, setShowPass] = useState(false);
	const [code, setCode] = useState("");
	const [isRunning, setIsRunning] = useState(false);
	const [nonRunError, setNonRunError] = useState("");
	const [error, setRunningError] = useState("");
	const [isAddingUser, setIsAddingUser] = useState(false);
	function handleCodeInput(e) {
		if (
			(e.target.value.match(/^[0-9]+$/) != null || e.target.value == "") &&
			e.target.value.length <= 11
		) {
			setCode(e.target.value);
		}
		// console.log(code == "" || username == "");
	}
	function handleUserNameInput(e) {
		setUsername(e.target.value);
	}
	async function handleUserAdding() {
		setIsAddingUser(false);
		if (code == "" || username == "") {
			setShowPass(true);
			handleNonRunningError("all fields required");
			handleUserReset();
			return;
		} else {
			setShowPass(false);
		}
		try {
			window.electronAPI.storeUser({ name: username, code: code });
		} catch (err) {
			// console.log(err);
		}
	}
	function removeErrors() {
		closeBrowser();
	}
	async function handleOpenTahvel(e) {
		e.preventDefault();
		if (code != "" || username != "") {
			if (code.length == 11) {
				try {
					// console.log({name: username, code: code});
					const res = await window.electronAPI.openTahvel(code);
					// console.log("result");
					// console.log(res);
				} catch (error) {
					// console.log("ERR " + error);
				}
				// console.log("running");
				setIsRunning(true);
			} else {
				handleNonRunningError("Your personal code should contain 11 digits");
			}
		} else {
			handleNonRunningError("Click 'Add User' and fill in all the fields");
		}
	}
	async function getUserData() {
		try {
			const userData = await window.electronAPI.getUser();
			if (userData.code.trim() != "" || userData.name.trim() != "") {
				setShowPass(false);
			}
			setUsername(userData.name);
			setCode(userData.code);
		} catch (err) {
			// console.log(err);
		}
	}
	async function closeBrowser() {
		// console.log("CloseBrowser");
		setRunningError("");
		setIsRunning(false);
		try {
			await window.electronAPI.closeBrowser("close");
		} catch {}
	}
	function handleNonRunningError(err) {
		if (err) {
			setNonRunError(err);
			setTimeout(() => {
				setNonRunError("");
			}, 5000);
		}
	}
	function handleRunningError(error) {
		if (error !== "") {
			setRunningError(error);
		} else {
			setRunningError("");
		}
	}
	useEffect(() => {
		if (code == "" || username == "") {
			setShowPass(true);
		} else {
			setShowPass(false);
		}
		getUserData();

		try {
			ipcRenderer.on("getUser", (event, arg) => {
				// console.log(arg);
			});
		} catch (err) {
			// console.log(err);
		}
	}, [isRunning]);
	useEffect(() => {
		getUserData();
		if (code.trim() != "" || username.trim() != "") {
			setShowPass(false);
		}
	}, []);
	useEffect(() => {
		try {
			// ipcRenderer.on("getUser", (event, arg) => {
			//     // console.log("GETING");
			// 	setUsername(arg.name);
			// 	setCode(arg.code);
			// });
			// ipcRenderer.on("Finished", (event, arg) => {
			// 	if (arg) {
			// 		setIsRunning(false);
			// 	}
			// });
			// ipcRenderer.on("error", (event, arg) => {
			// 	handleRunningError(arg);
			// });
		} catch (err) {
			// console.log("IPCRENDERER ERROR");
		}
		// console.log(username);
		// console.log(code);
	});
	function handleUserReset() {
		setUsername("");
		setCode("");
		setIsAddingUser(false);
		window.electronAPI.resetStore();
		setShowPass(true);
	}
	function addUser() {
		setIsAddingUser(true);
	}

	async function test() {
		setInterval(async () => {
			try {
				console.log(await window.electronAPI.progress());
			} catch {}
		}, 100);
	}
	return (
		<>
			<div className='header'>
				<h1>Tahvel</h1>
				<div>
					<button onClick={test}>Test</button>
					{code == "" || username == "" ? (
						<></>
					) : (
						<>
							<h3>Current User: {username}</h3>
						</>
					)}
					<button className='edit-btn' onClick={addUser}>
						{username == "" || code == "" ? "Add User" : "Edit User"}
					</button>
				</div>
			</div>

			<button onClick={handleOpenTahvel}>Open tahvel</button>
			{nonRunError == "" ? <></> : <p>Error: {nonRunError}</p>}

			{isAddingUser ? (
				<>
					<div className='shadow'></div>
					<div className='modal'>
						<div
							onClick={() => {
								setIsAddingUser(false);
							}}
							className='close-btn'>
							&#215;
						</div>
						<input
							type='text'
							name='username'
							value={username}
							onInput={handleUserNameInput}
							disabled={!showPass}
							// { showPass == true ? "enabled" : "disabled" }
						/>
						<input
							disabled={!showPass}
							placeholder='Personal Code'
							type={showPass ? "text " : "password"}
							onInput={handleCodeInput}
							value={code}
							minLength={11}
							maxLength={11}
						/>
						<div className='buttons'>
							<button onClick={handleUserAdding}>Save</button>
							<button onClick={handleUserReset}>Reset</button>
						</div>
					</div>
				</>
			) : (
				<></>
			)}

			{!isRunning ? (
				<></>
			) : (
				<div>
					<h3>Status</h3>

					{error == "" ? (
						<></>
					) : (
						<div className='error'>
							<h4>ERROR: {error}</h4>
							<button onClick={removeErrors}>Got it</button>
						</div>
					)}
					<button onClick={closeBrowser}>Cancel</button>
					<div>
						<div className='loader'></div>
					</div>
				</div>
			)}
		</>
	);
}

export { Home };
