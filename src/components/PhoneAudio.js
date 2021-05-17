// import './PhoneAudio.css';

import React, { forwardRef } from 'react'

const PhoneAudio = React.forwardRef((props, ref) => (
    <audio controls ref={ref}></audio>
))

export default PhoneAudio;