function addEvents(email,blockNames,colors,start,end)
{
  var email = email;
  var oldNames = ["A","B","C","D","E","F","G","H"];
  //var additionNames = ["Advisory","SBG HS Assembly","Break","Lunch"];
  var calendarTemplate = CalendarApp.getCalendarById('<calendar template ID>');
  var userCal = CalendarApp.getCalendarById(email);
  var start = new Date(start + " 1:00 AM");
  var end = new Date(end + " 11:00 PM");
  //var start = new Date('March 14, 2022 01:00:00 -0500');
  //var end = new Date('March 14, 2022 11:00:00 -0500');
 

  for(var i = 0;i<oldNames.length;i++){
  //console.log(blockNames[i]);
  
   if (blockNames[i] != " ") {    
     console.log(blockNames[i]);
  
   var blocks = calendarTemplate.getEvents(start,end,{search: oldNames[i]});
      for(var j = 0;j<blocks.length;j++){
        if (!blocks[j].isAllDayEvent()){
          console.log(blocks[j].getTitle());
        var startTime = blocks[j].getStartTime();
        var endTime = blocks[j].getEndTime();     
        userCal.createEvent(blockNames[i], startTime, endTime).setColor(colors[i]);
        Utilities.sleep(500);
    }
    }
   }
    /*for(var i = 0;i<additionNames.length;i++){
    Logger.log(additions[i]);
    if (additions[i] != " ") {  
    var blocks2 = calendarTemplate.getEvents(start,end,{search: additionNames[i]});
    for(var j = 0;j<blocks2.length;j++){
      var startTime = blocks2[j].getStartTime();
      var endTime = blocks2[j].getEndTime();     
      userCal.createEvent(additions[i], startTime, endTime).setColor(colors[8]);
      Utilities.sleep(500);
    
    }}*/
      }  
  return true;

}

function doGet()
{
  var html = HtmlService.createHtmlOutputFromFile('Index');
  return html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)

}

