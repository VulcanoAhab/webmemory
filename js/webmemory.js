
function setScreenshotUrl(base64Image, docObj) {
  document.getElementById("pagepic").src = base64Image;
}


chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  if (!(msg.action)){return false;}

  if (msg.action == "page_source") {
    console.log("[+] Fetching page source");
    var source=document.getElementsByTagName('html')[0].outerHTML;
    sendResponse({"source":source, "url":document.URL});
  }

  if (msg.action == "full_page_screenshot") {
    const fullHeight=document.documentElement.offsetHeight;
    const stepSize=window.innerHeight;
    var shotsMap={
      "fullHeight":fullHeight,
      "stepSize":stepSize
    };
    console.log(shotsMap);
    sendResponse(shotsMap);
  }

  if (msg.action == "scrollTo"){
    let startStep=msg.start;
    let endStep=msg.end;
    console.log("[+] Scrolling to", startStep, endStep);
    window.scrollTo(startStep, endStep);
    sendResponse({"status":"done"});


  }


});
