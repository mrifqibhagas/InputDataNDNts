import { Endpoint } from "@ndn/endpoint"; 
import { Interest, Name } from "@ndn/packet";
import { WsTransport } from "@ndn/ws-transport";

async function ping(evt) {
  evt.preventDefault();
  // Disable the submit button during function execution.
  const $button = document.querySelector("#submitbutton");
  $button.disabled = true;

  try {
    // Construct the name prefix <user-input>+/ping
    const prefix = new Name("/data/inputdata");//Prefix Declared
    const nama = document.querySelector("#nama").value;
    const umur = document.querySelector("#umur").value;
    const sex = document.querySelector("#jeniskelamin").value;
    const penyakit = document.querySelector("#kategorikanker").value;
    const alamat = document.querySelector("#alamat").value;
    const hp = document.querySelector("#nomorhp").value;
    const ktp = document.querySelector("#ktp").value;
    const goldar = document.querySelector("#golonganDarah").value;
    //const $log = document.querySelector("#app_log");
    //$log.textContent = `Check Data \n${AltUri.ofName(prefix)}\n`;

    const endpoint = new Endpoint();
    const encoder = new TextEncoder();
    for (let i = 0; i < 1; ++i) {

      // Construct an Interest with prefix
      const interest = new Interest();
      interest.name = prefix;
      interest.mustBeFresh = true; 
      interest.lifetime = 5000;
      const dataObj = {
        nama: nama,
        umur: umur,
        alamat: alamat,
        hp: hp,
        ktp: ktp,
        goldar: goldar,
        sex: sex,
        penyakit: penyakit
      };
      const jsonString = JSON.stringify(dataObj);
      // Use TextEncoder to encode the JSON string into Uint8Array
      const uint8Array = encoder.encode(jsonString);
      interest.appParameters = uint8Array;
      //$log.textContent += `\n${encoder.encode(app)}\n`;
      const t0 = Date.now();
      await interest.updateParamsDigest();
      try {
        // Retrieve Data and compute round-trip time.
        const data = await endpoint.consume(interest);
        const rtt = Date.now() - t0;
        const dataContent = data.content;
        
      } catch(err) {
        // Report Data retrieval error.
        //$log.textContent += `\n${AltUri.ofName(interest.name)} ${err}`;
      }

      // Delay 500ms before sending the next Interest.
      await new Promise((r) => setTimeout(r, 500));
    }
  } finally {
    // Re-enable the submit button.
    $button.disabled = false;
  }
}

async function main() {
  const face = await WsTransport.createFace({}, "wss://scbe.ndntel-u.my.id:9696");
  face.addRoute(new Name("/"));


  // Enable the form after connection was successful.
  document.querySelector("#submitbutton").disabled = false;
  document.querySelector("#inputinkeluhan").addEventListener("submit", ping);
}

window.addEventListener("load", main);
