function writeLog(data) {
    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dirEntry) {
        console.log('file system open: ' + dirEntry.name);
        var isAppend = true;
        createFile(dirEntry, "evnotify_debug_log.txt", isAppend, data);
    }, function(err) {
        console.log('Error on resolve filesystem', err);
    });
}

function createFile(dirEntry, fileName, isAppend, data) {
    // Creates a new file or returns the file if it already exists.
    dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {

        writeFile(fileEntry, data, isAppend);

    }, function(err) {
        console.log('Error on create file', err);
    });

}

function readFile(fileEntry) {

    fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function() {
            console.log("Successful file read: " + this.result);
            console.log('Path to file', fileEntry.fullPath);
        };

        reader.readAsText(file);

    }, function(err) {
        console.log('Error on read file', err);
    });
}

function writeFile(fileEntry, dataObj, isAppend) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file read...");
            readFile(fileEntry);
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file read: " + e.toString());
        };

        // If we are appending data to file, go to the end of the file.
        if (isAppend) {
            try {
                fileWriter.seek(fileWriter.length);
            }
            catch (e) {
                console.log("file doesn't exist!");
            }
        }
        fileWriter.write(dataObj);
    });
}
