const btn = document.getElementById("btn");
const filePathElement = document.getElementById("filePath");
btn.addEventListener("click", async () => {
	const filePath = await window.electronAPI.openFile();
	if (!filePath) return;
	filePathElement.innerText = filePath;
});

const btnC = document.getElementById("btn3");
const div = document.getElementById("comp");
btnC.addEventListener("click", async () => {
	const data = await window.electronAPI.openCompt();
	if (!data) return;
	div.innerHTML = data;
});
