// import './PhoneAudio.css';

import React from 'react'

const PhoneAudio = React.forwardRef((props, ref) => (
    <audio controls ref={ref}></audio>
))

export default PhoneAudio;