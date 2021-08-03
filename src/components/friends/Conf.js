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
 
     const { expand } = props
 
     return (<>
         <div className="User">
             <strong>{name}</strong><br />
             {num}<br />{type}
         </div>
         <div className='UserAct'>
             <span
                 className={'symb padsymb'}
                 onClick={() => expand({truth: true, data: props.conf})}
             >
                 more_horiz
             </span>
             <CallBtn number={num} />
         </div>
     </>)
 }
 
 export default Conf;