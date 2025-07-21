import { useEffect, useRef, useState } from "react";
import logo from "/assets/openai-logomark.svg";
import EventLog from "./EventLog";
import SessionControls from "./SessionControls";
import ToolPanel from "./ToolPanel";

export default function AppSpeechToText() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [dataChannel, setDataChannel] = useState(null);
  const [transcriptEvents, setTranscriptEvents] = useState([]);
  const [sessionTimeout, setSessionTimeout] = useState(0);

  const timerRef = useRef(null);
  const peerConnection = useRef(null);


  const getTranscript = () => {
    // Trả về transcript hiện tại
    return transcriptEvents.map((event) => event.delta || event.transcript).join(" ").replace(/\n/g, "");
  };

  function startSessionTimeout(seconds) {
    setSessionTimeout(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {

      setSessionTimeout((prev) => {
        console.log("Session timeout:", prev);
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          stopSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function startSession() {
    // Get a session token for OpenAI Realtime API
    const tokenResponse = await fetch("/token-realtime-transcription");
    const data = await tokenResponse.json();
    const EPHEMERAL_KEY = data.client_secret.value;
    alert("Token: \"" + EPHEMERAL_KEY +  "\"");

    // Create a peer connection
    const pc = new RTCPeerConnection();

    // Add local audio track for microphone input in the browser
    const ms = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    pc.addTrack(ms.getTracks()[0]);

    // Set up data channel for sending and receiving events
    const dc = pc.createDataChannel("oai-events");
    setDataChannel(dc);

    // Start the session using the Session Description Protocol (SDP)
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Điều chỉnh baseUrl và model cho transcription
    const baseUrl = "https://api.openai.com/v1/realtime";
    const model = "gpt-4o-mini-realtime-preview-2024-12-17";
    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${EPHEMERAL_KEY}`,
        "Content-Type": "application/sdp",
      },
    });

    const answer = {
      type: "answer",
      sdp: await sdpResponse.text(),
    };
    await pc.setRemoteDescription(answer);
    peerConnection.current = pc;
  }

  useEffect(() => {
    if (isSessionActive) {
      startSessionTimeout(30);
    } else {
      setSessionTimeout(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isSessionActive]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (dataChannel) {
      dataChannel.addEventListener("message", (e) => {
        const event = JSON.parse(e.data);
        // console.log("Received event:", event);
        if (event.type === "conversation.item.input_audio_transcription.delta" && event.delta) {
          // setTranscript((prev) => prev + event.delta);
          setTranscriptEvents((prev) => [...prev, event]);
          console.log("DELTA:", event.delta);
        }

        if (event.type === "conversation.item.input_audio_transcription.completed" && event.transcript) {
          setTranscriptEvents((prev) => {
            const filtered = prev.filter(
              (e) =>
                e.item_id !== event.item_id ||
                (e.content_index ?? 0) !== (event.content_index ?? 0)
            );
            return [...filtered, event];
          });
          console.log("COMPLETED:", event.transcript);
        }
      });
    }
  }, [dataChannel]);

  // Stop current session, clean up peer connection and data channel
  function stopSession() {
    if (dataChannel) {
      dataChannel.close();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (peerConnection.current) {
      peerConnection.current.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setIsSessionActive(false);
    setSessionTimeout(0);
    setDataChannel(null);
  }

  // Send a message to the model
  function sendClientEvent(message) {
    if (dataChannel) {
      const timestamp = new Date().toLocaleTimeString();
      message.event_id = message.event_id || crypto.randomUUID();

      // GỬI message lên server TRƯỚC khi thêm timestamp
      dataChannel.send(JSON.stringify(message));

      // Sau đó thêm timestamp cho UI (state events) nếu cần
      const uiEvent = { ...message, timestamp };
      setEvents((prev) => [uiEvent, ...prev]);
    } else {
      console.error(
        "Failed to send message - no data channel available",
        message,
      );
    }
  }

  // Send a text message to the model
  function sendTextMessage(message) {
    const event = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: message,
          },
        ],
      },
    };

    sendClientEvent(event);
    sendClientEvent({ type: "response.create" });
  }

  // Attach event listeners to the data channel when a new one is created
  useEffect(() => {
    if (dataChannel) {
      // Append new server events to the list
      dataChannel.addEventListener("message", (e) => {
        const event = JSON.parse(e.data);
        if (!event.timestamp) {
          event.timestamp = new Date().toLocaleTimeString();
        }

        setEvents((prev) => [event, ...prev]);
      });

      // Set session active when the data channel is opened
      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true);
        setEvents([]);
      });
    }
  }, [dataChannel]);

  useEffect(() => {
    if (transcriptEvents.length > 0) {
      console.log("Transcript events updated:", transcriptEvents);
      console.log("Transcript events updated:", getTranscript());
    }
  }, [transcriptEvents])

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 h-16 flex items-center">
        <div className="flex items-center gap-4 w-full m-4 pb-2 border-0 border-b border-solid border-gray-200">
          <img style={{ width: "24px" }} src={logo} />
          <h1>realtime console</h1>
        </div>

      </nav>
      <main className="absolute top-16 left-0 right-0 bottom-0">
        <section className="absolute top-0 left-0 right-[380px] bottom-0 flex">
          <section className="absolute top-0 left-0 right-0 bottom-32 px-4 overflow-y-auto">
            {/* <EventLog events={events} /> */}
            {isSessionActive ? (
              <textarea
                value={getTranscript()}
                readOnly
                id="message" rows="50" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here...">

              </textarea>
            ) : (
              <div className="text-gray-500">
                Waiting for connection...
              </div>
            )}
          </section>



          <section className="absolute h-32 left-0 right-0 bottom-0 p-4">

            <SessionControls
              startSession={startSession}
              stopSession={stopSession}
              sendClientEvent={sendClientEvent}
              sendTextMessage={sendTextMessage}
              events={events}
              sessionTimeout={sessionTimeout}
              isSessionActive={isSessionActive}
            />
          </section>
        </section>
        <section className="absolute top-0 w-[380px] right-0 bottom-0 p-4 pt-0 overflow-y-auto">

          <ToolPanel
            sendClientEvent={sendClientEvent}
            sendTextMessage={sendTextMessage}
            events={events}
            isSessionActive={isSessionActive}
          />

        </section>
      </main>
    </>
  );
}
