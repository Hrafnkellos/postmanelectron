// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// In renderer process (web page).
const {ipcRenderer} = require('electron');
const IDBExportImport = require("indexeddb-export-import");
const Dexie = require("Dexie");

const db = new Dexie("postman-app");

console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
});

ipcRenderer.send('asynchronous-message', 'ping');

// db.version(1).stores({
// 	things : "id++, thing_name, thing_description",
// });
db.open().then(() => {
	const idb_db = db.backendDB(); // get native IDBDatabase object from Dexie wrapper

	// export to JSON
	IDBExportImport.exportToJsonString(idb_db, (err, jsonString) => {
		if(err)
			console.error(err);
		else {
			console.log(JSON.parse(jsonString));
			ipcRenderer.send('postmandump', jsonString);
		}
	});
})
.catch((e) => {
        console.error("Could not connect. " + e);
});