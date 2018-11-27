var id = 100;

// helper functions
function urlToName(url) {
  var name = url.split('?')[0].split('#')[0];
  if (!(name)) { throw "[-] Fail to parse URL name"}
  name = name
   .replace(/^https?:\/\//, '')
   .replace(/[^A-z0-9]+/g, '-')
   .replace(/-+/g, '-')
   .replace(/^[_\-]+/, '')
   .replace(/[_\-]+$/, '');

   return name + "-" + Date.now();
}

// Listen for a click on the camera icon. On that click, take a screenshot.
chrome.browserAction.onClicked.addListener(function() {

    chrome.tabs.getSelected(null, function(tab) {

      var tabUrl = tab.url;

      console.log(`[+] Starting to mine data from: ${tabUrl}`);

      //--> source page
      chrome.tabs.sendMessage(tab.id, {"action":"page_source"},
        function(response) {
          console.log("[+] Got page_source from: "+ response.url);
          var blobis= new Blob([response.source],
                            {type:"text/plain;charset=UTF-8"});
          var blob_url=window.URL.createObjectURL(blobis);
          var imageFileName=urlToName(response.url);
          var sourceFileName=imageFileName
                                .replace(".png",".txt")
                                .replace("screencapture", "source");
          //save as txt
          chrome.downloads.download({
            url:blob_url,
            filename:sourceFileName
          });
        });

        //--> full page screenshot
        chrome.tabs.sendMessage(tab.id, {"action":"full_page_screenshot"},
          function(response) {
            var screenshots=[];
            const fullSize=response.fullHeight;
            const stepSize=response.stepSize;
            console.log("[+] Full page Screenshot. StepSize: "
                        +stepSize+" FullHeight: "+fullSize);
            var endStep=stepSize;
            var startStep=0;
            while (fullSize>endStep){
              console.log("[+] Asking scroll", startStep, endStep);
              chrome.tabs.sendMessage(tab.id, {
                                "action":"scrollTo",
                                "start":startStep,
                                "end":endStep
                              }, function(response) {
                                if (response.status != "done"){
                                  console.log("[-] Fail to scroll")
                                }
                              });
              chrome.tabs.captureVisibleTab(function(base64Image){
                screenshots.push(atob(base64Image));
              });
              startStep+=stepSize;
              endStep+=stepSize;
            }//while end
            console.log("[+] Shots length: ", screenshots.length)
            // var fullPage=screenshots.join()
            // var imageBlob= new Blob([fullPage]);
            // var imageBlobUrl=window.URL.createObjectURL(imageBlob);
            // chrome.downloads.download({
            //       url:imageBlobUrl,
            //       filename:"test-image.jpg"
            // });
      });

    }); //get select function

}); //onclick listener
