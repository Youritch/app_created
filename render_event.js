window.electronAPI.addEventListener("load", async (event) => {
	console.log("Loaded !");
	window.electronAPI.addEventListener(
		"load-page",
		async (event, data) => {
			//document.getElementsByTagName("body")[0].innerHTML = "";
			console.log("Loaded comp :");
			for (const l in data) {
				console.log("----\n" + data[l] + "\n----");
				let e = document.createElement("div");
				e.innerHTML = data[l];
				document.getElementsByTagName("body")[0].appendChild(e);
			}
		},
		true
	);
	window.electronAPI.load();
});
function popup(type, title, message) {
	let color = {
		error: "red",
		info: "green",
		warn: "orange",
	};
	let popup = document.createElement("div"),
		ti = document.createElement("h2"),
		msg = document.createElement("p");
	popup.setAttribute("class", "popup");
	popup.setAttribute("id", title);
	popup.style.backgroundColor = color[type];
	popup.style.borderRadius = "30px";
	popup.style.textAlign = "center";
	popup.style.width = "60%";
	popup.style.height = "20%";
	ti.innerHTML = title;
	msg.innerHTML = message;
	popup.appendChild(ti);
	popup.appendChild(msg);
	document.getElementById("popup-zone").appendChild(popup);
	const t = setTimeout(() => {
		document.getElementById(title).remove();
		popup.removeEventListener("click", (event) => {
			document.getElementById(title).remove();
		});
	}, 5000);
	popup.addEventListener("click", (event) => {
		document.getElementById(title).remove();
		clearTimeout(t);
	});
}
window.electronAPI.addEventListener("popup", async (event, { type, title, message }) => {
	popup(type, title, message);
});
document.addEventListener("DOMContentLoaded", () => {
	console.log("It's here where all begin !");
	window.electronAPI.emit("load");
});
