/**
 * render a conference
 */

 import './User.css';
 import CallBtn from  '../CallBtn'
 
 function Conf(props) {
 
     const {
         name,
         num,
         type
     } = props.conf
  
     return (<>
         <div className="User">
             <strong>{name}</strong><br />
             {num}<br />{type}
         </div>
         <div className='UserAct'>
             <CallBtn number={num} />
         </div>
     </>)
 }
 
 export default Conf;