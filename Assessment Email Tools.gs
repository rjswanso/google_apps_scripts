//Create Menu Item for assessment tool
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Data Analysis Assignment Actions')
     .addItem('Re-Create Sheets', 'recreateSheets')
     .addSeparator()   
     .addItem('Create Assignment for Students', 'createAssignment')
     .addSeparator()   
     .addItem('Give Access to Students', 'shareAssignments')
     .addSeparator()   
     .addItem('Remove Access to Students', 'revokePermissions')
     .addToUi();
  
}
//Ensure students aren't sharing documents with each other
function revokePermissions() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssID = ss.getId();
  var ssFolder =  DriveApp.getFileById(ssID).getParents();
  var studentFiles = ssFolder.next().getFiles();
  while (studentFiles.hasNext()) {
    var file = studentFiles.next();
    var users = file.getEditors();
    Logger.log(users.length);
    if (users[0]) file.revokePermissions(users[0]);
    if (users[1]) file.revokePermissions(users[1]);
    }
  SpreadsheetApp.getUi().alert('Student access has been removed.')
}

//Prepare student spreadsheets
function createAssignment() { 
  
  //Retrieve student name and email from student list
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssFolder = DriveApp.getFileById(ss.getId()).getParents();
  var folderID = ssFolder.next().getId();
  var sheets = ss.getSheets();
  var studentList = sheets[0];
  var lastRow = studentList.getLastRow();
  var studentName = studentList.getRange("A3:A"+lastRow).getValues();
  var studentEmail = studentList.getRange("B3:B"+lastRow).getValues();
  
  var folderID = "<Assessment Folder ID>";
  
  for (i=0;i<studentEmail.length;i++){
    var studentSS = SpreadsheetApp.create("temp");
    var rangeData = sheets[i+3].getRange("A2:G15").getValues();
    
    //Creates student spreadsheet and adds to assessment folder
    var fileID = studentSS.getId();
    var file = DriveApp.getFileById(fileID);
    var folder = DriveApp.getFolderById(folderID);
    var newFile = file.makeCopy(folder);
    DriveApp.getFileById(fileID).setTrashed(true);
    
    //Copies student data to spreadsheet 
    var newstudentSS = SpreadsheetApp.openById(newFile.getId());
    newstudentSS.getActiveSheet().getRange("A2:G15").setValues(rangeData);
    
    //Utilities.sleep(1000); in case of hangups

    var column = newstudentSS.getRange("A4:A10");
    column.setNumberFormat("0.0");
    newstudentSS.setColumnWidth(1, 150);
    var range = newstudentSS.getRange("A2:D2");
    range.setFontWeight("bold");
    var range = newstudentSS.getRange("A2:E10");
    range.setHorizontalAlignment("center");
    var column = newstudentSS.getRange("E4:E10");
    column.setNumberFormat("0");
    
    //Change file name to student name + add permissions
    newFile.setName(studentName[i] + " - " + studentList.getRange("D1").getValue());
    newFile.setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.NONE);
  }
    SpreadsheetApp.getUi().alert('Student assignments have been created.')
}

//Shares student data spreadsheets with students
function shareAssignments() { 
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var studentList = sheets[0];
  var lastRow = studentList.getLastRow();
  var studentName = studentList.getRange("A3:A"+lastRow).getValues();
  var studentEmail = studentList.getRange("B3:B"+lastRow).getValues();
  var studentPresent = studentList.getRange("C3:C"+lastRow).getValues();
  var absent = "";
  var ssID = ss.getId();
  var ssFolder =  DriveApp.getFileById(ssID).getParents();
  while (ssFolder.hasNext()){
    var studentFolder = ssFolder.next();
    for (i=0;i<studentName.length;i++){
      var studentFiles = studentFolder.getFilesByName(studentName[i] + " - " + studentList.getRange("D1").getValue());
        while(studentFiles.hasNext()){
        var file = studentFiles.next();
        
      if (studentPresent[i] != ""){
        var absent = absent + ', ' + studentName[i].toString();
        Logger.log(absent);
        Logger.log(studentPresent[i]).log(studentPresent[i].toString());
      }
      else{
      if (file.toString().indexOf(studentName[i]) >= 0) {
        Logger.log("the file " + file + " has been found at " + studentName[i]);
      //Share with student, and set student can't share to others
        file.addEditor(studentEmail[i]);
        file.setShareableByEditors(false);
      }
      }
        }

      }
    
    }
        SpreadsheetApp.getUi().alert('Student Assignments have been shared. \n Students Absent'+absent);
}  

//Recreates student sheets
function recreateSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  for (i=3; i<sheets.length;i++){
    Logger.log(sheets[i].getName());
    ss.deleteSheet(sheets[i]);
  }
  var studentList = sheets[0];
  var studentCount = sheets[0].getLastRow();
  var dataSheet = sheets[1];
  var range = dataSheet.getRange("A1:A26");
  var data = range.getValues();
  var lastRow = range.getLastRow();
  for (i=1; i<studentCount-1; i++) {
    var newSheet = sheets[2].copyTo(ss);
    newSheet.setName(data[0,i].toString());
    newSheet.getRange('B1').setValue(data[0,i].toString());
  }
  SpreadsheetApp.getUi().alert('Data sheets have been created.');
}

