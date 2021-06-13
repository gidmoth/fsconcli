/**
 * render an expanded user
 */

 //import './ExpUser.css';

 function ExpUser(props) {
 
     const {
         name,
         id,
         password,
         conpin,
         context,
         email,
         polymac
     } = props.user
 
     const { expand } = props
 
     return (<>
         <div className="User">
             <strong>{name}</strong><br />
             {id}
         </div>
         <div className='UserAct'>
             <span
                 className={'symb'}
                 onClick={() => expand({truth: false, data: null})}
             >
                 more_horiz
             </span>
         </div>
     </>)
 }
 
 export default ExpUser;