//Copies all files and folders owned by original owner within domain to same folder 

var currentUser = Session.getActiveUser().getEmail();
var origOwner = '<original domain owner email>'

function start() { 
  //get parent folders to copy from
  var parentFolder = '<parent folder ID-';
  var parent = DriveApp.getFolderById(parentFolder);
  copyFolder(parent);
  //sendEmail();
}
function copyFolder(parent){
  copyFiles(parent); // Copy all files from new parent folder
  var folders = parent.getFolders();
  while (folders.hasNext()) {
    var subFolder = folders.next();
    var folderName = subFolder.getName();
    //If the folder wasn't owned by user, creates new folder owned by user and sets old folder to be deleted
    if (subFolder.getOwner().getEmail() == 'origOwner') {var newFolder = parent.createFolder(folderName);
      Logger.log(folderName + ' has been copied')
      moveFiles(subFolder, newFolder);
      subFolder.setName(folderName + '_delete');
      copyFolder(newFolder);
      }
    //repeat function with new subfolder as parent
    else {copyFolder(subFolder);}
  }
}

function moveFiles(folder, newFolder) {
  //move all folders and files to new folder
  var files = folder.getFiles();
  var folders = folder.getFolders();
  while (files.hasNext()) {
    var subfile = files.next();
    subfile.moveTo(newFolder);
    }
  while (folders.hasNext()) {
    var subFolder = folders.next();
    subFolder.moveTo(newFolder);
  }
}
//Copies files from parent folder to new folder. This does not delete or let the user know to delete old file as it may still be in use
function copyFiles(parent) {
  var files = parent.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    if (file.getOwner().getEmail() == 'origOwner') {file.makeCopy(file.getName(), parent);
    Logger.log(file.getName() + ' has been copied');
    }
  }
}
//inform user of which files were copied
function sendEmail() {
  var body = Logger.getLog();
  MailApp.sendEmail({
    to: currentUser,
    subject: 'Folders to transfer ownership',
    htmlBody: body
  });
}