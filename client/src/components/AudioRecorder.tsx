import React, { useState, useRef } from "react"
import { transcribeAudio } from "../services/chatService.ts"
import { IconButton } from "@chakra-ui/react"
import { FaMicrophone, FaStop } from "react-icons/fa"

interface AudioRecorderProps {
  onTranscription: (text: string) => void
}

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
      colorScheme={isRecording ? "red" : "brand"}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
      icon={isRecording ? <FaStop size={12} /> : <FaMicrophone size={12} />}
      onClick={isRecording ? stopRecording : startRecording}
    />
  )
}

export default AudioRecorder
