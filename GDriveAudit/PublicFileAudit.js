//Audits all public files on Google Drive with specified folder
function getPublicFiles() {
  //Choose search folder
  //var files = DriveApp.searchFiles('visibility = "anyoneWithLink" or visibility = "anyoneCanFind"');
  var searchFolder = DriveApp.getFolderById("<Search Folder>");
  var searchFolders = searchFolder.getFolders();

  //Get current user email
  var currentUser = Session.getActiveUser().getEmail();
  
  //Search through folders and files
  while (searchFolders.hasNext()) {
    var folder = searchFolders.next();
    var files = folder.searchFiles('visibility = "limited"');
    while (files.hasNext()) {
      var file = files.next();

    //Log each file and permissions into html document
      try {
        var fileOwner = file.getOwner().getEmail();
      } catch(e) {
        Logger.log('Error retrieving file owner email address for file ' + file.getName() + ' with the error: ' + e.message);
      }
      
      if (fileOwner === currentUser) {
        try {
          var access = file.getSharingAccess(); 
        } catch(e) {
          Logger.log('Error retrieving access permissions for file ' + file.getName() + ' with the error: ' + e.message);
        }
          
        try {
          var permission = file.getSharingPermission();
        } catch(e) {
          Logger.log('Error retrieving sharing permissions for file ' + file.getName() + ' with the error: ' + e.message);
        }
        
        var url = file.getUrl();
        var html = HtmlService.createHtmlOutput('Google Drive document <a href="' + url + '"> ' + file.getName() 
          + '</a> is public and ' + access + ' can ' + permission + ' the document<br/>');
        Logger.log(html.getContent()); 
      }
    }
  }
  // get body of email and send email to current user
  var body = Logger.getLog();
  MailApp.sendEmail({
    to: currentUser,
    subject: 'Your public Google Drive files',
    htmlBody: body
  });
}