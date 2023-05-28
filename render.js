const setButton = document.getElementById("btnT");
const titleInput = document.getElementById("info");
setButton.addEventListener("click", () => {
	const title = titleInput.innerText;
	window.electronAPI.setTitle(title);
});
const btn = document.getElementById("btn");
const filePathElement = document.getElementById("filePath");
btn.addEventListener("click", async () => {
	const filePath = await window.electronAPI.openFile();
	filePathElement.innerText = filePath;
});
