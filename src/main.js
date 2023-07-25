//import { connectToNetwork, connectToRouter } from "@ndn/autoconfig";
import { Endpoint } from "@ndn/endpoint";
import { AltUri, Interest, Name } from "@ndn/packet";
import { WsTransport } from "@ndn/ws-transport";

async function ping(evt) {
  evt.preventDefault();
  // Disable the submit button during function execution.
  const $button = document.querySelector("#app_button");
  $button.disabled = true;

  try {
    // Construct the name prefix <user-input>+/ping
    const prefix = new Name(document.querySelector("#app_prefix").value);
    const nama = document.querySelector("#app_nama").value;
    const umur = document.querySelector("#app_umur").value;
    const sex = document.querySelector("#app_sex").value;
    const penyakit = document.querySelector("#app_penyakit").value;
    //const $log = document.querySelector("#app_log");
    //$log.textContent = `Check Data \n${AltUri.ofName(prefix)}\n`;

    const endpoint = new Endpoint();
    const encoder = new TextEncoder();
    // Generate a random number as initial sequence number.
    ///let seqNum = Math.trunc(Math.random() * 1e8);
    for (let i = 0; i < 1; ++i) {
      //++seqNum;
      // Construct an Interest with prefix + seqNum.
      const interest = new Interest();
      interest.name = prefix;
      interest.mustBeFresh = true; 
      interest.lifetime = 1000;
      const dataObj = {
        prefix: prefix,
        nama: nama,
        umur: umur,
        sex: sex,
        penyakit: penyakit
      };
      const jsonString = JSON.stringify(dataObj);
      // Use TextEncoder to encode the JSON string into Uint8Array
      const textEncoder = new TextEncoder();
      const uint8Array = textEncoder.encode(jsonString);
      ///const dataEncoded = encoder.encode(nama, umur, sex, penyakit);
      //const jsonData = JSON.stringify(dataEncoded);
      interest.appParameters = uint8Array;
      //$log.textContent += `\n${encoder.encode(app)}\n`;
      const t0 = Date.now();
      await interest.updateParamsDigest();
      try {
        // Retrieve Data and compute round-trip time.
        const data = await endpoint.consume(interest);
        const rtt = Date.now() - t0;
        const dataContent = data.content;
        //console.log(dataContent);
        //$log.textContent += `${AltUri.ofName(data.name)} rtt= ${rtt}ms content= ${String.fromCharCode(...dataContent)}\n`;
        //console.log(`${rtt} ms`);
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
  // Connect to the global NDN network in one line.
  // This function queries the NDN-FCH service, and connects to the nearest router.
  //await WsTransport.createFace({}, "wss://ndn-ehealth.australiaeast.cloudapp.azure.com");
  const face = await WsTransport.createFace({}, "wss://scbe.ndntel-u.my.id:9696");
  //await WsTransport.createFace({}, "wss://20.92.254.187:9696/");
  //await WsTransport.createFace({}, "wss://104.21.31.135:9696/");
  face.addRoute(new Name("/"));
  //await connectToRouter("wss://192.168.56.106:9696/ws/", {});
  //await WsTransport.createFace({}, "wss://testbed-ndn-rg.stei.itb.ac.id/ws/");
  //await WsTransport.createFace({}, "ws://192.168.56.111:9696/ws/");
  //await WsTransport.createFace({}, "ws://coba.ndntel-u.my.id/ws/");

  // Enable the form after connection was successful.
  document.querySelector("#app_button").disabled = false;
  document.querySelector("#app_form").addEventListener("submit", ping);
}

window.addEventListener("load", main);