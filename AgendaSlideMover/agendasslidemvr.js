function myFunction() {
  var planningSlides = SlidesApp.openById('<Plannig Slides ID>');
  var sci10DesSlides = SlidesApp.openById('<Class 1 Slides ID>');
  var sci101Slides = SlidesApp.openById('<Class 2 Slides ID>');
  var sci102Slides = SlidesApp.openById('<Class 3 Slides ID>');
  var DP11Slides = SlidesApp.openById('<Class 4 Slides ID>');
  var DP12Slides = SlidesApp.openById('<Class 5 Slides ID>');
  var classSlides = "";
  var slides = planningSlides.getSlides();
  for (i=0;i < slides.length; i++){
    var isSlideDeleted = false;
    var slideToCopy = slides[i];
    var elements = slides[i].getPageElements();
    for (k=0;k<elements.length;k++){
      if (isSlideDeleted == true) {
        break;}
      switch (elements[k].getTitle()){
        case "Sci 10 Design":
          var classSlides = sci10DesSlides;
          isSlideDeleted = moveSlides(classSlides, slideToCopy);
          break;
        case "Sci 10-1":
          var classSlides = sci101Slides;
          isSlideDeleted = moveSlides(classSlides, slideToCopy);
          break;
        case "Sci 10-2":
          var classSlides = sci102Slides;
          isSlideDeleted = moveSlides(classSlides, slideToCopy);
          break;
        case "DP1-1":
          var classSlides = DP11Slides;
          isSlideDeleted = moveSlides(classSlides, slideToCopy);
          break;
        case "DP1-2":
          var classSlides = DP12Slides;
          isSlideDeleted = moveSlides(classSlides, slideToCopy);
          break;
        default:
          break;
      }
      
    }}   
}

function moveSlides(classSlides, slideToCopy){
  var today = Utilities.formatDate(new Date(), "GMT-5", "EEEE, MMM. d");
  var elements = slideToCopy.getPageElements();
  for (k=0;k<elements.length;k++){
  var day = elements[k].asShape().getText().asString();
    
    if (day.match(today)) {
      classSlides.insertSlide(1,slideToCopy);
      Logger.log("Slide Moved");
      return true;
    }}}