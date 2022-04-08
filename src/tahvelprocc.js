const ipcRenderer = require("electron").ipcRenderer;

async function RunTahvel(code) {
    console.log("COde")
    console.log(code)
	const PCR = require("puppeteer-chromium-resolver");
	const option = {
		revision: "",
		detectionPath: "",
		folderName: ".chromium-browser-snapshots",
		defaultHosts: [
			"https://storage.googleapis.com",
			"https://npm.taobao.org/mirrors",
		],
		hosts: [],
		cacheRevisions: 2,
		retry: 3,
		silent: false,
	};
	const stats = await PCR(option);
	const browser = await stats.puppeteer
		.launch({
			headless: false,
			// args: ["--no-sandbox"],
			executablePath: stats.executablePath,
		})
		.catch(function (error) {
			console.log(error);
		});

	// const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	let progress = 0;
   
	await global.share.ipcMain.on("closeBrowser", async (event, arg) => {
		console.log("BROWSERCLOSE");
		await browser.close();
	});
    const percentage = { 
        value: 0,
    }
    await global.share.ipcMain.handle("progress", (event, arg) => { 
        console.log("HERE I AM")
        return (percentage.value);
    })

	const checkIfVisible = async (element) => {
		return await page.evaluate((elem) => {
			// console.log("ELEMENT")
			// console.log(elem)
			return false;
		}, element[0]);
	};

	const press = async (xpath) => {
		await page.waitForXPath(xpath);
		const el = await page.$x(xpath);
		// console.log("PROPERTY");
		// console.log(await (await el[0].getProperty("innerText")).jsonValue());
		// console.log(xpath);
		await el[0].click();
	};
	const progressSend = (percentage) => {
		try {
			window.electronAPI.progress(percentage)
		} catch {}
	};
	const input = async (selector) => {
		await page.waitForSelector(selector);
		await page.focus(selector);
		await page.keyboard.type(code);
	};
	const screenshot = async (selector) => {
		await page.waitForSelector(selector);
		const el = await page.$(selector);
		await el.screenshot({ path: "dairy.png" });
	};
	const redirect = async (url) => {
		try {
			await page.goto(url, {
				waitUntil: "load",
				timeout: 0,
			});
			await page.goto(url).catch((err) => {
				console.log("THIS IS ERROR: " + err);
			});
		} catch (err) {
            return "something went wrong"
        }
	};
	const get = async (xpath) => {
		try {
			await page.waitForXPath(xpath);
		} catch (err) {
			console.log("returning timeout");
			return "timeout";
		}
	};
	const basicsToTahvelLogin = {
		loginUpRight: "/html/body/div/md-toolbar/div[2]/div[2]/div/button",
		taraSmartID:
			"/html/body/div[3]/md-dialog/md-dialog-content/div/div/div/div[1]/button[2]",
		GOTO_logiSisse: "https://tahvel.edu.ee/hois_back/taraLogin",
		smartIdOption: "/html/body/div/div/div[3]/div[2]/nav/ul/li[3]/a",
		INPUT_code: "#sid-personal-code",
		Jatka:
			"/html/body/div/div/div[3]/div[2]/main/div[3]/div/div[1]/div[2]/form/table/tbody/tr[2]/td[2]/button",
		GET_smartIDcode:
			"/html/body/div/div/div[3]/div/div[2]/div/div/div[1]/div[2]/form/p[2]",
		// GOTO_WAIT_tunniplan: "https://tahvel.edu.ee/#/timetable/personalGeneralTimetable?_menu",
		// SCREENSHOT_dairy: '#vTimetable > div > div.layout-column.flex',
	};
    // browser.process.once('close', () => { 
    //     console.log("sloed");
    // })
    // browser.on('disconnected', () => { 
    //     global.share.win.webContents.send("browserWasClosed")
    //     console.log("disconnected");
    //     return "closed";
    // })
    percentage.value = 5;
	await page.goto("https://tahvel.edu.ee/");
    percentage.value = 10;
	// window.ipcRenderer.send("test", "HELLO");
	await redirect("https://tahvel.edu.ee/hois_back/taraLogin");
    percentage.value = 20;
	await press("/html/body/div/div/div[3]/div[2]/nav/ul/li[3]/a/span");
    percentage.value = 50;
	await input("#sid-personal-code");

	await press(
		"/html/body/div/div/div[3]/div[2]/main/div[3]/div/div[1]/div[2]/form/table/tbody/tr[2]/td[2]/button"
	);
	await page.waitForXPath(
		"/html/body/div/div/div[3]/div/div[2]/div/div/div[1]/div[2]/form/p[2]"
	);
	// const [el] = await page.$x("/html/body/div/div/div[3]/div/div[2]/div/div/div[1]/div[2]/form/p[2]");

	// console.log(el);
	// for (const [key, value] of Object.entries(basicsToTahvelLogin)) {
	// 	if (key.includes("INPUT")) {
	// 		// personal code
	// 		await input(value, code);
	// 	} else if (key.includes("SCREENSHOT")) {
	// 		console.log("screen");
	// 		await screenshot(value);
	// 	} else if (key.includes("GOTO") && key.includes("WAIT")) {
	// 		console.log("wait go");
	// 		page.waitForXPath("/html/body/div/md-toolbar/div[2]").then(() => {
	// 			console.log("redirecting");
	// 			redirect(value);
	// 		});
	// 	} else if (key.includes("GOTO")) {
	// 		console.log("goto");
	// 		await redirect(value);
	// 	} else if (key.includes("GET")) {
	// 		try {
	// 			await page.waitForXPath(
	// 				"/html/body/div/div/div[3]/div/div[2]/div/div/div[1]/div[2]/form/p[2]"
	// 			).catch()
	// 			const [el] = await page
	// 				.$x(
	// 					"/html/body/div/div/div[3]/div/div[2]/div/div/div[1]/div[2]/form/p[2]"
	// 				)
	// 				.catch((err) => {
	// 					console.log("THITS" + err);
	// 				});
	// 			console.log(el.getProperty("textContent"));
	// 		} catch (err) {
	//             console.log("ANOTHER " + err)
	//         }

	// 		// await page.waitForXPath(
	// 		// 	"/html/body/div/div/div[3]/div[2]/main/div[3]/div/div[1]/div[2]/form/table/tbody/tr[1]/td[2]/div[3]"
	// 		// );
	// 		console.log("HEEEEE");
	// 		// console.log(await (await errorElement.getProperty("style")));
	// 		if ((await get(value)) == "timeout") {
	// 			await global.share.ipcMain.send("Finished", true);
	// 			return "timeout";
	// 		}
	// 	} else {
	// 		// console.log(key);
	// 		await press(value);
	// 	}

	// 	// if (await checkIfVisible(errorElement)) {
	// 	//     console.log("ERROR is defined");
	// 	//     console.log(errorElement);
	// 	//     return "invalidCode"
	// 	// }
	// }
	console.log("finishing");
	console.log("finishing 1");
	// await browser.close()
}

module.exports = { 
    RunTahvel
}
