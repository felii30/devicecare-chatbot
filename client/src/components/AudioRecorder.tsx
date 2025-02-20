import React, { useState, useRef } from "react"
import { transcribeAudio } from "../services/chatService.ts"
import { IconButton, Icon } from "@chakra-ui/react"
import { keyframes } from "@emotion/react"
import { MdMic, MdStop } from "react-icons/md"

interface AudioRecorderProps {
  onTranscription: (text: string) => void
}

// Add pulse animation
const pulseRing = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })
        try {
          const text = await transcribeAudio(audioBlob)
          onTranscription(text)
        } catch (error) {
          console.error("Transcription failed:", error)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop())
      setIsRecording(false)
    }
  }

  return (
    <IconButton
      size="sm"
      h="35px"
      w="35px"
      minW="35px"
      colorScheme={isRecording ? "red" : "brand"}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
      icon={
        <Icon
          as={isRecording ? MdStop : MdMic}
          boxSize="16px"
          animation={isRecording ? `${pulseRing} 1.5s infinite` : undefined}
        />
      }
      onClick={isRecording ? stopRecording : startRecording}
    />
  )
}

export default AudioRecorder
