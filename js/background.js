var id = 100;

// Listen for a click on the camera icon. On that click, take a screenshot.
chrome.browserAction.onClicked.addListener(function() {

  chrome.tabs.captureVisibleTab(function(base64Image) {

    var viewTabUrl = chrome.runtime.getURL("webmemory.html?id=" + id++)
    var targetId = null;

    chrome.tabs.getSelected(null, function(tab) {
      var tabUrl = tab.url;

      chrome.tabs.sendMessage(tab.id, {"action":"page_source"},
        function(response) {
          console.log("[+] Got page_source from: "+response.url);
          var blobis= new Blob([response.source],
                            {type:"text/plain;charset=UTF-8"});
          var blob_url=window.URL.createObjectURL(blobis);
          var filename=window.btoa(response.url)+"txt";
          //source txt
          chrome.downloads.download({
            url:blob_url,
            filename:filename
          });
          //to full page image

        });

      });

    chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {

      if (tabId != targetId || changedProps.status != "complete")
        return;

      chrome.tabs.onUpdated.removeListener(listener);

      // var views = chrome.extension.getViews();
      // for (var i = 0; i < views.length; i++) {
      //   var view = views[i];
      //
      //   if (view.location.href == viewTabUrl) {
      //     view.setScreenshotUrl(base64Image);
      //     break
      //   }
      // }
    });

    chrome.tabs.create({url: viewTabUrl}, function(tab) {
      targetId = tab.id;
    });
  });

});
