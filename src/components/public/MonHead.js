/**
 * render Monitorline
 */

 import { useState } from 'react'
 //import { XmlContext } from '../XmlContext'
 
 import './InfoHead.css';
 
 
 function MonHead() {
 
     return (
         <div className={'infohead'}>
             <div
                 className={'headchoice'}
             >
                 <span className={'infoheadline'}>conferences</span>
             </div>
         </div>
     )
 }
 
 export default MonHead;