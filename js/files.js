function saveSource(filename){
  var source=document.getElementsByTagName('html')[0].outerHTML;
  var blobis=new window.Blob([source],{type: 'text/plain'});
  var fileUrl = window.URL.createObjectURL(blobis);
  var link = document.createElement('a');
  link.href = fileUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  console.log("SAVE FILE");
}
