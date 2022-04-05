(function(){

    const canvaswidth = 384;
    const canvasheight = 272;
    const output = document.querySelector('output');
    const fileinput = document.querySelector('#getfile');
    const imagecontainer = document.querySelector('#imagecontainer');
    
    const alldone = () => {
      document.querySelector('#container').classList.add('done');
    }
    function report(length) {
      output.innerHTML = `Found ${length} images. Click any to remove them.`;
    }
    
      /* Show the image once we have it */
    const loadImage = (file, name) => {
      var img = new Image();
      img.src = file;
      img.onload = function() {
        imagecontainer.appendChild(img);
        alldone();
      };
    }
    
    /* Image from Clipboard */
    const getClipboardImage = (ev) => {
      let items = ev.clipboardData.items;
      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          report(items.length);
          var blob = items[i].getAsFile();
          loadImage(window.URL.createObjectURL(blob));
        }
      }
    }
    window.addEventListener('paste', getClipboardImage, false);
    
    /* Image from Drag and Drop */
    const imageFromDrop = (e) => {
      report(e.dataTransfer.files.length);
      for (file of e.dataTransfer.files){
        loadImage(window.URL.createObjectURL(file), file.name);
          e.preventDefault();
      }
    }
    container.addEventListener('drop', imageFromDrop, false);
    // Override the normal drag and drop behaviour
    container.addEventListener('dragover', (ev) => {
      ev.preventDefault();
    }, false);
    
    /* Image from Upload */
    const imageFromUpload = (e) => {
      var files = e.target.files;
      report(files.length);

      for (var i = 0; i < files.length; i++) {
        var file = files.item(i);
        loadImage(window.URL.createObjectURL(file), file.name);
      }
      e.preventDefault();
    }
    fileinput.addEventListener('change', imageFromUpload, false);
  
    function dogif(){
      var canvas = document.getElementById('bitmap');
      var context = canvas.getContext('2d');
      var imgs = document.querySelectorAll('#imagecontainer img');
      canvas.width = canvaswidth;
      canvas.height = canvasheight;
      var encoder = new GIFEncoder();
      encoder.setRepeat(0); //auto-loop
      encoder.setDelay(+document.querySelector('#delay').value);
      encoder.start();
    
      imgs.forEach(img => {
          context.fillStyle = document.querySelector('#col').value;
          context.fillRect(0, 0, canvas.width, canvas.height);
          let x = img.offsetWidth;
          let y = img.offsetHeight;
          context.drawImage(img, (canvaswidth - x)/2, (canvasheight - y)/2, x, y);
          encoder.addFrame(context);
      });
      encoder.finish();
    let imgurl = 'data:image/gif;base64,'+encode64(encoder.stream().getData())
  
    document.querySelector('#image').src = imgurl;
    document.querySelector('#dl').href = imgurl;
  }
  document.querySelector('button').addEventListener('click', dogif);
  document.querySelector('#imagecontainer').addEventListener('click', ev => {
    if (ev.target.nodeName === 'IMG') {
        ev.target.remove();
    }
    if(document.querySelectorAll('#imagecontainer img').length === 0){
        document.querySelector('#container').classList.remove('done');
        output.innerHTML = '';
    }
  });
})();
  