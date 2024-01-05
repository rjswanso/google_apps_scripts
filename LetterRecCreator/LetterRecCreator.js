var templateDocID = '<Template Doc ID'
var targerFolderID = '<Target Folder ID'

function onFormSubmit(e){
  var form = FormApp.getActiveForm()
  var formResponses = form.getResponses();
  var lastINT = form.getResponses().length - 1;
  var latestR = formResponses[lastINT].getItemResponses();
  //get all responses as strings
  var fName = latestR[0].getResponse();
  var lName = latestR[1].getResponse();
  var traits = latestR[2].getResponse();
  var classroom = latestR[3].getResponse();
  var experience = latestR[4].getResponse();
  Logger.log(fName).log(traits[1]);
  
  //file is the template file, and you get it by ID
  var file = DriveApp.getFileById('templateDocID'); 
  
  //Make a copy of the template, name it, and optionally tell it what folder to live in
  var folder = DriveApp.getFolderById('targerFolderID')
  var copy = file.makeCopy(fName + ' ' + lName, folder); 
  
  //Once we've got the new file created, we need to open it as a document by using its ID
  var doc = DocumentApp.openById(copy.getId()); 
  
  //Since everything we need to change is in the body, we need to get that
  var body = doc.getBody(); 
  
  //Then we call all of our replaceText methods
  body.replaceText('%fName%', fName); 
  body.replaceText('%lName%', lName);  
  body.replaceText('%trait1%', traits[0]); 
  body.replaceText('%trait2%', traits[1]);
  body.replaceText('%trait3%', traits[2]);  
  body.replaceText('%classroom%', classroom);  
  body.replaceText('%experience%', experience);    
  
  //Lastly we save and close the document to persist our changes
  doc.saveAndClose(); 
  Logger.log(doc.getUrl());
}