function startCopy(sourceFolder, targetFolder) {
  var sourceFolder = '<Source Folder ID>';
  var targetFolder = '<Target Folder ID';

  var source = DriveApp.getFolderById(sourceFolder);
  var target = DriveApp.getFolderById(targetFolder);
  var name = source.getName();
  var targetFolder = target.createFolder(name);
  copyFolder(source, targetFolder);
}
function copyFolder(source, target) {
  
  var folders = source.getFolders();
  var files = source.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    var newFile = file.makeCopy(file.getName(), target);
  }

while (folders.hasNext()) {
    var subFolder = folders.next();
    var folderName = subFolder.getName();
    var targetFolder = target.createFolder(folderName);
    copyFolder(subFolder, targetFolder);
    Logger.log(folderName);
  }
}
function doGet()
{
  var html = HtmlService.createHtmlOutputFromFile('PersonalFileCopy');
  return html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)

}
