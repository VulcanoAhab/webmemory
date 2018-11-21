
function setScreenshotUrl(base64Image, docObj) {
  document.getElementById("pagepic").src = base64Image;
}

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg.action == "page_source") {
    var source=document.getElementsByTagName('html')[0].outerHTML;
    sendResponse({"source":source, "url":document.URL});
  }

  if (msg.action == "page_image") {
    var doc= new jsPDF();
    var specialElementHandlers={};
    var page=document.getElementsByTagName('html')[0].outerHTML;
    doc.fromHTML(page,15,15,{'width': 170,
    'elementHandlers': specialElementHandlers});
    doc.save('sample-file-2.pdf');
  }

});
