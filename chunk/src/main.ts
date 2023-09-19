import './style.css';
import '@picocss/pico';

class HTTPError extends Error {}

const inputFile: HTMLInputElement | null = document.querySelector<HTMLInputElement>('#file');
const videoInfosDiv: HTMLDivElement | null = document.querySelector<HTMLDivElement>('#video-infos');


const _createChunk = async ({videoId, start, file, chunkEnd, chunkCounter, chunkSize, urlEndpoints, numberOfChunk} : {videoId: string, start: number, chunkEnd: number, file: File, chunkCounter: number, chunkSize: number, urlEndpoints: {host: string, uri: string | URL}, numberOfChunk: number}) => {
  chunkCounter++;
  chunkEnd = Math.min(start + chunkSize, file.size);
  const chunk = file.slice(start, chunkEnd);
  const chunkForm = new FormData();

  if (videoId.length > 0) {
    chunkForm.append('videoId', videoId);
  }

  chunkForm.append('file', chunk, file.name);
  await _uploadChunk({chunkForm, chunkEnd, start, file, chunkCounter, chunkSize, videoId, urlEndpoints, numberOfChunk})
};



const _uploadChunk = async ({chunkForm, chunkEnd, start, file, chunkCounter, chunkSize, videoId, urlEndpoints, numberOfChunk} : {chunkForm: FormData, start: number, chunkEnd: number, file: File, chunkCounter: number, chunkSize: number, videoId: string, urlEndpoints: {host: string, uri: string | URL}, numberOfChunk: number}) => {
  const blobEnd = chunkEnd - 1;
  var contentRange = "bytes " + start + "-" + blobEnd + "/" + file.size;

  try {
    const url = new URL(urlEndpoints.uri, urlEndpoints.host);
    const request = new XMLHttpRequest();
    request.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          let percentageComplete = Math.round((100/numberOfChunk)*((chunkCounter-1)+(ev.loaded/ev.total)));
          videoInfosDiv!.innerHTML = "Envoi du fichier en cours ..." + String(percentageComplete) + "%";
        }
    };
    request.open('POST', url);
    request.setRequestHeader('Content-Range', contentRange);
    request.timeout = 300000;
    request.onload = () => {
        if (request.readyState === 4) {
          if (request.status >= 200 && request.status < 300) {

            const data = JSON.parse(request.responseText);
        
            if (videoId === "") {
              videoId = data.data.videoId;
              urlEndpoints.uri += "/" + videoId;
            }
        
            start += chunkSize;
                
            if (start < file.size && chunkCounter >= 1)
              _createChunk({videoId, file, start, chunkEnd, chunkCounter, chunkSize, urlEndpoints, numberOfChunk});
            else
              alert('All chunks are sent');

          } else {
            throw new HTTPError(request.statusText);
          }
        }
    }

    request.send(chunkForm);

  } catch(error: any) {
    alert("file can't upload...");
    console.log(error);
  };
  

}



inputFile?.addEventListener('change', () => {

  const urlEndpoints = {
    host: 'http://localhost:3000/',
    uri: '/uploads/v2'
  };
  
  let chunkCounter = 0;
  let chunkSize = 2000000;
  let videoId = "";

  if (inputFile.files && inputFile.files.length) {
    const file = inputFile.files[0];
    const numberOfChunk = Math.ceil(file.size/chunkSize);
    videoInfosDiv!.innerHTML = `${numberOfChunk} chunk(s) ont été créer !`;
    let start = 0;
    let chunkEnd = start + chunkSize;
    setTimeout(() => {
      _createChunk({videoId, file, start, chunkEnd, chunkCounter, chunkSize, urlEndpoints, numberOfChunk});
    }, 3000)
  } else console.log('Empty input !');

})