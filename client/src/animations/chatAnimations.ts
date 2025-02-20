import { keyframes } from "@emotion/react"

export const gradientAnimation = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`

export const floatAnimation1 = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-40px, 30px) rotate(3deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`

export const floatAnimation2 = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(35px, -30px) rotate(-3deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`

export const floatAnimation3 = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-30px, -35px) rotate(2deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`

export const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`

export const gradientMove = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
` 