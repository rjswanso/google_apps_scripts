function onFormOpen(e) {
  var spreadSheet = SpreadsheetApp.openById('1ohSIy4zhJkyF2YUT_tVsZRipwPEvRAYCMyAN5VUTSiY');
  var form = FormApp.getActiveForm();
  var items = form.getItems();
  Logger.log(items.length);
  //Check to see if empty or existing form
  if (items.length == 0) { 
    sheets = spreadSheet.getSheets();
    var classes = form.addMultipleChoiceItem().setTitle("Choose Your Class").setRequired(true);
    var classChoices = [];
    var DPPage = [];
    var studentNames = [];
    //get class names and student list for eeach class in spreadsheet
    for (n = 0; n < sheets.length; n++) {
      var className = sheets[n].getName();
      var studentList = sheets[n].getDataRange().getValues();
      DPPage[n] = form.addPageBreakItem()
        .setTitle(className)
        .setGoToPage(FormApp.PageNavigationType.SUBMIT);
        //create choices with desired destinations
        classChoices[n] = classes.createChoice(className,DPPage[n]);

        //add dropdown for students
        var studentListItem = form.addListItem().setTitle("Choose Your Name").setRequired(true);
  
        // convert the array ignoring empty cells
        for(var i = 0; i < studentList.length; i++)   {
          if(studentList[i][0] != "") {
          studentNames[i] = studentList[i][0];}
        }
      // populate the drop-down with the array data
      studentListItem.setChoiceValues(studentNames)
    }
    //add multiple choice for classes
    classes.setChoices(classChoices)
  }  
}
  
function onFormSubmit(e) {
  var spreadSheet = SpreadsheetApp.openById('1ohSIy4zhJkyF2YUT_tVsZRipwPEvRAYCMyAN5VUTSiY');
  var DP1sheet = spreadSheet.getSheets()[0];
  var DP2sheet = spreadSheet.getSheets()[1];
  
  var form = FormApp.getActiveForm();
 
  // If all questions are required, getItemResponses returns responses in form-order
  var formResponses = form.getResponses();
  var lastINT = form.getResponses().length - 1;
  var latestR = formResponses[lastINT].getItemResponses();
  var formTitle = form.getTitle();
  
  //Get all responses, email, and timestamp of file submission
  var class = latestR[0].getResponse();
  var studentName = latestR[1].getResponse();  
  var formFile = latestR[2].getResponse();
  var email = formResponses[lastINT].getRespondentEmail();
  var timeStamp = formResponses[lastINT].getTimestamp();
  var time = Utilities.formatDate(timeStamp, "GMT", "MM/dd' 'HH:mm a");

  //Changes submission folder depending on what class they're in
  if (class == DP1sheet.getName()) {var parentFolder = DriveApp.getFolderById("1kfNLUp7isYp8HvbjZc_JzzRFAzPT9wA5");}
  if (class == DP2sheet.getName()) {var parentFolder = DriveApp.getFolderById("12HHQVrFZSlOdGn3lQAQDM3w5zRn87Rb1");}

  //gets file and folder for submission
  var driveFile = DriveApp.getFileById(formFile); 
  var studentFolders = parentFolder.getFolders();
  
  //Checks to see if student folder already exists and adds it
  while(studentFolders.hasNext()){
    var folder = studentFolders.next();
    var folderName = folder.getName();
    Logger.log(folderName);
    if (folderName == class + " - " + studentName) {
      var newFile = driveFile.makeCopy(folder);
      newFile.setName(formTitle + " - " + studentName + " " + time);
      driveFile.setTrashed(true);
      var n = 1;
      Logger.log(studentName + "Folder Found, File Added");
    }
  }
  //Creates student folder if it doesn't exist
  if (n != 1) {
      var folder = parentFolder.createFolder(class + " - " + studentName);
      var newFile = driveFile.makeCopy(folder);
      newFile.setName(formTitle + " - " + studentName + " " + time);
      driveFile.setTrashed(true);
      folder.addViewer(email);
    Logger.log(studentName + " Folder Created, File Added");
    }
}